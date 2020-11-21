import React, {useContext, useState} from 'react';

import './App.css';
import {BrowserRouter, Route} from "react-router-dom";
import {AppContext} from "./appContext";
import {LoginForm} from "./components/LoginForm";
import {AppHeader} from "./components/AppHeader";
import {getCookie} from "./utils";
import {AddSemester} from "./components/AddSemester";

function App() {
    // noinspection JSUnusedLocalSymbols
    const context = useContext(AppContext)
    let [token, setToken] = useState(getCookie("token"))
    return token?(
        <div className="App">
            <AppHeader/>
            <BrowserRouter>
                <Route path="/">
                    <AddSemester/>
                </Route>
            </BrowserRouter>
        </div>
    ):<LoginForm setToken={setToken}/>;
}

export default App;
