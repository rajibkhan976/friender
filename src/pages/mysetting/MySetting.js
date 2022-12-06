/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef, useCallback } from "react";
import DropSelector from "../../components/formComponents/DropSelector";
import Footer from "../../components/common/Footer";
import PageHeader from "../../components/common/PageHeader";
import PageLeftMenuNav from "../../components/common/PageLeftMenuNav";
import Sidebar from "../../components/common/Sidebar";
import Switch from "../../components/formComponents/Switch";
import SettingLoader from "../../components/common/loaders/SettingLoader";
import module from "../Auth/styling/authpages.module.scss";
import Modal from "../../components/common/Modal";
//import { ThrottleFx } from "../../helpers/ThrottleFx";
import {
  fetchProfileSetting,
  saveSettings,
} from "../../services/SettingServices";
import { fetchUserProfile } from "../../services/authentication/facebookData";
// import showMessage from "../../components/common/Alertbox";
import Alertbox from "../../components/common/Toast";
import { useDispatch } from "react-redux";
import { getMySettings, updateMysetting } from "../../actions/MySettingAction";
//import { debounce } from "../../helpers/Dbounce";

function MySetting() {
  const current_fb_id=localStorage.getItem("fr_default_fb")
  const userToken = localStorage.getItem("fr_token");
  const render = useRef(0);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const [settingFetched, setSettingFetched] = useState(false);
  // const [facebookUserId, setFacebookUserId] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [dontSendFrindReqFrnd, setDontSendFrindReqFrnd] = useState(false);
  const [dontSendFrindReqIRejct, setDontSendFrindReqIRejct] = useState(false);
  const [dontSendFrindReqThyRejct, setDontSendFrindReqThyRejct] =
    useState(false);
  const [reFrndng, setReFrndng] = useState(false);
  const [autoCnclFrndRque, setAutoCnclFrndRque] = useState(false);
  const [sndMsgRcvFrndRqu, setSndMsgRcvFrndRqu] = useState(false);
  const [sndMsgAcptFrndRqu, setSndMsgAcptFrndRqu] = useState(false);
  const [sndMsgDlcFrndRqu, setSndMsgDlcFrndRqu] = useState(false);
  const [sndMsgExptFrndRqu, setSndMsgExptFrndRqu] = useState(false);
  const [dayBackAnlyFrndEng, setDayBackAnlyFrndEng] = useState(false);
 
  // useEffect(() => {
  //   setTimeout(() => {
  //    setSettingFetched(true);
  //    setLoading(false);
  //   }, 5000);
  // }, []);
  //token
  
  //period selctor obj
  const periodObj = [
    {
      value: "days",
      label: "Days",
    },
    {
      value: "months",
      label: "Months",
    },
    {
      value: "years",
      label: "Years",
    },
  ];

  //time object

  const timeObj = [
    {
      value: '00:00',
      label: '00:00 AM'
    },
    {
      value: '01:00',
      label: '01:00 AM'
    },
    {
      value: '02:00',
      label: '02:00 AM'
    },
    {
      value: '03:00',
      label: '03:00 AM'
    },
    {
      value: '04:00',
      label: '04:00 AM'
    },
    {
      value: '05:00',
      label: '05:00 AM'
    },
    {
      value: '06:00',
      label: '06:00 AM'
    },
    {
      value: '07:00',
      label: '07:00 AM'
    },
    {
      value: '08:00',
      label: '08:00 AM'
    },
    {
      value: '09:00',
      label: '09:00 AM'
    },
    {
      value: '10:00',
      label: '10:00 AM'
    },
    {
      value: '11:00',
      label: '11:00 AM'
    },
    {
      value: '12:00',
      label: '12:00 PM'
    },
    {
      value: '13:00',
      label: '01:00 PM'
    },
    {
      value: '14:00',
      label: '02:00 PM'
    },
    {
      value: '15:00',
      label: '03:00 PM'
    },
    {
      value: '16:00',
      label: '04:00 PM'
    },
    {
      value: '17:00',
      label: '05:00 PM'
    },
    {
      value: '18:00',
      label: '06:00 PM'
    },
    {
      value: '19:00',
      label: '07:00 PM'
    },
    {
      value: '20:00',
      label: '08:00 PM'
    },
    {
      value: '21:00',
      label: '09:00 PM'
    },
    {
      value: '22:00',
      label: '10:00 PM'
    },
    {
      value: '23:00',
      label: '11:00 PM'
    },
  ];
  //massage template selector object
  const msgTmpltObj = [{ value: 0, label: "Select message" }];
  //massage template selector object end

  //selector states
  const [reFrndSelect1, setReFrndSelect1] = useState(periodObj[0].value);

  const [sndMsgRcvFrndRquSelect, setSndMsgRcvFrndRquSelect] = useState(
    periodObj[0].value
  );
  const [sndMsgAcptFrndRquSelect, setSndMsgAcptFrndRquSelect] = useState(
    periodObj[0].value
  );
  const [sndMsgDlcFrndRquSelect, setSndMsgDlcFrndRquSelect] = useState(
    periodObj[0].value
  );
  const [sndMsgExptFrndRquSelect, setSndMsgExptFrndRquSelect] = useState(
    periodObj[0].value
  );
  const [dayBackAnlyFrndEngSelect1, setDayBackAnlyFrndEngSelect1] = useState(
    periodObj[0].value
  );
  const [dayBackAnlyFrndEngSelect2, setDayBackAnlyFrndEngSelect2] = useState(
    periodObj[0].value
  );

  //inputs box states
  const [reFrndngInput1, setReFrndngInput1] = useState(1);
  const [reFrndngInput2, setReFrndngInput2] = useState(1);
  const [cnclFrndRqueInput, setCnclFrndRqueInput] = useState(1);
  const [sndMsgRcvFrndRquInput, setSndMsgRcvFrndRquInput] = useState(1);
  const [sndMsgAcptFrndRquInput, setSndMsgAcptFrndRquInput] = useState(1);
  const [sndMsgDlcFrndRquInput, setSndMsgDlcFrndRquinput] = useState(1);
  const [sndMsgExptFrndRquInput, setSndMsgExptFrndRquInput] = useState(1);

  //input box states end

  ///massege template select
  const [sndMsgRcvFrndRquMsgSelect, setSndMsgRcvFrndRquMsgSelect] = useState(
    msgTmpltObj[0]
  );
  const [sndMsgAcptFrndRquMsgSelect, setSndMsgAcptFrndRquMsgSelect] = useState(
    msgTmpltObj[0]
  );
  const [sndMsgDlcFrndRquMsgSelect, setSndMsgDlcFrndRquMsgSelect] = useState(
    msgTmpltObj[0]
  );
  const [sndMsgExptFrndRquMsgSelect, setSndMsgExptFrndRquMsgSelect] = useState(
    msgTmpltObj[0]
  );

  //massege template select end
  const saveMySetting = () => {
    const payload = {
      token: userToken,
      dont_send_friend_requests_prople_ive_been_friends_with_before:
        dontSendFrindReqFrnd,
      dont_send_friend_requests_prople_who_send_me_friend_request_i_rejected:
        dontSendFrindReqIRejct,
      dont_send_friend_requests_prople_i_sent_friend_requests_they_rejected:
        dontSendFrindReqThyRejct,
      re_friending: reFrndng,
      automatic_cancel_friend_requests: autoCnclFrndRque,
      send_message_when_receive_new_friend_request: sndMsgRcvFrndRqu,
      send_message_when_accept_new_friend_request: sndMsgAcptFrndRqu,
      send_message_when_decline_friend_request: sndMsgDlcFrndRqu,
      send_message_when_someone_accept_new_friend_request: sndMsgExptFrndRqu,
      day_bak_to_analyse_friend_engagement: dayBackAnlyFrndEng,
    };
    if (current_fb_id) {
      payload.facebookUserId = `${current_fb_id}`;
    }

    //refriending
    if (reFrndng) {
   
      if (
        (reFrndngInput1 &&
        Number(reFrndngInput1) !== 0 )&&
        (reFrndngInput2 &&
        Number(reFrndngInput2) !== 0)
      ) {
        payload.re_friending_settings = {
          remove_pending_friend_request_after: reFrndngInput1
            ? reFrndngInput1
            : 1,
          time_type: reFrndSelect1,
          instantly_resend_friend_request: reFrndngInput2 ? reFrndngInput2 : 1,
          
        };
      } else {
        Alertbox("Input should not be empty or 0", "warning", 1000, "bottom-right");
        return;
      }
    }
    //refriending end
    //cancel_sent_friend_requests_settings
    if (autoCnclFrndRque) {
      if (cnclFrndRqueInput && Number(cnclFrndRqueInput) !== 0) {
        payload.automatic_cancel_friend_requests_settings = {
          remove_after: cnclFrndRqueInput ? cnclFrndRqueInput : 1,
        };
      } else {
        Alertbox("Input should not be empty or 0", "warning", 1000, "bottom-right");
        return;
      }
      // payload.cancel_sent_friend_requests_settings = {
      //   remove_after: cnclFrndRqueInput ? cnclFrndRqueInput : 1,
      //   remove_after_type: cnclFrndRqueSelect1,
      // };
    }
    // cancel_sent_friend_requests_settings end

    //send_message_when_receive_new_friend_request_settings

    if (sndMsgRcvFrndRqu) {
      if (sndMsgRcvFrndRquInput && Number(sndMsgRcvFrndRquInput)!==0) {
        payload.send_message_when_receive_new_friend_request_settings = {
          message_template_id: 1,
          send_message_time: sndMsgRcvFrndRquInput ? sndMsgRcvFrndRquInput : 1,
          send_message_time_type: sndMsgRcvFrndRquSelect,
        };
      } else {
        Alertbox("Input should not be empty or 0", "warning", 1000, "bottom-right");
        return;
      }
    }
    //send_message_when_receive_new_friend_request_settings end
    //send_message_when_accept_new_friend_request_settings

    if (sndMsgAcptFrndRqu) {
      if (sndMsgAcptFrndRquInput && Number(sndMsgAcptFrndRquInput) !== 0) {
        payload.send_message_when_accept_new_friend_request_settings = {
          message_template_id: 1,
          send_message_time: sndMsgAcptFrndRquInput
            ? sndMsgAcptFrndRquInput
            : 1,
          send_message_time_type: sndMsgAcptFrndRquSelect,
        };
      } else {
        Alertbox("Input should not be empty or 0", "warning", 1000, "bottom-right");
        return;
      }
    }
    //send_message_when_accept_new_friend_request_settings end

    //send_message_when_decline_friend_request_settings
    if (sndMsgDlcFrndRqu) {
      if (sndMsgDlcFrndRquInput && Number(sndMsgDlcFrndRquInput) !== 0) {
        payload.send_message_when_decline_friend_request_settings = {
          message_template_id: 1,
          send_message_time: sndMsgDlcFrndRquInput ? sndMsgDlcFrndRquInput : 1,
          send_message_time_type: sndMsgDlcFrndRquSelect,
        };
      } else {
        Alertbox("Input should not be empty or 0", "warning", 1000, "bottom-right");
        return;
      }
      // payload.send_message_when_decline_friend_request_settings = {
      //   message_template_id: 1,
      //   send_message_time: sndMsgDlcFrndRquInput ? sndMsgDlcFrndRquInput : 1,
      //   send_message_time_type: sndMsgDlcFrndRquMsgSelect,
      // };
    }
    //send_message_when_decline_friend_request_settings end
    //
    if (sndMsgExptFrndRqu) {
      if (sndMsgExptFrndRquInput && Number(sndMsgExptFrndRquInput) !== 0) {
        payload.send_message_when_someone_accept_new_friend_request_settings = {
          message_template_id: 1,
          send_message_time: sndMsgExptFrndRquInput
            ? sndMsgExptFrndRquInput
            : 1,
          send_message_time_type: sndMsgExptFrndRquSelect,
        };
      } else {
        Alertbox("Input should not be empty or 0", "warning", 1000, "bottom-right");
        return;
      }
    }
    //
    if (dayBackAnlyFrndEng) {
      payload.day_bak_to_analyse_friend_engagement_settings = {
        from_time: dayBackAnlyFrndEngSelect1,
        to_time: dayBackAnlyFrndEngSelect2,
      };
    }

    //vvi ucomment it

    console.log("i am payload****-----|||||>>>", payload);
    dispatch(updateMysetting(payload))
    saveSettings(payload).then(() => {
      Alertbox("setting saved successfully", "success", 1000, "bottom-right");
    });
  };



  const syncSettings = (data) => {
    console.log("i am the data which creating change in setting**", data);
    if(!data)return;
    if(data.length<0)return;
    setDontSendFrindReqFrnd(
      data.dont_send_friend_requests_prople_ive_been_friends_with_before
    );
    setDontSendFrindReqIRejct(
      data.dont_send_friend_requests_prople_who_send_me_friend_request_i_rejected
    );
    setDontSendFrindReqThyRejct(
      data.dont_send_friend_requests_prople_i_sent_friend_requests_they_rejected
    );
    setReFrndng(data.re_friending);

    if (data.re_friending && data.re_friending_settings) {
      console.log("refriender setting****", data.re_friending_settings[0]);

      setReFrndSelect1(data.re_friending_settings[0].time_type);
    

      setReFrndngInput1(
        data.re_friending_settings[0].remove_pending_friend_request_after
      );

      setReFrndngInput2(data.re_friending_settings[0].instantly_resend_friend_request);
      

    }

    setAutoCnclFrndRque(data.automatic_cancel_friend_requests);
    if (
      data.automatic_cancel_friend_requests &&
      data.automatic_cancel_friend_requests_settings[0]
    ) {
      setCnclFrndRqueInput(
        data.automatic_cancel_friend_requests_settings[0].remove_after
      );
    }

    setSndMsgRcvFrndRqu(data.send_message_when_receive_new_friend_request);
    if (
      data.send_message_when_receive_new_friend_request &&
      data.send_message_when_receive_new_friend_request_settings[0]
    ) {
      setSndMsgRcvFrndRquInput(
        data.send_message_when_receive_new_friend_request_settings[0]
          .send_message_time
      );

      setSndMsgRcvFrndRquSelect(
        data.send_message_when_receive_new_friend_request_settings[0]
          .send_message_time_type
      );


    }
    setSndMsgAcptFrndRqu(data.send_message_when_accept_new_friend_request);
    if (
      data.send_message_when_accept_new_friend_request &&
      data.send_message_when_accept_new_friend_request_settings[0]
    ) {
      setSndMsgAcptFrndRquInput(
        data.send_message_when_accept_new_friend_request_settings[0]
          .send_message_time
      );

      setSndMsgAcptFrndRquSelect(
        data.send_message_when_accept_new_friend_request_settings[0]
          .send_message_time_type
      );


    }

    setSndMsgDlcFrndRqu(data.send_message_when_decline_friend_request);
    if (
      data.send_message_when_decline_friend_request &&
      data.send_message_when_decline_friend_request_settings[0]
    ) {
      setSndMsgDlcFrndRquinput(
        data.send_message_when_decline_friend_request_settings[0]
          .send_message_time
      );
      setSndMsgDlcFrndRquSelect(
        data.send_message_when_decline_friend_request_settings[0]
          .send_message_time_type
      );


    }

    setSndMsgExptFrndRqu(
      data.send_message_when_someone_accept_new_friend_request
    );
    if (
      data.send_message_when_someone_accept_new_friend_request &&
      data.send_message_when_someone_accept_new_friend_request_settings[0]
    ) {
      setSndMsgExptFrndRquInput(
        data.send_message_when_someone_accept_new_friend_request_settings[0]
          .send_message_time
      );
      setSndMsgExptFrndRquSelect(
        data.send_message_when_someone_accept_new_friend_request_settings[0]
          .send_message_time_type
      );

      // periodObj.forEach((item) => {
      //   if (
      //     item.value ===
      //     data.send_message_when_someone_accept_new_friend_request_settings[0]
      //       .send_message_time_type
      //   ) {
      //     setSndMsgExptFrndRquSelect(item);
      //   }
      // });
    }

    setDayBackAnlyFrndEng(data.day_bak_to_analyse_friend_engagement);
    if (
      data.day_bak_to_analyse_friend_engagement &&
      data.day_bak_to_analyse_friend_engagement_settings[0]
    ) {
      setDayBackAnlyFrndEngSelect1(
        data.day_bak_to_analyse_friend_engagement_settings[0].from_time
      );
      setDayBackAnlyFrndEngSelect2(
        data.day_bak_to_analyse_friend_engagement_settings[0].to_time
      );
    }
  };

  useEffect(() => {
   console.log("current fb id creating requesting->>>",current_fb_id);
      dispatch(getMySettings({ token:userToken,fbUserId:`${current_fb_id}`}
    ))
    //update api call with redux
      fetchProfileSetting({
        token: userToken,
        fbUserId: `${current_fb_id}`,
      })
        .then((response) => {
          syncSettings(response.data[0]);

          setSettingFetched(true);
          setLoading(false);

          console.log("my res **", response.data);
        })
        .catch((err) => {
          console.log(err);
        });
  }, []);
 
  //if you want to use the common debounce function jus use it here i have used wth useCallback
 

  useEffect(() => {
    // as we are using react strict mode that why the rendering in happening  two times
    if (render.current <= 3) {
      render.current = render.current + 1;
       //console.log("hiiiiiii",render.current);
    }

    //console.log("hiiiiiii--out",render.current);
     if(render.current>2){
      if (settingFetched) {

        console.log("the setting saving is optimized-._>")

        const handler = setTimeout(() => saveMySetting(),1000)  
        return ()=>clearTimeout(handler);

        // optiMizedSave();
        // setTimeout(() => {
        //   saveMySetting();
        // }, 1000);
      } else {
        return;
      }
    }
  
  }, [
    dontSendFrindReqFrnd,
    dontSendFrindReqIRejct,
    dontSendFrindReqThyRejct,
    reFrndng,
    autoCnclFrndRque,
    sndMsgRcvFrndRqu,
    sndMsgAcptFrndRqu,
    sndMsgDlcFrndRqu,
    sndMsgExptFrndRqu,
    dayBackAnlyFrndEng,
    reFrndSelect1,
    sndMsgRcvFrndRquSelect,
    sndMsgAcptFrndRquSelect,
    sndMsgDlcFrndRquSelect,
    sndMsgExptFrndRquSelect,
    dayBackAnlyFrndEngSelect1,
    dayBackAnlyFrndEngSelect2,
    sndMsgRcvFrndRquMsgSelect,
    sndMsgAcptFrndRquMsgSelect,
    sndMsgDlcFrndRquMsgSelect,
    sndMsgExptFrndRquMsgSelect,
    reFrndngInput1,
    reFrndngInput2,
    cnclFrndRqueInput,
    sndMsgRcvFrndRquInput,
    sndMsgAcptFrndRquInput,
    sndMsgDlcFrndRquInput,
    sndMsgExptFrndRquInput,
  ]);

  const breadlinks = [
    {
      links: "/",
      linkString: "Menu",
    },
    {
      links: "/",
      linkString: "Setting",
    },
    {
      links: "/",
      linkString: "MY Setting",
    },
  ];
  const leftMenu = [
    {
      links: "/",
      linkString: "My Setting",
    },
  ];

  // const renderTimeObj = () => {
  //   timeObj.map((timeVal, i) => 
  //     (timeVal)
  //   )
  // }

  // const toastFun=()=>{
  //   toast("hii")
  // }
  //const optiMizedSave = useCallback(debounce(saveMySetting), []);

  return (
    <div
      className="main-content-inner d-flex justifyContent-start main-mysetting"
      style={{ width: "100%" }}
    >
      <div className="setting-menu">
        <PageLeftMenuNav menus={leftMenu} startMenu={leftMenu[0]} />
      </div>
      <div className="setting-content">
        {settingFetched && (
          <div className="settings paper">
            {/* all setting list with switchs*/}

                  <div className="setting">
                    <Modal
                    headerText={"Unfriend"}
                    bodyText={
                      "8 Friends selected. but 3 Whitelist friend are selected aswell. Are you sure you want to unfriend your friends."
                    }
                    open={modalOpen}
                    setOpen={setModalOpen}
                    ModalFun={() => {
                      console.log("Modal opened");
                    }}
                    btnText={"Yes, Unfriend"}
                  />
                    <div className="setting-child">
                      <Switch
                        checked={dontSendFrindReqFrnd}
                        handleChange={() => {
                          setDontSendFrindReqFrnd(!dontSendFrindReqFrnd);
                          //  alert("hiii")
                          // showMessage("hi something wrong!!!!","red",5000)

                          // Alertbox(
                          //   "hi something wrong",
                          //   "success",
                          //   100000,
                          //   "bottom-right"
                          // );
                          // Alertbox(
                          //   "hi something wrong",
                          //   "warning",
                          //   100000,
                          //   "bottom-right"
                          // );
                          // Alertbox(
                          //   "hi something wrong",
                          //   "error",
                          //   100000,
                          //   "bottom-right"
                          // );
                          //setModalOpen(!modalOpen);
                        }}
                      />
                      Don’t send friend requests to people I’ve been friends
                      with before.
                    </div>
                  </div>
                  <div className="setting">
                    <div className="setting-child">
                      <Switch
                        checked={dontSendFrindReqIRejct}
                        handleChange={() => {
                          setDontSendFrindReqIRejct(!dontSendFrindReqIRejct);
                        }}
                      />{" "}
                      Don’t send friend requests to people who sent me friend
                      requests and I rejected.
                    </div>
                  </div>
                  <div className="setting last-settings">
                    <div className="setting-child">
                      <Switch
                        checked={dontSendFrindReqThyRejct}
                        handleChange={() => {
                          setDontSendFrindReqThyRejct(
                            !dontSendFrindReqThyRejct
                          );
                        }}
                      />
                      Don’t send friend requests to people I sent friend
                      requests and they rejected.
                    </div>
                  </div>

                  {/* Re-Friending */}
                  <div className="setting  paper setting-checked">
                    <div className="setting-child first">
                      <Switch
                        checked={reFrndng}
                        handleChange={() => {
                          setReFrndng(!reFrndng);
                        }}
                      />
                      Re-Friending
                    </div>
                    {reFrndng && (
                      <div className="setting-child others">
                        Remove pending friend request after &nbsp;
                        <input
                          className="setting-input"
                          value={reFrndngInput1}
                          onChange={(e) => {
                            setReFrndngInput1(e.target.value);
                          }}
                        />
                        <DropSelector
                          selects={periodObj}
                          value={reFrndSelect1}
                          style={{}}
                          handleChange={(e) => {
                            setReFrndSelect1(e.target.value);
                          }}
                        />{" "}
                        &nbsp;and then, Instantly resend the friend request. I can set this to  &nbsp;
                        <input
                          className="setting-input"
                          value={reFrndngInput2}
                          onChange={(e) => {
                            setReFrndngInput2(e.target.value);
                          }}
                        />
                        &nbsp;amount of times to Refriend.
                        {/* <Switch
                          checked={reFrndng1}
                          handleChange={() => {
                            setReFrndng1(!reFrndng1);
                          }}
                        /> */}
                      </div>
                    )}
                    {/* {reFrndng1 && (
                      <div className="setting-child others">
                        Resend the friend request after&nbsp;
                        <input
                          className="setting-input"
                          value={reFrndngInput2}
                          onChange={(e) => {
                            setReFrndngInput2(e.target.value);
                          }}
                        />
                        <DropSelector
                          selects={periodObj}
                          value={reFrndSelect2}
                          handleChange={(e) => {
                            console.log(
                              "i am the select target re",
                              e.target.value
                            );
                            setReFrndSelect2(e.target.value);
                          }}
                        />
                      </div>
                    )} */}
                  </div>
                  {/* Re-Friending end */}

                  <div className="setting  paper setting-checked">
                    <div className="setting-child first">
                      <Switch
                        checked={autoCnclFrndRque}
                        handleChange={() => {
                          setAutoCnclFrndRque(!autoCnclFrndRque);
                        }}
                      />
                      Automaticaly Cancel sent friend requests.
                    </div>
                    {autoCnclFrndRque && (
                      <div className="setting-child others">
                        Remove sent friend request after &nbsp;{" "}
                        <input
                          className="setting-input"
                          value={cnclFrndRqueInput}
                          onChange={(e) => {
                            setCnclFrndRqueInput(e.target.value);
                          }}
                        />
                        {/* <DropSelector
                          selects={periodObj}
                          value={cnclFrndRqueSelect1}
                          style={{}}
                          handleChange={(e) => {
                            console.log(
                              "i am the select target",
                              e.target.value
                            );
                            setCnclFrndRqueSelect1(e.target.value);
                          }}
                        /> */}
                        &nbsp;Times.
                      </div>
                    )}
                  </div>
                  <div className="setting  paper setting-checked">
                    <div className="setting-child first">
                      <Switch
                        checked={sndMsgRcvFrndRqu}
                        handleChange={() => {
                          setSndMsgRcvFrndRqu(!sndMsgRcvFrndRqu);
                        }}
                      />
                      Send message when you receive a new friend request from
                      someone.
                    </div>

                    {sndMsgRcvFrndRqu && (
                      <div className="setting-child others">
                        Select the message template you want to send &nbsp;
                        <DropSelector
                          selects={msgTmpltObj}
                          value={sndMsgRcvFrndRquMsgSelect}
                          style={{}}
                          width={"297px"}
                          handleChange={(e) => {
                            setSndMsgRcvFrndRquMsgSelect(e.target.value);
                          }}
                        />
                        &nbsp; and then, &nbsp;{" "}
                        <input
                          className="setting-input"
                          value={sndMsgRcvFrndRquInput}
                          onChange={(e) => {
                            setSndMsgRcvFrndRquInput(e.target.value);
                          }}
                        />
                        <DropSelector
                          selects={periodObj}
                          value={sndMsgRcvFrndRquSelect}
                          style={{}}
                          handleChange={(e) => {
                            setSndMsgRcvFrndRquSelect(e.target.value);
                          }}
                        />
                        &nbsp; the mesage will be sent
                      </div>
                    )}
                  </div>
                  <div className="setting  paper setting-checked">
                    <div className="setting-child first">
                      {" "}
                      <Switch
                        checked={sndMsgAcptFrndRqu}
                        handleChange={() => {
                          setSndMsgAcptFrndRqu(!sndMsgAcptFrndRqu);
                        }}
                      />
                      Send message when you accept a friend request you received
                      from someone.
                    </div>
                    {sndMsgAcptFrndRqu && (
                      <div className="setting-child others">
                        Select the message tempalte you want to send &nbsp;
                        <DropSelector
                          selects={msgTmpltObj}
                          value={sndMsgAcptFrndRquMsgSelect}
                          style={{}}
                          width={"297px"}
                          handleChange={(e) => {
                            setSndMsgAcptFrndRquMsgSelect(e.target.value);
                          }}
                        />{" "}
                        &nbsp; and then, &nbsp;{" "}
                        <input
                          className="setting-input"
                          value={sndMsgAcptFrndRquInput}
                          onChange={(e) => {
                            setSndMsgAcptFrndRquInput(e.target.value);
                          }}
                        />
                        <DropSelector
                          selects={periodObj}
                          value={sndMsgAcptFrndRquSelect}
                          style={{}}
                          handleChange={(e) => {
                            setSndMsgAcptFrndRquSelect(e.target.value);
                          }}
                        />
                        &nbsp; the mesage will be sent
                      </div>
                    )}
                  </div>
                  <div className="setting  paper setting-checked">
                    <div className="setting-child first">
                      <Switch
                        checked={sndMsgDlcFrndRqu}
                        handleChange={() => {
                          setSndMsgDlcFrndRqu(!sndMsgDlcFrndRqu);
                        }}
                      />
                      Send message when you decline a friend request you
                      received from someone.
                    </div>

                    {sndMsgDlcFrndRqu && (
                      <div className="setting-child others">
                        Select the message tempalte you want to send &nbsp;
                        <DropSelector
                          selects={msgTmpltObj}
                          value={sndMsgDlcFrndRquMsgSelect}
                          style={{}}
                          width={"297px"}
                          handleChange={(e) => {
                            setSndMsgDlcFrndRquMsgSelect(e.target.value);
                          }}
                        />{" "}
                        &nbsp; and then, &nbsp;{" "}
                        <input
                          className="setting-input"
                          value={sndMsgDlcFrndRquInput}
                          onChange={(e) => {
                            setSndMsgDlcFrndRquinput(e.target.value);
                          }}
                        />
                        <DropSelector
                          selects={periodObj}
                          value={sndMsgDlcFrndRquSelect}
                          style={{}}
                          handleChange={(e) => {
                            setSndMsgDlcFrndRquSelect(e.target.value);
                          }}
                        />
                        &nbsp; the mesage will be sent
                      </div>
                    )}
                  </div>
                  <div className="setting  paper setting-checked">
                    <div className="setting-child first">
                      <Switch
                        checked={sndMsgExptFrndRqu}
                        handleChange={() => {
                          setSndMsgExptFrndRqu(!sndMsgExptFrndRqu);
                        }}
                      />
                      Send message when someone except my friend request.
                    </div>

                    {sndMsgExptFrndRqu && (
                      <div className="setting-child others">
                        Select the message tempalte you want to send &nbsp;
                        <DropSelector
                          selects={msgTmpltObj}
                          value={sndMsgExptFrndRquMsgSelect}
                          style={{}}
                          width={"297px"}
                          handleChange={(e) => {
                            setSndMsgExptFrndRquMsgSelect(e.target.value);
                          }}
                        />{" "}
                        &nbsp; and then, &nbsp;{" "}
                        <input
                          className="setting-input"
                          value={sndMsgExptFrndRquInput}
                          onChange={(e) => {
                            setSndMsgExptFrndRquInput(e.target.value);
                          }}
                        />
                        <DropSelector
                          selects={periodObj}
                          value={sndMsgExptFrndRquSelect}
                          handleChange={(e) => {
                            setSndMsgExptFrndRquSelect(e.target.value);
                          }}
                        />
                        &nbsp; the mesage will be sent
                      </div>
                    )}
                  </div>
                  <div className="setting  paper setting-checked">
                    <div className="setting-child first">
                      <Switch
                        checked={dayBackAnlyFrndEng}
                        handleChange={() => {
                          setDayBackAnlyFrndEng(!dayBackAnlyFrndEng);
                        }}
                      />
                      Day back to analyse friends engagement
                    </div>
                    {dayBackAnlyFrndEng && (
                      <div className="setting-child others">
                        Select the time you want to sync. From &nbsp;
                        <DropSelector
                          selects={timeObj}
                          value={dayBackAnlyFrndEngSelect1}
                          style={{}}
                          handleChange={(e) => {
                            setDayBackAnlyFrndEngSelect1(e.target.value);
                          }}
                        />{" "}
                        &nbsp; To &nbsp;
                        <DropSelector
                          selects={timeObj}
                          value={dayBackAnlyFrndEngSelect2}
                          style={{}}
                          handleChange={(e) => {
                            setDayBackAnlyFrndEngSelect2(e.target.value);
                          }}
                        />
                      </div>
                    )}
                  </div>

            {/* all setting list with switchs ends*/}
          </div>
        )}
        {loading && <SettingLoader/>}
      </div>
    </div>
  );
}

export default MySetting;
