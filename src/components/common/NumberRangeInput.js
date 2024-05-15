import { ChevronUpArrowIcon, ChevronDownArrowIcon } from '../../assets/icons/Icons';

const NumberRangeInput = ({
	value,
	handleChange,
	handleBlur = (_event) => null,
	setIncrementDecrementVal,
	customStyleClass = null,
	placeholder = "",
	disabled = false,
}) => {
	return (
		<div className={`input-num ${customStyleClass ? customStyleClass : ""}`}>
			<input
				type={value === "∞" ? "text" : "number"}
				className='setting-input'
				value={value}
				onChange={handleChange}
				onBlur={handleBlur}
				placeholder={placeholder}
				disabled={disabled}
			/>

			<div className='input-arrows'>
				<button
					className='btn inline-btn btn-transparent'
					onClick={() => !disabled && setIncrementDecrementVal("INCREMENT")}
				>
					<ChevronUpArrowIcon size={15} />
				</button>

				<button
					className='btn inline-btn btn-transparent'
					onClick={() => !disabled && setIncrementDecrementVal("DECREMENT")}
				>
					<ChevronDownArrowIcon size={15} />
				</button>
			</div>
		</div>
	);
};

export default NumberRangeInput;