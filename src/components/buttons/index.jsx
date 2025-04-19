

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