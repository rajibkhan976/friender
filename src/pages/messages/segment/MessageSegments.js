import { useEffect, useState } from "react";
import NoDataFound from "../../../components/common/NoDataFound";
import MsgLeftMenuNav from "../../../components/common/MsgLeftMenuNav";
import { addNewSegment, deleteSegment, fetchSegments, addNewSegmentMessageItem, deleteSegmentItemMessage } from '../../../actions/MessageAction';
import {
    CopyIcon, DeleteIcon,
    EditIcon,
    MergeFieldsIcon,
    MessageSegmentIcon,
    QueryIconGrey, SegmentIcon,
    SpintaxIcon,
    SubMessagesIcon
} from "../../../assets/icons/Icons"
import ListHeader from "../../../components/common/ListHeader";
import EmptyMessage from "../../../components/messages/EmptyMessage";
import TextEditor from "../../../components/common/TextEditor/TextEditor";
import { useDispatch, useSelector } from 'react-redux';
import Alertbox from "../../../components/common/Toast";
import Modal from "../../../components/common/Modal";
import DeleteImgIcon from "../../../assets/images/deleteModal.png";
import { useLocation } from "react-router-dom";
import { utils } from "../../../helpers/utils";

const MessageSegments = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const [segmentsArray, setSegmentsArray] = useState(null);
    const [activeSegmentsItem, setActiveSegmentsItem] = useState();
    const [activeMessage, setActiveMessage] = useState(null);
    const [activeMsgTypeObj, setActiveMsgTypeObj] = useState({});
    const [isEditing, setIsEditing] = useState({ readyToEdit: false, addNewSub: false });
    const [isEditingMessage, setIsEditingMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [activeTextContent, setActiveTextContent] = useState("");
    // const [replaceSegmentId, setReplaceSegmentId] = useState(null);
    const [editorStateValue, setEditorStateValue] = useState("");
    const messagesList = useSelector((state) => state.message.segmentsArray);


    // The Segments Data is from redux store came in messagesList and on component level is segmentsArray
    useEffect(() => {
        setLoading(true)
        if (messagesList.length > 0) {
            setLoading(false)
            setIsEditing({ addNewSub: false, readyToEdit: false });
        }
        // fetchSegmentsData();
    }, [messagesList]);

    useEffect(() => {
        console.log("helooooooo accctiva mesggggg >>>>>>> ", activeMessage);
        setEditorStateValue(activeMessage?.message?.__raw)
    }, [activeMessage]);


    // useEffect(() => {
    //  //setTimeout(()=>{
    //     // data for editor should  be ready be fore editor load
    //     //setEditorStateValue(dt);
    // //  },1000)
    // console.log("showinf the state",editorStateValue);
    //   }, [showEditor]);
    useEffect(() => {
        setLoading(true);
        try {
            console.log("Messages List -- ", messagesList);
            setSegmentsArray(messagesList);
            setActiveSegmentsItem(messagesList[0]);

            if (messagesList[0]?.segment_messages) {
                setActiveMessage(messagesList[0]?.segment_messages[0]);
            }
        } catch (error) {
            console.log('error on fetching segments === ', error);
        } finally {
            setLoading(false);
        }
    }, [messagesList]);

    useEffect(() => {
        if (activeSegmentsItem?._id !== activeMessage?.segment_id) {
            if (activeSegmentsItem?.segment_messages?.length) {
                setActiveMessage(activeSegmentsItem?.segment_messages[0]);
            }
        } else {
            console.log('updated');
        }
    }, [activeSegmentsItem]);

    // useEffect(() => {
    //     if(deleteId !== null && segmentsArray.filter(el => el._id !== deleteId?._id)?.length !== 0) {
    //         setReplaceSegmentId(segmentsArray.filter(el => el._id !== deleteId?._id)[0]?._id)
    //     }
    // }, [deleteId])

    useEffect(() => {
        if (!editorStateValue || JSON.parse(editorStateValue)?.root?.children[0]?.children[0]?.text?.trim() === "") return;

        const handleBeforeUnload = (event) => {
            // Perform actions before the component unloads
            event.preventDefault();
            event.returnValue = '';
        };
        if(
            location.pathname.split('/')[location.pathname.split('/').length - 1] === "segments"
        ) {
            window.addEventListener('beforeunload', handleBeforeUnload);

            return () => {
                window.removeEventListener('beforeunload', handleBeforeUnload);
            };
        }

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [editorStateValue]);

    /**
     * Fetching the segments all data from API
     */
    // const fetchSegmentsData = () => {
    //     setLoading(true)
    //     dispatch(fetchSegments())
    //         .unwrap()
    //         .then((res) => {
    //             if(res) {
    //                 setLoading(false)
    //                 setIsEditing({addNewSub:false,readyToEdit:false});
    //             }
    //         })
    // };

    /**
     * Add new segment item with name
     * @param event
     */
    const SegmentAdd = async (e) => {
        setLoading(true);
        setIsEditing({ addNewSub: false, readyToEdit: false });
        setActiveMessage(null);

        try {
            await dispatch(addNewSegment({ segmentName: e }))
                .unwrap()
                .then((res) => {
                    if (res?.data?.length === 0) {
                        Alertbox(
                            `${'Existing segment name can\'t be saved again'}`,
                            "error",
                            1000,
                            "bottom-right"
                        );
                    } else {

                        const resObj={...res.data,segment_messages:res?.data?.segment_messages?.length>0?res.data.segment_messages:[]}


                        setSegmentsArray([
                            resObj,
                            ...segmentsArray
                        ])

                        Alertbox(
                            `${res?.message || 'Segment created Successfully'}`,
                            "success",
                            1000,
                            "bottom-right"
                        );

                        setActiveSegmentsItem(res?.data)

                        if (res?.data?.segment_messages?.length) {
                            setActiveMessage(res?.data?.segment_messages[0])
                        }
                        setIsEditing({addNewSub:false,readyToEdit:true});
                    }
                    setLoading(false);
                })
                .catch((err) => {
                    setLoading(false);
                    Alertbox(err?.message, "error", 1000, "bottom-right")
                });

        } catch (error) {
            setLoading(false);
            Alertbox(error, "error", 1000, "bottom-right");
        }
    }

    /**
     * Edit Segments name and update with API
     * @param updatedSegment
     * @returns {Promise<void>}
     * @constructor
     */
    const SegmentNameEdit = async (updatedSegment) => {
        setLoading(true);

        let segmentsArrayPlaceholder = [...segmentsArray];
        segmentsArrayPlaceholder = segmentsArrayPlaceholder?.map(element => element._id !== updatedSegment?._id ? element : updatedSegment);
        setSegmentsArray(segmentsArrayPlaceholder);

        const currActiveSegmentObj = segmentsArrayPlaceholder?.filter(el => el._id === updatedSegment?._id)[0];
        setActiveSegmentsItem(currActiveSegmentObj);
        setActiveMessage(currActiveSegmentObj?.segment_messages.length > 0 ? currActiveSegmentObj?.segment_messages[0] : null);

        try {
            await dispatch(addNewSegment({
                segmentId: updatedSegment._id,
                segmentName: updatedSegment.segment_name
            })).unwrap()
                .then((res) => {
                    if (res){
                        setIsEditingMessage(null);
                        setIsEditing({addNewSub:false,readyToEdit:false})
                        setLoading(false);
                        Alertbox(`${res?.message || 'Group name updated successfully'}`, "success", 1000, "bottom-right");
                    }
                });

        } catch (err) {
            setIsEditingMessage(null);
            setIsEditing({addNewSub:false,readyToEdit:false})
            setLoading(false);
            Alertbox(err, "error", 1000, "bottom-right");
        }
    };

    /**
     * Delete Segment and delete with API
     * @returns {Promise<void>}
     */
    const deleteSegmentItem = async () => {
        setLoading(true);

        let segmentArrayPlaceholder = [...segmentsArray];
        segmentArrayPlaceholder = segmentArrayPlaceholder?.filter(element => element._id !== deleteId?._id);
        setSegmentsArray(segmentArrayPlaceholder);

        if (segmentArrayPlaceholder?.length) {
            setActiveSegmentsItem(segmentArrayPlaceholder[0]);

            if (segmentArrayPlaceholder?.segment_messages?.length) {
                setActiveMessage(segmentArrayPlaceholder?.segment_messages[0]);
            } else {
                setActiveMessage(null);
            }
        } else {
            setActiveSegmentsItem(null);
            setActiveMessage(null);
        }

        try {
            const segmentDelete = await dispatch(deleteSegment({ segmentId: deleteId?._id })).unwrap();
            if (segmentDelete) {
                Alertbox(`Segment deleted successfully`, 'success', 1000, 'bottom-right');
                setDeleteId(null)
                setLoading(false)
            }
        } catch (err) {
            Alertbox(err, "error", 1000, 'bottom-right');
        }
    };


    /**
     * To Save segment message item and for update parent list
     * @param data
     * @returns {Promise<void>}
     */
    const saveMessage = async (data) => {
        setLoading(true);

        try {
            // AddNewSegmentMessageItem..
            await dispatch(addNewSegmentMessageItem({ segmentId: activeSegmentsItem?._id, message: data }))
                .then(res => {
                    if (res) {
                        let segmentsArrayPlaceholder = [...segmentsArray];
                        let matchingSegmentObject = segmentsArrayPlaceholder?.filter(element => element._id === res?.payload?.data?.segment_id)[0];
                        segmentsArrayPlaceholder = segmentsArrayPlaceholder.map(element => element._id !== res?.payload?.data?.segment_id ? element : {
                            ...matchingSegmentObject,
                            segment_messages: [
                                ...matchingSegmentObject.segment_messages,
                                res?.payload?.data
                            ]
                        });

                        setSegmentsArray(segmentsArrayPlaceholder);
                        setActiveSegmentsItem(segmentsArrayPlaceholder?.filter(element => element._id === res?.payload?.data?.segment_id)[0]);
                        setActiveMessage(segmentsArrayPlaceholder?.filter(element => element._id === res?.payload?.data?.segment_id)[0]?.segment_messages?.filter(element => element._id === res?.payload?.data?._id)[0]);
                        Alertbox(`Message created successfully`, 'success', 1000, 'bottom-right');
                    }

                    setIsEditingMessage(null);
                    // setActiveMessage(null);
                    // setActiveTextContent("");
                    setIsEditing({addNewSub:false,readyToEdit:false});
                    setLoading(false);
                })
                .catch(e => {
                    setLoading(false);
                    Alertbox(e, 'error', 1000, 'bottom-right');
                });

        } catch(err) {
            setLoading(false);
            Alertbox(err, "error", 1000, "bottom-right");
        }
    };


    /**
     * To Edit Segment Message and update our parents array
     * @param data
     * @returns {Promise<void>}
     */
    const editMessage = async (data) => {
            setLoading(true);

            let segmentsArrayPlaceholder = [...segmentsArray];
            segmentsArrayPlaceholder = segmentsArrayPlaceholder?.map(element => element._id !== isEditingMessage?.segmentId ? element : {
                ...element,
                segment_messages: element?.segment_messages.map(element2 => element2?._id !== isEditingMessage.messageId ? element2 : {
                    ...element2,
                    message: data
                })
            });

            setSegmentsArray(segmentsArrayPlaceholder);
            setActiveSegmentsItem(segmentsArrayPlaceholder?.filter(element => element._id === isEditingMessage?.segmentId)[0]);
            setActiveMessage(segmentsArrayPlaceholder?.filter(element => element._id === isEditingMessage?.segmentId)[0]
                ?.segment_messages?.filter(element => element._id === isEditingMessage?.messageId)[0]);

            try {
                await dispatch(addNewSegmentMessageItem({
                    ...isEditingMessage,
                    message: data
                }))
                    .then(res => {
                        if (res) {
                            setIsEditingMessage(null);
                            setActiveMessage(res?.payload?.data);
                            setActiveTextContent("");
                            setIsEditing({addNewSub:false,readyToEdit:false});
                            setIsEditing(false);
                            setLoading(false);
                            Alertbox(`Message edited successfully`, "success", 1000, "bottom-right");
                        }
                    });

            } catch (err) {
                setIsEditingMessage(null);
                setIsEditing({addNewSub:false,readyToEdit:false})
                setLoading(false);
                Alertbox(err, 'error', 1000, 'bottom-right');
            }
    };


    /**
     * Modifying after showing at Preview of text after save or update from editor
     * @param inputString
     * @returns {*}
     */
    const modifyPatterns = (inputString) => {
        let modifiedString = inputString;

        modifiedString =
            modifiedString
                ?.replace(/{{(.*?)}}/g, '<span class="message-string-merge-field">{{$1}}</span>')
                ?.replace(/{(?!<span class="two">)(.*?)}/g, '<span class="message-string-spintax">{$1}</span>');

        modifiedString =
            modifiedString
                ?.replaceAll('<span class="message-string-merge-field"><span class="message-string-spintax">', '<span class="message-string-merge-field">')
                ?.replaceAll('}</span>}</span>', '}}</span>');

        return modifiedString;
    }


    /**
     * Function to set group message edit item
     */
    const editThisMessageItem = () => {
        setIsEditing({addNewSub:false,readyToEdit:true});
        setIsEditingMessage({
            segmentId: activeMessage.segment_id,
            messageId: activeMessage._id
        });
    }

    /**
     * Function to duplicate group message
     */
    const duplicateThisMessageItem = async () => {
        setLoading(true);
        const copiedMessage=utils.addCopyStamp(activeMessage?.message);

        try {
            await dispatch(addNewSegmentMessageItem({
                segmentId:activeMessage?.segment_id,
                message: copiedMessage?copiedMessage:activeMessage?.message
            }))
                .then((res) => {
                    if (res) {
                        let segmentsArrayPlaceholder = [...segmentsArray]

                        let matchingGroupObject = segmentsArrayPlaceholder?.filter(element => element._id === res?.payload?.data?.segment_id)[0];
                        segmentsArrayPlaceholder = segmentsArrayPlaceholder
                            .map(element => element._id !== res?.payload?.data?.segment_id ? element : {
                                ...matchingGroupObject,
                                segment_messages: [...matchingGroupObject.segment_messages, res?.payload?.data]
                            })

                        setSegmentsArray(segmentsArrayPlaceholder);
                        setActiveSegmentsItem(segmentsArrayPlaceholder?.filter(element => element._id === res?.payload?.data?.segment_id)[0]);
                        setActiveMessage(segmentsArrayPlaceholder?.filter(element => element._id === res?.payload?.data?.segment_id)[0]?.segment_messages?.filter(element => element._id === res?.payload?.data?._id)[0]);
                        Alertbox(`Message duplicated successfully`, "success", 1000, "bottom-right");
                    }
                    setIsEditing({addNewSub:false,readyToEdit:false});
                    setLoading(false);
                })
                .catch((error) => {
                    setLoading(false)
                    Alertbox(error,"error", 1000, "bottom-right");
                });

        } catch (error) {
            setLoading(false)
            Alertbox(
                error,"error", 1000, "bottom-right"
            );
        }
    }


    /**
     * Function to delete group message
     */
    const deleteThisMessageItem = async () => {
        let segmentsArrayPlaceholder = [...segmentsArray];
        segmentsArrayPlaceholder = segmentsArrayPlaceholder?.map(el => el?._id !== activeMessage?.segment_id ? el : {
            ...el,
            segment_messages: el?.segment_messages?.filter(em => em?._id !== activeMessage?._id)
        });

        setActiveSegmentsItem(segmentsArrayPlaceholder?.filter(el => el._id === activeMessage?.segment_id)[0]);
        setActiveMessage(
            segmentsArrayPlaceholder?.filter(el => el._id === activeMessage?.segment_id)[0]?.segment_messages?.length ?
                segmentsArrayPlaceholder?.filter(el => el._id === activeMessage?.segment_id)[0]?.segment_messages[0] : null
        )

        setSegmentsArray(segmentsArrayPlaceholder)

        try {
            await dispatch(deleteSegmentItemMessage(activeMessage?._id))
                .unwrap()
                .then((res) => {
                    Alertbox("Message deleted successfully.","success",1000,"bottom-right");
                    setIsEditing({addNewSub:false,readyToEdit:false})
                })
                .catch((error) => {
                    setLoading(false)
                    setIsEditing({addNewSub:false,readyToEdit:false})
                });
        } catch (error) {
            Alertbox(error,"error",1000,"bottom-right");
            setIsEditing({addNewSub:false,readyToEdit:false})
        }
    }

    const cancleFun = () => {
        setIsEditing({addNewSub:false,readyToEdit:false})
    }

    const subNavAddFun = (showEditorState) => {
        //when we are adding sub message then only we have to make "addNewSub":true
        setIsEditing({readyToEdit:showEditorState, addNewSub:true});
    };


    return (
        <>
            {deleteId && deleteId?.is_used !== 0 &&
                <Modal
                    modalType="DELETE"
                    modalIcon={DeleteImgIcon}
                    headerText={"Delete Alert"}
                    bodyText={
                        <>
                            The current segment is already in use by certain group(s). To delete this segment, you must first remove it from the group(s) where it is being used.
                        </>
                    }
                    closeBtnTxt={"Close"}
                    closeBtnFun={()=>setDeleteId(null)}
                    open={deleteId !== null && deleteId?.is_used !== 0}
                    setOpen={()=>setDeleteId(null)}
                    additionalClass="delete-group"
                />
            }
            {deleteId && deleteId?.is_used === 0 &&
                <Modal
                    modalType="DELETE"
                    modalIcon={DeleteImgIcon}
                    headerText={"Delete Alert"}
                    bodyText={
                        <>
                            By deleting the segment, all the messages inside the segment will be permanently deleted. Are you sure you want to delete this segment?
                        </>
                    }
                    closeBtnTxt={"Close"}
                    closeBtnFun={()=>setDeleteId(null)}
                    open={deleteId !== null && deleteId?.is_used === 0}
                    setOpen={()=>setDeleteId(null)}
                    ModalFun={deleteSegmentItem}
                    btnText={"Yes. Delete"}
                    modalWithChild={true}
                />
            }

            {/* Left Section */}
            <div className="message-menu message-menu-left message-menu-segments">
                <MsgLeftMenuNav
                    MsgNavtype="segment"
                    MessageObj={segmentsArray}
                    setMessageObj={setSegmentsArray}
                    HeaderText={"Segment(s)"}
                    AddFun={SegmentAdd}
                    activeObj={activeSegmentsItem}
                    setActiveObj={setActiveSegmentsItem}
                    HeaderIcon={MessageSegmentIcon}
                    isLoading={loading}
                    setIsLoading={setLoading}
                    multiPurposeFunction={SegmentNameEdit}
                    deletePayload={setDeleteId}
                    textContentInEditor={activeTextContent}
                />
            </div>

            {/* Middle Section */}
            <div className="message-content d-flex h-100">
                <div className="messages-sub-menu d-flex d-flex-column">
                    <MsgLeftMenuNav
                        MsgNavtype="sub-segment"
                        MessageObj={activeSegmentsItem?.segment_messages}
                        setMessageObj={setActiveSegmentsItem}
                        HeaderText={"Message(s)"}
                        AddFun={subNavAddFun}
                        activeObj={activeMessage}
                        setActiveObj={setActiveMessage}
                        HeaderIcon={SubMessagesIcon}
                        additionalClass="message-sub-content"
                        isLoading={loading || segmentsArray?.length <= 0}
                        setIsLoading={setLoading}
                        textContentInEditor={activeTextContent}
                        saveMessage={isEditingMessage !== null ? editMessage : saveMessage}
                    />
                </div>
                <div
                    className={
                        `
                            messages-editor 
                            d-flex 
                            d-flex-column 
                            ${segmentsArray?.length <= 0 ? 'no-messages-found' : isEditing.readyToEdit ? 'message-edit' : 'active-not-editing'}
                        `
                    }
                >
                    <div className="message-editor-header d-flex f-align-center f-justify-between">
                        {
                            activeSegmentsItem?.segment_messages?.length > 0 ?
                                // Not Editing
                                isEditing.readyToEdit ?
                                    // Edit, Duplicate, Delete :
                                    <>
                                        <h4>Create message</h4>
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
                                    </>
                                    :
                                    <>
                                        <h3 className='message-header-text d-flex f-align-center'>
                                            <figure><SubMessagesIcon /></figure>
                                        </h3>
                                        <div className="message-element-header d-flex f-align-center">
                                            <button className="btn-inline num-well btn-edit-inline" disabled={loading} onClick={editThisMessageItem}>
                                                <span className="icon-inline"><EditIcon /></span>
                                                Edit
                                            </button>
                                            <button className="btn-inline num-well btn-duplicate-inline" disabled={loading} onClick={duplicateThisMessageItem}>
                                                <span className="icon-inline"><CopyIcon /></span>
                                                Duplicate
                                            </button>
                                            <button className="btn-inline num-well btn-delete-inline" disabled={loading} onClick={deleteThisMessageItem}>
                                                <span className="icon-inline"><DeleteIcon /></span>
                                                Delete
                                            </button>
                                        </div>
                                    </>
                                :
                                <>
                                    <h4>Create message</h4>
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
                                </>
                        }

                    </div>
                    {
                        isEditing.readyToEdit ?
                            <>
                                <TextEditor
                                    editorStateValue={editorStateValue}
                                    setEditorStateValue={setEditorStateValue}
                                    isEditing={isEditing}
                                    cancleFun={cancleFun}
                                    saveMessage={isEditingMessage !== null ? editMessage : saveMessage}
                                    needSegment={false}
                                />
                            </> :
                            activeSegmentsItem?.segment_messages?.length > 0 ?
                                <>
                                    <div
                                        className="fr-message-view"
                                        dangerouslySetInnerHTML={{
                                            __html: modifyPatterns(
                                                activeMessage &&
                                                activeMessage?.message ?
                                                    activeMessage?.message?.html:
                                                    ''
                                            )
                                        }}
                                    >
                                    </div>
                                </> :
                                <>
                                    <TextEditor
                                        editorStateValue={editorStateValue}
                                        setEditorStateValue={setEditorStateValue}
                                        isEditing={{...isEditing,addNewSub:true}}
                                        cancleFun={cancleFun}
                                        saveMessage={saveMessage}
                                        needSegment={false}
                                    />
                                </>
                    }
                </div>
            </div>
        </>
    );
};

export default MessageSegments;
