import React, { memo, useEffect, useRef, useState } from "react";
import {
  Cross,
  DeleteNameIcon,
  EditNameIcon,
  EmptyNavArrowIcon,
  MsgAddIcon,
  ThreeDotIcon,
} from "../../assets/icons/Icons";
import Lottie from "react-lottie-player";
import EmptyPlaceAnimation from "../../assets/animations/empty-place-animation.json";
import ListHeader from "./ListHeader";
import { useDispatch, useSelector } from "react-redux";
import { deleteLocalDmf, deleteDmf, updateDmf, updatelocalDmf } from "../../actions/MessageAction";
import useComponentVisible from "../../helpers/useComponentVisible";
import { useSearchParams } from "react-router-dom";
import Modal from "./Modal";
import { DangerIcon } from "../../assets/icons/Icons"
import "../../assets/scss/component/common/_submenu.scss"

/**
 * Check type and return empty sidebar for new creation
 * @param {*} Message type (DMF,Segment,Groups) 
 * @returns Empty Sidebar component
 */
export const EmptyNavComp = (type) => {
  return (
    <div className="empty-nav-icon">
      <EmptyNavArrowIcon />
      <Lottie
        loop={Infinity}
        animationData={EmptyPlaceAnimation}
        play
        background="transparent"
        className="loto-loti"
        style={{ width: "60px", height: "60px" }}
      />
      <div className="empty-nav-text">
        You can create your first{" "}
        {type.type == "dmf"
          ? "Dynamic Merge Field"
          : type.type == "segment"
            ? "Message Segment"
            : "Message Group"}{" "}
        by clicking on Add icon
      </div>
    </div>
  );
};

