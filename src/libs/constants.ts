
export const interestOptions = [
    { label: 'Sports', value: 'Sports' },
    { label: 'Music', value: 'Music' },
    { label: 'Reading', value: 'Reading' },
    { label: 'Travel', value: 'Travel' },
    { label: 'Technology', value: 'Technology' },
    { label: 'Cooking', value: 'Cooking' },
    { label: 'Photography', value: 'Photography' },
];

export const customStyles = {
    control: (provided: any) => ({
        ...provided,
        borderColor: '#3A8EBA',
        borderRadius: '0.375rem',
        fontSize: '0.75rem',
        minHeight: '36px',
        
    }),
    placeholder: (provided: any) => ({
        ...provided,
        fontSize: '10px',
        color: '#6b7280',
        textAlign: 'left',
        paddingLeft: '0.25rem',
    }),
    menu: (provided: any) => ({
        ...provided,
        zIndex: 9999,
        width: '200px',
    }),

    multiValue: (provided: any) => ({

        ...provided,
        backgroundColor: '#d6e4f8',
        borderRadius: '0.375rem',
    }),
    multiValueLabel: (provided: any) => ({
        ...provided,
        color: '#4A5568',
    }),
    multiValueRemove: (provided: any) => ({
        ...provided,
        color: '#4A5568',
        '&:hover': {
            backgroundColor: '#3A8EBA',
            color: 'white',
        },
    }),
    dropdownIndicator: (provided: any) => ({
        ...provided,
        color: '#6b7280',
        fontWeight: '50',
        fontFamily: 'Poppins',
        paddingRight: '0.75rem',
    }),
    menuList: (provided: any) => ({
        ...provided,
        maxHeight: '150px',
    }),
};
