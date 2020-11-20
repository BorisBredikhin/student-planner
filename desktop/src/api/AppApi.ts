export interface LoginResponse {
    key: string
}

export default class AppApi {
    public readonly apiRoot: string

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
        return json.key
    }
}