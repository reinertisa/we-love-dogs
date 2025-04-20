import Button from "../../../components/buttons/index.jsx";
import pluralize from "pluralize";
import axios from "axios";
import {BASE_URL, ERROR_MSG} from "../../../constants.js";
import {useNavigate} from "react-router";
import {useState} from "react";
import ErrorMessage from "../../../components/errors/index.jsx";

import './index.css';

export default function FavoritePage({selectedDogs}) {

    const navigate = useNavigate();
    const [error, setError] = useState(null);

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
            if (err.response?.status === 401) {
                localStorage.removeItem('login');
                navigate('/');
            }
            setError(ERROR_MSG);
        }
    }


    if (selectedDogs.length > 0) {
        return (
            <div className="match-container">
                <Button className="match-selected" actionHandler={matchHandler}>
                    {selectedDogs.length} {pluralize('dog', selectedDogs.length)} selected. Do you want to find a match?
                </Button>
                <ErrorMessage message={error} />
            </div>
        );
    }
}