export const useSelectStyles = () => {
    const estilosSelect = {
        control: (provided, state) => ({
            ...provided,
            borderColor: state.isFocused ? '#60a5fa' : '#d1d5db',
            boxShadow: state.isFocused ? '0 0 0 1px #60a5fa' : 'none',
            '&:hover': {
                borderColor: state.isFocused ? '#60a5fa' : '#d1d5db'
            },
            minHeight: '38px',
            fontSize: '14px'
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused ? '#dbeafe' : 'white',
            color: '#374151',
            cursor: 'pointer',
            fontSize: '14px',
            '&:hover': {
                backgroundColor: '#dbeafe'
            }
        }),
        placeholder: (provided) => ({
            ...provided,
            color: '#9ca3af',
            fontSize: '14px'
        }),
        singleValue: (provided) => ({
            ...provided,
            color: '#111827',
            fontSize: '14px'
        }),
        menu: (provided) => ({
            ...provided,
            zIndex: 9999
        }),
        menuPortal: (provided) => ({ 
            ...provided, 
            zIndex: 9999 
        })
    };

    const estilosSelectError = {
        ...estilosSelect,
        control: (provided, state) => ({
            ...estilosSelect.control(provided, state),
            borderColor: '#fca5a5',
            '&:hover': {
                borderColor: '#fca5a5'
            }
        })
    };

    return { estilosSelect, estilosSelectError };
};