function MsgLeftMenuNav({
  MsgNavtype = "dmf",
  MessageObj = [],
  setMessageObj,
  HeaderText = "Dynamic Merge Fields",
  AddFun,
  activeObj,
  setActiveObj,
  newDmf,
  setNewDMfAdded,
  QueryEdit,
  RemoveQueryParams
}) {
  /**@param  MsgNavtype="dmf"*/
  /**@param  MessageObj={}*/
  /**@param  HeaderText=String*/
  //::::AddFun is the function which will create the new element !!impotant
  const dispatch = useDispatch();
  const { clickedRef, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);
  const [active, setActive] = useState(0);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editMenu, setEditMenu] = useState(null);
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteMessageItem, setDeleteMessageItem] = useState(null)
  const [errorCreation, setErrorCreation] = useState({
    createEditInput: ""
  })

  const msgArrRef = useRef(MessageObj);

  /**
   * this starts rename process for dmf
   *
   * @returns 
   */
  const doubleClickHandle = () => {
    setIsEditingName(true);
    setEditMenu(null)
  };

  /**
   * on removal of focus from dmf name edit
   *
   * @returns 
   */
  const blurHandle = () => {
    setIsEditingName(false);
    setNewDMfAdded(false);
  };

  /**
   * Submit rename of dmf
   * resetting the active edit states and errors
   *
   * @returns 
   */
  const handleNameEdit = (event, ele) => {
    let newArr = MessageObj.map(obj => {
      if (obj._id === ele._id) {
        return { ...obj, name: event.target.value };
      }

      return obj;
    });

    let selectedObj = newArr.find((item) => item._id === ele._id);

    if (event.key === "Enter") {
      if (event.target.value.trim() === "") {
        setErrorCreation({
          ...errorCreation,
          createEditInput: "Please enter a proper name."
        })
      }
      if (event.target.value.trim() !== "") {
        const dmfPayload = {
          "dmf_id": selectedObj._id,
          "name": event.target.value
        }

        try {
          dispatch(updateDmf(dmfPayload))
            .unwrap()
            .then((res) => {
              if (res) {
                setMessageObj(newArr)
                //console.log("newArr<<<<<", newArr);
                setIsEditingName(false);
                setNewDMfAdded(false);
                setErrorCreation({
                  ...errorCreation,
                  createEditInput: ""
                })
              }
            })
        } catch (error) {
          // console.log(error);
        }
      }
    }
  };

  /**
   * Starts process of adding new dmf
   *
   * @returns 
   */
  const addFunctionHandle = () => {
    msgArrRef.current = MessageObj;
    // console.log("msgArrRef.current", msgArrRef.current, MessageObj);
    AddFun();
  };

  /**
   * If MessageObj is modified
   * if first MessageObj added, set first one as active
   * if editing, switch on rename option for dmf
   *
   * @returns 
   */
  useEffect(() => {
    setIsEditingName(false);
    // console.log("MessageObj", MessageObj[0]);
    setActive(0)
    if (MessageObj?.length > 0) {
      setActive(MessageObj[0]._id);
      setActiveObj(MessageObj[0])
      if (newDmf) {
        setIsEditingName(true)
      } else {
        setIsEditingName(false);
      }
    }
  }, [MessageObj])

  /**
   * Open dmf three dots submenu
   * to edit / delete the dmf
   *
   * @returns 
   */
  const openSubmenu = (e, elId) => {
    e.preventDefault();

    setEditMenu(editMenu === elId ? null : elId)
    RemoveQueryParams()
  }

  /**
   * on change in editmenu
   * toggle global state for this as visible / not visible
   *
   * @returns 
   */
  useEffect(() => {
    if (editMenu === null) {
      // console.log('here ============> ', editMenu);
      setIsComponentVisible(false)
    }
    else {
      // console.log('else here ==============> ', editMenu);
      setIsComponentVisible(true)
    }
  }, [editMenu])


  /**
   * delete dmf
   * send dmf id for deletion then reset the active dmf, subdmf, id, 
   * edit menu values
   *
   * @returns 
   */
  const deleteItem = (id) => {
    let dmfArrayPlaceholder = MessageObj;

    const deletePayload = {
      "dmf_id": id
    }
    try {
      dispatch(deleteDmf(deletePayload))
        .unwrap()
        .then((res) => {
          if (res) {
            if (res) {
              setActiveObj(null)
              if (dmfArrayPlaceholder.length > 0) {
                setMessageObj(dmfArrayPlaceholder?.filter(el => el._id !== id))
                setActive(dmfArrayPlaceholder?.filter(el => el._id !== id)[0]?._id);
                setActiveObj(dmfArrayPlaceholder?.filter(el => el._id !== id)[0])
              }
              setEditMenu(null);
              RemoveQueryParams()
            }
          }
        })
    } catch (error) {
      // console.log(error);
    } finally {
      setDeleteMessageItem(null)
      setModalOpen(false)
    }
  }

  /**
   * on Click
   * make dmf as active
   * 
   * @returns 
   */
  const activateDmf = (item) => {
    try {
      RemoveQueryParams()
    } catch (error) {
      console.log(error);
    } finally {
      setActive(item._id);
      setActiveObj(item);
    }
  }

  /**
   * on change of modalopen state
   * set delete message id as null
   *
   * @returns 
   */
  useEffect(() => {
    if (!modalOpen) {
      setDeleteMessageItem(null)
    }
  }, [modalOpen])

  return (
    <div className="paper-non-padded message-page-left-nav">
      <ListHeader
        HeaderText={HeaderText}
        AddFun={addFunctionHandle}
        DataLength={MessageObj && MessageObj.length}
      />
      <div className="message-left-nav-content">
        {MessageObj && (
          <ul>
            {MessageObj.map((item) => {
              // console.log("LI item:::::", activeObj);
              return (
                <li
                  key={item._id}
                  className={
                    item._id === activeObj?._id
                      ? "message-leftbar-item message-leftbar-item-active main-dmf-lists"
                      : "message-leftbar-item"
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    activateDmf(item)
                  }}
                >
                  {/* {console.log('checking duplicate key', item._id)} */}
                  {isEditingName && item._id === active ? (
                    <div className={errorCreation.createEditInput !== '' ? "message-editable-text-Field error" : "message-editable-text-Field"}>
                      <div className="message-editable-text-Field-input">
                        <input
                          onBlur={blurHandle}
                          // ref={inputElement}
                          defaultValue={item.name}
                          maxlength="30"
                          onKeyDown={(e) => handleNameEdit(e, item)}
                          autoFocus
                        />

                        <Cross />
                      </div>
                      {errorCreation.createEditInput !== "" && <p className="error-message">{errorCreation.createEditInput}</p>}
                    </div>
                  ) : (
                    <div
                      className="message-editable-text-Field display-name-only"
                    >
                      <p>{item.name}</p>
                      <div className="inner-menu-message" dir="dmf-list" ref={clickedRef}>
                        <button
                          className="btn"
                          onClick={(e) => openSubmenu(e, item._id)}><ThreeDotIcon /></button>
                        {editMenu === item._id && isComponentVisible && <div className="sub-menu submenu-message">
                          <ul>
                            <li
                              key="menu-edit"
                              className="sub-menu-item"
                              onClick={() => doubleClickHandle()}>
                              <figure>
                                <EditNameIcon />
                              </figure>
                              <span>
                                Rename
                              </span>
                            </li>
                            <li
                              key="menu-delete"
                              className="sub-menu-item error-menu-item"
                              onClick={() => {
                                setModalOpen(true)
                                setDeleteMessageItem(item._id)
                              }}
                            >
                              <figure>
                                <DeleteNameIcon />
                              </figure>
                              <span>
                                Delete
                              </span>
                            </li>
                          </ul>
                        </div>}
                      </div>
                      <span className="dmf-list-tooltip">
                        {(item.name.length < 70) ?
                          <>
                            {item.name}
                          </>


                          :
                          <>
                            {item.name?.slice(0, 70).concat("...")}
                          </>

                        }

                      </span>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        {MessageObj?.length <= 0 && <EmptyNavComp type={MsgNavtype} />}
      </div>

      <Modal
        headerText="Delete"
        bodyText="Are you sure you want to delete this dynamic merge field?"
        btnText="Yes, Delete"
        ModalFun={() => deleteItem(deleteMessageItem)}
        open={modalOpen}
        setOpen={setModalOpen}
        ModalIconElement={DangerIcon}
        modalType="delete-type"
      />
    </div>
  );
}

export default memo(MsgLeftMenuNav);
