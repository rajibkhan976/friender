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
    setUsingSelectOptions = null,
    usingSelectOptions = null,
    saveMySetting = null,
    others = [],
    customWrapperClass = null,
    customSelectPanelClass = null,
    customSelectPanelPageClass = null
}) => {
    const [selectOption, setSelectOption] = useState(() => groupSelect ? groupSelect.group_name : '');
    const [selectedOptionId] = useState(() => groupSelect ? groupSelect._id : '');
    const [showTooltip, setShowTooltip] = useState(false);
    const [editorStateValue, setEditorStateValue] = useState("");
    const [unselectedError, setUnselectedError] = useState(false);

    useEffect(() => {
        if (quickMessage && type === "ACCEPT_REQ") {
            // setEditorStateValue(quickMessage?.__raw);
            localStorage.setItem('fr_quickMessage_accept_req', quickMessage?.__raw);
        }

        if (quickMessage && type === "REJECT_REQ") {
            localStorage.setItem("fr_quickMessage_reject_req", quickMessage?.__raw);
        }

        if (quickMessage && type === "SOMEONE_SEND_REQ") {
            localStorage.setItem("fr_quickMessage_someone_send_req", quickMessage?.__raw);
        }

        if (quickMessage && type === "REJT_INCOMING_REQ") {
            localStorage.setItem("fr_quickMessage_rejt_send_req", quickMessage?.__raw);
        }

        if (quickMessage && type === "ACCEPT_INCOMING_REQ") {
            localStorage.setItem("fr_quickMessage_accept_send_req", quickMessage?.__raw);
        }

        if (quickMessage && type === "CAMPAIGNS_MESSAGE") {
            localStorage.setItem("fr_quickMessage_campaigns_message", quickMessage?.__raw);
            setUnselectedError(false);
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
                        className={showTooltip ? `tooltipFullName quick-msg-tooltip-inline` : ''}
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

    // console.log("Check the Select Option group IDDD -- ", selectedOptionId);

    /**
     * ===== Select From Option =====
     */
    const handleClickToSelectOption = (optionObj) => {
        const { group_name } = optionObj;

        // store the old group ID before updating it.
        // localStorage.getItem("old_message_group_id");
        if (selectedOptionId) {
            localStorage.setItem("old_message_group_id", selectedOptionId);
        }

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

        if (type === "SOMEONE_SEND_REQ") {
            localStorage.setItem("fr_using_someone_send", true);
        }

        if (type === "REJT_INCOMING_REQ") {
            localStorage.setItem("fr_using_rejt_incoming", true);
        }

        if (type === "ACCEPT_INCOMING_REQ") {
            localStorage.setItem("fr_using_accept_incoming", true);
        }

        if (type === "CAMPAIGNS_MESSAGE") {
            localStorage.setItem("fr_using_campaigns_message", true);
        }
    };

    // Rendering select options..
    const renderSelectOption = () => {
        if (type === "ACCEPT_REQ") {
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

        if (type === "SOMEONE_SEND_REQ") {
            const isSelectUsing = localStorage.getItem("fr_using_someone_send");

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

        if (type === "REJT_INCOMING_REQ") {
            const isSelectUsing = localStorage.getItem("fr_using_rejt_incoming");

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

        if (type === "ACCEPT_INCOMING_REQ") {
            const isSelectUsing = localStorage.getItem("fr_using_accept_incoming");

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

        if (type === "CAMPAIGNS_MESSAGE") {
            const isSelectUsing = localStorage.getItem("fr_using_campaigns_message");

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

    /**
     * Select Bar Click Handler Function.
     */
    const handleSelectBarClick = () => {
        if (!isDisabled) {
            handleIsOpenSelectOption(!openSelectOption)
        }

        // UNSELECTED OPTION SITUATION FOR CAMPAIGNS MESSAGE SELECT..
        if (openSelectOption && !selectOption && type === "CAMPAIGNS_MESSAGE") {
            setUnselectedError(true);
        }

        // SELECTED OPTION SITUATION FOR CAMPAIGNS MESSAGE SELECT..
        if (openSelectOption && selectOption && type === "CAMPAIGNS_MESSAGE") {
            setUnselectedError(false);
        }

        if (others && others.length) {
            others.forEach((func) => func(false));
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
                oldGroupId={selectedOptionId}
            />

            <div className={`custom-select-option-wrapper ${customWrapperClass !== null ? customWrapperClass : ''}`}>
                {/* ====== SELECT BAR ====== */}
                <div
                    className={`select-wrapers 
                    ${isDisabled ? 'disable-custom-select-panel' : ' select-panel'} 
                    ${customSelectPanelClass !== null ? customSelectPanelClass : ''}
                    ${unselectedError ? 'select-panel-error' : ''}`}
                    style={{
                        borderColor: openSelectOption && '#0094FFFF',
                        color: 'lightgray'
                    }}
                    onClick={handleSelectBarClick}
                >
                    <span>{renderSelectOption()}</span>
                    {/*<span className="select-arrow"></span>*/}
                    <figure className="icon-arrow-down">
                        {!openSelectOption ? <ChevronDownArrowIcon size={18} color={isDisabled === false ? 'white' : 'gray'} /> : <ChevronUpArrowIcon size={18} />}
                    </figure>
                </div>

                {/* == ERROR SITUATIION HANDLE WITH MESSAGE == */}
                {unselectedError && <span className='text-red'>Select a message</span>}

                {/* ======== SELECT OPTIONS LIST ======== */}
                <div
                    className={`select-panel-page ${customSelectPanelPageClass ? customSelectPanelPageClass : ''}`}
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
                                        textContent={'If you need to send a quick message without creating a group, you can create a message for immediate use'}
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

