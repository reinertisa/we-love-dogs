import {useFormContext} from "react-hook-form";
import useUniqueId from "../../hooks/uniqId.js";
import PropTypes from "prop-types";

const propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    help: PropTypes.string,
    validation: PropTypes.object,
    required: PropTypes.bool,
    className: PropTypes.string,
    style: PropTypes.object,
};
/**
 * Input element to use with react-hook-form.
 */
export default function FormText({name, label, value, help, id: origId, validation, required,
                                     className, style, ...inputAttribs}) {
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
                defaultValue={value}
                required={required}
                {...inputAttribs}
            />
            {help && <small className="form-text text-muted">{help}</small>}
            {errors[name] && <small className="form-text text-danger">{errors[name].message}</small>}
        </div>
    )
}
FormText.propTypes = propTypes;
