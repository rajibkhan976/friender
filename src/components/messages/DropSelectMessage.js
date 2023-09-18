import React, { useEffect, useState } from 'react';
import EditorModal from './EditorModal';
import { ChevronDownArrowIcon, ChevronUpArrowIcon, NotFoundGroupMessagesIcon } from '../../assets/icons/Icons';
import ToolTipPro from "../common/ToolTipPro";

/**
 * ==== Dropdown for Select Message ====
 * @returns {Element}
 */
const DropSelectMessage = ({
    openSelectOption,
    handleIsOpenSelectOption,
    groupList,
    groupSelect,
    setGroupSelect,
    quickMessage,
    setQuickMessage,
    quickMsgModalOpen,
    setQuickMsgOpen,
    isDisabled,
    usingOptions,
    setUsingOptions,
    // editorStateValue,
    // setEditorStateValue
}) => {
    const [selectOption, setSelectOption] = useState(() => groupSelect ? groupSelect.group_name : '');
    const [selectedOptionId, setSelectedOptionId] = useState(() => groupSelect ? groupSelect._id : '');
    const [showTooltip, setShowTooltip] = useState(false);
    const [editorStateValue, setEditorStateValue] = useState("");

    useEffect(() => {
        console.log("QUICKKK -- ", quickMessage);

        if (quickMessage) {
            console.log('====================================');
            console.log("QUICKKK -- ", quickMessage);
            console.log('====================================');
            
            setEditorStateValue(quickMessage?.__raw);
        }
    }, [quickMessage]);


    useEffect(() => {
        console.log("Editor State Value --- ", editorStateValue);
    }, [editorStateValue]);


    useEffect(() => {
        setUsingOptions(false);
    }, []);

    console.log("Using OPtions AT DROP-SELECT-MSG -- ", usingOptions);

    /**
     * ====== Make Text to Truncate when gets upper then 32 character ======
     * @param text
     * @returns {*}
     */
    const truncateTextTo32 = (text) => text.slice(0, 32) + (text.length > 32 ? "..." : "");

    /**
     * ====== Showing for Select Options for Group Message Selection ======
     * @param selects
     * @returns {*}
     */
    const showSelectOptions = (selects) => {
        if (selects?.length) {
            return selects.map(option => {
                const { _id, group_name } = option;

                return (
                    <li
                        key={_id}
                        className={showTooltip && `tooltipFullName quick-msg-tooltip-inline`}
                        data-text={group_name}
                        onClick={() => handleClickToSelectOption(option)}
                        onMouseEnter={() => group_name.length > 32 ? setShowTooltip(true) : setShowTooltip(false)}
                        onMouseLeave={() => setShowTooltip(false)}
                    >
                        {truncateTextTo32(group_name)}
                    </li>
                );
            });
        } else {
            return (
                <div className="not-found-group-messages-section">
                    <NotFoundGroupMessagesIcon />
                    <p>You haven't created any group yet</p>
                </div>
            );
        }
    };

    /**
     * ===== Handle On Edit button Clicks =====
     */
    const handleModalOpen = () => {
        setQuickMsgOpen(true);
        handleIsOpenSelectOption(false);
    };

    /**
     * ===== Select From Option =====
     */
    const handleClickToSelectOption = (optionObj) => {
        const { group_name } = optionObj;

        // store the old group ID before updating it.
        localStorage.getItem("old_message_group_id");
        localStorage.setItem("old_message_group_id", selectedOptionId);

        setSelectOption(group_name);
        setGroupSelect(optionObj);
        handleIsOpenSelectOption(false);
        setUsingOptions(true);
    };

    return (
        <>
            <div className='custom-select-option-wrapper'>
                {/* ====== SELECT BAR ====== */}
                <div
                    className={`select-wrapers ${isDisabled ? 'disable-custom-select-panel' : ' select-panel'}`}
                    style={{
                        borderColor: openSelectOption && '#0094FFFF',
                        color: 'lightgray'
                    }}
                    onClick={() => handleIsOpenSelectOption(!openSelectOption)}
                >
                    <span>{truncateTextTo32(selectOption || "Select the message")}</span>
                    {/*<span className="select-arrow"></span>*/}
                    <figure className="icon-arrow-down">
                        {!openSelectOption ? <ChevronDownArrowIcon size={18} color={isDisabled === false ? 'white' : 'gray'} /> : <ChevronUpArrowIcon size={18} />}
                    </figure>
                </div>

                {/* ======== SELECT OPTIONS LIST ======== */}
                <div
                    className={`select-panel-page`}
                    style={{ display: !openSelectOption ? 'none' : 'block' }}
                >
                    {/* ======== Quick Message ======== */}
                    <div className="quick-msg-section">
                        <div className="quick-msg-heading">
                            <h4 style={{ display: 'flex', alignItems: 'center' }}>
                                <span className="quick-msg-title">Quick message</span>
                                <span>
                                    <ToolTipPro
                                        type={"query-gray"}
                                        isInteract={false}
                                        textContent={'If you need to send a quick message without creating a group, you cancreate a message for immediate use'}
                                        extraClassToOptimise="tooltip-pro-content-modify-drop-select-msg"
                                    />
                                </span>
                            </h4>
                            <button onClick={handleModalOpen}>Edit</button>
                        </div>

                        <p
                            className="tooltipFullName quick-msg-tooltip"
                            data-text={`If you need to send a quick message without creating a group, you can create a message for immediate use`}
                        >
                            Click on edit to create a quick message..
                        </p>
                    </div>

                    {/* ======== Group Message ======== */}
                    <div className="group-msg-section">
                        <h4 className="group-msg-title">Group message</h4>
                        <ul>
                            {showSelectOptions(groupList)}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Modal for Quick Message Sending Text Editor  */}
            <EditorModal
                open={quickMsgModalOpen}
                setOpen={setQuickMsgOpen}
                setMessage={setQuickMessage}
                editorStateValue={editorStateValue}
                setEditorStateValue={setEditorStateValue}
            />
        </>
    )
}

export default DropSelectMessage;
