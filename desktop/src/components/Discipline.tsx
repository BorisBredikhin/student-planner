import {Link, useParams} from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";
import {Discipline as Dis} from "../api/AppApi";
import {AppContext} from "../appContext";

export function Discipline(){
    const context = useContext(AppContext)
    let {id} = useParams<{id: string}>()
    let [loaded, setLoaded] = useState<Dis | null>(null)
    let [loadedk, setLoadedk] = useState(false)

    useEffect(()=>{
        if (!loaded)
            context
                .appApi
                .Discipline
                .get(id)
                .then(r => {
                    setLoaded(r)
                })
    })

    if (!loaded) {
        return <p>l</p>
    }

    return <div>
        <div style={{
            textAlign: "left",
        }}>
            <Link to={"/s/"+loaded!.semester_id}>К семестру</Link>
        </div>
        <h2>{loaded!.name}</h2>
        {loaded!.tasks/*todo*/}
    </div>
}