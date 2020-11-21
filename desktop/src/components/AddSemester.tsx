import React, {useContext} from "react";
import {AppContext} from "../appContext";
import {FloatingWindow} from "./FloatingWindow";
import {getById} from "../utils";


export function AddSemester() {
    const context = useContext(AppContext)

    function save() {
        let data = new FormData();
        ["name", "start_date", "end_date"]
            .forEach(
                value => data
                    .append(
                        value,
                        getById<HTMLInputElement>(value)
                            .value
                    )
            )
        context.appApi.addSemester(data)
    }

    return <FloatingWindow>
        <div>
            <form id="addSemester" className="AddSemester">
                <h3>Добавить семестр</h3>
                <div>
                    <div><label htmlFor="name">Название</label></div>
                    <div><input type="text" id="name" required={true}/></div>
                </div>
                <div>
                    <div><label htmlFor="start_date">Дата начала</label></div>
                    <div><input type="date" id="start_date" required={true}/></div>
                </div>
                <div>
                    <div><label htmlFor="end_date">Дата окончания</label></div>
                    <div><input type="date" id="end_date" required={true}/></div>
                </div>
            </form>
            <div>
                <button style={{marginRight: "5px"}} onClick={save}>Сохранить</button>
                <button style={{marginLeft: "5px"}}>Отменить</button>
            </div>
        </div>
    </FloatingWindow>
}