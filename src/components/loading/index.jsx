import PropTypes from 'prop-types';

import './index.css';

const propTypes = {
    text: PropTypes.string,
};
/**
 * This renders a loading indicator.
 */
export default function Loading({text = 'Loading...'}) {
    return (
        <div className="loading" role="status">
            <span>{text}</span>
        </div>
    );
}
Loading.propTypes = propTypes;