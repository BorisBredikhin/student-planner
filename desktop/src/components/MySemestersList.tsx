import React, {useContext, useEffect, useState} from "react";
import {AppContext} from "../appContext";
import {Semester} from "../api/AppApi";

export function MySemestersList() {
    const context = useContext(AppContext)
    let [loaded, setLoaded] = useState<Semester[] | null>(null)
    // if (!loaded) {
        useEffect(()=> {
            if (!loaded)
            context
                .appApi
                .getSemesters()
                .then(setLoaded)
        })
    // }
    console.log(loaded)
    return <div>
        <h2>Мои семестры</h2>
        {loaded
            ?.map((s, idx)=><p key={idx}>{s.name}</p>)}
    </div>
}