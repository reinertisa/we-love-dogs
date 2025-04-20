import axios from "axios";
import {FormProvider, useForm} from "react-hook-form";
import {useNavigate} from "react-router";

import {useState} from "react";
import FormText from "../../../components/form/Text.jsx";
import Button from "../../../components/buttons/index.jsx";
import {BASE_URL, ERROR_MSG} from "../../../constants.js";
import ErrorMessage from "../../../components/errors/index.jsx";
import './index.css';

export default function LoginPage() {
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const formMethods = useForm({
        defaultValues: {
            name: '',
            email: '',
        }
    })

    const {handleSubmit} = formMethods;

    const onSubmit = async (values) => {
        try {
            const rez = await axios.post(`${BASE_URL}/auth/login`, {
                ...values,
            }, {
                withCredentials: true
            })

            const {data, status} = rez;
            if (data === 'OK' && status === 200) {
                localStorage.setItem('login', 'true');
                navigate('/search');
            }
        } catch (err) {
            if (err.response?.status === 401) {
                localStorage.removeItem('login');
                navigate('/');
            }
            setError(ERROR_MSG);
        }
    }

    return (
        <div className="loginPageWrapper">
            <div className="loginPage">
                <FormProvider {...formMethods}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FormText name="name" label="Name" />
                        <FormText name="email" label="Email" />
                        <Button type="submit">Login</Button>
                        {error && <ErrorMessage message={error} />}
                    </form>
                </FormProvider>
            </div>
        </div>
    )
}