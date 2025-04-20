import {Link} from "react-router";

import './index.css'

export default function NotFound() {
  return (
      <div className="notfound-container">
        <h1>404</h1>
        <p>Oops! The page you're looking for doesn't exist.</p>
        <Link to="/search">Go back home</Link>
      </div>
  );
}
