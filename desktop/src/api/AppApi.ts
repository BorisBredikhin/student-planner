import {getCookie} from "../utils"

export interface LoginResponse {
    key: string
}

const apiRoot: string = "http://127.0.0.1:8000"
var token: string | null = getCookie("token")

export class Task {
    public readonly id: number
    public title: string
    public description: string
    public mark_numerator?: number
    public mark_denominator?: number


    get mark(): number {
        return this.mark_numerator! / this.mark_denominator!
    }

    public due_date: Date
    public priority: number
    public is_completed: boolean
    public weight_id: number


    constructor(json: any) {
        this.id = json.id
        this.title = json.title
        this.description = json.description
        this.mark_numerator = json.mark_numerator
        this.mark_denominator = json.mark_denominator
        this.due_date = json.due_date
        this.priority = json.priority
        this.is_completed = json.is_completed
        this.weight_id = json.weight_id
    }
}

export class Discipline {
    public readonly id: number
    public user: number
    public semester_id: number
    public name: string
    public teachers: string
    public tasks: string

    constructor(data: any) {
        var discipline = data.discipline;
        this.id = discipline.id
        this.user = discipline.user
        this.semester_id = discipline.semester
        this.name = discipline.name
        this.teachers = discipline.teachers
        this.tasks = discipline.tasks
        // todo: add tasks object list
    }

    private _semester?: Semester = undefined

    get semester(): Semester {
        return this._semester!
    }

    set semester(val) {
        if (!this._semester)
            this._semester = val
        else throw new Error("value cannot be overwritten")
    }
}

export class Semester {
    public readonly id: number
    public name: string
    public start_date: Date
    public end_date: Date
    public disciplines: Discipline[] = []

    constructor(s: any, d: any) {
        console.log(s)
        this.id = s.id
        this.name = s.name
        this.start_date = s.start_date
        this.end_date = s.end_date
        this.disciplines = d
    }
}

abstract class Api {
    protected async postFormData(path: string, data: FormData) {
        let r = await fetch(path, {
            method: "POST",
            body: data,
            headers: {
                "Authorization": `Token ${token}`
            }
        })
        console.log(r)
        let json = await r.json()
        return json
    }
}

abstract class ModelAPI extends Api {
    public abstract apiPath: string

    public async add(data: FormData) {
        console.log(data)
        return await this.postFormData(this.apiPath, data)
    }

    public async get(id: string) {
        let r = await fetch(this.apiPath + "?id=" + id, {
            method: "GET",
            headers: {
                "Authorization": `Token ${token}`
            }
        })
        let json = await r.json()
        console.log(json)
        return json
    }

    public async getAll() {
        let r = await fetch(this.apiPath, {
            method: "GET",
            headers: {
                "Authorization": `Token ${token}`
            }
        })
        let json = await r.json()
        console.log(json)
        return json
    }
}

export default class AppApi extends Api {
    public readonly Task: TaskAPI
    public readonly Semester: SemesterApi
    public readonly Discipline: DisciplineAPI

    constructor() {
        super()
        this.Task = new TaskAPI()
        this.Semester = new SemesterApi()
        this.Discipline = new DisciplineAPI()
    }

    public async login(username: string, password: string) {
        let formData = new FormData()
        formData.append("username", username)
        formData.append("password", password)

        let r = await fetch(apiRoot + "/rest-auth/login/", {
            method: "POST",
            body: formData
        })
        let json = await r.json() as LoginResponse

        document.cookie = `token=${json.key}`

        return (token = json.key)
    }

    public async addDiscipline(data: FormData) {
        return await this.postFormData("/api/discipline/", data)
    }
}

export class SemesterApi extends ModelAPI {
    apiPath = apiRoot + "/api/semester/"

    async get(id: string): Promise<Semester> {
        let r = await super.get(id)
        return new Semester(r.semester, r.disciplines)
    }

    async getCurrent() {
        let r = await fetch(this.apiPath + "?current=true", {
            method: "GET",
            headers: {
                "Authorization": `Token ${token}`
            }
        })
        let json = await r.json()
        console.log(json)
        return json
    }
}

export class TaskAPI extends ModelAPI {
    apiPath = apiRoot + "/api/task/"
}

export class DisciplineAPI extends ModelAPI {
    apiPath = apiRoot + "/api/discipline/"


    async get(id: string): Promise<Discipline> {
        let r = await super.get(id)
        let discipline = new Discipline(r)
        discipline.semester = await new SemesterApi().get(
            discipline
                .semester_id
                .toString()
        )
        return discipline
    }
}