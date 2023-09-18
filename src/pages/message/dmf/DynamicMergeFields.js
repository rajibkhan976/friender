import React, { memo, useEffect, useMemo, useState } from "react";
import { MsgAddIcon } from "../../../assets/icons/Icons";
import CheckBox from "../../../components/common/CheckBox";
import NothingSelected from "../../../components/common/NothingSelected"
import SearchField from "../../../components/formComponents/SearchField";
import TextInput, {
  TextAreaInput,
} from "../../../components/formComponents/TextInput";
import Card from "./Card";
import DraggableList from "./DraggableList";
import {
  FileDocIcon,
  EditIcon,
  DeletedIcon,
  CopyIcon,
} from "../../../assets/icons/Icons";
import { useDispatch, useSelector } from "react-redux";
import { addSubDmf, deleteSubDmf } from "../../../actions/MessageAction";
import Modal from "../../../components/common/Modal";
import { DangerIcon } from '../../../assets/icons/Icons'

function DynamicMergeFields({ MessageObj, setMessageObj, MessageArray, QueryEdit, RemoveQueryParams }) {
  const dispatch = useDispatch()
  const [searchClear, setSearchClear] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editorOn, setEditorOn] = useState(false);
  const [messageObjState, setMessageObjState] = useState(null);
  // const [isPseudo, setIsPseudo] = useState("")
  const [activeSubdmfId, setActiveSubdmfId] = useState(null);
  const [activeSubdmf, setActiveSubdmf] = useState(null);
  const [activeSubdmfEdit, setActiveSubdmfEdit] = useState(null);
  const [activationStatus, setActivationStatus] = useState("default");
  let dataObj = MessageObj;

  /**
   * on any change in MessageObj(active DMF)
   * set the active sub dmf, sub dmf id and the sub dmf for edit
   *
   * @returns 
   */
  useEffect(() => {
    if (MessageObj) {
      setEditorOn(false);
      setMessageObjState(MessageObj);
      dataObj = MessageObj;

      if (activationStatus === "add") {
        setActiveSubdmfId(MessageObj && MessageObj?.sub_dmfs[MessageObj?.sub_dmfs.length - 1]?._id);
        setActiveSubdmf(MessageObj && MessageObj?.sub_dmfs[MessageObj?.sub_dmfs.length - 1]);
        setActiveSubdmfEdit(MessageObj && MessageObj?.sub_dmfs[MessageObj?.sub_dmfs.length - 1]);
      }
      if (activationStatus === "default") {
        setActiveSubdmfId(MessageObj && MessageObj?.sub_dmfs[0]?._id);
        setActiveSubdmf(MessageObj && MessageObj?.sub_dmfs[0]);
        setActiveSubdmfEdit(MessageObj && MessageObj?.sub_dmfs[0]);
      }
      if (activationStatus === "edit") {
        // console.log("***")
        // console.log("activeSubdmf ::: ", activeSubdmf)
        const currentSubdmf = MessageObj && MessageObj?.sub_dmfs.filter(el => el?._id === activeSubdmf?._id)
        // console.log("currentSubdmf :: ", currentSubdmf)
        currentSubdmf && currentSubdmf.length > 0 && setActiveSubdmfId(currentSubdmf[0]?._id)
        setActiveSubdmf(currentSubdmf && currentSubdmf.length > 0 && currentSubdmf[0]);
        setActiveSubdmfEdit(currentSubdmf && currentSubdmf.length > 0 && currentSubdmf[0]);
      }
      setActivationStatus("default")
    }
    if (MessageObj == null) {
      setMessageObjState(null)
      setActiveSubdmfId(null);
      setActiveSubdmf(null);
      setActiveSubdmfEdit(null);
    }
  }, [MessageObj]);

  /**
   * on click of any subdmf
   * make that subdmf active , along wiith id
   * close editor, if it's on
   *
   * @returns 
   */
  const handleSubDmfClick = useMemo(
    () => (subdmf) => {
      console.log("subdmf", subdmf);
      RemoveQueryParams()
      setActiveSubdmfId(subdmf._id);
      setActiveSubdmf(subdmf);
      setActiveSubdmfEdit(subdmf);
      setEditorOn(false);
    },
    [MessageObj]
  );

  /**
   * Add new Subdmf and trigger renaming of the same
   * updates stored dmfs
   * 
   * @returns newly created subdmf
   */
  const AddFunNew = (e) => {
    e.preventDefault();
    setActivationStatus("add")
    // console.log("ADD NEW************")

    const defaultPayload = {
      "dmf_id": messageObjState._id,
      "subdmf_name": "Sub DMF ",
      "priority": messageObjState.sub_dmfs.length,
      "subdmf_content": "This is your default sub dmf content",
      "use_as": {
        "keyword": false,
        "label": false,
        "tags": false
      }
    }

    dispatch(addSubDmf(defaultPayload))
      .unwrap()
      .then((res) => {
        if (res) {
          // console.log("response.......... ", res)
          RemoveQueryParams()
          const dmfsPlaceholder = { ...messageObjState, sub_dmfs: [...messageObjState.sub_dmfs, res.data] }
          // console.log("dmfsPlaceholder", dmfsPlaceholder);

          const storedDmfsPlaceholder = MessageArray.map(obj => {
            if (obj._id === dmfsPlaceholder._id) {
              return dmfsPlaceholder
            }

            return obj
          })

          // dispatch(updatelocalDmf(storedDmfsPlaceholder));
          console.log('after adding new subdmf', storedDmfsPlaceholder);
          setMessageObj(storedDmfsPlaceholder)
          console.log("storedDmfsPlaceholder?.sub_dmfs[storedDmfsPlaceholder?.sub_dmfs.length]", storedDmfsPlaceholder);
          // setActiveSubdmfId(storedDmfsPlaceholder && storedDmfsPlaceholder?.sub_dmfs[storedDmfsPlaceholder?.sub_dmfs.length]?._id);
          // setActiveSubdmf(storedDmfsPlaceholder && storedDmfsPlaceholder.sub_dmfs[storedDmfsPlaceholder?.sub_dmfs.length]);
          // setActiveSubdmfEdit(storedDmfsPlaceholder && storedDmfsPlaceholder.sub_dmfs[storedDmfsPlaceholder?.sub_dmfs.length])
        }
      })
  };

  /**
   * delete subdmf
   * resets active subdmf to first one
   * updates the stored dmf array
   *
   * @returns 
   */
  const deleteClick = () => {
    const deleteSubDmfPayload = {
      "sub_dmf_id": activeSubdmf._id,
      "is_deleted": 1
    }

    let dmfsArrayClone = [...MessageArray].map(dmfMap => {
      if (dmfMap._id === MessageObj._id) {
        return {
          ...dmfMap,
          sub_dmfs: dmfMap.sub_dmfs.filter(mapDmf => mapDmf._id !== activeSubdmf._id)
        }
      } else {
        return { ...dmfMap }
      }
    });
    console.log("Deleted array", dmfsArrayClone);

    try {
      dispatch(deleteSubDmf(deleteSubDmfPayload))
        .unwrap()
        .then((res) => {
          RemoveQueryParams()
          setMessageObj(dmfsArrayClone)
          setActiveSubdmfId(MessageObj && MessageObj?.sub_dmfs[0]?._id);
          setActiveSubdmf(MessageObj && MessageObj?.sub_dmfs[0]);
          setActiveSubdmfEdit(MessageObj && MessageObj?.sub_dmfs[0]);
          setEditorOn(false)
        })
    } catch (error) {
      console.log(error);
    } finally {
      setModalOpen(false)
    }
  };

  /**
   * clones the active Subdmf
   * makes the cloned one as active
   *
   * @returns updated dmfs array
   */
  const copyClick = () => {
    setActivationStatus("add")
    let clonePayload = {
      "dmf_id": activeSubdmfEdit.dmf_id,
      "subdmf_name": activeSubdmfEdit.subdmf_name,
      "priority": MessageObj.sub_dmfs.length,
      "subdmf_content": activeSubdmfEdit.subdmf_content,
      "use_as": {
        "keyword": activeSubdmfEdit.use_as.keyword,
        "label": activeSubdmfEdit.use_as.label,
        "tags": activeSubdmfEdit.use_as.tags,
      }
    }

    try {
      dispatch(addSubDmf(clonePayload))
        .then((res) => {
          if (res) {
            RemoveQueryParams()
            let dmfsPlaceholder = { ...messageObjState, sub_dmfs: [...messageObjState.sub_dmfs, res.payload.data] }
            // console.log("dmfStored", dmfStored);

            let storedDmfsPlaceholder = MessageArray.map(obj => {
              if (obj._id === dmfsPlaceholder._id) {
                return dmfsPlaceholder
              }

              return obj
            })
            setMessageObj(storedDmfsPlaceholder)
          }
        })
    } catch (error) {
      console.log(error);
    }
  };


  /**
   * give random colors for the icons
   * inside dmfs
   *
   * @returns active dmf with colors for the icons
   */
  const colorPush = (msgObj) => {
    const iconColorArr = ["#ee37ff", "#ff8f6b", "#605bbf", "#26bfe2"];
    let point = 0;
    const newArr = msgObj.sub_dmfs.slice(1).map((item) => {
      const newObj = {
        ...item,
        color: !item.color ? iconColorArr[point] : item.color,
      };

      if (point === iconColorArr.length - 1) {
        point = 0;
      }
      point++;
      return newObj;
    });
    // console.log("msgObj!!!!!!!", [msgObj.sub_dmfs.filter(el => el.is_default !== 1)[0], ...newArr]);
    return { ...msgObj, sub_dmfs: [msgObj.sub_dmfs[0], ...newArr] };
  };

  /**
   * update active subdmf
   * with changes in name, dependencies and content
   *
   * @returns updated subdmf, updated dmf array
   */
  const saveActiveSubdmf = () => {
    if (activeSubdmfEdit.subdmf_name.trim() !== "" && activeSubdmfEdit.subdmf_content.trim() !== "") {
      setActivationStatus("edit")
      const editedPayload = {
        "dmf_id": activeSubdmfEdit.dmf_id,
        "sub_dmf_id": activeSubdmfEdit._id,
        "subdmf_name": activeSubdmfEdit.subdmf_name,
        "priority": activeSubdmfEdit.priority,
        "subdmf_content": activeSubdmfEdit.subdmf_content,
        "use_as": {
          "keyword": activeSubdmfEdit.use_as.keyword,
          "label": activeSubdmfEdit.use_as.label,
          "tags": activeSubdmfEdit.use_as.tags
        }
      };
      // console.log("main load", messageObjState);

      dispatch(addSubDmf(editedPayload))
        .unwrap()
        .then((res) => {
          if (res) {
            RemoveQueryParams()
            // console.log('res>>>', res.data);
            let subPlaceholder = messageObjState.sub_dmfs.map(elSub => {
              if (elSub._id === res.data._id) {
                return res.data
              }
              else {
                return elSub
              }
            })
            // [...messageObjState.sub_dmfs, res.data]
            let dmfsPlaceholder = { ...messageObjState, sub_dmfs: subPlaceholder }

            let storedDmfsPlaceholder = MessageArray.map(obj => {
              if (obj._id === dmfsPlaceholder._id) {
                return dmfsPlaceholder
              }

              return obj
            })

            console.log("storedDmfsPlaceholder", storedDmfsPlaceholder);
            // dispatch(updatelocalDmf(storedDmfsPlaceholder));
            setMessageObj(storedDmfsPlaceholder)
            setEditorOn(false)
            setActiveSubdmfEdit(null)
            setActiveSubdmfId(null)
          }
        })
    }
  }

  /**
   * if editing, then  cancelled
   * re-set the active sub-dmf and their original values
   * closes the editor
   * 
   * @returns 
   */
  const cancelEdit = () => {
    setEditorOn(false)
    setActiveSubdmfEdit(MessageObj && MessageObj?.sub_dmfs.filter(el => el._id === activeSubdmfEdit._id)[0]);
  }

  /**
   * set search results and search result active
   */

  const setSearch = (searched) => {
    // console.log("searched", searched?.sub_dmfs, "MessageArray", MessageObj?.sub_dmfs);
    // RemoveQueryParams()
    setActivationStatus("search")
    setMessageObjState(searched)

    setActiveSubdmfId(searched?.sub_dmfs[0]?._id);
    setActiveSubdmf(searched?.sub_dmfs[0]);
    setActiveSubdmfEdit(searched?.sub_dmfs[0]);
  }

  /**
   * Reset Search value on any interaction
   */
  const resetSearch = () => {
    console.log('reset search');
    // RemoveQueryParams()
    setSearchClear(true)
    setMessageObjState(MessageObj);
  }

  /**
   * get subdf edit id from param and make active
   */
  useEffect(() => {
    // console.log("QueryEdit", QueryEdit.get('dmf'), QueryEdit.get('subdmf'), "Message Aobject", MessageObj);
    if (QueryEdit.get('dmf')) {
      try {
        setActiveSubdmfId(QueryEdit?.get('subdmf'));
        setEditorOn(false);
        if (MessageObj) {
          // console.log("trying sub edit", MessageObj?.sub_dmfs.find(el => el._id === '63f6f223ce01410008c0fb12'), QueryEdit.get('subdmf'));
          setActiveSubdmf(MessageObj?.sub_dmfs.find(el => el._id === QueryEdit?.get('subdmf')));
          setActiveSubdmfEdit(MessageObj?.sub_dmfs?.find(el => el._id === QueryEdit?.get('subdmf')));
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [QueryEdit])

  return (
    <div className="message-content">
      <div className="paper-simple d-flex message dmf-listing-wraper">
        {messageObjState && (
          <div className="dmf-leftbar">
            <div className="dmf-left-nav-header">
              <div className="d-flex">
                <h4>{messageObjState && messageObjState.name}</h4>
                <span className="num-header-count num-well">
                  {/* {console.log("messageObjState>>>>>>>>", messageObjState?.sub_dmfs?.length)} */}
                  {messageObjState &&
                    messageObjState?.sub_dmfs &&
                    messageObjState?.sub_dmfs?.length}
                </span>
              </div>
              <button
                className="btn add-new-message sub"
                onClick={(e) => {
                  resetSearch();
                  AddFunNew(e)
                }}
              >
                <figure>
                  <MsgAddIcon />
                </figure>
              </button>
            </div>
            <SearchField
              ArrayToSearch={dataObj}
              onSearch={setSearch}
              isSearch={searchClear}
            />

            <div className="dmf-leftbar-search"></div>
            {messageObjState && messageObjState?.sub_dmfs && messageObjState?.sub_dmfs?.length > 0 && (
              <DraggableList
                data={colorPush(messageObjState)}
                renderItemContent={(item, active, color) =>
                  CardRender(item, active, color)
                }
                onClickFun={handleSubDmfClick}
                setDataObj={setMessageObjState}
                activeObjId={activeSubdmfId}
              />

            )}
            {messageObjState?.sub_dmfs?.length === 0 &&
              <div className="nothing-found-item">
                Nothing Found
              </div>
            }

            {/* {messageObjState && messageObjState?.sub_dmfs && console.log("activeSubdmfId>>>>>>", activeSubdmfId)} */}

            {/* <div className="dmf-leftbar-body">
            {  messageObjState&&messageObjState.subdmf&&messageObjState.subdmf.map((item, idx) => {
              return (
                <div
                  key={idx}
                  className={
                    activeSubdmfId === item.subdmf_id
                      ? "subdmf_active"
                      : "subdmf"
                  }
                  onClick={() => {
                    handleSubDmfClick(item);
                  }}
                >
                  {item.subdmf_name}
                </div>
              );
            })}
          </div> */}
          </div>
        )}

        {messageObjState && messageObjState?.sub_dmfs.length > 0 && (
          <div className="dmf-body">
            {/* {console.log("editorOn", editorOn, "activeSubdmf", activeSubdmf)} */}
            {!editorOn && (
              <div className="dmf-body-content">
                <div className="dmf-body-header d-flex">
                  <div className="dmf-body-header-left d-flex">
                    <div className="dmf-header-icon">
                      {console.log("activeSubdmf", activeSubdmf)}
                      <span className="dragable-file" style={{ background: `${activeSubdmf?.color + "1e"}` }}>
                        <FileDocIcon fillColor={activeSubdmf?.color} />
                      </span>
                    </div>
                    <div className="dmf-header-info">
                      <h5>{activeSubdmf && activeSubdmf?.subdmf_name}</h5>
                      <div className="menu-breadcrumb">
                        <ul className="breadcrumb">
                          {console.log("Object.keys(activeSubdmf?.use_as)", activeSubdmf)}
                          {activeSubdmf && Object.keys(activeSubdmf?.use_as).filter(key => activeSubdmf?.use_as[key]).map((showUse, index) => (
                            <li key={index}>
                              {showUse}
                            </li>
                          ))}
                          {/* <li>Keywords</li>
                          <li>Labels</li> */}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="dmf-body-header-right d-flex">
                    <button
                      className="action-btn edit-btn"
                      onClick={() => {
                        resetSearch();
                        setEditorOn(!editorOn)
                      }}
                    >
                      <figure>
                        <EditIcon />
                      </figure>
                    </button>
                    {activeSubdmf && activeSubdmf?.is_default !== 1 && (
                      <button
                        className="action-btn delete-btn"
                        // onClick={() => deleteClick(activeSubdmf)}
                        onClick={() => {
                          resetSearch();
                          setModalOpen(true)
                        }}
                      >
                        <figure>
                          <DeletedIcon />
                        </figure>
                      </button>
                    )}
                    <button className="action-btn copy-btn" onClick={() => {
                      resetSearch();
                      copyClick()
                    }}>
                      <figure>
                        <CopyIcon />
                      </figure>
                    </button>
                  </div>
                </div>
                <div className="dmf-body-content-wraper">
                  <p>{activeSubdmf && activeSubdmf?.subdmf_content}</p>
                </div>
              </div>
            )}
            {console.log("activeSubdmfEdit>>>>>", activeSubdmfEdit)}
            {activeSubdmfEdit && editorOn && (
              <div className="dmf-body-editor">
                <TextInput
                  label={"Keyword Name *"}
                  maxlength={"30"}
                  value={
                    activeSubdmfEdit.subdmf_name
                      ? activeSubdmfEdit.subdmf_name
                      : ""
                  }
                  onChange={(e) => {
                    setActiveSubdmfEdit({
                      ...activeSubdmfEdit,
                      subdmf_name: e.target.value,
                    });
                  }}
                  isReadOnly={activeSubdmfEdit.is_default === 1}
                />
                <div className="checkbox-dmf-content-wrapers">
                  <p>Use this dynamic merge fields as (optional)</p>
                  <div className="dmf-checkboxs-clister d-flex">
                    <CheckBox
                      label={"Keyword"}
                      checked={
                        activeSubdmfEdit.use_as.keyword
                          ? activeSubdmfEdit.use_as.keyword
                          : false
                      }
                      checkFun={() => {
                        // console.log(
                        //   "this i am going to change",
                        //   activeSubdmfEdit
                        // );
                        setActiveSubdmfEdit({
                          ...activeSubdmfEdit,
                          use_as: {
                            ...activeSubdmfEdit.use_as,
                            keyword: !activeSubdmfEdit.use_as.keyword,
                          },
                        });
                      }}
                    />

                    <CheckBox
                      label={"Label"}
                      checked={
                        activeSubdmfEdit.use_as.label
                          ? activeSubdmfEdit.use_as.label
                          : false
                      }
                      checkFun={() => {
                        setActiveSubdmfEdit({
                          ...activeSubdmfEdit,
                          use_as: {
                            ...activeSubdmfEdit.use_as,
                            label: !activeSubdmfEdit.use_as.label,
                          },
                        });
                      }}
                    />
                    <CheckBox
                      label={"Tags"}
                      checked={
                        activeSubdmfEdit.use_as.tags
                          ? activeSubdmfEdit.use_as.tags
                          : false
                      }
                      checkFun={() => {
                        setActiveSubdmfEdit({
                          ...activeSubdmfEdit,
                          use_as: {
                            ...activeSubdmfEdit.use_as,
                            tags: !activeSubdmfEdit.use_as.tags,
                          },
                        });
                      }}
                    />
                  </div>
                </div>

                <div className="messagearea-wraper">

                  <TextAreaInput
                    label="DMF Message*"
                    value={activeSubdmfEdit.subdmf_content}
                    onChange={(e) => {
                      setActiveSubdmfEdit({
                        ...activeSubdmfEdit,
                        subdmf_content: e.target.value,
                      });
                    }}
                  />

                  {/* <div 
                  className="pseudo-field"
                  contentEditable="true"
                  onInput={(e) => pseudoType(e)}
                >

                  {isPseudo != "" && 
                    <div className="pseudo-menu">
                      
                    </div>
                  }
                </div> */}

                  <div className="dmf-editor-btn d-flex">
                    <button
                      className="btn-primary outline"
                      onClick={() => {
                        cancelEdit()
                        // setEditorOn(false);
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn-primary btn-save"
                      onClick={saveActiveSubdmf}
                      disabled={
                        activeSubdmfEdit.subdmf_name.trim() === "" || activeSubdmfEdit.subdmf_content.trim() === ""
                      }
                    >Save</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* {!messageObjState && <NoDataFound />} */}
        {!messageObjState && <NothingSelected />}
      </div>

      <Modal
        headerText="Delete"
        bodyText="Are you sure you want to delete this sub-dmf?"
        btnText="Yes, Delete"
        ModalFun={() => deleteClick(activeSubdmf)}
        open={modalOpen}
        setOpen={setModalOpen}
        ModalIconElement={DangerIcon}
        modalType="delete-type"
      />
    </div>
  );
}

const CardRender = (item, active, color) => (
  <>
    {/* {console.log(item, active, color)} */}
    <Card
      item={item}
      active={active}
      color={color}
    />
  </>
);
export default memo(DynamicMergeFields);
