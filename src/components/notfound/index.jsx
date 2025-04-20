import {Link} from "react-router";

import fezzik from "../../assets/fezzik.jpg"
import inigo from "../../assets/inigo.jpg";
import cat from "../../assets/cat.jpg";

import './index.css'

export default function NotFound() {
  return (
      <div className="notfound-container">
          <h1>404</h1>
          <p>Oops! The page you're looking for doesn't exist.</p>
          <p>At least you met my babies Fezzik, Inigo and Cat</p>

          <div className="notfound-images">
              <img src={fezzik} alt="Fezzik" />
              <img src={inigo} alt="Inigo" />
              <img src={cat} alt="Cat" />
          </div>

        <Link to="/search" className="back-link">
            Go back home
        </Link>
      </div>
  );
}
