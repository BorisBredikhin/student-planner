import {Link, useParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {Semester as Sem} from "../api/AppApi";
import {AppContext} from "../appContext";
import React from "react";

export function Semester(){
    const context = useContext(AppContext)
    let {id} = useParams<{id: string}>()
    let [loaded, setLoaded] = useState<Sem | null>(null)
    let [loadedk, setLoadedk] = useState(false)

    useEffect(()=>{
        if (!loaded)
            context
                .appApi
                .Semester
                .get(id)
                .then(r => {
                    setLoaded(r)
                })
        else if (loaded!.disciplines == [])
            loaded!.loadDisciplines().then(()=>console.log(loaded))
    })

    if (!loadedk) {
        console.log(loaded)
        setLoadedk(true)
    }

    return <div>
        <h2>Семестр {loaded?.name}</h2>
        <p>{loaded?.start_date} – {loaded?.end_date}</p>
        <ul>
            {
                loaded?.disciplines.map(d=>
                <li><Link to={"/d/"+d.id}>{d.name}</Link></li>)
            }
        </ul>
    </div>
}