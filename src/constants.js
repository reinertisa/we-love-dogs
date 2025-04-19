
export const BASE_URL = 'https://frontend-take-home-service.fetch.com';

export const customReactSelectStyles = {
    control: (base) => ({
        ...base,
        backgroundColor: '#f3f4f6',
        borderColor: '#3b82f6',
        borderRadius: '8px',
        boxShadow: 'none',
        '&:hover': {
            borderColor: '#2563eb',
        },
    }),
    option: (base, state) => ({
        ...base,
        backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#e0f2fe' : 'white',
        color: state.isSelected ? 'white' : 'black',
        padding: '10px 12px',
    }),
    menu: (base) => ({
        ...base,
        borderRadius: '6px',
        overflow: 'hidden',
    }),
};