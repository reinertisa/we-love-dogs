import PropTypes from 'prop-types';


const propTypes = {
    /**
     * Function to call on click or keyboard event.
     */
    actionHandler: PropTypes.func,
    /**
     * Type of button: `button` (the default), `submit`, or `reset`.  Mainly used for a button in a form.
     * Not applicable if this is an `href` button.
     */
    type: PropTypes.oneOf(['button', 'reset', 'submit']),
    /**
     * Determines if the button should be disabled.
     */
    disabled: PropTypes.bool,
    className: PropTypes.string,
    style: PropTypes.object,
    /**
     * Used to set the `title` attribute as well as `aria-label` attribute if `aria-label` is not defined.
     */
    title: PropTypes.string,
    children: PropTypes.node.isRequired,
};

/**
 * Creates a button component.
 *
 * @return {JSX.Element}
 */
export default function Button({actionHandler, type, disabled, children, className,
                                   style, title, ...otherProps}) {
    return (
        <button
            type={type || 'button'}
            onClick={actionHandler}
            disabled={disabled}
            className={className}
            style={style}
            title={title}
            {...otherProps}
        >
            {children}
        </button>
    )
}
Button.propTypes = propTypes;
