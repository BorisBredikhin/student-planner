import React, {useContext, useEffect, useState} from "react";
import {AppContext} from "../appContext";
import {Semester, Task} from "../api/AppApi"
import {Link} from "react-router-dom";
import {linkSytle} from "../styles";

export function CurrentTaskList() {
    const context = useContext(AppContext)
    let [loaded, setLoaded] = useState<Task[] | null>(null)
    // if (!loaded) {
        useEffect(()=> {
            if (!loaded)
            context
                .appApi
                .Task
                .getCurrent()
                .then(r => setLoaded(r.tasks))
        })
    // }
    console.log(loaded)
    return <div style={{margin: "0 auto"}}>
        <h2>Текущие задания</h2>
        {loaded
            ?.map((t)=>
                <Link
                    key={t.pk}
                    to={`/t/${t.pk}`}
                    style={linkSytle}
                >{t.title}</Link
                >)}
    </div>
}