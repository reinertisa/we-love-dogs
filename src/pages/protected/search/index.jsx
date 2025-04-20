import {useEffect, useState} from "react";
import axios from "axios";
import {BASE_URL, ERROR_MSG} from "../../../constants.js";
import {map} from "lodash";
import Loading from "../../../components/loading/index.jsx";
import SearchForm from "./Form.jsx";
import ErrorMessage from "../../../components/errors/index.jsx";
import {useNavigate} from "react-router";


export default function SearchPage() {

    const [breedOptions, setBreedOptions] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            try {
                const breedResponse = await axios.get(`${BASE_URL}/dogs/breeds`,{
                    withCredentials: true,
                })
                setBreedOptions([...map(breedResponse?.data, (val) => ({label: val, value: val}))]);

            } catch (err) {
                if (err.response?.status === 401) {
                    navigate('/');
                }
                setError(ERROR_MSG);
            }
        }
        void loadData();
    }, [navigate]);

    let body = <Loading />
    if (breedOptions?.length > 0) {
        body = <SearchForm breedOptions={breedOptions} />
    } else if (error) {
        body = <ErrorMessage message={error} />
    }
    return <div>{body}</div>

}