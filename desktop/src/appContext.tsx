import React from "react";
import AppApi from "./api/AppApi";

export interface IAppContext {
    appApi: AppApi
}

export const AppContext = React.createContext<IAppContext>({
    appApi: new AppApi()
})