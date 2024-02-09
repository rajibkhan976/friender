import { useEffect, useState } from "react";
import MsgLeftMenuNav from "../../../components/common/MsgLeftMenuNav";
import { CopyIcon, DeleteIcon, EditIcon, MergeFieldsIcon, MessageGroupIcon, QueryIconGrey, SegmentIcon, SpintaxIcon, SubMessagesIcon } from "../../../assets/icons/Icons";
// import TextEditor from "../../../components/messages/TextEditor";
import { addNewGroup, addNewGroupMessageItem, deleteGroup, deleteGroupItemMessage, fetchGroups } from "../../../actions/MessageAction";
import { useDispatch, useSelector } from "react-redux";
import Alertbox from "../../../components/common/Toast";
import Modal from "../../../components/common/Modal";

import DeleteImgIcon from "../../../assets/images/deleteModal.png";
import { useLocation } from "react-router-dom";
import TextEditor from "../../../components/common/TextEditor/TextEditor";
import { utils } from "../../../helpers/utils";

const MessageGroups = () => {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false);
    const [groupsArray, setGroupsArray] = useState(null)
    const [activeGroupsItem, setActiveGroupsItem] = useState(null)
    const [activeMessage, setActiveMessage] = useState(null);
    //to recognise what type edit need: {readyToEdit:showEditorstate,addNewSub:false}
    const [isEditing, setIsEditing] = useState({ readyToEdit: false, addNewSub: false });
    const [isEditingMessage, setIsEditingMessage] = useState(null)
    const [deleteId, setDeleteId] = useState(null);
    const [replaceGroupId, setReplaceGroupId] = useState(null)
    const [activeTextContent, setActiveTextContent] = useState("")
    const [editorStateValue, setEditorStateValue] = useState("");
    const [pageRef, setPageRef] = useState(1);
    const messagesList = useSelector((state) =>
        state.message.groupArray
    );
    const [isPages, setIsPages] = useState(true);
    const [listLoading, setListLoading] = useState(false);

    /**
     * Fetching Groups with Pagination
     */
    const fetchGroupsData = () => {
        if (isPages) {
            dispatch(fetchGroups(pageRef))
                .unwrap()
                .then((res) => {
                    if (res) {
                       // if (res !== "Request failed with status code 500") {
                            //console.log("final arrayyyyy",res.data);
                           // setGroupsArray(groupsArray?.length ? [...groupsArray, ...res?.data] : res?.data);
                           // console.log("groups array::::::",groupsArray)
                       // }
                       
                        setIsEditing({ addNewSub: false, readyToEdit: false });
                        setListLoading(false);
                        setIsPages(true);
                    }
                }).catch((error) => {
                  //  console.log('error <<<<groupsy', error);
                    setListLoading(false);
                    if (error.message === "Rejected"|| error.message==="Request failed with status code 500") {
                        setIsPages(false);
                    }
                });
        }
        setPageRef((prevPage) => prevPage + 1);
    }

    // console.log("Group Data -- ", messagesListWithPaginate);
    // console.log("Redux Message List -- ", messagesList);

    useEffect(() => {
        fetchGroupsData();
    }, []);

    useEffect(() => {
        setLoading(true)
        try {
            setGroupsArray(messagesList)
            setActiveGroupsItem(messagesList[0])
            // console.log('messagesList?.data', messagesList?.data?.group_messages);
            if (messagesList[0]?.group_messages) {
                setActiveMessage(messagesList[0]?.group_messages[0])
            }
        } catch (error) {
            console.log('error fetching groups:::', error);
        } finally {
            setLoading(false)
        }
    }, [messagesList])

    useEffect(() => {
        // console.log('active group   ',activeGroupsItem);
        if (activeGroupsItem?._id !== activeMessage?.group_id) {
            // console.log('not same');
            if (activeGroupsItem?.group_messages?.length) {
                // console.log('groupsArray[0]?.group_messages[0]', groupsArray[0]?.group_messages[0]);
                setActiveMessage(activeGroupsItem?.group_messages[0])
                setEditorStateValue(activeGroupsItem?.group_messages[0]?.__raw)
            } else {
                setActiveMessage(null)
                setEditorStateValue("")
            }
        } else {
            // console.log('same');
        }

        // if(activeGroupsItem?.group_messages?.length===0){
        //     setIsEditing({readyToEdit:true,addNewSub:true})
        // }
    }, [activeGroupsItem])



    /**
     * Check if replacement is available for delete item,
     * if yes, set initial replace item
     */
    useEffect(() => {
        if (deleteId !== null && groupsArray.filter(el => el._id !== deleteId?._id)?.length !== 0) {
            setReplaceGroupId(groupsArray.filter(el => el._id !== deleteId?._id)[0]?._id)
        }
    }, [deleteId])

    /**
     * on group page force shut down, trigger a browser alert if isEditing or isLoading
     */
    useEffect(() => {
        if (
            !editorStateValue ||
            JSON.parse(editorStateValue)?.root?.children[0]?.children[0]?.text?.trim() === "" ||
            (!isEditing.addNewSub && !isEditing.readyToEdit)
        ) {
            return
        } else {
            const handleBeforeUnload = (event) => {
                // Perform actions before the component unloads
                event.preventDefault();
                return (event.returnValue = '');
            };

            window.addEventListener('beforeunload', handleBeforeUnload);

            return () => {
                window.removeEventListener('beforeunload', handleBeforeUnload);
            };
        }
    }, [editorStateValue]);


    useEffect(() => {
        //console.log("helooooooo accctiva mesggggg>>>>>>>",activeMessage);
        setEditorStateValue(activeMessage?.message?.__raw)

    }, [activeMessage])

    /**
     * Add new group item with name
     */
    const GroupAdd = async (e) => {
        setLoading(true);
        setIsEditing({ addNewSub: false, readyToEdit: false })
        setActiveMessage(null)

        try {
            await dispatch(addNewGroup({ groupName: e }))
                .unwrap()
                .then((res) => {
                    if (res?.data?.length === 0) {
                        Alertbox(
                            'Existing group name can’t be saved again.',
                            "error",
                            1000,
                            "bottom-right"
                        );
                    } else {
                        const resObj = { ...res.data, group_messages: res?.data?.group_messages?.length > 0 ? res.data.group_messages : [] }
                        setGroupsArray([
                            resObj,
                            ...groupsArray
                        ])

                        Alertbox(
                            `Group created Successfully`,
                            "success",
                            1000,
                            "bottom-right"
                        );

                        setActiveGroupsItem(res?.data)
                        // if(res?.data?.group_messages?.length) {
                        //     setActiveMessage(res?.data?.group_messages[0])
                        // }
                        setIsEditingMessage(null)
                        setIsEditing({ addNewSub: false, readyToEdit: true })
                        setActiveTextContent("")
                        setEditorStateValue("")
                    }
                    setLoading(false);
                })
                .catch((err) => {
                    setLoading(false);

                    Alertbox(
                        err?.message,
                        "error",
                        1000,
                        "bottom-right"
                    );
                });
        } catch (error) {
            setLoading(false);

            Alertbox(
                error,
                "error",
                1000,
                "bottom-right"
            );
        }
    }

    /**
     * Edit group name in local array and push api
     */
    const GroupNameEdit = async (updatedGroup) => {
        setLoading(true);
        // console.log('updatedGroup', updatedGroup);

        try {
            await dispatch(addNewGroup({
                groupId: updatedGroup._id,
                groupName: updatedGroup.group_name
            })).unwrap()
                .then((res) => {
                    if (res) {
                        let placeholderGroupsArray = [...groupsArray];
                        placeholderGroupsArray = placeholderGroupsArray?.map(el => el._id !== updatedGroup?._id ? el : updatedGroup)

                        setGroupsArray(placeholderGroupsArray);
                        const currActiveGroupObj = placeholderGroupsArray?.filter(el => el._id === updatedGroup?._id)[0];
                        setActiveGroupsItem(currActiveGroupObj);
                        setActiveMessage(
                            currActiveGroupObj?.group_messages.length > 0 ? currActiveGroupObj?.group_messages[0] : null
                        )

                        Alertbox(
                            `Group name updated successfully`,
                            "success",
                            1000,
                            "bottom-right"
                        );
                        setIsEditingMessage(null)
                        setIsEditing({ addNewSub: false, readyToEdit: false })
                        setLoading(false);
                    }
                })
        } catch (error) {
            console.log(error, ':::while renaming edit');
            setIsEditingMessage(null)
            setIsEditing({ addNewSub: false, readyToEdit: false })
            setLoading(false);
            Alertbox(
                error,
                "error",
                1000,
                "bottom-right"
            );
        }
    }

    const deleteGroupItem = async (withReplaceId = true) => {
        setLoading(true);
        let groupArrayPlaceholder = [...groupsArray];
        groupArrayPlaceholder = groupArrayPlaceholder?.filter(el => el._id !== deleteId?._id);

        setGroupsArray(groupArrayPlaceholder)

        if (groupArrayPlaceholder?.length) {
            setActiveGroupsItem(groupArrayPlaceholder[0])

            if (groupArrayPlaceholder?.group_messages?.length) {
                setActiveMessage(groupArrayPlaceholder?.group_messages[0])
            } else {
                setActiveMessage(null)
            }
        } else {
            setActiveGroupsItem(null)
            setActiveMessage(null)
        }

        try {
            let deletePayload = {
                groupId: deleteId?._id
            }

            if (replaceGroupId && withReplaceId) {
                deletePayload.replaceGroupId = replaceGroupId;
            }

            // let deletePayload = {
            //     groupId: deleteId?._id
            // }
            //
            // if (replaceGroupId && withReplaceId) {
            //     deletePayload.replaceGroupId = deleteId?._id;
            //     deletePayload.groupId = replaceGroupId;
            // }

            const groupDelete = await dispatch(deleteGroup(deletePayload)).unwrap();
            if (groupDelete) {
                if (replaceGroupId && withReplaceId) {
                    setGroupsArray(prevArray => prevArray.map(el => el._id === replaceGroupId ? {
                        ...el,
                        is_used: 1
                    } : el))
                }

                Alertbox(
                    `Group deleted successfully`,
                    "success",
                    1000,
                    "bottom-right"
                );
                setDeleteId(null)
                setLoading(false)
            }
        } catch (error) {
            console.log(error);
            Alertbox(
                error,
                "error",
                1000,
                "bottom-right"
            );
        }
    }




    /**
     * Function to modifiy the message patterns for segment, dmf and spintax to UI
     */

    function sliceAndInsertTags(inputString, start, end) {
        // Check if the start or end position includes specified tags
        const regex = /<span class="(message-string-merge-field|message-string-spintax|message-string-segment)"><\/span>/g;
        if (regex.test(inputString.substring(start, end))) {
            return inputString; // Ignore if tags are present in the slice
        }

        // Insert <strong> tags at the start and end of the slice
        const slicedString = inputString.slice(0, start) + '<strong>' + inputString.slice(start, end) + '</strong>' + inputString.slice(end);
        return slicedString;
    }

    function modifyPatterns(inputString) {
        let modifiedString = inputString;

        // console.log('modifiedString>>>>>>>>', modifiedString);

        // Process the first pattern
        modifiedString =
            modifiedString
                ?.replace(/{{(.*?)}}/g, '<span class="message-string-merge-field">{{$1}}</span>')
                ?.replace(/{(?!<span class="two">)(.*?)}/g, '<span class="message-string-spintax">{$1}</span>')
                ?.replace(/\[(?!<span class="three">)(.*?)\]/g, '<span class="message-string-segment">[$1]</span>');

        modifiedString =
            modifiedString
                ?.replaceAll('<span class="message-string-merge-field"><span class="message-string-spintax">', '<span class="message-string-merge-field">')
                ?.replaceAll('}</span>}</span>', '}}</span>');


        // Process the text styles
        // JSON.parse(activeMessage?.message)?.blocks[0]?.inlineStyleRanges?.map(el => {
        //     console.log('el:::::::::', el);
        //     if (el.style === "BOLD") {
        //         console.log(sliceAndInsertTags(modifiedString, el.offset, el.length))
        //     }
        // })

        return modifiedString;
    }

    /**
     * Function to save group message item and update the parent array
     */

    const saveMessage = async (data) => {
        setLoading(true);
        setIsEditing({ addNewSub: false, readyToEdit: false })
        // console.log('data', data);

        if (data?.text?.trim() === '') {
            setLoading(false)
            return false;
        }

        try {
            await dispatch(addNewGroupMessageItem({
                groupId: activeGroupsItem?._id,
                message: data
            }))
                .then((res) => {
                    setActiveTextContent("");
                    cancleFun()

                    if (res) {
                        // console.log("saved message resss", res);
                        let placeholderGroupsArray = [...groupsArray]
                        let matchingGroupObject = placeholderGroupsArray?.filter(el => el._id === res?.payload?.data?.group_id)[0];

                        placeholderGroupsArray = placeholderGroupsArray
                            .map(el => el._id !== res?.payload?.data?.group_id ? el : {
                                ...matchingGroupObject,
                                group_messages: [
                                    ...matchingGroupObject
                                        .group_messages, res?.payload?.data
                                ]
                            })

                        setGroupsArray(placeholderGroupsArray);
                        setActiveGroupsItem(placeholderGroupsArray?.filter(el => el._id === res?.payload?.data?.group_id)[0]);
                        setActiveMessage(
                            placeholderGroupsArray?.filter(el => el._id === res?.payload?.data?.group_id)[0]?.group_messages?.filter(el => el._id === res?.payload?.data?._id)[0]
                        )
                        setActiveTextContent("")
                        Alertbox(
                            `Message created successfully`,
                            "success",
                            1000,
                            "bottom-right"
                        );
                        setIsEditingMessage(null)
                        setLoading(false)
                        // setActiveMessage(null)
                        // setActiveTextContent("")
                    }
                })
                .catch((error) => {
                    console.log('error while saving group message', error);
                    setLoading(false)
                    Alertbox(
                        error,
                        "error",
                        1000,
                        "bottom-right"
                    );
                })
        } catch (error) {
            console.log('error while saving group message', error);
            setLoading(false)
            Alertbox(
                error,
                "error",
                1000,
                "bottom-right"
            );
        }
    }

    /**
     * Function to Edit group message item and update the parent array
     */

    const editMessage = async (data) => {
        setLoading(true);
        // console.log('here');

        let placeholderGroupsArray = [...groupsArray];
        placeholderGroupsArray = placeholderGroupsArray?.map(el => el._id !== isEditingMessage?.groupId ? el : {
            ...el,
            group_messages: el?.group_messages.map(em => em?._id !== isEditingMessage.messageId ? em : {
                ...em,
                message: data
            })
        }
        )

        setGroupsArray(placeholderGroupsArray);
        setActiveGroupsItem(placeholderGroupsArray?.filter(el => el._id === isEditingMessage?.groupId)[0])
        // console.log('NOW THIS', placeholderGroupsArray?.filter(el => el._id === isEditingMessage?.groupId)[0]);
        setActiveMessage(
            placeholderGroupsArray
                ?.filter(el => el._id === isEditingMessage?.groupId)[0]
                ?.group_messages?.filter(el => el._id === isEditingMessage?.messageId)[0]
        )

        try {
            await dispatch(addNewGroupMessageItem({
                ...isEditingMessage,
                message: data,
                oldMessage: activeMessage?.message
            }))
                .then((res) => {
                    // console.log('res', res?.payload?.data);
                    if (res) {
                        setIsEditingMessage(null)
                        // setActiveMessage(null)
                        setActiveTextContent("")
                        setIsEditing({ addNewSub: false, readyToEdit: false })
                        Alertbox(
                            `Message edited successfully`,
                            "success",
                            1000,
                            "bottom-right"
                        );
                        setLoading(false);
                    }
                })
        } catch (error) {
            console.log(error, ':::while saving edit');
            setIsEditingMessage(null)
            setIsEditing({ addNewSub: false, readyToEdit: false })
            setLoading(false);
            Alertbox(
                error,
                "error",
                1000,
                "bottom-right"
            );
        }
    }

    /**
     * Function to set group message edit item
     */

    const editThisMessageItem = () => {
        if (activeMessage?.group_id) {
            setIsEditingMessage({
                groupId: activeMessage?.group_id,
                messageId: activeMessage?._id,
            });
            setIsEditing({ addNewSub: false, readyToEdit: true });
            setEditorStateValue(activeMessage?.message?.__raw)
        } else {
            Alertbox(`Select some Message to edit`, "error", 3000, "bottom-right");
        }
    };

    /**
     * Function to duplicate group message
     */
    const duplicateThisMessageItem = async () => {
        setLoading(true);
        const copiedMessage = utils.addCopyStamp(activeMessage?.message);
        //console.log("current message_____>>",copiedMessage);

        try {
            await dispatch(addNewGroupMessageItem({
                groupId: activeMessage?.group_id,
                message: copiedMessage ? copiedMessage : activeMessage?.message
            }))
                .then((res) => {
                    if (res) {
                        let placeholderGroupsArray = [...groupsArray]

                        // console.log('OLD >>>> placeholderGroupsArray', placeholderGroupsArray);

                        let matchingGroupObject = placeholderGroupsArray?.filter(el => el._id === res?.payload?.data?.group_id)[0];
                        placeholderGroupsArray = placeholderGroupsArray
                            .map(el => el._id !== res?.payload?.data?.group_id ? el : {
                                ...matchingGroupObject,
                                group_messages: [
                                    ...matchingGroupObject
                                        .group_messages, res?.payload?.data
                                ]
                            })
                        // console.log('NEW >>> placeholderGroupsArray', placeholderGroupsArray);

                        setGroupsArray(placeholderGroupsArray);
                        setActiveGroupsItem(placeholderGroupsArray?.filter(el => el._id === res?.payload?.data?.group_id)[0]);
                        setActiveMessage(
                            placeholderGroupsArray?.filter(el => el._id === res?.payload?.data?.group_id)[0]?.group_messages?.filter(el => el._id === res?.payload?.data?._id)[0]
                        )

                        Alertbox(
                            `Message duplicated successfully`,
                            "success",
                            1000,
                            "bottom-right"
                        );
                    }
                    setIsEditing({ addNewSub: false, readyToEdit: false })
                    setLoading(false)
                })
                .catch((error) => {
                    console.log('error while duplicating group message', error);
                    setLoading(false)
                    Alertbox(
                        error,
                        "error",
                        1000,
                        "bottom-right"
                    );
                })
        } catch (error) {
            console.log('error while duplicating group message', error);
            setLoading(false)
            Alertbox(
                error,
                "error",
                1000,
                "bottom-right"
            );
        }
    }

    /**
     * Function to delete group message
     */

    const deleteThisMessageItem = async () => {
        let placeholderGroupsArray = [...groupsArray];
        placeholderGroupsArray = placeholderGroupsArray?.map(el => el?._id !== activeMessage?.group_id ? el : {
            ...el,
            group_messages: el?.group_messages?.filter(em => em?._id !== activeMessage?._id)
        })

        // console.log('placeholderGroupsArray', placeholderGroupsArray);
        setActiveGroupsItem(placeholderGroupsArray?.filter(el => el._id === activeMessage?.group_id)[0])
        setActiveMessage(
            placeholderGroupsArray?.filter(el => el._id === activeMessage?.group_id)[0]?.group_messages[activeGroupsItem?.group_messages?.indexOf(activeMessage) - 1]
        )

        setGroupsArray(placeholderGroupsArray)

        // console.log('updated group array after message deletion::::', placeholderGroupsArray);

        try {
            dispatch(deleteGroupItemMessage(activeMessage?._id))
                .unwrap()
                .then((res) => {
                    // console.log('res', res);
                    Alertbox(
                        "Message deleted successfully.",
                        "success",
                        1000,
                        "bottom-right"
                    );
                    setIsEditing({ addNewSub: false, readyToEdit: false })
                })
                .catch((error) => {
                    console.log('error while saving group message', error);
                    setLoading(false)
                    setIsEditing({ addNewSub: false, readyToEdit: false })
                })
        } catch (error) {
            console.log('error deleting group message', error);
            Alertbox(
                error,
                "error",
                1000,
                "bottom-right"
            );
            setIsEditing({ addNewSub: false, readyToEdit: false })
        }
    }


    const cancleFun = () => {
        setIsEditing({ addNewSub: false, readyToEdit: false })
        setIsEditingMessage(null)
        setEditorStateValue("")
        setActiveTextContent("")

        if (!activeMessage || activeMessage == null) {
            if (activeGroupsItem?.group_messages?.length) {
                setActiveMessage(activeGroupsItem?.group_messages[0])
            } else {
                setActiveMessage(null)
            }
        }
    }

    const subNavAddFun = (showEditorstate) => {
        //when we are adding sub message then only we have to make "addNewSub":true
        // console.log('active message', activeMessage);
        setIsEditing({ readyToEdit: showEditorstate, addNewSub: true })
    }


    return (
        <>
            {deleteId && deleteId?.is_used !== 0 && (
                <Modal
                    modalType="DELETE"
                    modalIcon={DeleteImgIcon}
                    headerText={"Delete Alert"}
                    bodyText={
                        groupsArray.filter((el) => el._id !== deleteId?._id)?.length ===
                            0 ? (
                            <>
                                Before deleting the current message group, it is necessary to
                                create another group as a replacement. Once the new group is
                                established, you can proceed to replace the current group with
                                the newly created one.
                            </>
                        ) : (
                            <>
                                The current group is being actively used with certain
                                settings. In order to proceed you need to reassign another
                                group and then you can proceed with deletion.
                            </>
                        )
                    }
                    closeBtnTxt={"Close"}
                    closeBtnFun={() => setDeleteId(null)}
                    open={deleteId !== null && deleteId?.is_used !== 0}
                    setOpen={() => setDeleteId(null)}
                    ModalFun={
                        groupsArray.filter((el) => el._id !== deleteId?._id)?.length !==
                        0 && deleteGroupItem
                    }
                    btnText={"Replace & Delete"}
                    modalWithChild={true}
                    ExtraProps={{
                        primaryBtnDisable:
                            groupsArray.filter((el) => el._id !== deleteId?._id).length <=
                            0 || replaceGroupId === null,
                    }}
                    additionalClass="delete-group"
                >
                    {groupsArray.filter((el) => el._id !== deleteId?._id)?.length !==
                        0 && <><h6>Reassign another group</h6>  <span className="select-wrapers w-100">
                            <select
                                value={replaceGroupId || ""}
                                onChange={(e) => setReplaceGroupId(e.target.value)}
                                className="selector_box"
                            >
                                {groupsArray
                                    .filter((el) => el._id !== deleteId?._id)
                                    .map((item, index) => {
                                        return (
                                            <option value={item._id} key={"fr-select" + index}>
                                                {item?.group_name}
                                            </option>
                                        );
                                    })}
                            </select>
                            <span className="select-arrow"></span>
                        </span></>}
                </Modal>
            )}
            {deleteId && deleteId?.is_used === 0 && (
                <Modal
                    modalType="DELETE"
                    modalIcon={DeleteImgIcon}
                    headerText={"Delete Alert"}
                    bodyText={
                        <>
                            By deleting the group, all the messages inside the group will be
                            permanently deleted. Are you sure you want to delete this group?
                        </>
                    }
                    closeBtnTxt={"Close"}
                    closeBtnFun={() => setDeleteId(null)}
                    open={deleteId !== null && deleteId?.is_used === 0}
                    setOpen={() => setDeleteId(null)}
                    ModalFun={() => deleteGroupItem(false)}
                    btnText={"Yes. Delete"}
                    modalWithChild={true}
                />
            )}
            <div className="message-menu message-menu-left message-menu-groups">
                <MsgLeftMenuNav
                    MsgNavtype="group"
                    MessageObj={groupsArray}
                    setMessageObj={setGroupsArray}
                    HeaderText={"Group(s)"}
                    AddFun={GroupAdd}
                    activeObj={activeGroupsItem}
                    setActiveObj={setActiveGroupsItem}
                    HeaderIcon={MessageGroupIcon}
                    deletePayload={setDeleteId}
                    isLoading={loading}
                    setIsLoading={setLoading}
                    multiPurposeFunction={GroupNameEdit}
                    textContentInEditor={activeTextContent}
                    setActiveTextContent={setActiveTextContent}
                    setIsEditing={setIsEditing}
                    fetchData={fetchGroupsData}
                    isPages={isPages}
                    listLoading={listLoading}
                    setListLoading={setListLoading}
                    saveMessage={
                        isEditingMessage !== null ? editMessage : saveMessage
                    }
                />
            </div>
            <div className="message-content d-flex h-100">
                <div className="messages-sub-menu d-flex d-flex-column">
                    <MsgLeftMenuNav
                        MsgNavtype="sub-group"
                        MessageObj={activeGroupsItem?.group_messages}
                        setMessageObj={setActiveGroupsItem}
                        HeaderText={"Message(s)"}
                        AddFun={subNavAddFun}
                        activeObj={activeMessage}
                        setActiveObj={setActiveMessage}
                        HeaderIcon={SubMessagesIcon}
                        additionalClass="message-sub-content"
                        isLoading={loading || groupsArray?.length <= 0}
                        setIsLoading={setLoading}
                        textContentInEditor={activeTextContent}
                        setActiveTextContent={setActiveTextContent}
                        setIsEditing={setIsEditing}
                        saveMessage={
                            isEditingMessage !== null ? editMessage : saveMessage
                        }
                    />
                </div>
                <div
                    className={`
                            messages-editor 
                            d-flex 
                            d-flex-column 
                            ${groupsArray?.length <= 0
                            ? "no-messages-found"
                            : isEditing.readyToEdit
                                ? "message-edit"
                                : "active-not-editing"
                        }
                        `}
                >
                    <div className="message-editor-header d-flex f-align-center f-justify-between">
                        {groupsArray?.length > 0 &&
                            activeGroupsItem?.group_messages?.length > 0 ? (
                            // Not Editing
                            isEditing.readyToEdit ? (
                                // Edit, Duplicate, Delete :
                                <>
                                    <h4>Create message</h4>
                                    <ul className="fr-editor-legend d-flex">
                                        <li>
                                            <figure>
                                                <SpintaxIcon />
                                            </figure>
                                            <div className="edit-text-type">
                                                Spintax
                                                <span className="fr-tooltip-side-overflow icon-inline">
                                                    <QueryIconGrey />
                                                    <div className="legend-tooltip">
                                                        <span className="legend-tooltip-icon">
                                                            <SpintaxIcon />
                                                        </span>
                                                        <div className="lengend-text-details">
                                                            <span className="legend-header">
                                                                How to use spintax?
                                                            </span>
                                                            <span className="legend-text">
                                                                To use spintax, start your sentence with an
                                                                open curly brace '&#123;' and then list out
                                                                the alternate variations that you want to use,
                                                                separated by a pipe symbol '|'.
                                                            </span>
                                                            <span className="legend-footer">
                                                                e.g.{" "}
                                                                <small>
                                                                    &#123;option1|option2|option3&#125;
                                                                </small>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </span>
                                            </div>
                                        </li>
                                        <li>
                                            <figure>
                                                <MergeFieldsIcon />
                                            </figure>
                                            <div className="edit-text-type">
                                                Merge field
                                                <span className="fr-tooltip-side-overflow icon-inline">
                                                    <QueryIconGrey />
                                                    <div className="legend-tooltip">
                                                        <span className="legend-tooltip-icon">
                                                            <MergeFieldsIcon />
                                                        </span>
                                                        <div className="lengend-text-details">
                                                            <span className="legend-header">
                                                                How to use merge fields?
                                                            </span>
                                                            <span className="legend-text">
                                                                To use merge fields, type '&#123;&#123;' at
                                                                the beginning of the field you want to insert
                                                                from the list, followed by the corresponding
                                                                field name.
                                                            </span>
                                                            <span className="legend-footer">
                                                                e.g.{" "}
                                                                <small>&#123;&#123;option&#125;&#125;</small>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </span>
                                            </div>
                                        </li>
                                        <li>
                                            <figure>
                                                <SegmentIcon />
                                            </figure>
                                            <div className="edit-text-type">
                                                Segment
                                                <span className="fr-tooltip-side-overflow icon-inline">
                                                    <QueryIconGrey />
                                                    <div className="legend-tooltip">
                                                        <span className="legend-tooltip-icon">
                                                            <SegmentIcon />
                                                        </span>
                                                        <div className="lengend-text-details">
                                                            <span className="legend-header">
                                                                How to use segment?
                                                            </span>
                                                            <span className="legend-text">
                                                                To use a segment, type '[' and choose the
                                                                segment you created from the dropdown list and
                                                                it will be inserted into your textbox.
                                                            </span>
                                                            <span className="legend-footer">
                                                                e.g. <small>[option]</small>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </span>
                                            </div>
                                        </li>
                                    </ul>
                                </>
                            ) : (
                                <>
                                    <h3 className="message-header-text d-flex f-align-center">
                                        <figure>
                                            <SubMessagesIcon />
                                        </figure>
                                    </h3>
                                    <div className="message-element-header d-flex f-align-center">
                                        <button
                                            className="btn-inline num-well btn-edit-inline"
                                            disabled={loading}
                                            onClick={editThisMessageItem}
                                        >
                                            <span className="icon-inline">
                                                <EditIcon />
                                            </span>
                                            Edit
                                        </button>
                                        <button
                                            className="btn-inline num-well btn-duplicate-inline"
                                            disabled={loading}
                                            onClick={duplicateThisMessageItem}
                                        >
                                            <span className="icon-inline">
                                                <CopyIcon />
                                            </span>
                                            Duplicate
                                        </button>
                                        <button
                                            className="btn-inline num-well btn-delete-inline"
                                            disabled={loading}
                                            onClick={deleteThisMessageItem}
                                        >
                                            <span className="icon-inline">
                                                <DeleteIcon />
                                            </span>
                                            Delete
                                        </button>
                                    </div>
                                </>
                            )
                        ) : (
                            <>
                                <h4>Create message</h4>
                                <ul className="fr-editor-legend d-flex">
                                    <li>
                                        <figure>
                                            <SpintaxIcon />
                                        </figure>
                                        <div className="edit-text-type">
                                            Spintax
                                            <span className="fr-tooltip-side-overflow icon-inline">
                                                <QueryIconGrey />
                                                <div className="legend-tooltip">
                                                    <span className="legend-tooltip-icon">
                                                        <SpintaxIcon />
                                                    </span>
                                                    <div className="lengend-text-details">
                                                        <span className="legend-header">
                                                            How to use spintax?
                                                        </span>
                                                        <span className="legend-text">
                                                            To use spintax, start your sentence with an open
                                                            curly brace '&#123;' and then list out the
                                                            alternate variations that you want to use,
                                                            separated by a pipe symbol '|'.
                                                        </span>
                                                        <span className="legend-footer">
                                                            e.g.{" "}
                                                            <small>
                                                                &#123;option1|option2|option3&#125;
                                                            </small>
                                                        </span>
                                                    </div>
                                                </div>
                                            </span>
                                        </div>
                                    </li>
                                    <li>
                                        <figure>
                                            <MergeFieldsIcon />
                                        </figure>
                                        <div className="edit-text-type">
                                            Merge field
                                            <span className="fr-tooltip-side-overflow icon-inline">
                                                <QueryIconGrey />
                                                <div className="legend-tooltip">
                                                    <span className="legend-tooltip-icon">
                                                        <MergeFieldsIcon />
                                                    </span>
                                                    <div className="lengend-text-details">
                                                        <span className="legend-header">
                                                            How to use merge fields?
                                                        </span>
                                                        <span className="legend-text">
                                                            To use merge fields, type '&#123;&#123;' at the
                                                            beginning of the field you want to insert from
                                                            the list, followed by the corresponding field
                                                            name.
                                                        </span>
                                                        <span className="legend-footer">
                                                            e.g.{" "}
                                                            <small>&#123;&#123;option&#125;&#125;</small>
                                                        </span>
                                                    </div>
                                                </div>
                                            </span>
                                        </div>
                                    </li>
                                    <li>
                                        <figure>
                                            <SegmentIcon />
                                        </figure>
                                        <div className="edit-text-type">
                                            Segment
                                            <span className="fr-tooltip-side-overflow icon-inline">
                                                <QueryIconGrey />
                                                <div className="legend-tooltip">
                                                    <span className="legend-tooltip-icon">
                                                        <SegmentIcon />
                                                    </span>
                                                    <div className="lengend-text-details">
                                                        <span className="legend-header">
                                                            How to use segment?
                                                        </span>
                                                        <span className="legend-text">
                                                            To use a segment, type '[' and choose the
                                                            segment you created from the dropdown list and
                                                            it will be inserted into your textbox.
                                                        </span>
                                                        <span className="legend-footer">
                                                            e.g. <small>[option]</small>
                                                        </span>
                                                    </div>
                                                </div>
                                            </span>
                                        </div>
                                    </li>
                                </ul>
                            </>
                        )}
                        {/* {
                            activeMsgTypeObj?.group_messages?.length ?
                                // has messages :
                                isEditing.readyToEdit ?
                                    // is Editing :
                                    <>
                                        <h4>Create message</h4>
                                        <ul className="fr-editor-legend d-flex">
                                            <li>
                                                <figure></figure>
                                                <div className="edit-text-type">
                                                    <span className="fr-tooltip-side-overflow icon-inline"></span>
                                                </div>
                                                <div className="legend-tooltip">
                                                <span>
                                            </li>
                                        </ul>
                                    </> :
                                    // is Not Editing
                                    <>
                                        <h3 className='message-header-text d-flex f-align-center'>
                                            <figure><SubMessagesIcon /></figure>
                                        </h3>
                                        <div className="message-element-header d-flex f-align-center">
                                            <button className="btn-inline">Edit</button>
                                            <button className="btn-inline">Duplicate</button>
                                            <button className="btn-inline">Delete</button>
                                        </div>
                                    </> :
                                // doesn't have messages
                                    <>
                                        <h4>Create message</h4>
                                    </>
                        } */}
                    </div>
                    {isEditing.readyToEdit ? (
                        <>
                            {/* the is extra tag for differentciation*/}
                            <p></p>
                            <TextEditor
                                editorStateValue={editorStateValue}
                                setEditorStateValue={setEditorStateValue}
                                isEditing={isEditing}
                                cancleFun={cancleFun}
                                saveMessage={isEditingMessage !== null ? editMessage : saveMessage}
                                setTextContent={setActiveTextContent}
                            />
                        </>
                    ) : activeGroupsItem?.group_messages?.length > 0 ? (
                        <>
                            <div
                                className="fr-message-view"
                                dangerouslySetInnerHTML={{
                                    __html: modifyPatterns(
                                        activeMessage &&
                                            activeMessage?.message ?
                                            activeMessage?.message?.html :
                                            ''
                                    )
                                }}
                            ></div>
                        </>
                    ) : (
                        <>
                            {/* <div>deff</div> */}
                            <TextEditor
                                editorStateValue={editorStateValue}
                                setEditorStateValue={setEditorStateValue}
                                isEditing={{ ...isEditing, addNewSub: true }}
                                cancleFun={cancleFun}
                                saveMessage={saveMessage}
                                autoFocus={false}
                            />
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default MessageGroups;
