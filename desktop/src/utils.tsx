import React, {ForwardedRef} from "react";
import {buttonStyle} from "./styles";

export function getCookie(name: string) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

export function getById<T extends HTMLElement>(id: string) {
    return document.getElementById(id) as T
}

export const CancelButton =
React.forwardRef((props, ref: ForwardedRef<any>)=>(<a ref={ref} style={{
    ...buttonStyle,
    backgroundColor: "#fbb"
    }} className="button" {...props}>0тменить</a>));