import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MsgLeftMenuNav from "../../components/common/MsgLeftMenuNav";
import { dmfJsonArr, segmentJsonArr, groupJsonArr } from "./messagesData";
import DynamicMergeFields from "./dmf/DynamicMergeFields";
import MessageSegments from "./segments/MessageSegments";
import MessageGroups from "./groups/MessageGroups";
import { getDmfList, addDmf, updatelocalDmf } from "../../actions/MessageAction";
import { useLocation,useSearchParams } from "react-router-dom";


function Message() {
  //::::This is the parent component of all the massege::::
  const dispatch = useDispatch();
  const queryParamsEdit = new URLSearchParams(window.location.search)
  const [paramsEdit, setParamsEdit] = useSearchParams()
  const messageType = useSelector((state) => state.message.messageType);
  const dmfArrayStored = useSelector((state) => state.message.dmfArray);
  const [dmfAdded, setDmfAdded] = useState(false);
  // const segmentsArrayStored = useSelector((state) => state.message.segmentsArray);
  // const groupsArrayStored = useSelector((state) => state.message.groupArray);
  const [activeMsgTypeObj, setActiveMsgTypeObj] = useState(null);
  const [dmfArray, setDmfArray] = useState(dmfArrayStored);
  // const [segmentArray, setSegmentArray] = useState(segmentsArrayStored);
  // const [groupsArray, setGroupsArray] = useState(groupsArrayStored);

  /**
   * Adding of new DMF
   * passing default value New DMF with payload
   *
   * @returns newly created DMF along with the start of rename
   */

  const DmfAdd = () => {
    let dmfPlaceholder = dmfArray;
        
    const staticNew = {
      "name": "New DMF"
    }
    try {
      dispatch(addDmf(staticNew))
      .unwrap()
      .then((res) => {
        if(res) {
          dmfPlaceholder = [res?.data[0], ...dmfPlaceholder];
          setActiveMsgTypeObj(dmfPlaceholder[0])
          // dispatch(updatelocalDmf(dmfPlaceholder));
          setDmfArray(dmfPlaceholder);
          setDmfAdded(true)
        }
      })
    } catch (error) {
    }
  };
  
  /**
   * Fetching stored dmfs from backend
   *
   * @returns reversed dmf list so that the recently created one is at the beginning
   */
  const fetchDmfs = () => {
    dispatch(getDmfList())
    .unwrap()
    .then((res) => {
      if(res) {
        setDmfArray(res.data.slice().reverse())
        // console.log("res", res.data.slice().reverse());
        if(res?.data?.length > 0){
          setActiveMsgTypeObj(res.data.slice().reverse()[0]);
        }
      }
    })
  }

  /**
   * Calling fetch
   *
   * @returns stored dmf list at page init
   */
  useEffect(()=>{
    fetchDmfs()
  },[])


  /**
   * In any change of locally saved dmf array
   * if active dmf is not there focus on the first dmf
   * if active dmf is there, re-set the active dmf
   *
   * @returns stored dmf list at page init
   */
  useEffect(() => {
    if(activeMsgTypeObj == null) {
      if(dmfArray?.length > 0){
        setActiveMsgTypeObj(dmfArray[0]);
      }
    }
    else {
      let activeObj = dmfArray.filter(el => el._id === activeMsgTypeObj._id)[0]
      setActiveMsgTypeObj(activeObj)
    }
  }, [dmfArray])


  /**
   * Remove dmf and subdmf edit query params from Url
   *
   * @returns 
   */
  const removeQueryParams = () => {
    const dmfParam = queryParamsEdit.get('dmf');

    if (dmfParam) {
      // 👇️ delete each query dmfParam
      paramsEdit.delete('dmf');
      if(queryParamsEdit.get('subdmf')) {
        paramsEdit.delete('subdmf')
      }

      // 👇️ update state after
      setParamsEdit(paramsEdit);
    }
  };

  /**
   * on change / fetching of any query params in url
   * get the queryparams (for edit, link from extension, of dmf and subdmf)
   *
   * @returns
   */
  useEffect(() => {
    if(queryParamsEdit?.get('dmf')){
      setActiveMsgTypeObj(dmfArray.find(el => el._id === queryParamsEdit?.get('dmf')))
      // console.log("activeMsgTypeObj", dmfArray.find(el => el._id === queryParamsEdit?.get('dmf')));

      if(queryParamsEdit.get('subdmf')){
        console.log(":::::::::", queryParamsEdit.get('subdmf'));
      }
    }
  }, [queryParamsEdit])

  return (
    <div
      className="main-content-inner d-flex justifyContent-start main-message"
      style={{ width: "100%" }}
    >
      <div className="message-menu message-menu-left">
        {dmfArray && messageType == "dmf" && (
          <MsgLeftMenuNav
            MsgNavtype={messageType}
            MessageObj={dmfArray}
            setMessageObj={setDmfArray}
            HeaderText={"Dynamic Merge Fields"}
            AddFun={DmfAdd}
            activeObj={activeMsgTypeObj}
            setActiveObj={setActiveMsgTypeObj}
            newDmf={dmfAdded}
            setNewDMfAdded={setDmfAdded}
            QueryEdit={queryParamsEdit}
            RemoveQueryParams={removeQueryParams}
          />
        )}
        {/* {segmentArray && messageType == "segment" && (
          <MsgLeftMenuNav
            MsgNavtype={messageType}
            MessageObj={segmentArray}
            setMessageObj={setSegmentArray}
            HeaderText={"Message Segement"}
            AddFun={SegmentAdd}
            activeObj={segmentArray[0]}
            setActiveObj={setActiveMsgTypeObj}
          />
        )}
        {groupsArray && messageType == "group" && (
          <MsgLeftMenuNav
            MsgNavtype={messageType}
            MessageObj={groupsArray}
            setMessageObj={setGroupsArray}
            HeaderText={"Message Group"}
            AddFun={GroupAdd}
            activeObj={groupsArray[0]}
            setActiveObj={setActiveMsgTypeObj}
          />
        )} */}
      </div>

      {messageType == "dmf" && (
        <DynamicMergeFields 
          MessageObj={activeMsgTypeObj}
          setActiveDmf={setActiveMsgTypeObj}
          setMessageObj={setDmfArray}
          MessageArray={dmfArray}
          QueryEdit={queryParamsEdit}
          RemoveQueryParams={removeQueryParams}
        />
      )}
      {messageType == "segment" && <MessageSegments />}
      {messageType == "group" && <MessageGroups />}
    </div>
  );
}

export default Message;
