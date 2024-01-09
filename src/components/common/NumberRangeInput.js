import { ChevronUpArrowIcon, ChevronDownArrowIcon } from '../../assets/icons/Icons';

const NumberRangeInput = ({ value, handleChange, setIncrementDecrementVal, customStyleClass = null }) => {
    return (
        <div className={`input-num ${customStyleClass ? customStyleClass : ''}`}>
            <input
                type='number'
                className='setting-input'
                value={value}
                onChange={handleChange}
            />

            <div className='input-arrows'>
                <button
                    className='btn inline-btn btn-transparent'
                    onClick={() =>
                        setIncrementDecrementVal("INCREMENT")
                    }
                >
                    <ChevronUpArrowIcon size={15} />
                </button>

                <button
                    className='btn inline-btn btn-transparent'
                    onClick={() =>
                        setIncrementDecrementVal("DECREMENT")
                    }
                >
                    <ChevronDownArrowIcon size={15} />
                </button>
            </div>
        </div>
    );
};

export default NumberRangeInput;