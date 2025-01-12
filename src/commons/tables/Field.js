import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

function Field({ id, label = '', value = '', onChange, locked = false, focused = false, error = '' }) {
    const [isFocused, setIsFocused] = useState((locked && focused) || false);
    const [inputValue, setInputValue] = useState(value);
    const [fieldError, setFieldError] = useState(error);

    const handleChange = (event) => {
        const newValue = event.target.value;
        setInputValue(newValue);
        setFieldError('');
        if (onChange) {
            onChange(event);
        }
    };

    return (
        <div className={`input-field ${(locked ? isFocused : isFocused || inputValue) && 'focused'} ${locked && !isFocused && 'locked'}`}>
            <input
                id={id}
                type="text"
                value={inputValue}
                placeholder={label}
                onChange={handleChange}
                onFocus={() => !locked && setIsFocused(true)}
                onBlur={() => !locked && setIsFocused(false)}
            />
            <label htmlFor={id} className={fieldError ? 'error' : ''}>
                {fieldError || label}
            </label>
        </div>
    );
}

Field.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string,
    onChange: PropTypes.func,
    focused: PropTypes.bool,
    value: PropTypes.string,
    locked: PropTypes.bool,
    error: PropTypes.string,
};

export default Field;
