import {getCookie} from "../utils";

export interface LoginResponse {
    key: string
}

export class Semester {
    public readonly id: number
    public name: string
    public start_date: Date
    public end_date: Date
    public disciplineIds: number[]

    constructor(s: any) {
        console.log(s)
        this.id=s.id
        this.name=s.name
        this.start_date = s.start_date
        this.end_date = s.end_date
        this.disciplineIds = JSON.parse(s.disciplines as string)
    }

}

abstract class Api {
    public readonly apiRoot: string = "http://127.0.0.1:8000"
    protected token: string|null = getCookie("token")


    protected async postFormData(path: string, data: FormData){
        let r = await fetch(path, {
            method: "POST",
            body: data,
            headers: {
                "Authorization": `Token ${this.token}`
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
                "Authorization": `Token ${this.token}`
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
                "Authorization": `Token ${this.token}`
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

    constructor() {
        super()
        this.tasks = new TaskAPI()
        this.Semester = new SemesterApi()
    }

    public async login(username: string, password: string) {
        let formData = new FormData()
        formData.append("username", username)
        formData.append("password", password)

        let r = await fetch(this.apiRoot + "/rest-auth/login/", {
            method: "POST",
            body: formData
        })
        let json = await r.json() as LoginResponse

        document.cookie = `token=${json.key}`

        return (this.token=json.key)
    }

    public async addDiscipline(data: FormData) {
        return await this.postFormData("/api/discipline/", data)
    }
}

export class SemesterApi extends ModelAPI {
    apiPath = this.apiRoot + "/api/semester/";

    async get(id: string): Promise<Semester> {
        return new Semester((await super.get(id)).semester);
    }
}

class TaskAPI extends ModelAPI{
    apiPath = this.apiRoot + "/api/task/"
}