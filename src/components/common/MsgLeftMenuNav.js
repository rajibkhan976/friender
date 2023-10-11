import { memo, useEffect, useRef, useState } from "react";
import ListHeader from "./ListHeader";
import { useDispatch, useSelector } from "react-redux";
import { convertToRaw } from 'draft-js';
import "../../assets/scss/component/common/_submenu.scss";
import EmptyMessage from "../messages/EmptyMessage";
import { Cross, DeleteIcon, EditIcon, ThreeDotIcon } from "../../assets/icons/Icons";
import Button from "../formComponents/Button";
import Alertbox from "./Toast";
import { tools } from "./TextEditor/tools/tools";
import { fetchGroups } from "../../actions/MessageAction";

/**
 * Check type and return empty sidebar for new creation
 * @param {*} Message type (DMF,Segment,Groups)
 * @returns Empty Sidebar component
 */
// export const EmptyNavComp = (type) => {
//   return (
//     <div className="empty-nav-icon">
//       <EmptyNavArrowIcon />
//       <Lottie
//         loop={Infinity}
//         animationData={EmptyPlaceAnimation}
//         play
//         background="transparent"
//         className="loto-loti"
//         style={{ width: "60px", height: "60px" }}
//       />
//       <div className="empty-nav-text">
//         You can create your first{" "}
//         {type.type === "dmf"
//           ? "Dynamic Merge Field"
//           : type.type === "segment"
//             ? "Message Segment"
//             : "Message Group"}{" "}
//         by clicking on Add icon
//       </div>
//     </div>
//   );
// };

