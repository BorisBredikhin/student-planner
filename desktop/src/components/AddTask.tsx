import React, {useContext, useEffect, useState} from "react";
import {AppContext} from "../appContext";
import {FloatingWindow} from "./FloatingWindow";
import {CancelButton, getById} from "../utils";
import {Link} from "react-router-dom";
import {Discipline, Task} from "../api/AppApi"


export function AddTask() {
    const context = useContext(AppContext)
    var [disciplineList, setDisciplineList] = useState<Discipline[] | null>(null);

    useEffect(()=>{
        if (!disciplineList){
            context
                .appApi
                .Discipline
                .getAll()
                .then(r => setDisciplineList(r.disciplines))
        }
    })

    function save() {
        let data = new FormData();
        ["name", "discipline", "description", "due_time", "priority"]
            .forEach(
                value => data
                    .append(
                        value,
                        getById<HTMLInputElement>(value)
                            .value
                    )
            )
        context
            .appApi
            .Task
            .add(data)
    }

    if (disciplineList === [])
        return <p>Загрузка</p>

    console.log(disciplineList)

    return <FloatingWindow>
        <div>
            <form id="addDiscipline" className="AddDiscipline">
                <h3>Добавить задание</h3>
                <div>
                    <div><label htmlFor="name">Название</label></div>
                    <div><input type="text" id="name" required={true}/></div>
                </div>
                <div>
                    <div><label htmlFor="discipline">Дисциплина</label></div>
                    <div>
                        <select name="discipline" id='discipline'>
                            {disciplineList?.map(s=><option value={s.id} key={s.id}>
                                {s.name}
                            </option>)}
                        </select>
                    </div>
                    <div>
                        <div><label htmlFor="description">Описание</label></div>
                        <div><textarea id="description"/></div>
                    </div>
                    <div>
                        <div><label htmlFor="due_time">Сдать до</label></div>
                        <div><input type="date" id="due_time"/></div>
                    </div>
                    <div>
                        <div><label htmlFor="priority">Приоритет</label></div>
                        <div><input type="number" id="priority"/></div>
                    </div>
                </div>
            </form>
            <div>
                <button style={{marginRight: "5px"}} onClick={save}>Сохранить</button>
                <Link to="/" component={CancelButton}/>
            </div>
        </div>
    </FloatingWindow>
}