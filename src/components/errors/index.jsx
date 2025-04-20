import {isObject} from 'lodash';
import clsx from "clsx";

import './index.css'

const defaultMessage = (
    <p>
        Something unexpected happened.  We are looking into it and will try to fix this as soon as
        possible.  If you would like to feedback to let us know the details around this
        problem, we would be very grateful.
    </p>
);

export default function ErrorMessage({title, message, className, style, ...otherProps}) {
    if (!message) {
        return null;
    }

    const renderTitle = () => {
        if (title) {
            if (isObject(title)) {
                return title;
            } else {
                return <h4>{title}</h4>;
            }
        }
        return '';
    };

    const renderMessage = () => {
        if (message) {
            if (isObject(message)) {
                return message;
            }
            return <p>{message}</p>;
        }
        return defaultMessage;
    };

    return (
        <div className={clsx('error', className)} style={style} {...otherProps}>
            {renderTitle()}
            {renderMessage()}
        </div>
    );
}