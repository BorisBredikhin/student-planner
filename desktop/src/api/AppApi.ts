import {getCookie} from "../utils"

export interface LoginResponse {
    key: string
}

const apiRoot: string = "http://127.0.0.1:8000"
var token: string | null = getCookie("token")

export class Task {
    public readonly pk: number
    public title: string
    public description: string
    public mark_numerator?: number
    public mark_denominator?: number
    public due_time: Date
    public priority: number
    public is_completed: boolean
    public weight_id: number

    constructor(json: any) {
        this.pk = json.id ?? json.pk
        this.title = json.title
        this.description = json.description
        this.mark_numerator = json.mark_numerator
        this.mark_denominator = json.mark_denominator
        this.due_time = json.due_time
        this.priority = json.priority
        this.is_completed = json.is_completed
        this.weight_id = json.weight_id
    }

    mark(): number | string {
        console.log(this)
        return this.is_completed && this.denGe0()
            ? this.mark_numerator! / this.mark_denominator! : "N/A"
    }

    private denGe0 = () => this.mark_denominator == undefined
        ? false : this.mark_denominator! > 0
}

export class Discipline {
    public readonly id: number
    public user: number
    public semester_id: number
    public name: string
    public teachers: string
    public tasks: string
    public tasksObj: Task[]

    constructor(discipline: any, t: any) {
        this.id = discipline.id
        this.user = discipline.user
        this.semester_id = discipline.semester
        this.name = discipline.name
        this.teachers = discipline.teachers
        this.tasks = discipline.tasks
        this.tasksObj = t
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

    async register(username: string, email: string, password1: string, password2: string) {
        const data = {username, email, password1, password2}
        const formData = new FormData()

        for (var key in data)
            { // @ts-ignore
                formData.append(key, data[key])
            }

        let r = await fetch(apiRoot + "/rest-auth/registration/", {
            method: "POST",
            body: formData
        })

        if (r.status == 500) { // особенность rest-auth
            alert("Пользователь успешно зарегистрирован")
            document.location.href = "/"
        }
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

    async get(id: string): Promise<Task> {
        return new Task((await super.get(id)).task)
    }

    async getCurrent() {
        let r = await fetch(this.apiPath + "?current_only=true", {
            method: "GET",
            headers: {
                "Authorization": `Token ${token}`
            }
        })
        let json = await r.json()
        console.log(json)
        return json
    }

    async saveMark(pk: number, numerator: string, denominator: string) {
        let formData = new FormData()
        formData.append("pk", pk.toString())
        formData.append("numerator", numerator)
        formData.append("denominator", denominator)

        let r = await fetch(this.apiPath, {
            method: "POST",
            body: formData
        })
    }
}

export class DisciplineAPI extends ModelAPI {
    apiPath = apiRoot + "/api/discipline/"


    async get(id: string): Promise<Discipline> {
        let r = await super.get(id)
        let discipline = new Discipline(r.discipline, r.tasks)
        discipline.semester = await new SemesterApi().get(
            discipline
                .semester_id
                .toString()
        )
        return discipline
    }
}