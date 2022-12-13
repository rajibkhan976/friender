import React, { useState } from 'react';

const Search = ({extraClass, placeholderText="Search...", onSearch}) => {
    const [errors, setErrors] = useState('');

    const onSearchChange = (e) => {
        onSearch(e.target.value);
    }
    return (
        <div className={`fr-search element-wraper ${extraClass ? extraClass : ''}`}>
            <div className='form-field h-100'>
                <input 
                    type="search" 
                    placeholder={placeholderText}
                    onChange={(e) => onSearchChange(e)}
                    // tabIndex={setTabIndex}
                    autoComplete="new-password"
                    className={errors ? "form-control error" : "form-control"}
                />
                {errors && <span className="error-mesage">{errors}</span>}
            </div>
        </div>
    );
};

export default Search;