function MsgLeftMenuNav({
  MsgNavtype = "group",
  MessageObj = [],
  setMessageObj,
  HeaderText = "Group(s)",
  AddFun,
  activeObj,
  setActiveObj,
  newDmf,
  setNewDMfAdded,
  QueryEdit,
  RemoveQueryParams,
  HeaderIcon,
  additionalClass,
  deletePayload,
  isLoading,
  setIsLoading,
  multiPurposeFunction,
  textContentInEditor,
  setActiveTextContent,
  saveMessage,
  setIsEditing,
  fetchData = null,
  isPages = null,
  listLoading = null,
  setListLoading = null,
}) {
  /**@param  MsgNavtype="dmf"*/
  /**@param  MessageObj={}*/
  /**@param  HeaderText=String*/
  //::::AddFun is the function which will create the new element !!impotant
  const inputRef = useRef(null);
  const contenxtMenu = useRef({})
  const dispatch = useDispatch();
  const [active, setActive] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editGroup, setEditGroup] = useState(null)
  const [editMenu, setEditMenu] = useState(null);
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteMessageItem, setDeleteMessageItem] = useState(null)
  const [errorCreation, setErrorCreation] = useState(false)
  const [newCreateName, setNewCreateName] = useState('')
  const isLoadingMessage = useSelector((state) => state.message.isLoading);

  /**
   * Detecting Scrolling of user and loads Data
   */
  function handleScroll(event) {
    if (MessageObj && MessageObj.length) {
      const container = event.target;
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;
      const actualScrollHeight = Math.ceil(scrollHeight - scrollTop);

      // console.log("CALLED THE SCROLL EFFECT");
      // console.log("Scroll TOp -- ", scrollTop);
      // console.log("scrollHeight -- ", scrollHeight);
      // console.log("Client height -- ", clientHeight);

      // console.log("ScrollHeight - ScrollTop --==-- ", scrollHeight - scrollTop);
      // console.log("Scroll should be -- ", actualScrollHeight === clientHeight);

      // Adjust the threshold as needed
      if (actualScrollHeight === clientHeight) {
        // For Infinite-Scrolling..
        // Load more data here
        // setLoading(true);
        // loadMore();

        // Now that is on parent component..
        if (listLoading !== null) {
          setListLoading(true);
          fetchData();
        }
      }
    }
  }

  /**
   *  Make Text to Truncate when gets upper then 32 character
   * @param text
   * @returns {*}
   */
  const renderToolTipWhenText32Upper = (element) => (
    MsgNavtype === 'group' ? element?.group_name?.length > 32 && 'style-tooltip' :
      MsgNavtype === 'segment' ? element?.segment_name?.length > 32 && 'style-tooltip' : ''
  );

  // Toggle Context menu
  const contextMenuToggle = (e, elID) => {
    e.preventDefault();
    e.stopPropagation();

    console.log(e);

    setActive(current => current === elID ? null : elID);
    setEditGroup(null);
  }

  // Format Date
  const formatDate = (dt) => {
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const dateNow = new Date(dt);

    return `${monthNames[dateNow.getMonth()]?.slice(0, 3)} ${dateNow?.getDate()}, ${dateNow?.getFullYear()}`
  }

  // filter and return key title
  const showKeyContent = (item, limit) => {
    return (
      MsgNavtype === "group" ?
        (limit && item?.group_name?.length > limit) ?
          item?.group_name?.slice(0, limit) + "..." :
          item?.group_name :
        MsgNavtype === "segment" ?
          (limit && item?.segment_name?.length > limit) ?
            item?.segment_name.slice(0, limit) + "..." :
            item?.segment_name :
          MsgNavtype === "sub-group" ?
            (limit && item?.message.text?.length > limit) ?
              item?.message.text.slice(0, limit) + "..." :
              item?.message.text :
            MsgNavtype === "sub-segment" ?
              (limit && item?.message.text?.length > limit) ?
                item?.message.text.slice(0, limit) + "..." :
                item?.message.text :
              item?.dmf_name
    )
  }

  const showMsgContent = (item) => MsgNavtype === "sub-segment" || MsgNavtype === "sub-group" ? item?.message?.text : '';

  const setActiveMessage = (item) => {
    console.log('item????????', item);
    if (MsgNavtype === "sub-group" || MsgNavtype === "sub-segment") {
      AddFun(false)
    }
    setIsEditing({ readyToEdit: false, addNewSub: false })
    setActiveObj(currentActive => currentActive?._id !== item?._id ? item : currentActive);
    setActiveTextContent("")

    if (editGroup != null && item?._id !== editGroup?._id) {
      setEditGroup(null)
      setActive(null)
    }
    
    // console.log('>>>>>>>>>>>>>>>>>>>', textContentInEditor)
  }

  const addNewMessageParent = () => {
    if (MsgNavtype === "group" || MsgNavtype === "segment") {
      setIsLoading(true)
      setIsEditingName(true);
    }

    if (MsgNavtype === "sub-group" || MsgNavtype === "sub-segment") {
      setActiveObj(null)
      AddFun(false)

      if (textContentInEditor && tools.$convertPureString(JSON.parse(textContentInEditor)).length > 0) {
        const tempMsgObj = JSON.parse(textContentInEditor);

        if (tempMsgObj?.root?.children || tempMsgObj?.root?.children[0]?.children?.length > -1) {

          const msgObj = {
            __raw: textContentInEditor,
            html: tools.$generateHtmlFromNodeState(tempMsgObj),
            text: tools.$convertPureString(tempMsgObj).join(" "),
            messengerText: tools.$generateMessengerText(tempMsgObj)
          }
          try {
            AddFun(false)
            saveMessage(msgObj)
              .then((res) => {
                AddFun(true)
              })
          } catch (error) {
            console.log(error);
          }
        } else {
          AddFun(true)
        }
      } else {
        AddFun(true)
      }
    }
  }

  const createNew = e => {
    e.preventDefault();
    e.stopPropagation()

    if (newCreateName.trim() !== "") {
      try {
        if (MsgNavtype === 'group') {
          if (MessageObj?.filter(el => el.group_name === newCreateName)?.length !== 0) {
            setErrorCreation(true)
            Alertbox(
              'Existing group name can’t be saved again.',
              "error",
              1000,
              "bottom-right"
            );
            setTimeout(() => {
              setErrorCreation(false)
            }, 800);
          } else {
            if (textContentInEditor && tools.$convertPureString(JSON.parse(textContentInEditor)).length > 0) {
              const tempMsgObj = JSON.parse(textContentInEditor);

              if (tempMsgObj?.root?.children || tempMsgObj?.root?.children[0]?.children?.length > -1) {
                const msgObj = {
                  __raw: textContentInEditor,
                  html: tools.$generateHtmlFromNodeState(tempMsgObj),
                  text: tools.$convertPureString(tempMsgObj).join(" "),
                  messengerText: tools.$generateMessengerText(tempMsgObj)
                }
                try {
                  saveMessage(msgObj)
                    .then((res) => {
                      setErrorCreation(false)
                      AddFun(newCreateName)
                    })
                } catch (error) {
                  console.log(error);
                }
              } else {
                setErrorCreation(false)
                AddFun(newCreateName)
              }
            } else {
              setErrorCreation(false)
              AddFun(newCreateName)
            }
          }
        }

        // Segment..
        if (MsgNavtype === 'segment') {
          if (MessageObj?.filter(el => el.segment_name === newCreateName)?.length !== 0) {
            setErrorCreation(true)
            Alertbox(
              'Segment group name can\'t be saved again',
              "error",
              1000,
              "bottom-right"
            );
            setTimeout(() => {
              setErrorCreation(false)
            }, 800);
          } else {
            if (textContentInEditor) {
              const tempMsgObj = JSON.parse(textContentInEditor);

              if (tempMsgObj?.root?.children || tempMsgObj?.root?.children[0]?.children?.length > -1) {
                const msgObj = {
                  __raw: textContentInEditor,
                  html: tools.$generateHtmlFromNodeState(tempMsgObj),
                  text: tools.$convertPureString(tempMsgObj).join(" "),
                  messengerText: tools.$generateMessengerText(tempMsgObj)
                }
                try {
                  saveMessage(msgObj)
                    .then((res) => {
                      setErrorCreation(false)
                      AddFun(newCreateName)
                    })
                } catch (error) {
                  console.log(error);
                }
              } else {
                setErrorCreation(false)
                AddFun(newCreateName)
              }
            } else {
              setErrorCreation(false)
              AddFun(newCreateName)
            }
          }
        }

        // console.log('here');
      } catch (error) {
        Alertbox(
          error,
          "error",
          1000,
          "bottom-right"
        );
      }
    } else {
      setErrorCreation(true)
      Alertbox(
        `${MsgNavtype === 'group' ? 'Please enter a proper group name.' : 'Please enter a proper segment name.'}`,
        "error",
        1000,
        "bottom-right"
      );
    }
  }

  const resetCreateNew = () => {
    console.log('clicked reset', isEditingName, isLoading);
    setIsEditingName(false)
    setIsLoading(false)
    setNewCreateName('')
  }

  const editMessageName = (e, el) => {
    e.preventDefault();
    e.stopPropagation()

    if (MsgNavtype === "group") {
      if (editGroup.group_name.trim() !== "") {
        if (MessageObj?.filter(el => el.group_name === editGroup.group_name).length > 0) {
          Alertbox(
            'Existing group name can’t be saved again.',
            "error",
            1000,
            "bottom-right"
          );
        } else {
          multiPurposeFunction(editGroup);
          setEditGroup(null)
          setActive(null)
        }
      } else {
        Alertbox(
          'Message group name cannot be empty.',
          "error",
          1000,
          "bottom-right"
        );
      }
    }

    if (MsgNavtype === "segment") {
      if (editGroup.segment_name.trim() !== "") {
        if (MessageObj?.filter(el => el.segment_name === editGroup.segment_name).length > 0) {
          Alertbox(
            'Existing segment name can’t be saved again.',
            "error",
            1000,
            "bottom-right"
          );
        } else {
          multiPurposeFunction(editGroup);
          setEditGroup(null);
          setActive(null);
        }
      } else {
        Alertbox(
          'Message segment name cannot be empty.',
          "error",
          1000,
          "bottom-right"
        );
      }
    }
  }

  const deleteMessageGroup = (e, item) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      deletePayload(item)
      setActive(null)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    // console.log('MessageObj<<<<<<<<<<<<<<<<', MessageObj, 'setActiveObj', activeObj);
    if (MsgNavtype === "group" || MsgNavtype === "segment") {
      if (MessageObj?.length <= 0) {
        setIsEditingName(true)
        inputRef?.current?.focus()
      } else {
        setIsEditingName(false)
      }

      setNewCreateName('')
    }
  }, [MessageObj])

  // useEffect(() => {
  //   console.log('activeObj updated', activeObj);
  // }, [activeObj])

  const handleOutsideClick = (e) => {
    e.stopPropagation();

    if (
      active &&
      contenxtMenu && Object.keys(contenxtMenu.current).length !== 0 && contenxtMenu?.current &&
      contenxtMenu && Object.keys(contenxtMenu.current).length !== 0 && contenxtMenu?.current?.hasOwnProperty(active) &&
      !contenxtMenu?.current[active].contains(e.target)
    ) {
      setActive(null)
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  });

  return (
    <div className={`paper-simple message-page-left-nav d-flex d-flex-column ${additionalClass}`}>
      <ListHeader
        HeaderText={HeaderText}
        AddFun={addNewMessageParent}
        DataLength={MessageObj && MessageObj?.length ? MessageObj?.length : 0}
        HeaderIcon={HeaderIcon}
        isLoading={isEditingName || isLoading}
      />
      <div className="message-left-nav-content h-100"
        onScroll={handleScroll}
      >
        {
          isEditingName ?
            <form
              className={`creating-new d-flex f-justify-between ${errorCreation ? 'error' : ''}`}
              onSubmit={e => createNew(e)}
            >
              <input
                autoFocus
                ref={inputRef}
                className="fr-input-inline"
                placeholder={`${MsgNavtype === 'segment' ?
                  'Enter segment name' :
                  MsgNavtype === "group" ?
                    "Enter message group name" : ''
                  }
                `}
                name="new message"
                value={newCreateName}
                onChange={e => {
                  setErrorCreation(false)
                  setNewCreateName(e.target.value)
                }}
                disabled={isLoadingMessage}
              />
              <Button
                extraClass={`create-message-${MsgNavtype} btn-inline`}
                btnText='Create'
                clickEv={e => createNew(e)}
                disable={isLoadingMessage}
              />
              <span
                className="reset-creation"
                onClick={resetCreateNew}
              >
                <Cross />
              </span>
            </form> : ''
        }
        {
          // !initialMessageObj?.length ?
          !MessageObj?.length ?
            <EmptyMessage
              customText={`
                      ${MsgNavtype === "group" ? 'Empty message groups? Create a new one now and get the conversation rolling!' :
                  MsgNavtype === "sub-group" ? 'Message box is empty! Get your typing fingers ready!' :
                    MsgNavtype === "segment" ? 'You haven’t created any message segment yet.  It’s time to weave your words in to magical conversations' :
                      MsgNavtype === "sub-segment" && 'Paint your canvas with inspiring message(s)'}
                    `}
            />
            :
            <div className="fr-message-listing h-100 w-100">
              <ul className="d-flex d-flex-column h-100 w-100">
                {
                  // initialMessageObj?.map(el => (
                  MessageObj?.map(el => (
                    <li
                      className={el?._id === activeObj?._id ? `active-sub-message ${renderToolTipWhenText32Upper(el)}` : `${renderToolTipWhenText32Upper(el)}`}
                      key={'message-item-' + el._id}
                      onClick={() => setActiveMessage(el)}
                      data-text={showKeyContent(el, null)}
                    >
                      {
                        editGroup?._id === el?._id ?
                          <div className="edit-message-group-name">
                            <form
                              className="creating-new d-flex f-justify-between"
                              onSubmit={e => editMessageName(e, el)}
                            >
                              <input
                                autoFocus
                                className="fr-input-inline"
                                name="new message"
                                value={editGroup?.group_name || editGroup?.segment_name}
                                onChange={e => setEditGroup({
                                  ...editGroup,
                                  group_name: e.target.value,
                                  segment_name: e.target.value,
                                })}
                              />
                              <Button
                                extraClass={`create-message-${MsgNavtype} btn-inline`}
                                btnText='Save'
                                clickEv={e => editMessageName(e, el)}
                              />
                              <span
                                className="reset-creation"
                                onClick={() => {
                                  setEditGroup(null)
                                  setActive(null)
                                }}
                              >
                                <Cross />
                              </span>
                            </form>
                          </div> :
                          <div
                            className={`content-message-list-item d-flex f-align-center f-justify-between`}
                          // ${showMsgContent(el)?.length > 77 && 'style-sub-tooltip'}
                          // data-text={showMsgContent(el)}
                          >
                            <span className="message-name">
                              {showKeyContent(el, MsgNavtype === "segment" || MsgNavtype === "group" ? 32 : MsgNavtype === "sub-segment" || MsgNavtype === "sub-group" ? 77 : null)}
                            </span>
                            <aside>
                              <span className="message-date">
                                {formatDate(el.created_at)}
                              </span>

                              {(MsgNavtype !== 'sub-group' && MsgNavtype !== 'sub-segment') &&
                                <div
                                  className="message-context-menu"
                                  ref={element => {
                                    if (element) {
                                      contenxtMenu.current[el._id] = element
                                    } else {
                                      delete contenxtMenu.current[el._id]
                                    }
                                  }}
                                >
                                  <button
                                    className={`context-menu-trigger ${active === el._id ? 'active' : ''}`}
                                    onClick={e => contextMenuToggle(e, el._id)}
                                  >
                                    <ThreeDotIcon />
                                  </button>

                                  {active === el._id &&
                                    <div className="context-menu">
                                      <button className="btn btn-edit" onClick={e => setEditGroup(el)}><span className="context-icon"><EditIcon /></span>Rename</button>
                                      <button className="btn btn-delete" onClick={e => deleteMessageGroup(e, el)}><span className="context-icon"><DeleteIcon /></span>Delete</button>
                                    </div>
                                  }
                                </div>
                              }
                            </aside>
                          </div>
                      }
                    </li>
                  ))}

                {listLoading && isPages && (
                  <li className="active-sub-message">
                    <h4 style={{textAlign: 'center'}}>Loading...</h4>
                  </li>
                )}
              </ul>
            </div>
        }
      </div>
    </div>
  );
}

export default memo(MsgLeftMenuNav);
