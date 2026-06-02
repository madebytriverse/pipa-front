import type { JSX } from "react";

interface ButtonProps{
    text?:string | JSX.Element;
    style?:string;
    icon?:JSX.Element;
    iconStyle?:string;
    type?:"button" | "submit" | "reset";
    onClick?:()=>void;
    disabled?: boolean;
}
export default function ButtonComponent(props : ButtonProps) {
    const { text, style, icon, iconStyle, onClick } = props;
    return(
        <button type={props.type || "button"} className={style} onClick={onClick}>
            {icon && <span className={iconStyle}>{icon}</span>}
            {text}
        </button>
);
}