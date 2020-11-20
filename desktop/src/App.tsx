import React, {useContext, useState} from 'react';

import './App.css';
import {BrowserRouter} from "react-router-dom";
import {AppContext} from "./appContext";
import {LoginForm} from "./components/LoginForm";
import {AppHeader} from "./components/AppHeader";
import {getCookie} from "./utils";

function App() {
    // noinspection JSUnusedLocalSymbols
    const context = useContext(AppContext)
    let [token, setToken] = useState(getCookie("token"))
    return token?(
        <div className="App">
            <AppHeader/>
            <BrowserRouter>

            </BrowserRouter>
        </div>
    ):<LoginForm setToken={setToken}/>;
}

export default App;
