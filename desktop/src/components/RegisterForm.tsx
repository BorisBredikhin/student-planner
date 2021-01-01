import React, {useContext} from "react";
import colors from "../colors";
import './LoginForm.css'
import {AppContext} from "../appContext";

export function RegisterForm(props: {setToken: (_:string) => void}){
    let context = useContext(AppContext)

    function register(){
        // @ts-ignore
        context
            .appApi
            .register(
                (document.getElementById("username") as HTMLInputElement).value,
                (document.getElementById("email") as HTMLInputElement).value,
                (document.getElementById("password1") as HTMLInputElement).value,
                (document.getElementById("password2") as HTMLInputElement).value,
                )
    }

    return <div className="LoginForm">
        <h1>Регистрация</h1>
        <div>
            <span>Имя пользователя</span>
            <input id="username"/>
        </div>
        <div>
            <span>E-mail</span>
            <input id="email" type="email"/>
        </div>
        <div>
            <span>Пароль</span>
            <input id="password1" type="password"/>
        </div>
        <div>
            <span>Повторите пароль</span>
            <input id="password2" type="password"/>
        </div>
        <button
            onClick={register}
            style={{
                background: colors.secondary,
                color: colors.textOnMain
            }}
        >Зарегистрироваться</button>
    </div>
}