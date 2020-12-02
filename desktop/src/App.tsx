import React, {useContext, useState} from 'react';

import './App.css';
import {BrowserRouter, Link, Route} from "react-router-dom";
import {AppContext} from "./appContext";
import {LoginForm} from "./components/LoginForm";
import {AppHeader} from "./components/AppHeader";
import {getCookie} from "./utils";
import {AddSemester} from "./components/AddSemester";
import {MySemestersList} from "./components/MySemestersList";
import {AddDiscipline} from "./components/AddDiscipline";
import {Semester} from "./components/Semester";


function App() {
    // noinspection JSUnusedLocalSymbols
    const context = useContext(AppContext)
    let [token, setToken] = useState(getCookie("token"))
    return token?(
        <div className="App">
            <AppHeader/>
            <BrowserRouter>
                <Link to = "/addsem">Добавить семестр</Link>
                    {" "}
                    <Link to = "/adddis">Добавить дисциплину</Link>
                    <Route path="/" exact>
                    <MySemestersList/>
                </Route>
                <Route path="/addsem">
                    <AddSemester/>
                </Route>
                <Route path="/adddis">
                    <AddDiscipline/>
                </Route>
                <Route path="/s/:id">
                    <Semester/>
                </Route>
            </BrowserRouter>
        </div>
    ):<LoginForm setToken={setToken}/>;
}

export default App;
