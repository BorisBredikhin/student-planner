import React, {useContext} from "react";
import colors from "../colors";
import './LoginForm.css'
import {AppContext} from "../appContext";
import { Link } from "react-router-dom";

export function LoginForm(props: {setToken: (_:string) => void}){
    let context = useContext(AppContext)

    function login(){
        // @ts-ignore
        context
            .appApi
            .login(
                (document.getElementById("login") as any).value,
                (document.getElementById("password") as any).value)
            .then((token:string)=>{
                document.cookie=`token=${token}`
                props.setToken(token)
            })
    }

    return <div className="LoginForm">
        <h1>Вход</h1>
        <div>
            <span>Логин</span>
            <input id="login"/>
        </div>
        <div>
            <span>Пароль</span>
            <input id="password" type="password"/>
        </div>
        <div>
            <button
                onClick={login}
                style={{
                    background: colors.secondary,
                    color: colors.textOnMain
                }}
            >Войти</button>
            <Link to="/register">Зарегистрироваться</Link>
        </div>
    </div>
}