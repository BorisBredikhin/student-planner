import React, {useContext, useEffect, useState} from "react";
import {AppContext} from "../appContext";
import {Semester} from "../api/AppApi";
import {Link, useParams} from "react-router-dom";
import {linkSytle} from "../styles";

export function DiscplineList() {
    const context = useContext(AppContext)
    let [loaded, setLoaded] = useState<Semester[] | null>(null)

       let {id} = useParams<{id: string}>()

        useEffect(()=> {
            if (!loaded)
            context
                .appApi
                .Discipline
                .get(id)
                .then(r => setLoaded(r.disciplines))
        })
    console.log(loaded)
    return <div style={{margin: "0 auto"}}>
        <h2>Мои семестры</h2>
        {loaded
            ?.map((s)=>
                <Link
                    key={s.id}
                    to={`/s/${s.id}`}
                    style={linkSytle}
                >{s.name}</Link
                >)}
    </div>
}