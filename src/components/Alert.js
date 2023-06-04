import React from "react";

export default function Alert(props) {
    
    // to make first letter capital
    const capitalize = (word)=>{
        if(word==="danger") word="Error";
        return word.charAt(0).toUpperCase() + word.slice(1);
    }

    return (
        // ye tbhi chlega jab props.alert null na hoye
        <div style={{height: "53px"}}>
        {props.alert && <div class={`alert alert-${props.alert.type} alert-dismissible fade show`} role="alert">
            <strong>{capitalize(props.alert.type)}</strong>: {props.alert.message}
        </div>}
        </div>
    );
}
