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
    handleIsOpenSelectOption = null,
    groupList,
    groupSelect,
    setGroupSelect,
    quickMessage,
    setQuickMessage,
    quickMsgModalOpen,
    setQuickMsgOpen,
    isDisabled,
    type,
    setUsingSelectOptions,
    usingSelectOptions,
    saveMySetting
}) => {
    const [selectOption, setSelectOption] = useState(() => groupSelect ? groupSelect.group_name : '');
    const [selectedOptionId] = useState(() => groupSelect ? groupSelect._id : '');
    const [showTooltip, setShowTooltip] = useState(false);
    const [editorStateValue, setEditorStateValue] = useState("");

    useEffect(() => {
        if (quickMessage && type === "ACCEPT_REQ") {
            // setEditorStateValue(quickMessage?.__raw);
            localStorage.setItem('fr_quickMessage_accept_req', quickMessage?.__raw);
        }

        if (quickMessage && type === "REJECT_REQ") {
            localStorage.setItem("fr_quickMessage_reject_req", quickMessage?.__raw);
        }
    }, [quickMessage]);

    /**
     * Saving manually when selecting the options only..
     */
    useEffect(() => {
        if (usingSelectOptions !== false) {
            saveMySetting();
        }
    }, [usingSelectOptions]);

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
                        data-text={`${group_name}`}
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
        // setUsingOptions(true);
        setUsingSelectOptions(true);

        if (type === "ACCEPT_REQ") {
            localStorage.setItem("fr_using_select_accept", true);
        }

        if (type === "REJECT_REQ") {
            localStorage.setItem("fr_using_select_rejt", true);
        }
    };

    // Rendering select options..
    const renderSelectOption = () => {
        if (type === "ACCEPT_REQ") {
            console.log("This is SELECT OPTION -- CURRENTLY SAVEDDD --- ", selectOption);
            const isSelectUsing = localStorage.getItem("fr_using_select_accept");

            if (quickMessage && !isSelectUsing) {
                return "Quick Message";
            }

            if (!isSelectUsing) {
                return 'Select the message';
            }

            if (isSelectUsing) {
                return truncateTextTo32(selectOption || "Select the message");
            }
        }

        if (type === "REJECT_REQ") {
            const isSelectUsing = localStorage.getItem("fr_using_select_rejt");

            if (quickMessage && !isSelectUsing) {
                return "Quick Message";
            }

            if (!isSelectUsing) {
                return 'Select the message';
            }

            if (isSelectUsing) {
                return truncateTextTo32(selectOption || "Select the message");
            }
        }
    };


    return (
        <>
            {/* Modal for Quick Message Sending Text Editor  */}
            <EditorModal
                type={type}
                open={quickMsgModalOpen}
                setOpen={setQuickMsgOpen}
                setMessage={setQuickMessage}
                editorStateValue={editorStateValue}
                setEditorStateValue={setEditorStateValue}
            />

            <div className='custom-select-option-wrapper'>
                {/* ====== SELECT BAR ====== */}
                <div
                    className={`select-wrapers ${isDisabled ? 'disable-custom-select-panel' : ' select-panel'}`}
                    style={{
                        borderColor: openSelectOption && '#0094FFFF',
                        color: 'lightgray'
                    }}
                    onClick={() => !isDisabled && handleIsOpenSelectOption(!openSelectOption)}
                >
                    <span>{renderSelectOption()}</span>
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
        </>
    )
}

export default DropSelectMessage;
