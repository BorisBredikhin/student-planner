import {getCookie} from "../utils";

export interface LoginResponse {
    key: string
}

export class Semester {
    public readonly id: number
    public name: string
    public startDate: Date
    public endDate: Date
    public DisciplineIds: number[]

    constructor(s: any) {
        console.log(s)
        this.id=s.id
        this.name=s.name
        this.startDate = s.start_date
        this.endDate = s.end_date
        this.DisciplineIds = (s.disciplines as string)
            .slice(
                1,
                (s.disciplines as string).length
            )
            .split(', ')
            .map(parseInt)
    }

}

export default class AppApi {
    public readonly apiRoot: string
    private token: string|null = getCookie("token")

    constructor(apiRoot: string) {
        this.apiRoot = apiRoot
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

    public async addSemester(data: FormData) {
        console.log(data)
        let r = await fetch(this.apiRoot + "/api/semester/", {
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

    public async getSemesters(){
        let r = await fetch(this.apiRoot + "/api/semester/", {
            method: "GET",
            headers: {
                "Authorization": `Token ${this.token}`
            }
        })
        let json = await r.json();
        console.log(json)
        return (json).semesters.map((s: any)=>new Semester(s));
    }
}