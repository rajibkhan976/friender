import { useState } from "react";

const Radio = ({name, options, onChangeMethod}) => {
    const [radioOptions, setRadioOptions] = useState([]);

    const onOptionChange = (itemChecked) => {
        onChangeMethod(itemChecked);
    }

    useState(() => {
        setRadioOptions(options);
    }, [radioOptions])
    
    return (
        <div className="fr-radio-block d-flex f-align-center f-justify-between">
            {radioOptions.map((optionItem, i) => (
                <label className="fr-radio-option f-align-center f-justify-between" key={'fr-option-'+i}>
                    <input 
                        type="radio" 
                        name={name}
                        defaultChecked={optionItem.checked}
                        onChange={() => onOptionChange(optionItem)}
                    />
                    <span className="fr-radio-design">
                        {optionItem.label}
                    </span>
                </label>
            ))}
        </div>
    )
};

export default Radio;