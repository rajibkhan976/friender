// import { XMarkIcon } from "../../assets/icons/Icons";
import TextEditor from '../common/TextEditor/TextEditor';
import { MergeFieldsIcon, QueryIconGrey, SpintaxIcon } from "../../assets/icons/Icons";
import {useState} from "react";

/**
 * Editor Modal Component
 * @param open
 * @param setOpen
 * @returns {Element}
 * @constructor
 */
const EditorModal = ({ open, setOpen, setMessage, setEditorStateValue, type, setSendMessage }) => {
    const [editorStateValue] = useState(() => {
        if (type === "ACCEPT_REQ") {
            return localStorage.getItem("fr_quickMessage_accept_req") || "";
        }

        if (type === "REJECT_REQ") {
            return localStorage.getItem("fr_quickMessage_reject_req") || "";
        }
    });

    return (
        <div
            className={`modal-background`}
            style={{ display: open ? "block" : "none" }}
        // onClick={() => {
        //   setOpen(false);
        // }}
        >
            <div className="modal editor-modal">
                <div className="modal-content-wraper">

                    {/* MODAL HEADER */}
                    <div className={`modal-header editor-modal-header`}>
                        <span className="editor-modal-header-text" style={{ color: '#fff' }}>{"Quick message"}</span>

                        <div className="editor-modal-legend-wrapper">
                            <ul className="fr-editor-legend d-flex">
                                <li>
                                    <figure><SpintaxIcon /></figure>
                                    <div className="edit-text-type">
                                        Spintax
                                        <span className="fr-tooltip-side-overflow icon-inline">
                                            <QueryIconGrey />
                                            <div className="legend-tooltip">
                                                <span className="legend-tooltip-icon">
                                                    <SpintaxIcon />
                                                </span>
                                                <div className="lengend-text-details">
                                                    <span className="legend-header">How to use spintax?</span>
                                                    <span className="legend-text">To use spintax, start your sentence with an open curly brace '&#123;' and then list out the alternate variations that you want to use, separated by a pipe symbol '|'.</span>
                                                    <span className="legend-footer">e.g.  <small>&#123;option1|option2|option3&#125;</small></span>
                                                </div>
                                            </div>
                                        </span>
                                    </div>
                                </li>
                                <li>
                                    <figure><MergeFieldsIcon /></figure>
                                    <div className="edit-text-type">
                                        Merge field
                                        <span className="fr-tooltip-side-overflow icon-inline">
                                            <QueryIconGrey />
                                            <div className="legend-tooltip">
                                                <span className="legend-tooltip-icon">
                                                    <MergeFieldsIcon />
                                                </span>
                                                <div className="lengend-text-details">
                                                    <span className="legend-header">How to use merge fields?</span>
                                                    <span className="legend-text">To use merge fields, type '&#123;&#123;' at the beginning of the field you want to insert from the list, followed by the corresponding field name.</span>
                                                    <span className="legend-footer">e.g.  <small>&#123;&#123;option&#125;&#125;</small></span>
                                                </div>
                                            </div>
                                        </span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* MODAL HEADER & BODY SEPARATOR (HR) */}
                    <hr className="editor-modal-hr" />

                    {/* MODAL BODY */}
                    <div className="modal-content editor-modal-content">
                        <p className={"editor-msg-title"}>Message*</p>
                            <TextEditor
                                useForModal
                                needSegment={false}
                                cancleFun={() => setOpen(false)}
                                editorStateValue={editorStateValue}
                                setEditorStateValue={setEditorStateValue}
                                saveMessage={setMessage}
                                setModalOpen={setOpen}
                                setSendMessage={setSendMessage}
                            />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditorModal;