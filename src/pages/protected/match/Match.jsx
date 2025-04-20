import {useLocation, useNavigate} from "react-router";
import Button from "../../../components/buttons/index.jsx";
import './Match.css';

/**
 * Render the match dog page.
 */
export default function MatchPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const {data} = location.state
    const {img, name, age, breed, zip_code: zipCode} = data[0];

    if (data == null) {
        return null;
    }

    const handleNavigate = () => navigate(-1)

    return (
        <div className="dog-profile-container">
            <div className="dog-card">
                <img src={img} alt={name} className="dog-image" />
                <h2>{name}</h2>
                <p><strong>Age:</strong> {age}</p>
                <p><strong>Breed:</strong> {breed}</p>
                <p><strong>Zip Code:</strong> {zipCode}</p>
                <Button className="go-back-button" actionHandler={handleNavigate}>
                    ← Go Back
                </Button>
            </div>
        </div>
    );
}