import {useController} from "react-hook-form";
import {customReactSelectStyles} from "../../constants.js";
import AsyncSelect from "react-select/async";
import zipcodes from '../../assets/zipcodes.json'
import {filter, map, slice, startsWith} from "lodash";
import PropTypes from "prop-types";


const propTypes = {
    name: PropTypes.string.isRequired,
    control: PropTypes.object.isRequired,
};
export default function ZipCodeSelect({control, name}) {
    // Function to load zip code options
    const loadZipOptions = (inputValue) => {
        if (!inputValue || inputValue.length < 2) return Promise.resolve([]);  // Minimal length to search

        let inputVal = inputValue;
        if (inputVal.startsWith('00')) {
            inputVal = inputValue.substring(2);
        } else if (inputVal.startsWith('0')) {
            inputVal = inputValue.substring(1);
        }

        // Filter zipcodes based on input value
        const filteredZipCodes = filter(zipcodes, (z) => startsWith(String(z.zip_code), inputVal));
        const slicedZipCodes = slice(filteredZipCodes, 0, 50) // Check if zip matches
        const mappedZipCodes = map(slicedZipCodes, (z) => {
            let val = String(z.zip_code);
            if (val.length <=3) {
                val = '00' + val;
            } else if (val.length <= 4) {
                val = '0' + val;
            }
            return ({
                value: val,
                label: `${val} – ${z.city}, ${z.state}`,
            })})
        return Promise.resolve(mappedZipCodes);  // Return filtered options
    };

    const {
        field: { onChange, value },
    } = useController({
        name,
        control,
    });

    return (
        <div>
            <label htmlFor="zip-select">Zip codes</label>
            <AsyncSelect
                inputId="zip-select"
                cacheOptions
                defaultOptions={false}
                loadOptions={loadZipOptions}
                onChange={onChange}
                isMulti
                value={value}
                placeholder="Start typing a ZIP code"
                isClearable
                styles={customReactSelectStyles}
            />
        </div>
    );
}
ZipCodeSelect.propTypes = propTypes;
