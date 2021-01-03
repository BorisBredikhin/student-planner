import {Link, useParams} from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";
import {Discipline as Dis, Task} from "../api/AppApi"
import {AppContext} from "../appContext";

function TaskTile(props: { task: Task }) {
    return <div>
        <strong>{props.task.title}</strong>
        {props.task.is_completed ? ((props.task.mark() === "N/A")?<p>Завершено</p>:<p>Сдано на {props.task.mark() as number*100}%</p>) : <p>Сдать до {props.task.due_time}</p>}
        <Link to={`/t/${props.task.pk}`}>Подробнее</Link>
    </div>
}

export function Discipline(){
    const context = useContext(AppContext)
    let {id} = useParams<{id: string}>()
    let [loaded, setLoaded] = useState<Dis | null>(null)

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
        <div className="tasklist">
            {loaded!.tasksObj.map(task => <TaskTile key={task.pk} task={new Task(task)}/>)}
        </div>
    </div>
}