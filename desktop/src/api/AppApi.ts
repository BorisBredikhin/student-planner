import {getCookie} from "../utils";

export interface LoginResponse {
    key: string
}

const apiRoot: string = "http://127.0.0.1:8000"
var token: string|null = getCookie("token")


export class Discipline {
    public id: number;
    public user: number;
    public semester: number;
    public name: string;
    public teachers: string;
    public tasks: string;


    constructor(data: any) {
        this.id = data.id;
        this.user = data.user;
        this.semester = data.semester;
        this.name = data.name;
        this.teachers = data.teachers;
        this.tasks = data.tasks;
    }
}

export class Semester{
    public readonly id: number
    public name: string
    public start_date: Date
    public end_date: Date
    public disciplines: Discipline[] = []

    constructor(s: any, d: any) {
        console.log(s)
        this.id=s.id
        this.name=s.name
        this.start_date = s.start_date
        this.end_date = s.end_date
        this.disciplines = d
    }
}

abstract class Api {
    protected async postFormData(path: string, data: FormData){
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
    public async get(id: string){
        let r = await fetch(this.apiPath + "?id="+id, {
            method: "GET",
            headers: {
                "Authorization": `Token ${token}`
            }
        })
        let json = await r.json();
        console.log(json)
        return json;
    }
    public async getAll(){
        let r = await fetch(this.apiPath, {
            method: "GET",
            headers: {
                "Authorization": `Token ${token}`
            }
        })
        let json = await r.json();
        console.log(json)
        return json;
    }
}

export default class AppApi extends Api{
    public readonly tasks: TaskAPI
    public readonly Semester: SemesterApi;
    public readonly Discipline: DisciplineAPI;

    constructor() {
        super()
        this.tasks = new TaskAPI()
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

        return (token=json.key)
    }

    public async addDiscipline(data: FormData) {
        return await this.postFormData("/api/discipline/", data)
    }
}

export class SemesterApi extends ModelAPI {
    apiPath = apiRoot + "/api/semester/";

    async get(id: string): Promise<Semester> {
        let r = await super.get(id);
        return new Semester(r.semester, r.disciplines);
    }

    async getCurrent(){
        let r = await fetch(this.apiPath + "?current=true", {
            method: "GET",
            headers: {
                "Authorization": `Token ${token}`
            }
        })
        let json = await r.json();
        console.log(json)
        return json;
    }
}

export class TaskAPI extends ModelAPI{
    apiPath = apiRoot + "/api/task/"
}

export class DisciplineAPI extends ModelAPI{
    apiPath = apiRoot + "/api/discipline/"
}