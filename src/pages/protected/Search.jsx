import {useEffect, useState} from "react";
import axios from "axios";
import {map} from "lodash";
import ListPage from "./List.jsx";
import {BASE_URL} from "../../constants.js";
import {FormProvider, useForm} from "react-hook-form";
import BreedSelect from "../../components/form/BreedSelect.jsx";
import ZipCodeSelect from "../../components/form/ZipCodeSelect.jsx";
import pluralize from 'pluralize';
import {useNavigate} from "react-router";
import Button from "../../components/buttons/index.jsx";
import FormText from "../../components/form/Text.jsx";
import ErrorMessage from "../../components/errors/index.jsx";
import Loading from "../../components/loading/index.jsx";

import './Search.css';


const defaultValues = {
    breeds: [],
    zipCodes: [],
    ageMin: '',
    ageMax: '',
};

const initialCounter = {
    prev: 0,
    next: 100,
};

export default function SearchPage() {
    const [breedOptions, setBreedOptions] = useState([]);
    const [dogData, setDogData] = useState([]);
    const [searchResult, setSearchResult] = useState({});
    const [load, setLoad] = useState(false);
    const [count, setCount] = useState(initialCounter);
    const [error, setError] = useState('');
    const [selectedDogs, setSelectedDogs] = useState([]);
    const [pending, setPending] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        const loadData = async () => {
            try {
                const breedResponse = await axios.get(`${BASE_URL}/dogs/breeds`,{
                    withCredentials: true,
                })
                setBreedOptions([...map(breedResponse?.data, (val) => ({label: val, value: val}))]);

            } catch (err) {
                setError(err);
            }
        }
        loadData();
    }, []);


    useEffect(() => {
        const getDogs = async () => {
            try {
                if (searchResult?.total > 0) {
                    const ids = searchResult.resultIds.slice(count.prev, count.next);
                    const rez = await axios.post(`${BASE_URL}/dogs`, ids, {
                        withCredentials: true,
                    });
                    if (load) {
                        setDogData([...dogData, ...rez.data]);
                    } else {
                        setDogData([...rez.data]);
                    }
                } else {
                    setDogData([]);
                }
            } catch (err) {
                setError(err);
            }
        }
        getDogs();

    }, [load, searchResult, count])


    const setLoadHandler = () => {
        setCount(prev => ({
            prev: prev.next, next: prev.next + 100
        }));
        setLoad(true);
    }

    const renderStats = () => {
        if (Object.keys(searchResult).length === 0) {
            return null;
        }

        let content;
        if (searchResult.total > 100) {
            if (count.next >= searchResult.total) {
                content = <span className="total">Now, you can see all {searchResult.total} dogs.</span>;
            } else {
                content = (
                    <>
                        <span className="total">
                            {count.next} out of {searchResult.total} dogs displayed.
                            Do you want to see more?
                        </span>
                        <Button type="button" className="btn-load" actionHandler={setLoadHandler}>
                            Please click here.
                        </Button>
                    </>
                );
            }
        } else if (searchResult.total <= 100 && searchResult.total > 0) {
            content = <span className="total">{searchResult.total} dogs found.</span>
        } else {
            content = <span className="total">We did not find any dogs.</span>;
        }

        return <div className="result-stats">{content}</div>;
    }

    const matchHandler = async () => {
        try {
            const matchDogIdRez = await axios.post(`${BASE_URL}/dogs/match`, selectedDogs,
             {
                withCredentials: true
            })

            const matchDogRez = await axios.post(`${BASE_URL}/dogs`, [matchDogIdRez.data.match], {
                withCredentials: true,
            });

            console.log('rez', matchDogRez)
            const data = matchDogRez.data;

            // ✅ Navigate and pass data
            navigate('/match', { state: { data } });

        } catch (err) {
            setError(err);
        }
    }

    const renderSelectedDogs = () => {
        if (selectedDogs.length > 0) {
            return (
                <Button className="btn-selected" actionHandler={matchHandler}>
                    {selectedDogs.length} {pluralize('dog', selectedDogs.length)} selected. Do you want to find a match?
                </Button>
            );
        }

    }

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

            const {resultIds, total} = rez.data;
            setSearchResult({
                resultIds,
                total,
            });
            setCount(initialCounter);
            setLoad(false);
            setPending(false);
        } catch (err) {
            setError(err);
        }
    }

    const formMethods = useForm({
        defaultValues,
    });

    const {handleSubmit, reset, control} = formMethods;

    const handleReset = () => {
        reset(defaultValues); // resets to the initial state
    };

    let body = <Loading />
    if (breedOptions?.length > 0) {
        body = (
            <>
                <FormProvider {...formMethods}>
                    <form onSubmit={handleSubmit(onSubmit)}>
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
                </FormProvider>
                {renderStats()}
                {renderSelectedDogs()}
                {renderDogData(dogData, setSelectedDogs, selectedDogs, pending)}
            </>
        );
    } else if (error) {
        body = <ErrorMessage message={error} />
    }
    return <div>{body}</div>
}


function renderDogData(dogData, setSelectedDogs, selectedDogs, pending = false) {
    if (pending) {
        return <Loading />
    }

    if (dogData?.length > 0) {
        return (
            <ListPage
                data={dogData}
                setSelectedDogs={setSelectedDogs}
                selectedDogs={selectedDogs} />
        );
    }
}
