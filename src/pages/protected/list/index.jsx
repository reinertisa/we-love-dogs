import Button from "../../../components/buttons/index.jsx";
import {useEffect, useState} from "react";
import TablePage from "./Table.jsx";
import axios from "axios";
import {BASE_URL, ERROR_MSG} from "../../../constants.js";
import Loading from "../../../components/loading/index.jsx";
import ErrorMessage from "../../../components/errors/index.jsx";
import FavoritePage from "../match/index.jsx";
import {useNavigate} from "react-router";
import './index.css';


const initialCounter = {
    prev: 0,
    next: 100,
};

export default function ListPage({searchResult}) {
    const [data, setData] = useState(null);
    const [count, setCount] = useState(initialCounter);
    const [load, setLoad] = useState(false);
    const [selectedDogs, setSelectedDogs] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Reset local states when new search results come in
        if (searchResult) {
            setCount(initialCounter);
            setLoad(false);
            setSelectedDogs([]);
            setError(null);
        }
    }, [searchResult]);

    useEffect(() => {
        const getDogs = async () => {
            try {
                if (searchResult?.total > 0) {
                    const ids = searchResult.resultIds.slice(count.prev, count.next);
                    const rez = await axios.post(`${BASE_URL}/dogs`, ids, {
                        withCredentials: true,
                    });
                    if (load) {
                        setData(prev => [...prev, ...rez.data]);
                    } else {
                        setData(rez.data);
                    }
                } else {
                    setData([]);
                }
            } catch (err) {
                if (err.response?.status === 401) {
                    localStorage.removeItem('login');
                    navigate('/');
                }
                setError(ERROR_MSG);
            }
        };
        void getDogs();
    }, [load, searchResult, count, navigate]);


    const setLoadHandler = () => {
        setCount(prev => ({
            prev: prev.next, next: prev.next + 100
        }));
        setLoad(true);
    }


    if (Object.keys(searchResult).length === 0) {
        return null;
    }

    const {total} = searchResult;
    let body = <Loading />;

    if (Object.keys(searchResult).length > 0) {
        let content;
        if (total > 0) {
            if (total > 100) {
                const title = count.next >= total
                    ? `All ${total} dogs displayed.`
                    : `${count.next} out of ${total} dogs displayed. See more?`
                content = (
                    <>
                        <p className="total">{title}</p>
                        {count.next < total && (
                            <Button
                                type="button"
                                className="btn-load"
                                actionHandler={setLoadHandler}
                            >
                                Please click here.
                            </Button>
                        )}
                    </>
                );
            } else  {
                content = <p className="total">All {total} dogs displayed.</p>
            }

            body = (
                <>
                    <div className="result-stats">
                        {content}
                    </div>
                    <FavoritePage selectedDogs={selectedDogs} />

                    <TablePage
                        data={data}
                        setSelectedDogs={setSelectedDogs}
                        selectedDogs={selectedDogs}
                    />
                </>
            )
        } else {
            body = <p className="total">No dogs found. Please change your query.</p>;
        }
    } else if (error) {
        body = <ErrorMessage message={error} />
    }

    return <div>{body}</div>;
}