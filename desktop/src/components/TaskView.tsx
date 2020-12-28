import React, {useContext, useEffect, useState} from "react"
import {AppContext} from "../appContext"
import {useParams} from "react-router-dom"
import {Task} from "../api/AppApi"



export function TaskView(){
    const context = useContext(AppContext)
    let {id} = useParams<{id: string}>()
    let [loaded, setLoaded] = useState<Task | null>(null)
    
    useEffect(() => {
        if (!loaded)
            context
                .appApi
                .Task
                .get(id)
                .then(r => {
                    setLoaded(r)
                })
    })

    if (!loaded)
        return <p>Загрузка</p>
    
    return <div>
        <h1>Задача {loaded.title}</h1>
        <div style={{
            width: "80%",
            textAlign: "justify",
            margin: "1em auto"
        }}>{loaded.description}
        {loaded.is_completed?
            <p>Оценка: {loaded.mark}</p>:
            <div>
                <p>Сдать до {loaded.due_time}</p>
                <p>Приоритет: {loaded.priority}</p>
                </div>
        }
        </div>
    </div>
}