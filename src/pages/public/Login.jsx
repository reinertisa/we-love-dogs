import axios from "axios";
import {FormProvider, useForm} from "react-hook-form";
import {useNavigate} from "react-router";

import './Login.css';
import {useState} from "react";
import FormText from "../../components/form/Text.jsx";
import Button from "../../components/buttons/index.jsx";
import {BASE_URL} from "../../constants.js";
import ErrorMessage from "../../components/errors/index.jsx";

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
            console.log(err);
                setError(err.response?.data);
        }
    }

    return (
        <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)} className="loginPage">
            <FormText name="name" label="Name" />
            <FormText name="email" label="Email" />
            <Button type="submit">Login</Button>
            {error && <ErrorMessage message={error} />}
        </form>
        </FormProvider>
    )
}