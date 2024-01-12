import React, { useState } from 'react';
import DropSelectMessage from 'components/messages/DropSelectMessage';
import NumberRangeInput from 'components/common/NumberRangeInput';
import Switch from 'components/formComponents/Switch';


const CampaignCreateEditLayout = ({ children, ...rest }) => {
    // COLLECTING THE REST PROPS ITEMS..
    const { type = "CREATE" || "EDIT", handleClickSaveForm } = rest;

   // CAMPAIGN NAME STATE..
	const [campaignName, setCampaignName] = useState({
		value: "Connect and Win",
		placeholder: 'Ex. Word Boost',
		isError: false,
		errorMsg: "",
	});

	// SELECT MESSAGE SATES..
	const [selectMessageOptionOpen, setSelectMessageOptionOpen] = useState(false);
	const [groupMsgSelect, setGroupMsgSelect] = useState(null);
	const [quickMsg, setQuickMsg] = useState(null);
	const [quickMsgModalOpen, setQuickMsgModalOpen] = useState(false);
	const [usingSelectOption, setUsingSelectOption] = useState(false);

	// MESSAGE LIMIT/24HR STATE..
	const [msgLimit, setMsgLimit] = useState(100);

	// END DATE & TIME STATE..
	const [showEndDataAndTime, setShowEndDataAndTime] = useState(false);


    // HANDLE CAMPAIGNS NAME FUNCTION..
    const handleCampaignName = (event) => {
        // event.preventDefault();
        const value = event.target.value;
        setCampaignName({ ...campaignName, value });
    };

    // HANDLE MESSAGE SELECT OPTION'S ON BLUR..
    // const handleSelectMessageOnBlur = (_event) => {
    // 	console.log("I AM ON BLUR FOR MESSAGE SELECT AREA");
    // 	if (!groupMsgSelect) {
    // 		setSelectMsgError(true);
    // 	} else {
    // 		setSelectMsgError(false);
    // 	}
    // };

    // INCREMENTING AND DECREMENTING FOR MESSAGE LIMIT/25HR..
    const incrementDecrementVal = (type) => {
        if (type === "INCREMENT") {
            setMsgLimit((prev) => prev + 1);

            if (msgLimit >= 999) {
                setMsgLimit(999);
            }
        }

        if (type === "DECREMENT") {
            setMsgLimit((prev) => prev - 1);

            if (msgLimit <= 1) {
                setMsgLimit(1);
            }
        }
    };

    // HANDLE THE BLUR EFFECT'S VALIDATION FOR TEXT FIELDS..
    const handleBlurValidationOnTextField = (event) => {
        const value = event.target.value.trim();

        if (value.length < 1) {
            setCampaignName({ ...campaignName, isError: true, errorMsg: 'Enter campaign name' });
        } else {
            setCampaignName({ ...campaignName, isError: false, errorMsg: '' });
        }
    };

    // HANDLE MESSAGE LIMIT/24HR INPUT..
    const handleMessageLimitOnBlur = (event) => {
        const value = event.target.value;

        if (value?.trim() === '') {
            setMsgLimit(100);
        }

        if (value?.trim() !== '' && value?.trim() < 1) {
            setMsgLimit(1);
        }

        if (value?.trim() >= 999) {
            setMsgLimit(999);
        }
    };

    // HANDLE CLICK ON THE SAVE CAMPAIGNS..
    const handleClickToSaveCampaign = (event) => {
        event.preventDefault();
        // TRANSFERING DATA..
        handleClickSaveForm({
            campaignName: campaignName?.value,
            selectedGroupMsg: groupMsgSelect,
            selectedQuickMsg: quickMsg,
            msgLimit: msgLimit,
            isEndDateAndTime: showEndDataAndTime,
        });
    };


    return (
        <div className='campaigns-edit d-flex d-flex-column'>
            {/* CAMPAIGNS CREATE/EDIT FORM INPUT TOP SECTION */}
            <div className='campaigns-edit-inputs'>
                <div className='campaigns-input w-250'>
                    <label>Campaign name</label>

                    <input
                        type='text'
                        className={`campaigns-name-field ${campaignName?.isError ? 'campaigns-error-input-field' : ''}`}
                        placeholder={campaignName?.placeholder}
                        value={campaignName?.value}
                        onChange={handleCampaignName}
                        onBlur={handleBlurValidationOnTextField}
                    />

                    {campaignName?.isError && <span className="text-red">{campaignName?.errorMsg}</span>}
                </div>

                <div className='campaigns-input'>
                    <label>Select message</label>

                    <DropSelectMessage
                        type='CAMPAIGNS_MESSAGE'
                        openSelectOption={selectMessageOptionOpen}
                        handleIsOpenSelectOption={setSelectMessageOptionOpen}
                        groupList={[]}
                        groupSelect={groupMsgSelect}
                        setGroupSelect={setGroupMsgSelect}
                        quickMessage={quickMsg}
                        setQuickMessage={setQuickMsg}
                        quickMsgModalOpen={quickMsgModalOpen}
                        setQuickMsgOpen={setQuickMsgModalOpen}
                        isDisabled={false}
                        usingSelectOptions={usingSelectOption}
                        setUsingSelectOptions={setUsingSelectOption}
                        customWrapperClass='campaigns-select-msg-wrapper'
                        customSelectPanelClass='campaigns-select-panel'
                        customSelectPanelPageClass='campaigns-select-panel-page'
                    />
                </div>

                <div className='campaigns-input w-200'>
                    <label>Time delay</label>
                    <select className='campaigns-select'>
                        <option value='3'>3 min</option>
                        <option value='5'>5 min</option>
                        <option value='10'>10 min</option>
                        <option value='15'>15 min</option>
                    </select>
                </div>

                <div className='campaigns-input w-200'>
                    <label>Message limit/24hr</label>

                    <NumberRangeInput
                        value={msgLimit}
                        handleChange={(event) => setMsgLimit(event.target.value)}
                        handleBlur={handleMessageLimitOnBlur}
                        setIncrementDecrementVal={incrementDecrementVal}
                        customStyleClass='campaigns-num-input'
                    />
                </div>

                <div className='campaigns-input w-220'>
                    <label className='d-flex'>
                        <div>
                            <Switch
                                // isDisabled={!editCampaign || editCampaign?.friends_pending === 0}
                                checked={showEndDataAndTime}
                                handleChange={() =>
                                    setShowEndDataAndTime(!showEndDataAndTime)
                                }
                                smallVariant
                            />
                        </div>

                        <span>End date & time</span>
                    </label>

                    <input
                        type='datetime-local'
                        className='campaigns-datetime-select'
                        style={{
                            visibility: !showEndDataAndTime ? "hidden" : "visible",
                        }}
                    />
                </div>
            </div>

            {/* CAMPAIGNS CALENDERS SECTION MIDDLE */}
            <div className='create-campaign-scheduler-container'>
                {children}
            </div>

            {/* CAMPAIGNS SAVE OR CANCEL BUTTONS BOTTOM SECTION */}
            <div className='campaigns-save-buttons-container'>
                <button className='btn btn-grey'>Cancel</button>
                <button className='btn' onClick={handleClickToSaveCampaign}>Save campaign</button>
            </div>
        </div>
    );
};

export default React.memo(CampaignCreateEditLayout);