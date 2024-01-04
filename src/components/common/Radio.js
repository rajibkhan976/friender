import { memo, useState } from "react";

const Radio = ({name, options, isIcon=false, onChangeMethod, extraClass}) => {
    const [radioOptions, setRadioOptions] = useState([]);

    const onOptionChange = (itemChecked) => {
        let itemCheckedObject = {...itemChecked, checked: true}
        onChangeMethod(itemCheckedObject);
    }

    useState(() => {
        setRadioOptions(options);
    }, [options])
    
    return (
        <div className={`fr-radio-block d-flex f-align-center f-justify-between ${extraClass ? extraClass : ''}`}>
            {radioOptions?.map((optionItem, i) => (
                <label className="fr-radio-option f-align-center f-justify-between" key={'fr-option-'+i}>
                    <input 
                        type="radio" 
                        name={name}
                        defaultChecked={optionItem.checked}
                        onChange={() => onOptionChange(optionItem)}
                    />
                    <span className="fr-radio-design">
                        {
                            isIcon ?
                                optionItem?.iconItem:
                                optionItem?.label
                        }
                    </span>
                </label>
            ))}
        </div>
    )
};

export default memo(Radio);