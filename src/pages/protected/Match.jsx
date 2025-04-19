import {useLocation, useNavigate} from "react-router";

import './Match.css';

export default function MatchPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const {data} = location.state
    const {img, name, age, breed, zip_code: zipCode} = data[0];

    if (data == null) {
        return null;
    }

    return (
        <div className="dog-profile-container">
            <div className="dog-card">
                <img src={img} alt={name} className="dog-image" />
                <h2>{name}</h2>
                <p><strong>Age:</strong> {age}</p>
                <p><strong>Breed:</strong> {breed}</p>
                <p><strong>Zip Code:</strong> {zipCode}</p>

                <button className="go-back-button" onClick={() => navigate(-1)}>
                    ← Go Back
                </button>
            </div>
        </div>
    );
}