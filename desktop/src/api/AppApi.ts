import {getCookie} from "../utils";

export interface LoginResponse {
    key: string
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
}