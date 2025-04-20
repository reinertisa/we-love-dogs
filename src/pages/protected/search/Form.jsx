import {useState} from "react";
import axios from "axios";
import {BASE_URL, ERROR_MSG} from "../../../constants.js";
import {map} from "lodash";
import {FormProvider, useForm} from "react-hook-form";
import BreedSelect from "../../../components/form/BreedSelect.jsx";
import ZipCodeSelect from "../../../components/form/ZipCodeSelect.jsx";
import FormText from "../../../components/form/Text.jsx";
import Button from "../../../components/buttons/index.jsx";
import ErrorMessage from "../../../components/errors/index.jsx";
import {useNavigate} from "react-router";
import ListPage from "../list/index.jsx";
import './Form.css'


const defaultValues = {
    breeds: [],
    zipCodes: [],
    ageMin: '',
    ageMax: '',
};

export default function SearchForm({breedOptions}) {
    const [searchResult, setSearchResult] = useState({});
    const [pending, setPending] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const onSubmit = async (values) => {
        try {
            setPending(true);
            const rez = await axios.get(`${BASE_URL}/dogs/search`, {
                params: {
                    breeds: map(values?.breeds, (breed) => breed.value),
                    zipCodes: values?.zipCodes ?? '',
                    ageMin: values?.ageMin ?? '',
                    ageMax: values?.ageMax ?? '',
                    size: 10000,
                    sort: 'name:asc',
                },
                withCredentials: true,
            });

            setPending(false);
            const {resultIds, total} = rez.data;
            setSearchResult({
                resultIds,
                total,
            });

        } catch (err) {
            if (err.response?.status === 401) {
                localStorage.removeItem('login');
                navigate('/');
            }
            setError(ERROR_MSG);
        }
    }

    const formMethods = useForm({
        defaultValues,
    });

    const {handleSubmit, reset, control} = formMethods;

    const handleReset = () => {
        reset(defaultValues); // resets to the initial state
    };

    return (
        <>
            <FormProvider {...formMethods}>
                <form onSubmit={handleSubmit(onSubmit)} className="search-form">
                    <BreedSelect control={control} name="breeds" options={breedOptions} />
                    <ZipCodeSelect control={control} name="zipCodes" />
                    <div className="input-age">
                        <FormText name="ageMin" label="Min age" type="number" min={0} max={20} />
                        <FormText name="ageMax" label="Max age" type="number" min={0} max={20} />
                    </div>
                    <div className="btn">
                        <Button type="reset" actionHandler={handleReset}>Reset</Button>
                        <Button type="submit">Search</Button>
                    </div>
                </form>
                <ErrorMessage message={error} />
            </FormProvider>
            <ListPage searchResult={searchResult} pending={pending} />
        </>
    )
}