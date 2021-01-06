import React, {useContext, useEffect, useState} from "react";
import {AppContext} from "../appContext";
import {Semester} from "../api/AppApi";
import {Link} from "react-router-dom";
import {linkSytle} from "../styles";

export function MySemestersList() {
    const context = useContext(AppContext)
    let [loaded, setLoaded] = useState<Semester[] | null>(null)
    // if (!loaded) {
        useEffect(()=> {
            if (!loaded)
            context
                .appApi
                .Semester
                .getCurrent()
                .then(r => setLoaded(r.semesters))
        })
    // }
    console.log(loaded)
    return <div style={{margin: "0 auto"}}>
        <h2>Мои семестры</h2>
        {loaded
            ?.map((s)=>
                <Link
                    key={s.id}
                    to={`/s/${s.id}`}
                    style={linkSytle}
                >{s.name} (Средний балл {s.avg_mark*100})</Link
                >)}
    </div>
}