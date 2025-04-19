import axios from "axios";
import {useForm} from "react-hook-form";
import {useNavigate} from "react-router";

import './Login.css';
import {useState} from "react";

export default function LoginPage() {
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const {register, handleSubmit} = useForm({
        defaultValues: {
            name: '',
            email: '',
        }
    })

    const onSubmit = async (values) => {
        try {
            const rez = await axios.post('https://frontend-take-home-service.fetch.com/auth/login', {
                ...values,
            }, {
                withCredentials: true
            })
            console.log('rez', rez);

            const {data, status} = rez;

            if (data === 'OK' && status === 200) {
                localStorage.setItem('login', 'true');
                navigate('/search');
            }

        } catch (err) {
            setError(err);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="loginPage">
            <div>
                <label htmlFor="name">Name</label>
                <input id="name" type="text" {...register('name')} required={true} />
            </div>
            <div>
                <label htmlFor="email">Email</label>
                <input id="email" type="email" {...register('email')} required={true} />
            </div>
            <button type="submit">Login</button>
            {error && <p className="error">Something went wrong</p>}
        </form>
    )
}