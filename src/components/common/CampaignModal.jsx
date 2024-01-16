import React, { useState, useEffect } from 'react';
import { XMarkIcon } from "assets/icons/Icons";
import DropSelectMessage from 'components/messages/DropSelectMessage';
import DropSelector from 'components/formComponents/DropSelector';
import DayChooseBalls from 'components/common/DayChooseBalls';
import NumberRangeInput from 'components/common/NumberRangeInput';
import ColorPickerBalls from 'components/common/ColorPickerBalls';
import { fetchGroups } from 'actions/MessageAction';
import { useDispatch, useSelector } from "react-redux";


const CalenderModal = ({ open = false, setOpen }) => {
    const dispatch = useDispatch();
    const [calenderModalOpen, setCalenderModalOpen] = useState(open);

    // CAMPAIGN NAME STATE..
    const [campaignName, setCampaignName] = useState({
        value: "Connect and Win",
        placeholder: 'Ex. Word Boost',
        isError: false,
        errorMsg: "",
    });

    // SELECT MESSAGE SATES..
    const [groupMessages, setGroupMessages] = useState([]);
    const [selectMessageOptionOpen, setSelectMessageOptionOpen] = useState(false);
    const [groupMsgSelect, setGroupMsgSelect] = useState(null);
    const [quickMsg, setQuickMsg] = useState(null);
    const [quickMsgModalOpen, setQuickMsgModalOpen] = useState(false);
    const [usingSelectOption, setUsingSelectOption] = useState(false);

    // TIME DELAY..
    const [timeDelay, setTimeDelay] = useState("");

    // MESSAGE LIMIT/24HR STATE..
    const [msgLimit, setMsgLimit] = useState();

    // TIME DURATIONS..
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    const timeDelays = [
        {
            value: "3 min",
            label: '3 min',
            selected: true,
        },
        {
            value: "5 min",
            label: '5 min',
            selected: false,
        },
        {
            value: "10 min",
            label: '10 min',
            selected: false,
        },
        {
            value: "15 min",
            label: '15 min',
            selected: false,
        }
    ];

    const timeOptions = [
        {
            value: "12:00  am",
            label: "12:00  am",
            selected: false,
        },
        {
            value: "12:30  am",
            label: "12:30  am",
            selected: false,
        },
        {
            value: "1:00  am",
            label: "1:00  am",
            selected: false,
        },
        {
            value: "1:30  am",
            label: "1:30  am",
            selected: false,
        },
        {
            value: "2:00  am",
            label: "2:00  am",
            selected: false,
        },
        {
            value: "2:30  am",
            label: "2:30  am",
            selected: false,
        },
        {
            value: "3:00  am",
            label: "3:00  am",
            selected: false,
        },
        {
            value: "3:30  am",
            label: "3:30  am",
            selected: false,
        },
        {
            value: "4:00  am",
            label: "4:00  am",
            selected: false,
        },
        {
            value: "4:30  am",
            label: "4:30  am",
            selected: false,
        },
        {
            value: "5:00  am",
            label: "5:00  am",
            selected: false,
        },
        {
            value: "5:30  am",
            label: "5:30  am",
            selected: false,
        },
        {
            value: "6:00  am",
            label: "6:00  am",
            selected: false,
        },
        {
            value: "6:30  am",
            label: "6:30  am",
            selected: false,
        },
        {
            value: "7:00  am",
            label: "7:00  am",
            selected: false,
        },
        {
            value: "8:00  am",
            label: "8:00  am",
            selected: false,
        },
        {
            value: "8:30  am",
            label: "8:30  am",
            selected: false,
        },
        {
            value: "9:00  am",
            label: "9:00  am",
            selected: false,
        },
        {
            value: "9:30  am",
            label: "9:30  am",
            selected: false,
        },
        {
            value: "10:00  am",
            label: "10:00  am",
            selected: false,
        },
        {
            value: "11:00  am",
            label: "11:00  am",
            selected: false,
        },
        {
            value: "11:30  am",
            label: "11:30  am",
            selected: false,
        },
        {
            value: "12:00  pm",
            label: "12:00  pm",
            selected: false,
        },
        {
            value: "12:30  pm",
            label: "12:30  pm",
            selected: false,
        },
        {
            value: "1:00  pm",
            label: "1:00  pm",
            selected: false,
        },
        {
            value: "1:30  pm",
            label: "1:30  pm",
            selected: false,
        },
        {
            value: "2:00  pm",
            label: "2:00  pm",
            selected: false,
        },
        {
            value: "2:30  pm",
            label: "2:30  pm",
            selected: false,
        },
        {
            value: "3:00  pm",
            label: "3:00  pm",
            selected: false,
        },
        {
            value: "3:30  pm",
            label: "3:30  pm",
            selected: false,
        },
        {
            value: "4:00  pm",
            label: "4:00  pm",
            selected: false,
        },
        {
            value: "4:30  pm",
            label: "4:30  pm",
            selected: false,
        },
        {
            value: "5:00  pm",
            label: "5:00  pm",
            selected: false,
        },
        {
            value: "5:30  pm",
            label: "5:30  pm",
            selected: false,
        },
        {
            value: "6:00  pm",
            label: "6:00  pm",
            selected: false,
        },
        {
            value: "6:30  pm",
            label: "6:30  pm",
            selected: false,
        },
        {
            value: "7:00  pm",
            label: "7:00  pm",
            selected: false,
        },
        {
            value: "8:00  pm",
            label: "8:00  pm",
            selected: false,
        },
        {
            value: "8:30  pm",
            label: "8:30  pm",
            selected: false,
        },
        {
            value: "9:00  pm",
            label: "9:00  pm",
            selected: false,
        },
        {
            value: "9:30  pm",
            label: "9:30  pm",
            selected: false,
        },
        {
            value: "10:00  pm",
            label: "10:00  pm",
            selected: false,
        },
        {
            value: "11:00  pm",
            label: "11:00  pm",
            selected: false,
        },
        {
            value: "11:30  pm",
            label: "11:30  pm",
            selected: false,
        },
    ];


    // HANDLE CAMPAIGNS NAME FUNCTION..
    const handleCampaignName = (event) => {
        // event.preventDefault();
        const value = event.target.value;
        setCampaignName({ ...campaignName, value });
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

    // TIME DELAY..
    const onChangeTimeDelay = (event) => {
        setTimeDelay(event.target.value);
    };

    // TIME DURATIONS..
    const onChangeStartingTime = (event) => {
        setStartTime(event.target.value);
    };
    const onChangeEndingTime = (event) => {
        setEndTime(event.target.value);
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

    useEffect(() => {
        // Fetching All Group Messages.
        dispatch(fetchGroups())
            .unwrap()
            .then((res) => {
                const data = res?.data;
                if (data && data.length) {
                    setGroupMessages(data);
                }
            })
            .catch((error) =>
                console.log("Error when try to fetching all groups -- ", error)
            );
    }, []);


    // useEffect(() => {
    //     if (quickMsgModalOpen === true) {
    //         setCalenderModalOpen(false);
    //     }
    // }, [quickMsgModalOpen, calenderModalOpen]);


    return (
        <div className="modal campaigns-modal" style={{ display: calenderModalOpen ? "block" : "none" }}>
            <div className="modal-content-wraper">
                <span
                    className="close-modal campaign-close-modal"
                    onClick={() => {
                        setOpen(false);
                        setCalenderModalOpen(false);
                    }}
                >
                    <XMarkIcon color='lightgray' />
                </span>

                <div className='modal-header d-flex f-align-center campaign-modal-header'>
                    <span style={{ color: '#fff', fontSize: '15px' }}>{"Create new campaign"}</span>
                </div>

                <div className="modal-content campaign-modal-content">
                    {/* NAME / MESSAGE SELECT COMPONENT */}
                    <div className="row">
                        <div className="col">
                            <label className='mb'>Name</label>

                            <input
                                type="text"
                                className={`campaigns-name-field ${campaignName?.isError ? 'campaigns-error-input-field' : ''}`}
                                placeholder={campaignName?.placeholder}
                                value={campaignName?.value}
                                onChange={handleCampaignName}
                                onBlur={handleBlurValidationOnTextField}
                            />

                            {campaignName?.isError && <span className="text-red campaign-modal-name-error">{campaignName?.errorMsg}</span>}
                        </div>

                        <div className="col">
                            <label className='mb'>Message</label>

                            <DropSelectMessage
                                type='CAMPAIGNS_MODAL_MESSAGE'
                                openSelectOption={selectMessageOptionOpen}
                                handleIsOpenSelectOption={setSelectMessageOptionOpen}
                                groupList={groupMessages}
                                groupSelect={groupMsgSelect}
                                setGroupSelect={setGroupMsgSelect}
                                quickMessage={quickMsg}
                                setQuickMessage={setQuickMsg}
                                quickMsgModalOpen={quickMsgModalOpen}
                                setQuickMsgOpen={setQuickMsgModalOpen}
                                isDisabled={false}
                                usingSelectOptions={usingSelectOption}
                                setUsingSelectOptions={setUsingSelectOption}
                                customWrapperClass='campaigns-modal-select-msg-wrapper'
                                customSelectPanelClass='campaigns-modal-select-panel'
                                customSelectPanelPageClass='campaigns-modal-select-panel-page'
                                customErrorMsgStyleClass='campaigns-modal-name-error'
                                customQuickMsgTooltipStyleClass='campaign-quick-msg-tooltip'
                            />
                        </div>
                    </div>

                    {/* TIME DELAY / MESSAGE LIMIT COMPONENT */}
                    <div className="row mt-2">
                        <div className="col">
                            <label className='mb'>Time delay</label>

                            <DropSelector
                                selects={timeDelays}
                                // id='start-time-span'
                                defaultValue={
                                    timeDelays?.find((el) => el.value === timeDelay)?.value
                                }
                                extraClass='campaign-time-select-full'
                                height='40px'
                                width='inherit'
                                handleChange={onChangeTimeDelay}
                            />
                        </div>

                        <div className="col">
                            <label className='mb'>Message limit/24hr</label>

                            <NumberRangeInput
                                value={msgLimit}
                                handleChange={(event) => setMsgLimit(event.target.value)}
                                handleBlur={handleMessageLimitOnBlur}
                                setIncrementDecrementVal={incrementDecrementVal}
                                customStyleClass='campaign-modal-num-input'
                                placeholder='Enter value'
                            />
                        </div>
                    </div>


                    {/* CHOOSE DAY(S) BALLS COMPONENT */}
                    <div className="row mt-2">
                        <div className="col">
                            <label>Choose day(s)</label>

                            <div className='ml'>
                                <DayChooseBalls />
                            </div>
                        </div>
                    </div>

                    {/* COLOR PICKER COMPONENT */}
                    <div className="row mt-2">
                        <div className="col-full">
                            <label>Pick color</label>

                            <div className="ml mt">
                                <ColorPickerBalls />
                            </div>
                        </div>
                    </div>

                    {/* TIME DURATION / END DATE & TIME COMPONENT */}
                    <div className="row mt-2">
                        <div className="col">
                            <label>Time duration</label>

                            <div className="col-sm mt">
                                <DropSelector
                                    selects={timeOptions}
                                    id='start-time-span'
                                    defaultValue={
                                        timeOptions?.find((el) => el.value === startTime)?.value
                                    }
                                    extraClass='fr-select-new tinyWrap campaign-time-select-half'
                                    height='40px'
                                    width='120px'
                                    handleChange={onChangeStartingTime}
                                />

                                <span>to</span>

                                <DropSelector
                                    selects={timeOptions}
                                    id='end-time-span'
                                    defaultValue={
                                        timeOptions?.find((el) => el.value === endTime)?.value
                                    }
                                    extraClass='fr-select-new tinyWrap campaign-time-select-half'
                                    height='40px'
                                    width='120px'
                                    handleChange={onChangeEndingTime}
                                />
                            </div>
                        </div>

                        <div className="col">
                            <label>End date & time</label>

                            <input type="datetime-local" className='mt' />
                        </div>
                    </div>
                </div>

                <div className="modal-buttons d-flex justifyContent-end campaign-modal-buttons" style={{ gap: '10px' }}>
                    <button className='btn btn-grey'>Cancel</button>
                    <button className='btn' disabled={false}>Save</button>
                </div>
            </div>
        </div>
    );
};

export default CalenderModal;