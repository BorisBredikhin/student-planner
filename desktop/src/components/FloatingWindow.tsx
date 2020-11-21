import react from "react";
import React from "react";
import colors from "../colors";

export function FloatingWindow(props: {children: react.ReactElement}) {
    return <div style={{
        position: "absolute",
        top: "0",
        left: "0",
        width: "100vw",
        height: "100vh",
        background: colors.transparent,
    }}><div style={{
        margin: "15vh auto",
        width: "fit-content",
        height: "fit-content",
        verticalAlign: "middle",
    }}>
        {props.children}
    </div></div>;
}