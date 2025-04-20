import PropTypes from "prop-types";
import Select from "react-select";
import {useController} from "react-hook-form";
import {customReactSelectStyles} from "../../constants.js";


const propTypes = {
    name: PropTypes.string.isRequired,
    options: PropTypes.shape({label: PropTypes.string, value: PropTypes.string}).isRequired,
    control: PropTypes.object.isRequired,
};
export default function BreedSelect({control, name, options}) {
    const {
        field: { onChange, value, ref },
    } = useController({
        name,
        control,
        defaultValue: options[0], // Optional default
    });

    return (
        <div>
            <label htmlFor="breed-select">Breeds</label>
            <Select
                inputRef={ref}
                inputId="breed-select"
                value={value}
                onChange={onChange}
                options={options}
                defaultValue={options[0]}
                placeholder="Select breed(s)"
                isMulti
                styles={customReactSelectStyles}
            />
        </div>
    );
}
BreedSelect.propTypes = propTypes;
