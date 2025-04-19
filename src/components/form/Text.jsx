import {useFormContext} from "react-hook-form";
import useUniqueId from "../../hooks/uniqId.js";

export default function FormText({name, label, help, id: origId, defaultValue, validation, className, style, ...inputAttribs}) {
    const id = useUniqueId({id: origId, prefix: `${name}-`});
    const {register, formState: {errors}} = useFormContext();

    return (
        <div
            className={className}
            style={style}
        >
            <label htmlFor={id}>{label}</label>
            <input
                id={id}
                type="text"
                {...register(name, {validate: validation})}
                defaultValue={defaultValue}
                {...inputAttribs}
            />
            {help && <small className="form-text text-muted">{help}</small>}
            {errors[name] && <small className="form-text text-danger">{errors[name].message}</small>}
        </div>
    )
}