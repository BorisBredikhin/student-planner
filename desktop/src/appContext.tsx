import React from "react";
import AppApi from "./api/AppApi";

export interface IAppContext{
    apiRoot: string,
    appApi: AppApi
}

export const AppContext = React.createContext<IAppContext>({
    apiRoot: "http://127.0.0.1:8000",
    appApi: new AppApi("http://127.0.0.1:8000")
})