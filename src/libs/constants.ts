import { CSSObjectWithLabel } from 'react-select';
import { SelectOption } from './types/SelectOption';

export const interestOptions: SelectOption[] = [
    { label: 'Sports', value: 'Sports' },
    { label: 'Music', value: 'Music' },
    { label: 'Reading', value: 'Reading' },
    { label: 'Travel', value: 'Travel' },
    { label: 'Technology', value: 'Technology' },
    { label: 'Cooking', value: 'Cooking' },
    { label: 'Photography', value: 'Photography' },
];

export const customStyles = {
    control: (provided: CSSObjectWithLabel) => ({
        ...provided,
        borderColor: '#3A8EBA',
        borderRadius: '0.375rem',
        fontSize: '0.75rem',
        minHeight: '36px',
    }),
    placeholder: (provided: CSSObjectWithLabel) => ({
        ...provided,
        fontSize: '10px',
        color: '#6b7280',
        textAlign: 'left',
        paddingLeft: '0.25rem',
    }),
    menu: (provided: CSSObjectWithLabel) => ({
        ...provided,
        zIndex: 9999,
        width: '200px',
    }),
    multiValue: (provided: CSSObjectWithLabel) => ({
        ...provided,
        backgroundColor: '#d6e4f8',
        borderRadius: '0.375rem',
    }),
    multiValueLabel: (provided: CSSObjectWithLabel) => ({
        ...provided,
        color: '#4A5568',
    }),
    multiValueRemove: (provided: CSSObjectWithLabel) => ({
        ...provided,
        color: '#4A5568',
        '&:hover': {
            backgroundColor: '#3A8EBA',
            color: 'white',
        },
    }),
    dropdownIndicator: (provided: CSSObjectWithLabel) => ({
        ...provided,
        color: '#6b7280',
        fontWeight: '50',
        fontFamily: 'Poppins',
        paddingRight: '0.75rem',
    }),
    menuList: (provided: CSSObjectWithLabel) => ({
        ...provided,
        maxHeight: '150px',
    }),
} satisfies { [key: string]: (base: CSSObjectWithLabel) => CSSObjectWithLabel };