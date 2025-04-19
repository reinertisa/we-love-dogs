import {useEffect, useState} from "react";
import axios from "axios";
import {map} from "lodash";
import ListPage from "./List.jsx";
import {BASE_URL} from "../../constants.js";
import {useForm} from "react-hook-form";
import BreedSelect from "./BreedSelect.jsx";
import ZipCodeSelect from "./ZipCodeSelect.jsx";
import pluralize from 'pluralize';
import {useNavigate} from "react-router";

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
    const navigate = useNavigate();

    const {handleSubmit, register, reset, control} = useForm({
        defaultValues,
    });

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
                content = (
                    <span className="total">Now, you can see all {searchResult.total} dogs.</span>
                );
            } else {
                content = (
                    <>
                        <span className="total">
                            {searchResult.total} dogs found. {count.next} out of {searchResult.total} dogs displayed.
                            Do you want to see more?
                        </span>
                        <button
                            type="button"
                            className="btn-load"
                            onClick={setLoadHandler}
                        >
                            Please click here.
                        </button>
                    </>
                );
            }
        } else if (searchResult.total <= 100 && searchResult.total > 0) {
            content = (
                <span className="total">
                    {searchResult.total} dogs found.
                </span>
            )
        } else {
            content = (
                <span className="total">
                    We did not find any dogs.
                </span>
            )
        }

        return (
            <div className="result-stats">
                {content}
            </div>
        )
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
                <button className="btn-selected" onClick={matchHandler}>
                    {selectedDogs.length} {pluralize('dog', selectedDogs.length)} selected. Do you want to find a match?
                </button>
            );
        }

    }

    const onSubmit = async (values) => {
        try {
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
        } catch (err) {
            setError(err);
        }
    }

    const handleReset = () => {
        reset(defaultValues); // resets to initial state
    };

    let body = <p>We are loading lovely dogs for you. Please wait for them...</p>
    if (breedOptions?.length > 0) {
        body = (
            <>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label htmlFor="breed-select">Breeds</label>
                        <BreedSelect control={control} name="breeds" options={breedOptions} />
                    </div>
                    <div>
                        <label htmlFor="zip-select">Zip codes</label>
                        <ZipCodeSelect control={control} name="zipCodes" />
                    </div>
                    <div className="input-age">
                        <div>
                            <label htmlFor="ageMin">Min age</label>
                            <input id="ageMin" type="number" {...register('ageMin')} min={0} max={20} />
                        </div>
                        <div>
                            <label htmlFor="ageMax">Max age</label>
                            <input id="ageMax" type="number" {...register('ageMax')} min={0} max={20} />
                        </div>
                    </div>
                    <div className="btn">
                        <button type="reset" onClick={handleReset}>Reset</button>
                        <button type="submit">Go</button>
                    </div>
                </form>
                {renderStats()}
                {renderSelectedDogs()}
                {dogData?.length > 0 && <ListPage data={dogData} setSelectedDogs={setSelectedDogs} selectedDogs={selectedDogs} />}
            </>
        );
    } else if (error) {
        body = <p className="error">Something went wrong. Please try again.</p>
    }

    return (
        <div>
            {body}
        </div>
    )
}

