import { useParams } from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {Semester as Sem} from "../api/AppApi";
import {AppContext} from "../appContext";
import React from "react";

export function Semester(){
    const context = useContext(AppContext)
    let {id} = useParams<{id: string}>()
    let [loaded, setLoaded] = useState<Sem | null>(null)

    useEffect(()=>{
        if (!loaded)
            context
                .appApi
                .Semester
                .get(id)
                .then(setLoaded)
    })

    console.log(loaded)

    return <div>
        <h2>Семестр {loaded?.name}</h2>
        <p>{loaded?.start_date} – {loaded?.end_date}</p>
        <pre>{loaded?.disciplineIds}</pre>
    </div>
}