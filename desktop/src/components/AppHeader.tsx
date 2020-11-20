import React from "react";
import colors from "../colors";

export function AppHeader(){
    return <div className="AppHeader" style={{
        background: colors.main,
        color: colors.textOnMain
    }}>
        <h1>Студенческий планировщик</h1>
    </div>
}