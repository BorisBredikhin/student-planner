import React, {useContext, useEffect, useState} from "react";
import {AppContext} from "../appContext";
import {FloatingWindow} from "./FloatingWindow";
import {CancelButton, getById} from "../utils";
import {Link} from "react-router-dom";
import {Semester} from "../api/AppApi";


export function AddDiscipline() {
    const context = useContext(AppContext)
    var [semestersList, setSemestersList] = useState<Semester[] | null>(null);

    useEffect(()=>{
        if (!semestersList){
            context
                .appApi
                .Semester
                .getAll()
                .then(r => setSemestersList(r.semesters))
        }
    })

    function save() {
        let data = new FormData();
        ["name", "semester"]
            .forEach(
                value => data
                    .append(
                        value,
                        getById<HTMLInputElement>(value)
                            .value
                    )
            )
        context.appApi.Discipline.add(data)
    }

    if (semestersList === [])
        return <p>Загрузка</p>

    console.log(semestersList)

    return <FloatingWindow>
        <div>
            <form id="addDiscipline" className="AddDiscipline">
                <h3>Добавить Дисциплину</h3>
                <div>
                    <div><label htmlFor="name">Название</label></div>
                    <div><input type="text" id="name" required={true}/></div>
                </div>
                <div>
                    <div><label htmlFor="semester">Семестер</label></div>
                    <div>
                        <select name="semester" id='semester'>
                            {semestersList?.map(s=><option value={s.id} key={s.id}>
                                {s.name}
                            </option>)}
                        </select>
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