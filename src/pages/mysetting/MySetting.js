/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import DropSelector from "../../components/formComponents/DropSelector";
import Switch from "../../components/formComponents/Switch";
import SettingLoader from "../../components/common/loaders/SettingLoader";
import Modal from "../../components/common/Modal";
import {
  fetchProfileSetting,
  saveSettings,
} from "../../services/SettingServices";
import Alertbox from "../../components/common/Toast";
import { useDispatch, useSelector } from "react-redux";
import { getMySettings, saveAllSettings, getAllGroupMessages, getGroupById } from "../../actions/MySettingAction";
import {
  ChevronUpArrowIcon,
  ChevronDownArrowIcon,
  OutlinedDeleteIcon,
  DangerIcon,
  RefreshIconLight,
} from '../../assets/icons/Icons';
import NotifyAlert from "../../components/common/NotifyAlert";
import extensionAccesories from "../../configuration/extensionAccesories"
import helper from "../../helpers/helper"
import ToolTipPro from "../../components/common/ToolTipPro"
import Keyword from "../../components/common/Keyword"
import DropSelectMessage from "../../components/messages/DropSelectMessage";
import message from "../message";


const MySetting = () => {
  //:::: This is a child Setting my-setting::::
  const current_fb_id = localStorage.getItem("fr_default_fb");
  //const userToken = localStorage.getItem("fr_token");
  const render = useRef(0);
  const loading = useSelector((state) => state.settings.isLoading)
  const dispatch = useDispatch();
  const [settingFetched, setSettingFetched] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  //states for setting switches
  const [dontSendFrindReqFrnd, setDontSendFrindReqFrnd] = useState(false);
  const [dontSendFrindReqIRejct, setDontSendFrindReqIRejct] = useState(false);
  const [dontSendFrindReqThyRejct, setDontSendFrindReqThyRejct] = useState(false);
  const [reFrndng, setReFrndng] = useState(false);
  const [autoCnclFrndRque, setAutoCnclFrndRque] = useState(null);
  const [sndMsgRcvFrndRqu, setSndMsgRcvFrndRqu] = useState(false);
  const [sndMsgAcptFrndRqu, setSndMsgAcptFrndRqu] = useState(false);
  const [sndMsgDlcFrndRqu, setSndMsgDlcFrndRqu] = useState(false);
  const [dayBackAnlyFrndEng, setDayBackAnlyFrndEng] = useState(false);
  //const [dayBackAnlyFrndEngNEW, setDayBackAnlyFrndEngNEW] = useState(false);
  const [dayBackAnlyFrndEngOpen, setDayBackAnlyFrndEngOpen] = useState(false);
  // const [deletePendingFrnd, setDeletePendingFrnd] = useState(false);
  const [deletePendingFrndOpen, setDeletePendingFrndOpen] = useState(false);
  const [deletePendingFrndValue, setDeletePendingFrndValue] = useState(1);
  const [deletePendingFrndModalOpen, setDeletePendingFrndModalOpen] = useState(false);
  const [deletePendingFrndStartFinding, setDeletePendingFrndStartFinding] = useState(false);
  const [deletePendingFrndError, setDeletePendingFrndError] = useState(false);
  const [frndWillInactiveAfterDays, setFrndInactiveAfterDays] = useState(30);


  // Send message when someone accepts my friend request..
  const [sndMsgExptFrndRquOpen, setsndMsgExptFrndRquOpen] = useState(false);

  const [groupsToSelect, setGroupsToSelect] = useState([]);

  const [sndMsgAcptsFrndReqToggle, setSndMsgAcptsFrndReqToggle] = useState(false);
  const [selectMsgTempAcceptsFrndReq, setSelectMsgTempAcceptsFrndReq] = useState(false);
  const [sndMsgAcptsFrndReqGroupSelect, setSndMsgAcptsFrndReqGroupSelect] = useState(null);
  const [quickMsgAcptsFrndReq, setQuickMsgAcptsFrndReq] = useState(null);
  const [sndMsgAcptsQuickMsgModalOpen, setSndMsgAcptsQuickMsgOpen] = useState(false);
  const [usingSelectOptions, setUsingSelectOptions] = useState(false);

  // Send message when someone reject my friend request..
  const [sndMsgRejtFrndReqOpen, setSndMsgRejtFrndReqOpen] = useState(false);
  const [sndMsgRejtFrndReqToggle, setSndMsgRejtFrndReqToggle] = useState(false);
  const [selectMsgTempRejectFrndReq, setSelectMsgTempRejectFrndReq] = useState(false);
  const [sndMsgRejtFrndReqGroupSelect, setSndMsgRejtFrndReqGroupSelect] = useState(null);
  const [quickMsgRejtFrndReq, setQuickMsgRejtFrndReq] = useState(null);
  const [sndMsgRejtQuickMsgModalOpen, setSndMsgRejtQuickMsgOpen] = useState(false);
  const [usingSelectOptions2, setUsingSelectOptions2] = useState(false);

  // Send message when someone sends me a friend request..
  const [sndMsgSomeoneSndFrndReqToggle, sertSndMsgSomeoneSndFrndReqToggle] = useState(false);
  const [selectMsgSomeoneSndFrndReq, setSelectMsgSomeoneSndFrndReq] = useState(false);
  const [sndMsgSomeoneSndFrndReqGroupSelect, setSndMsgSomeoneSndFrndReqGroupSelect] = useState(null);
  const [quickMsgSomeoneSndFrndReq, setQuickMsgSomeoneSndFrndReq] = useState(null);
  const [sndMsgSomeoneSndFrndReqQuickMsgModalOpen, setSndMsgSomeoneSndFrndReqQuickMsgModalOpen] = useState(false);
  const [usingSelectOptions3, setUsingSelectOptions3] = useState(false);

  // Send message when I reject an incoming friend request..
  const [sndMsgRejtIncomingFrndReqToggle, setSndMsgRejtIncomingFrndReqToggle] = useState(false);
  const [selectMsgRejtIncomingFrndReq, setSelectMsgRejtIncomingFrndReq] = useState(false);
  const [sndMsgRejtIncomingFrndReqGroupSelect, setSndMsgRejtIncomingFrndReqGroupSelect] = useState(null);
  const [quickMsgRejtIncomingFrndReqFrndReq, setQuickMsgRejtIncomingFrndReqFrndReq] = useState(null);
  const [sndMsgRejtIncomingFrndReqQuickMsgModalOpen, setSndMsgRejtIncomingFrndReqQuickMsgModalOpen] = useState(false);
  const [usingSelectOptions4, setUsingSelectOptions4] = useState(false);

  // Send message when I accept an incoming friend request..
  const [sndMsgAcptsIncomingFrndReqToggle, setSndMsgAcptsIncomingFrndReqToggle] = useState(false);
  const [selectMsgAcptsIncomingFrndReq, setSelectMsgAcptsIncomingFrndReq] = useState(false);
  const [sndMsgAcptsIncomingFrndReqGroupSelect, setSndMsgAcptsIncomingFrndReqGroupSelect] = useState(null);
  const [quickMsgAcptsIncomingFrndReqFrndReq, setQuickMsgAcptsIncomingFrndReqFrndReq] = useState(null);
  const [sndMsgAcptsIncomingFrndReqQuickMsgModalOpen, setSndMsgAcptsIncomingFrndReqQuickMsgModalOpen] = useState(false);
  const [usingSelectOptions5, setUsingSelectOptions5] = useState(false);

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
  //
  const dayObj = [
    {
      value: "15",
      label: "15 min",
    },
    {
      value: "30",
      label: "30 min",
    },
    {
      value: "45",
      label: "45 min",
    },
    {
      value: "60",
      label: "1 hr",
    },
    {
      value: "120",
      label: "2 hr",
    },
    {
      value: "180",
      label: "3 hr",
    },
  ];

  //time object

  const timeObj = [
    {
      value: "00:00",
      label: "00:00 AM",
    },
    {
      value: "01:00",
      label: "01:00 AM",
    },
    {
      value: "02:00",
      label: "02:00 AM",
    },
    {
      value: "03:00",
      label: "03:00 AM",
    },
    {
      value: "04:00",
      label: "04:00 AM",
    },
    {
      value: "05:00",
      label: "05:00 AM",
    },
    {
      value: "06:00",
      label: "06:00 AM",
    },
    {
      value: "07:00",
      label: "07:00 AM",
    },
    {
      value: "08:00",
      label: "08:00 AM",
    },
    {
      value: "09:00",
      label: "09:00 AM",
    },
    {
      value: "10:00",
      label: "10:00 AM",
    },
    {
      value: "11:00",
      label: "11:00 AM",
    },
    {
      value: "12:00",
      label: "12:00 PM",
    },
    {
      value: "13:00",
      label: "01:00 PM",
    },
    {
      value: "14:00",
      label: "02:00 PM",
    },
    {
      value: "15:00",
      label: "03:00 PM",
    },
    {
      value: "16:00",
      label: "04:00 PM",
    },
    {
      value: "17:00",
      label: "05:00 PM",
    },
    {
      value: "18:00",
      label: "06:00 PM",
    },
    {
      value: "19:00",
      label: "07:00 PM",
    },
    {
      value: "20:00",
      label: "08:00 PM",
    },
    {
      value: "21:00",
      label: "09:00 PM",
    },
    {
      value: "22:00",
      label: "10:00 PM",
    },
    {
      value: "23:00",
      label: "11:00 PM",
    },
    {
      value: "24:00",
      label: "00:00 AM",
    },
  ];
  //massage template selector object
  const msgTmpltObj = [{ value: 0, label: "Select message" }];
  //massage template selector object end

  const [sndMsgRcvFrndRquSelect, setSndMsgRcvFrndRquSelect] = useState(
    periodObj[0].value
  );
  const [sndMsgAcptFrndRquSelect, setSndMsgAcptFrndRquSelect] = useState(
    periodObj[0].value
  );
  const [sndMsgDlcFrndRquSelect, setSndMsgDlcFrndRquSelect] = useState(
    periodObj[0].value
  );
  const [sndMsgExptFrndRquOpenSelect, setsndMsgExptFrndRquOpenSelect] = useState(
    periodObj[0].value
  );
  const [dayBackAnlyFrndEngSelect1, setDayBackAnlyFrndEngSelect1] = useState(
    timeObj[0].value
  );
  const [dayBackAnlyFrndEngSelect2, setDayBackAnlyFrndEngSelect2] = useState(
    timeObj[1].value
  );

  const [dayBackAnlyFrndEngSelect1NEW, setDayBackAnlyFrndEngSelect1NEW] =
    useState(dayObj[0].value);


  //selector states
  const [reFrndSelect1, setReFrndSelect1] = useState(() => {
    const storedData = localStorage.getItem('fr_refriending_data');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      return parsedData.reFrndngSelect || 1;
    }
    return 1;
  });
  //inputs box states
  const [reFrndngInput1, setReFrndngInput1] = useState(() => {
    const storedData = localStorage.getItem('fr_refriending_data');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      return parsedData.reFrndngInput || 1;
    }
    return 1;
  });
  const [reFrndngInput2, setReFrndngInput2] = useState();
  const [reFrndngKeywords, setFrndngKeywords] = useState(() => {
    const storedData = localStorage.getItem('fr_refriending_data');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const FBIdFromAPI = current_fb_id;
      const FBIdFromBrowser = parsedData?.current_fb_id;

      if (FBIdFromAPI !== FBIdFromBrowser) {
        return '';
      }

      return parsedData.keywords || '';
    }
    return '';
  });
  const [cnclFrndRqueInput, setCnclFrndRqueInput] = useState(1);
  const [sndMsgRcvFrndRquInput, setSndMsgRcvFrndRquInput] = useState(1);
  const [sndMsgAcptFrndRquInput, setSndMsgAcptFrndRquInput] = useState(1);
  const [sndMsgDlcFrndRquInput, setSndMsgDlcFrndRquinput] = useState(1);
  const [sndMsgExptFrndRquOpenInput, setsndMsgExptFrndRquOpenInput] = useState(1);

  // console.log('reFrndngKeywords -- ', reFrndngKeywords);

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
  const [sndMsgExptFrndRquOpenMsgSelect, setsndMsgExptFrndRquOpenMsgSelect] = useState(
    msgTmpltObj[0]
  );
  const [refrienderingOpen, setRefrienderingOpen] = useState(false);

  //Refrendering obj
  const noOfRefrendering = [
    {
      value: 1,
      label: "1",
    },
    {
      value: 2,
      label: "2",
    },
    {
      value: 3,
      label: "3",
    },
  ];
  const [reFriendSaveActive, setReFriendSaveActive] = useState(null);
  const [reFriendOpenKeywords, setReFriendOpenKeywords] = useState(false);

  /**
   * ===== Auto-Saving the Settings with any toggle or button pressed ======
   */
  useEffect(() => {
    //setLoading(true)
    // console.log("after", render.current)
    if (render.current > 1) {
      if (settingFetched) {
        //console.log("the setting saving is optimized-._>");
        const handler = setTimeout(() => saveMySetting(), 1000);
        //setLoading(false)
        return () => clearTimeout(handler);
        /* ::::Never delete the Comment::::
        optiMizedSave();
        setTimeout(() => {
          saveMySetting();
        }, 1000);*/
      } else {
        return;
      }
    }
    if (render.current <= 5) {
      render.current = render.current + 1;
    }

  }, [
    settingFetched,
    dontSendFrindReqFrnd,
    dontSendFrindReqIRejct,
    dontSendFrindReqThyRejct,
    reFrndng,
    reFrndngInput1,
    reFrndSelect1,
    reFriendOpenKeywords,
    autoCnclFrndRque,
    sndMsgRcvFrndRqu,
    sndMsgAcptFrndRqu,
    sndMsgDlcFrndRqu,
    sndMsgExptFrndRquOpen,
    dayBackAnlyFrndEng,
    sndMsgRcvFrndRquSelect,
    sndMsgAcptFrndRquSelect,
    sndMsgDlcFrndRquSelect,
    sndMsgExptFrndRquOpenSelect,
    dayBackAnlyFrndEngSelect1,
    dayBackAnlyFrndEngSelect2,
    sndMsgRcvFrndRquMsgSelect,
    sndMsgAcptFrndRquMsgSelect,
    sndMsgDlcFrndRquMsgSelect,
    sndMsgExptFrndRquOpenMsgSelect,
    reFrndngInput2,
    cnclFrndRqueInput,
    sndMsgRcvFrndRquInput,
    sndMsgAcptFrndRquInput,
    sndMsgDlcFrndRquInput,
    sndMsgExptFrndRquOpenInput,
    frndWillInactiveAfterDays,
    sndMsgAcptsFrndReqToggle,
    sndMsgRejtFrndReqToggle,
    quickMsgAcptsFrndReq,
    quickMsgRejtFrndReq,
    sndMsgSomeoneSndFrndReqToggle,
    sndMsgRejtIncomingFrndReqToggle,
    sndMsgAcptsIncomingFrndReqToggle,
    quickMsgSomeoneSndFrndReq,
    quickMsgRejtIncomingFrndReqFrndReq,
    quickMsgAcptsIncomingFrndReqFrndReq,
  ]);


  useEffect(() => {
    const isDeleting = helper.getCookie("deleteAllPendingFR");

    if (localStorage.getItem("fr_delete_id") === localStorage.getItem("fr_default_fb")) {
      if (isDeleting && isDeleting === "Done") {
        setDeletePendingFrndStartFinding(false);
        localStorage.removeItem("fr_delete_id");
        helper.deleteCookie("deleteAllPendingFR");

      } else if (isDeleting && isDeleting === "Active") {
        setDeletePendingFrndStartFinding(true);
        checkDeletePFRProgress();

      } else {
        setDeletePendingFrndStartFinding(false);
        localStorage.removeItem("fr_delete_id");
      }
    }

    dispatch(getMySettings({ fbUserId: `${current_fb_id}` })).unwrap().then((res) => {
      syncSettings(res.data[0]);
      //console.log("setting res", res);
      setSettingFetched(true);
      // setLoading(false);

      // Storing las engage date for later use
      if (!localStorage.getItem('fr_inactive_after') || localStorage.getItem('fr_inactive_after') == "undefined") {
        localStorage.setItem('fr_inactive_after', res?.data[0]?.friends_willbe_inactive_after);
      }
    }).catch((err) => {

      Alertbox(`${err.message} `, "error", 3000, "bottom-right");
    });

    // Fetching All Group Messages.
    dispatch(getAllGroupMessages()).unwrap().then((res) => {
      const data = res?.data;
      if (data && data.length) {
        setGroupsToSelect(data);
      }
    }).catch((error) => console.log("Error when try to fetching all groups -- ", error));

    //update api call with redux
    // fetchProfileSetting({
    //   fbUserId: `${current_fb_id}`,
    // })
    //   .then((response) => {
    //     syncSettings(response.data[0]);

    //     setSettingFetched(true);
    //     setLoading(false);

    //     // console.log("my res **", response.data[0]);
    //   })
    //   .catch((err) => {
    //     //console.log(err);
    //   });
  }, []);


  /**
   * Make Child Toggle Turn Off when parent settings Toggle is Turned Off.
   */
  useEffect(() => {
    if (reFrndng === false) {
      setReFriendOpenKeywords(false);
    }
  }, [reFrndng]);

  // console.log('refrnding -- ', reFrndng);


  /**
   * ==== When User Changed The Account Then Keywords with Different Useer will be Update =====
   */
  useEffect(() => {
    // Fetching the API Setting here.
    dispatch(getMySettings({ fbUserId: `${current_fb_id}` })).unwrap().then((res) => {
      const responseData = res?.data[0];
      const responsedAPIReFrndingKeywords = responseData?.re_friending_settings[0]?.keywords;
      const fbUserIdFromAPI = current_fb_id;
      const fbUserIdFromBrowser = JSON.parse(localStorage.getItem('fr_refriending_data'))?.current_fb_id;

      // console.log("------- ReFriending =---------- ", reFrndngKeywords);
      // console.log("Fetch API data -- ", responsedAPIReFrndingKeywords);
      // console.log("IDDDD -- ", fbUserIdFromAPI, fbUserIdFromBrowser);

      if (fbUserIdFromAPI !== fbUserIdFromBrowser) {
        // console.log(" C H A N G E D");
        const existingStorageData = JSON.parse(localStorage.getItem('fr_refriending_data') || '{}');
        existingStorageData.keywords = responsedAPIReFrndingKeywords;
        localStorage.setItem('fr_refriending_data', JSON.stringify(existingStorageData));
      }

    }).catch((err) => {
      Alertbox(`${err.message} `, "error", 3000, "bottom-right");
    });

  }, []);

  /**
   * ====== Setting API Payload Saving Function =======
   * @returns
   */
  const saveMySetting = (withSaveButton = false) => {
    const payload = {
      // token: userToken,
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
      day_bak_to_analyse_friend_engagement: dayBackAnlyFrndEng,
      automatic_cancel_friend_requests_settings: {
        remove_after: cnclFrndRqueInput
      },
      friends_willbe_inactive_after: Number(frndWillInactiveAfterDays),

      send_message_when_someone_accept_new_friend_request: sndMsgAcptsFrndReqToggle,
      send_message_when_someone_accept_new_friend_request_settings: {
        message_group_id: sndMsgAcptsFrndReqGroupSelect?._id || null,
        quick_message: quickMsgAcptsFrndReq || null,
      },
      send_message_when_reject_friend_request: sndMsgRejtFrndReqToggle,
      send_message_when_reject_friend_request_settings: {
        message_group_id: sndMsgRejtFrndReqGroupSelect?._id || null,
        quick_message: quickMsgRejtFrndReq || null,
      },

      //.. New Payload..
      send_message_when_someone_sends_me_friend_request: sndMsgSomeoneSndFrndReqToggle,
      send_message_when_someone_sends_me_friend_request_settings: {
        message_group_id: sndMsgSomeoneSndFrndReqGroupSelect?._id || null,
        quick_message: quickMsgSomeoneSndFrndReq || null,
      },

      send_message_when_reject_incoming_friend_request: sndMsgRejtIncomingFrndReqToggle,
      send_message_when_reject_incoming_friend_request_settings: {
        message_group_id: sndMsgRejtIncomingFrndReqGroupSelect?._id || null,
        quick_message: quickMsgRejtIncomingFrndReqFrndReq || null,
      },

      send_message_when_accept_incoming_friend_request: sndMsgAcptsIncomingFrndReqToggle,
      send_message_when_accept_incoming_friend_request_settings: {
        message_group_id: sndMsgAcptsIncomingFrndReqGroupSelect?._id || null,
        quick_message: quickMsgAcptsIncomingFrndReqFrndReq || null,
      },
    }

    /**
     * "send_message_when_reject_friend_request": false,
     *   "send_message_when_reject_friend_request_settings": {
     *     "message_group_id": "64e73170787a194bbcb72d66",
     *     "quick_message": ""
     *   },
     *   "send_message_when_someone_accept_new_friend_request": false,
     *   "send_message_when_someone_accept_new_friend_request_settings": {
     *     "message_group_id": "",
     *     "quick_message": "Just a quick text....."
     *   },
     */

    if (current_fb_id) {
      payload.facebookUserId = `${current_fb_id}`;
    }

    //refriending
    if (reFrndng) {
      if (reFrndngInput1 && Number(reFrndngInput1) !== 0 && reFrndSelect1 && Number(reFrndSelect1) !== 0) {
        payload.re_friending_settings = {
          remove_pending_friend_request_after: reFrndngInput1 ? reFrndngInput1 : 1,
          instantly_resend_friend_request: reFrndSelect1 ? reFrndSelect1 : 1,
          use_keyword: reFriendOpenKeywords,
          keywords: localStorage.getItem('fr_refriending_data') && JSON.parse(localStorage.getItem('fr_refriending_data') || '')?.keywords,
        };

        if (withSaveButton) {
          payload.re_friending_settings = {
            ...payload.re_friending_settings,
            keywords: reFrndngKeywords,
          };
        }

      } else {
        setReFrndngInput1(1);
        return;
      }
    }

    if (!reFrndng) {
      payload.re_friending_settings = {
        remove_pending_friend_request_after: reFrndngInput1 ? reFrndngInput1 : 1,
        instantly_resend_friend_request: reFrndSelect1 ? reFrndSelect1 : 1,
        use_keyword: reFriendOpenKeywords,
        keywords: localStorage.getItem('fr_refriending_data') && JSON.parse(localStorage.getItem('fr_refriending_data') || '')?.keywords,
      };

      if (withSaveButton) {
        payload.re_friending_settings = {
          ...payload.re_friending_settings,
          keywords: reFrndngKeywords,
        };
      }
    }
    //refriending end

    // friend will inactive after days.
    if (Number(frndWillInactiveAfterDays) < 1) {
      setFrndInactiveAfterDays(1);
      payload.friends_willbe_inactive_after = 1;
    }

    //cancel_sent_friend_requests_settings
    if (autoCnclFrndRque) {
      if (cnclFrndRqueInput && Number(cnclFrndRqueInput) !== 0) {
        payload.automatic_cancel_friend_requests_settings = {
          remove_after: cnclFrndRqueInput ? cnclFrndRqueInput : 1,
        };
        setDeletePendingFrndValue(cnclFrndRqueInput ? cnclFrndRqueInput : 1)
      } else {
        // Alertbox(
        //   "Input should not be empty or 0",
        //   "warning",
        //   1000,
        //   "bottom-right"
        // );
        setCnclFrndRqueInput(1);
        return;
      }
      // payload.cancel_sent_friend_requests_settings = {
      //   remove_after: cnclFrndRqueInput ? cnclFrndRqueInput : 1,
      //   remove_after_type: cnclFrndRqueSelect1,
      // };
    }
    if (!autoCnclFrndRque) {
      if (cnclFrndRqueInput && Number(cnclFrndRqueInput) !== 0) {
        payload.automatic_cancel_friend_requests_settings = {
          remove_after: cnclFrndRqueInput ? cnclFrndRqueInput : 1,
        };
        setDeletePendingFrndValue(cnclFrndRqueInput ? cnclFrndRqueInput : 1)
      }
    }
    // cancel_sent_friend_requests_settings end

    //send_message_when_receive_new_friend_request_settings

    // if (sndMsgRcvFrndRqu) {
    //   if (sndMsgRcvFrndRquInput && Number(sndMsgRcvFrndRquInput) !== 0) {
    //     payload.send_message_when_receive_new_friend_request_settings = {
    //       message_template_id: 1,
    //       send_message_time: sndMsgRcvFrndRquInput ? sndMsgRcvFrndRquInput : 1,
    //       send_message_time_type: sndMsgRcvFrndRquSelect,
    //     };
    //   } else {
    //     Alertbox(
    //       "Input should not be empty or 0",
    //       "warning",
    //       1000,
    //       "bottom-right"
    //     );
    //     return;
    //   }
    // }
    //send_message_when_receive_new_friend_request_settings end
    //send_message_when_accept_new_friend_request_settings

    // if (sndMsgAcptFrndRqu) {
    //   if (sndMsgAcptFrndRquInput && Number(sndMsgAcptFrndRquInput) !== 0) {
    //     payload.send_message_when_accept_new_friend_request_settings = {
    //       message_template_id: 1,
    //       send_message_time: sndMsgAcptFrndRquInput
    //         ? sndMsgAcptFrndRquInput
    //         : 1,
    //       send_message_time_type: sndMsgAcptFrndRquSelect,
    //     };
    //   } else {
    //     Alertbox(
    //       "Input should not be empty or 0",
    //       "warning",
    //       1000,
    //       "bottom-right"
    //     );
    //     return;
    //   }
    // }
    //send_message_when_accept_new_friend_request_settings end

    //send_message_when_decline_friend_request_settings
    // if (sndMsgDlcFrndRqu) {
    //   if (sndMsgDlcFrndRquInput && Number(sndMsgDlcFrndRquInput) !== 0) {
    //     payload.send_message_when_decline_friend_request_settings = {
    //       message_template_id: 1,
    //       send_message_time: sndMsgDlcFrndRquInput ? sndMsgDlcFrndRquInput : 1,
    //       send_message_time_type: sndMsgDlcFrndRquSelect,
    //     };
    //   } else {
    //     Alertbox(
    //       "Input should not be empty or 0",
    //       "warning",
    //       1000,
    //       "bottom-right"
    //     );
    //     return;
    //   }
    // }

    //send_message_when_decline_friend_request_settings end
    // if (sndMsgExptFrndRquOpen) {
    //   if (sndMsgExptFrndRquOpenInput && Number(sndMsgExptFrndRquOpenInput) !== 0) {
    //     payload.send_message_when_someone_accept_new_friend_request_settings = {
    //       message_template_id: 1,
    //       send_message_time: sndMsgExptFrndRquOpenInput
    //         ? sndMsgExptFrndRquOpenInput
    //         : 1,
    //       send_message_time_type: sndMsgExptFrndRquOpenSelect,
    //     };
    //   } else {
    //     Alertbox(
    //       "Input should not be empty or 0",
    //       "warning",
    //       1000,
    //       "bottom-right"
    //     );
    //     return;
    //   }
    // }

    // Saving the Interval for auto sync friend list...
    if (dayBackAnlyFrndEng) {
      payload.day_bak_to_analyse_friend_engagement_settings = {
        from_time: dayBackAnlyFrndEngSelect1,
        to_time: dayBackAnlyFrndEngSelect2,
      };
    } else {
      payload.day_bak_to_analyse_friend_engagement_settings = {
        from_time: dayBackAnlyFrndEngSelect1,
        to_time: dayBackAnlyFrndEngSelect2,
      };
    }

    // Send Message When Someone Accepts My Friend Requests.
    if (sndMsgAcptsFrndReqToggle) {
      if (usingSelectOptions) {
        // console.log("OLD MESSAGE GROUP ID -- ", localStorage.getItem("old_message_group_id"));
        payload.send_message_when_someone_accept_new_friend_request_settings = {
          message_group_id: sndMsgAcptsFrndReqGroupSelect?._id,
          quick_message: null,
          old_message_group_id: sndMsgAcptsFrndReqGroupSelect?._id !== localStorage.getItem("old_message_group_id") ? localStorage.getItem("old_message_group_id") : null || "",
        }
        setUsingSelectOptions(false);
      }

      if (quickMsgAcptsFrndReq && !usingSelectOptions) {
        payload.send_message_when_someone_accept_new_friend_request_settings = {
          message_group_id: null,
          quick_message: quickMsgAcptsFrndReq,
          old_message_group_id: localStorage.getItem("old_message_group_id") || "",
        }
      }
    } else {
      if (usingSelectOptions) {
        payload.send_message_when_someone_accept_new_friend_request_settings = {
          message_group_id: sndMsgAcptsFrndReqGroupSelect?._id,
          quick_message: null,
          old_message_group_id: sndMsgAcptsFrndReqGroupSelect?._id !== localStorage.getItem("old_message_group_id") ? localStorage.getItem("old_message_group_id") : null || "",
        }
        setUsingSelectOptions(false);
      }

      if (quickMsgAcptsFrndReq && !usingSelectOptions) {
        payload.send_message_when_someone_accept_new_friend_request_settings = {
          message_group_id: null,
          quick_message: quickMsgAcptsFrndReq,
          old_message_group_id: localStorage.getItem("old_message_group_id") || "",
        }
      }
    }

    // Send Message When someone Rejects My Friend Requests.
    if (sndMsgRejtFrndReqToggle) {
      if (usingSelectOptions2) {
        payload.send_message_when_reject_friend_request_settings = {
          message_group_id: sndMsgRejtFrndReqGroupSelect?._id,
          quick_message: null,
          old_message_group_id: sndMsgRejtFrndReqGroupSelect?._id !== localStorage.getItem("old_message_group_id") ? localStorage.getItem("old_message_group_id") : null || "",
        }
        setUsingSelectOptions2(false);
      }

      if (quickMsgRejtFrndReq && !usingSelectOptions2) {
        payload.send_message_when_reject_friend_request_settings = {
          message_group_id: null,
          quick_message: quickMsgRejtFrndReq,
          old_message_group_id: localStorage.getItem("old_message_group_id") || "",
        };
      }

    } else {
      if (usingSelectOptions2) {
        payload.send_message_when_reject_friend_request_settings = {
          message_group_id: sndMsgRejtFrndReqGroupSelect?._id,
          quick_message: null,
          old_message_group_id: sndMsgRejtFrndReqGroupSelect?._id !== localStorage.getItem("old_message_group_id") ? localStorage.getItem("old_message_group_id") : null || "",
        }
        setUsingSelectOptions2(false);
      }

      if (quickMsgRejtFrndReq && !usingSelectOptions2) {
        payload.send_message_when_reject_friend_request_settings = {
          message_group_id: null,
          quick_message: quickMsgRejtFrndReq,
          old_message_group_id: localStorage.getItem("old_message_group_id") || "",
        };
      }
    }

    // Send message when someone sends me a friend request..
    if (sndMsgSomeoneSndFrndReqToggle) {
      if (usingSelectOptions3) {
        payload.send_message_when_someone_sends_me_friend_request_settings = {
          message_group_id: sndMsgSomeoneSndFrndReqGroupSelect?._id,
          quick_message: null,
          old_message_group_id: sndMsgSomeoneSndFrndReqGroupSelect?._id !== localStorage.getItem("old_message_group_id") ? localStorage.getItem("old_message_group_id") : null || "",
        }
        setUsingSelectOptions3(false);
      }

      if (quickMsgSomeoneSndFrndReq && !usingSelectOptions3) {
        payload.send_message_when_someone_sends_me_friend_request_settings = {
          message_group_id: null,
          quick_message: quickMsgSomeoneSndFrndReq,
          old_message_group_id: localStorage.getItem("old_message_group_id") || "",
        };
      }

    } else {
      if (usingSelectOptions3) {
        payload.send_message_when_someone_sends_me_friend_request_settings = {
          message_group_id: sndMsgSomeoneSndFrndReqGroupSelect?._id,
          quick_message: null,
          old_message_group_id: sndMsgSomeoneSndFrndReqGroupSelect?._id !== localStorage.getItem("old_message_group_id") ? localStorage.getItem("old_message_group_id") : null || "",
        }
        setUsingSelectOptions3(false);
      }

      if (quickMsgSomeoneSndFrndReq && !usingSelectOptions3) {
        payload.send_message_when_someone_sends_me_friend_request_settings = {
          message_group_id: null,
          quick_message: quickMsgSomeoneSndFrndReq,
          old_message_group_id: localStorage.getItem("old_message_group_id") || "",
        };
      }
    }

    // Send message when I reject an incoming friend request..
    if (sndMsgRejtIncomingFrndReqToggle) {
      if (usingSelectOptions4) {
        payload.send_message_when_reject_incoming_friend_request_settings = {
          message_group_id: sndMsgRejtIncomingFrndReqGroupSelect?._id,
          quick_message: null,
          old_message_group_id: sndMsgRejtIncomingFrndReqGroupSelect?._id !== localStorage.getItem("old_message_group_id") ? localStorage.getItem("old_message_group_id") : null || "",
        }
        setUsingSelectOptions4(false);
      }

      if (quickMsgRejtIncomingFrndReqFrndReq && !usingSelectOptions4) {
        payload.send_message_when_reject_incoming_friend_request_settings = {
          message_group_id: null,
          quick_message: quickMsgRejtIncomingFrndReqFrndReq,
          old_message_group_id: localStorage.getItem("old_message_group_id") || "",
        };
      }

    } else {
      if (usingSelectOptions4) {
        payload.send_message_when_reject_incoming_friend_request_settings = {
          message_group_id: sndMsgRejtIncomingFrndReqGroupSelect?._id,
          quick_message: null,
          old_message_group_id: sndMsgRejtIncomingFrndReqGroupSelect?._id !== localStorage.getItem("old_message_group_id") ? localStorage.getItem("old_message_group_id") : null || "",
        }
        setUsingSelectOptions4(false);
      }

      if (quickMsgRejtIncomingFrndReqFrndReq && !usingSelectOptions4) {
        payload.send_message_when_reject_incoming_friend_request_settings = {
          message_group_id: null,
          quick_message: quickMsgRejtIncomingFrndReqFrndReq,
          old_message_group_id: localStorage.getItem("old_message_group_id") || "",
        };
      }
    }

    // Send message when I accept an incoming friend request..
    if (sndMsgAcptsIncomingFrndReqToggle) {
      if (usingSelectOptions5) {
        payload.send_message_when_accept_incoming_friend_request_settings = {
          message_group_id: sndMsgAcptsIncomingFrndReqGroupSelect?._id,
          quick_message: null,
          old_message_group_id: sndMsgAcptsIncomingFrndReqGroupSelect?._id !== localStorage.getItem("old_message_group_id") ? localStorage.getItem("old_message_group_id") : null || "",
        }
        setUsingSelectOptions5(false);
      }

      if (quickMsgAcptsIncomingFrndReqFrndReq && !usingSelectOptions5) {
        payload.send_message_when_accept_incoming_friend_request_settings = {
          message_group_id: null,
          quick_message: quickMsgAcptsIncomingFrndReqFrndReq,
          old_message_group_id: localStorage.getItem("old_message_group_id") || "",
        };
      }

    } else {
      if (usingSelectOptions5) {
        payload.send_message_when_accept_incoming_friend_request_settings = {
          message_group_id: sndMsgAcptsIncomingFrndReqGroupSelect?._id,
          quick_message: null,
          old_message_group_id: sndMsgAcptsIncomingFrndReqGroupSelect?._id !== localStorage.getItem("old_message_group_id") ? localStorage.getItem("old_message_group_id") : null || "",
        }
        setUsingSelectOptions5(false);
      }

      if (quickMsgAcptsIncomingFrndReqFrndReq && !usingSelectOptions5) {
        payload.send_message_when_accept_incoming_friend_request_settings = {
          message_group_id: null,
          quick_message: quickMsgAcptsIncomingFrndReqFrndReq,
          old_message_group_id: localStorage.getItem("old_message_group_id") || "",
        };
      }
    }


    // console.log("Saving to API OUTSITE -- ", sndMsgAcptsFrndReqGroupSelect);
    // payload.send_message_when_someone_accept_new_friend_request_settings = {
    //   message_group_id: sndMsgAcptsFrndReqGroupSelect[0]?._id,
    //   quick_message: "",
    // };


    /**
     * dispatching the save mysetting action/////
     */
    dispatch(saveAllSettings(payload)).unwrap().then(() => {
      Alertbox("setting updated successfully", "success", 3000, "bottom-right");
      // if (render.current > 2 && !forceSave) {
      //   Alertbox("setting saved successfully", "success", 3000, "bottom-right");
      // }

      // if (forceSave && render.current > 1) {
      //   Alertbox("settings updated successfully", "success", 1000, "bottom-right");
      // }
    }).catch((err) => {
      Alertbox(`${err.message} `, "error", 3000, "bottom-right");
    });
  };


  /**
   * ===== Syncing API Setting Data Fetching to set with Saved Data ====
   * @param {*} data
   * @returns
   */
  const syncSettings = (data) => {
    // console.log("i am the data which creating change in setting**", data);
    if (!data) return;
    if (data.length < 0) return;
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

    if (data?.re_friending_settings) {
      // console.log("refriender setting****", data.re_friending_settings[0]);
      setReFrndngInput1(
        data.re_friending_settings[0].remove_pending_friend_request_after
      );
      setReFrndSelect1(data.re_friending_settings[0].instantly_resend_friend_request);

      // Adding the keywords..
      setFrndngKeywords(data.re_friending_settings[0].keywords);
      setReFriendOpenKeywords(data.re_friending_settings[0].use_keyword);
    }

    setAutoCnclFrndRque(data.automatic_cancel_friend_requests);
    if (
      data?.automatic_cancel_friend_requests_settings.length > 0
    ) {
      //console.log('data', data.automatic_cancel_friend_requests_settings[0].remove_after);
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

    setsndMsgExptFrndRquOpen(
      data.send_message_when_someone_accept_new_friend_request
    );
    if (
      data.send_message_when_someone_accept_new_friend_request &&
      data.send_message_when_someone_accept_new_friend_request_settings[0]
    ) {
      setsndMsgExptFrndRquOpenInput(
        data.send_message_when_someone_accept_new_friend_request_settings[0]
          .send_message_time
      );
      setsndMsgExptFrndRquOpenSelect(
        data.send_message_when_someone_accept_new_friend_request_settings[0]
          .send_message_time_type
      );

      // !!!! Never Delete the comment!!!!
      // periodObj.forEach((item) => {
      //   if (
      //     item.value ===
      //     data.send_message_when_someone_accept_new_friend_request_settings[0]
      //       .send_message_time_type
      //   ) {
      //     setsndMsgExptFrndRquOpenSelect(item);
      //   }
      // });
    }

    setDayBackAnlyFrndEng(data.day_bak_to_analyse_friend_engagement);

    if (data?.day_bak_to_analyse_friend_engagement_settings.length) {
      setDayBackAnlyFrndEngSelect1(
        data.day_bak_to_analyse_friend_engagement_settings[0].from_time
      );
      setDayBackAnlyFrndEngSelect2(
        data.day_bak_to_analyse_friend_engagement_settings[0].to_time
      );
    }

    // Friends Will Inactive After Days Sync Data.
    setFrndInactiveAfterDays(data?.friends_willbe_inactive_after ?? 30);

    // Send Message when someone accepts my friend request (SYNC-DATA).
    setSndMsgAcptsFrndReqToggle(data?.send_message_when_someone_accept_new_friend_request);

    if (data.send_message_when_someone_accept_new_friend_request_settings) {
      const { message_group_id, quick_message } = data?.send_message_when_someone_accept_new_friend_request_settings[0];

      if (message_group_id !== "" && message_group_id !== null && message_group_id !== undefined) {
        // console.log("DATA MESSAGE GROUP ID -- ", message_group_id);

        dispatch(getGroupById(message_group_id)).unwrap().then((res) => {
          const data = res?.data;
          // console.log("See the Data -- ", res);
          if (data.length) {
            setSndMsgAcptsFrndReqGroupSelect(data[0]);
            localStorage.setItem("fr_using_select_accept", true);
          }
        });
      }

      if (quick_message !== "" && quick_message !== null && quick_message !== undefined) {
        setQuickMsgAcptsFrndReq(quick_message);
      }
    }

    // Send Message when someone rejects my friend request (SYNC-DATA).
    setSndMsgRejtFrndReqToggle(data?.send_message_when_reject_friend_request);

    if (data.send_message_when_reject_friend_request_settings) {
      const { message_group_id, quick_message } = data?.send_message_when_reject_friend_request_settings[0];

      if (message_group_id !== "" && message_group_id !== null && message_group_id !== undefined) {
        dispatch(getGroupById(message_group_id)).unwrap().then((res) => {
          const data = res?.data;
          if (data.length) {
            setSndMsgRejtFrndReqGroupSelect(data[0]);
            localStorage.setItem("fr_using_select_rejt", true);
          }
        });
      }

      if (quick_message !== "" && quick_message !== null && quick_message !== undefined) {
        setQuickMsgRejtFrndReq(quick_message);
      }
    }


    // Send message when someone sends me a friend request (SYNC-DATA).
    sertSndMsgSomeoneSndFrndReqToggle(data?.send_message_when_someone_sends_me_friend_request);

    if (data.send_message_when_someone_sends_me_friend_request_settings) {
      const { message_group_id, quick_message } = data?.send_message_when_someone_sends_me_friend_request_settings[0];

      if (message_group_id !== "" && message_group_id !== null && message_group_id !== undefined) {
        dispatch(getGroupById(message_group_id)).unwrap().then((res) => {
          const data = res?.data;
          if (data.length) {
            setSndMsgSomeoneSndFrndReqGroupSelect(data[0]);
            localStorage.setItem("fr_using_someone_send", true);
          }
        });
      }

      if (quick_message !== "" && quick_message !== null && quick_message !== undefined) {
        setQuickMsgSomeoneSndFrndReq(quick_message);
      }
    }

    // Send message when I reject an incoming friend request (SYNC-DATA).
    setSndMsgRejtIncomingFrndReqToggle(data?.send_message_when_reject_incoming_friend_request);

    if (data.send_message_when_reject_incoming_friend_request_settings) {
      const { message_group_id, quick_message } = data?.send_message_when_reject_incoming_friend_request_settings[0];

      if (message_group_id !== "" && message_group_id !== null && message_group_id !== undefined) {
        dispatch(getGroupById(message_group_id)).unwrap().then((res) => {
          const data = res?.data;
          if (data.length) {
            setSndMsgRejtIncomingFrndReqGroupSelect(data[0]);
            localStorage.setItem("fr_using_rejt_incoming", true);
          }
        });
      }

      if (quick_message !== "" && quick_message !== null && quick_message !== undefined) {
        setQuickMsgRejtIncomingFrndReqFrndReq(quick_message);
      }
    }


    // Send message when I accept an incoming friend request (SYNC-DATA).
    setSndMsgAcptsIncomingFrndReqToggle(data?.send_message_when_accept_incoming_friend_request);

    if (data.send_message_when_accept_incoming_friend_request_settings) {
      const { message_group_id, quick_message } = data?.send_message_when_accept_incoming_friend_request_settings[0];

      if (message_group_id !== "" && message_group_id !== null && message_group_id !== undefined) {
        dispatch(getGroupById(message_group_id)).unwrap().then((res) => {
          const data = res?.data;
          if (data.length) {
            setSndMsgAcptsIncomingFrndReqGroupSelect(data[0]);
            localStorage.setItem("fr_using_accept_incoming", true);
          }
        });
      }

      if (quick_message !== "" && quick_message !== null && quick_message !== undefined) {
        setQuickMsgAcptsIncomingFrndReqFrndReq(quick_message);
      }
    }

    // --- [ END OF SYNC FUNCTION ] ---
  };

  //if you want to use the common debounce function jus use it here I have used wth useCallback

  /**
   * set start time
   * if start time is higher than to time,
   * set to time as 1hr more than selected from time
   *
   * @returns
   */
  const setStartTime = (e) => {
    if (
      timeObj.indexOf(timeObj.filter((el) => el.value == e.target.value)[0]) >=
      timeObj.indexOf(
        timeObj.filter((el) => el.value == dayBackAnlyFrndEngSelect2)[0]
      )
    ) {
      //console.log("here");
      setDayBackAnlyFrndEngSelect2(
        timeObj[
          timeObj.indexOf(
            timeObj.filter((el) => el.value == e.target.value)[0]
          ) + 1
        ].value
      );
    }
    setDayBackAnlyFrndEngSelect1(e.target.value);
  };

  /**
   * ===== Handle Value Will Inactive After Days =====
   * @param {*} event
   */
  const handleValWillInactiveAfterDays = (event) => {
    let { value } = event.target;
    const parsedValue = parseInt(value);
    let inputValue = value;

    if (parsedValue === 0 || parsedValue <= -1) {
      inputValue = 1;
    } else if (parsedValue > 365) {
      inputValue = 365;
    } else if (value.includes('.')) {
      inputValue = Math.floor(parsedValue);
    }

    setFrndInactiveAfterDays(inputValue);
  };


  /**
   * ====== Set the Value of Friend Will Inactive After Days ======
   */
  const setValOfFrndWillInactiveAfterDays = (type) => {
    if (type === "INCREMENT") {
      if (Number(frndWillInactiveAfterDays) >= 365) {
        setFrndInactiveAfterDays(365);
      } else {
        setFrndInactiveAfterDays(Number(frndWillInactiveAfterDays) + 1);
      }
    }

    if (type === "DECREMENT") {
      if (Number(frndWillInactiveAfterDays) <= 1) {
        setFrndInactiveAfterDays(1);
      } else {
        setFrndInactiveAfterDays(Number(frndWillInactiveAfterDays) - 1);
      }
    }
  };

  /**
   * ====== Set Re-Friending Input1 Increment & Decrement..
   * @param {string} type
   */
  const setValOfReFrndngIncDic = (type) => {
    if (!reFrndng) {
      Alertbox(
        "Please turn on the setting to make changes",
        "warning",
        1000,
        "bottom-right"
      );
    }

    if (reFrndng) {
      if (type === "INCREMENT") {
        if (reFrndngInput1 >= 99) {
          //.. error true
          return;
        } else {
          //.. error false
          setReFrndngInput1(parseInt(reFrndngInput1) + 1);

          const storageData = {
            current_fb_id: current_fb_id,
            reFrndngInput: parseInt(reFrndngInput1) + 1,
            reFrndngSelect: reFrndSelect1,
            keywords: reFrndngKeywords,
          };
          const jsonStorageData = JSON.stringify(storageData);
          localStorage.setItem('fr_refriending_data', jsonStorageData);
        }
      }

      if (type === "DECREMENT") {
        if (reFrndngInput1 > 1) {
          //.. error false..
          setReFrndngInput1(parseInt(reFrndngInput1) - 1);

          const storageData = {
            current_fb_id: current_fb_id,
            reFrndngInput: parseInt(reFrndngInput1) - 1,
            reFrndngSelect: reFrndSelect1,
            keywords: reFrndngKeywords,
          };
          const jsonStorageData = JSON.stringify(storageData);
          localStorage.setItem('fr_refriending_data', jsonStorageData);
        }
      }
    }
  };

  /**
   * Set Delete Pending Requests Increment & Decrement..
   */
  const setValOfDeletePendingFrndIncDic = (type) => {
    //console.log("autoCnclFrndRque", autoCnclFrndRque);
    if (!autoCnclFrndRque) {
      Alertbox(
        "Please turn on the setting to make changes",
        "warning",
        1000,
        "bottom-right"
      );
    }

    if (autoCnclFrndRque) {
      if (type === "INCREMENT") {
        if (cnclFrndRqueInput > 30) {
          setDeletePendingFrndError(true);

          setTimeout(() => {
            setDeletePendingFrndError(false);
          }, 2000);

        } else {
          setDeletePendingFrndError(false);
          setCnclFrndRqueInput(parseInt(cnclFrndRqueInput) + 1);
          setDeletePendingFrndValue(parseInt(cnclFrndRqueInput) + 1);
        }
      }

      if (type === "DECREMENT") {
        if (cnclFrndRqueInput > 1) {
          setDeletePendingFrndError(false);
          setCnclFrndRqueInput(parseInt(cnclFrndRqueInput) - 1);
          setDeletePendingFrndValue(parseInt(cnclFrndRqueInput) - 1);
        }
      }
    }
  };


  /**
   * Handle Input-Bar of Re-Frinding Input1
   */
  const reFriendingInput1Handle = (event) => {
    const { value } = event.target;

    if (!reFrndng) {
      Alertbox(
        "Please turn on the setting to make changes",
        "warning",
        1000,
        "bottom-right"
      );
      return;
    }

    const parsedValue = parseInt(value);

    let inputValue = value;
    let storageData = {
      current_fb_id: current_fb_id,
      reFrndngInput: inputValue,
      reFrndngSelect: reFrndSelect1,
      keywords: reFrndngKeywords,
    };

    if (reFrndng) {
      if (parsedValue === 0 || parsedValue <= -1) {
        inputValue = 1;
        storageData.reFrndngInput = 1;
      } else if (parsedValue > 99) {
        inputValue = 99;
        storageData.reFrndngInput = 99;
      } else if (value.includes('.')) {
        inputValue = Math.floor(parsedValue);
        storageData.reFrndngInput = inputValue;
      }

      setReFrndngInput1(inputValue);
      const jsonStorageData = JSON.stringify(storageData);
      localStorage.setItem('fr_refriending_data', jsonStorageData);
    }
  };

  /**
   * ===== Re-Friending Select Attempts Handle Function =======
   * @param {*} event
   */
  const handleChangeReFrndngSelect1 = (event) => {
    const { value } = event.target;
    const parsedValue = parseInt(value);
    setReFrndSelect1(parsedValue);

    const jsonStorageData = JSON.stringify({
      current_fb_id: current_fb_id,
      reFrndngInput: reFrndngInput1,
      reFrndngSelect: parsedValue,
      keywords: reFrndngKeywords,
    });
    localStorage.setItem('fr_refriending_data', jsonStorageData);
  };


  /**
   * Handle Input-Bar of Cancel sent friend reuquest(s)
   */
  const deletePendingFrndInputHandle = (event) => {
    const { value } = event.target;

    if (!autoCnclFrndRque) {
      Alertbox(
        "Please turn on the setting to make changes",
        "warning",
        1000,
        "bottom-right"
      );
    }

    if (autoCnclFrndRque) {
      if (parseInt(value) === 0 || value <= -1) {
        setDeletePendingFrndError(true);
        // setDeletePendingFrndValue(1);
        setCnclFrndRqueInput(1)

        setTimeout(() => {
          setDeletePendingFrndError(false);
        }, 2000);

      } else if (parseInt(value) > 31) {
        setDeletePendingFrndError(true);
        // setDeletePendingFrndValue(31);
        setCnclFrndRqueInput(31)

        setTimeout(() => {
          setDeletePendingFrndError(false);
        }, 2000);

      } else if (value.includes('.')) {
        setDeletePendingFrndError(true);
        // setDeletePendingFrndValue(Math.floor(parseFloat(value)));
        setCnclFrndRqueInput(Math.floor(parseFloat(value)))

        setTimeout(() => {
          setDeletePendingFrndError(false);
        }, 2000);

      } else {
        setDeletePendingFrndError(false);
        setDeletePendingFrndValue(value);
        setCnclFrndRqueInput(value)
      }
    }
    // if (autoCnclFrndRque) {
    //   setDeletePendingFrndError(false);

    //   if (!deletePendingFrndValue) {
    //     setDeletePendingFrndValue(1)
    //     setCnclFrndRqueInput(1)
    //   } else {
    //     setCnclFrndRqueInput(deletePendingFrndValue)
    //   }
    // }
  }

  const checkDeletePFRProgress = async () => {
    let checkingIntv = setInterval(() => {
      // console.log("checking deleting PFR status");
      const isDeleting = helper.getCookie("deleteAllPendingFR");
      if (isDeleting) {
        switch (isDeleting) {
          case "Done":
            setDeletePendingFrndStartFinding(false);
            localStorage.removeItem("fr_delete_id");
            helper.deleteCookie("deleteAllPendingFR")
            clearInterval(checkingIntv);
            Alertbox(
              "Deleted all pending friend request(s)",
              "success",
              1000,
              "bottom-right"
            );
            break;

          case "Active":
            setDeletePendingFrndStartFinding(true)
            break;

          case "Empty":
            clearInterval(checkingIntv);
            localStorage.removeItem("fr_delete_id");
            setDeletePendingFrndStartFinding(false);
            helper.deleteCookie("deleteAllPendingFR");
            Alertbox(
              "No pending request(s) found",
              "warning-toast",
              1000,
              "bottom-right"
            );
            break;
        }
      }
      else {
        setDeletePendingFrndStartFinding(false)
        clearInterval(checkingIntv)
      }
    }, 1000 * 10);
  };

  /**
   * Delete Pending Request Handler Function..
   */
  const deletePendingRequestHandle = async () => {
    setDeletePendingFrndModalOpen(false);
    setDeletePendingFrndStartFinding(true);
    localStorage.setItem("fr_delete_id", localStorage.getItem("fr_default_fb"))
    Alertbox(
      "Started to delete all pending friend request(s) please don't reload or logout from facebook or turn off the system",
      "warning",
      1000,
      "bottom-right"
    );
    const currentProfile = localStorage.getItem("fr_default_fb")
    const friendCountPayload = {
      action: "syncprofile",
      frLoginToken: localStorage.getItem("fr_token"),
    };
    const facebookProfile = await extensionAccesories.sendMessageToExt(
      friendCountPayload
    );
    if (!facebookProfile.uid || facebookProfile.uid != currentProfile) {
      setDeletePendingFrndStartFinding(false);
      localStorage.removeItem("fr_delete_id");
      Alertbox(
        `To initiate the deletion process, please Login to following facebook account`,
        "error-toast",
        2000,
        "bottom-right",
        `https://www.facebook.com/${localStorage.getItem("fr_default_fb")}`
      );
      return;
    }
    helper.setCookie("deleteAllPendingFR", "Active");
    //  deleteAllInterval(()=>{dispatch(getSendFriendReqst({ fbUserId: localStorage.getItem("fr_default_fb") }))});
    checkDeletePFRProgress();
    await extensionAccesories.sendMessageToExt({ action: "deletePendingFR", fbUserId: localStorage.getItem("fr_default_fb") });
  };

  /**
   * ===== Save Re-Friending Keywords ====
   * @param {*} event
   */
  const saveReFrndngKeywords = (keywords) => {
    // setReFriendSaveActive(false);
    // console.log("Save Re-Friending Keywords -- ", reFrndngKeywords);
    // console.log("re-friending after -- ", reFrndngInput1);
    // console.log("re-frending attemps -- ", reFrndSelect1);

    // Passed with Bool (true|false) because of to save only clicking save button,
    // not automatically with all settings changes... (Don't remove the boolean type and for the function itself calling)
    saveMySetting(true);
    const storageData = {
      current_fb_id: current_fb_id,
      reFrndngInput: reFrndngInput1,
      reFrndngSelect: reFrndSelect1,
      keywords,
    };
    const jsonStorageData = JSON.stringify(storageData);
    localStorage.setItem('fr_refriending_data', jsonStorageData);
    setFrndngKeywords(keywords);

    if (keywords === '') {
      localStorage.removeItem("fr_refriending_keywords");
    }
  };

  /**
   * Disable every functional / special key except numbers
   */

  const checkData = (e) => {
    let keySuccess = e.target.value == "." ||
      e.target.value == "e" ||
      e.target.value == "E" ||
      e.code == "Period" ||
      e.code == "NumpadDecimal" ||
      e.code == "NumpadAdd" ||
      e.code == "Equal" ||
      e.code == "Minus" ||
      e.code == "NumpadSubtract" ||
      e.code == "Minus" ||
      e.code == "NumpadMultiply" ||
      e.code == "KeyE"

    if (keySuccess) {
      e.preventDefault()
    }
  }

  /**
   * ====== Turn On Settings Warning ======
   * @param {*} param
   * @returns
   */
  const TurnOnSettingsWarn = ({ children, enabledFeature }) => {
    return (
      <span onClick={() => {
        if (!enabledFeature) {
          Alertbox(
            "Please turn on the setting to make changes",
            "warning",
            1000,
            "bottom-right"
          );
          return;
        }
      }}>
        {children}
      </span>
    );
  };


  return (
    <div className="setting-content setting-global">
      {settingFetched && (
        <>
          <NotifyAlert
            type="NOTIFY"
            title="The settings will apply to each profile individually, allowing for customization and flexibility within a single account"
          />

          <Modal
            modalType="DELETE"
            headerText={"Delete"}
            bodyText={
              "Are you sure you want to delete all of your pending friend request(s)?"
            }
            open={deletePendingFrndModalOpen}
            setOpen={setDeletePendingFrndModalOpen}
            ModalFun={deletePendingRequestHandle}
            btnText={"Yes, Delete"}
            ModalIconElement={() => <DangerIcon />}
          />
          <div className="settings setting-paper currenctly-active">
            {/* ========== General Settings ============ */}
            <p className="fr-heading">
              <span>General settings</span>
            </p>

            {/* <div className={`setting ${dayBackAnlyFrndEngOpen ? "setting-actived" : ""}`} onClick={() => setDayBackAnlyFrndEngOpen(!dayBackAnlyFrndEngOpen)}> */}
            <div className={`setting ${dayBackAnlyFrndEng ? "setting-actived" : ""}`}>
              <Switch
                checked={dayBackAnlyFrndEng}
                // handleOnBlur={e => setDayBackAnlyFrndEng(!dayBackAnlyFrndEng)}
                handleChange={() => {
                  setDayBackAnlyFrndEng(!dayBackAnlyFrndEng);
                  setDayBackAnlyFrndEngOpen(!dayBackAnlyFrndEngOpen);
                }}
              />
              {/* Day back to analyse friends engagement */}
              {/* Friend list and engagement sync time */}
              Interval for auto sync friend list

              <div className="setting-control">
                <figure className="icon-arrow-down">
                  {!dayBackAnlyFrndEng ? <ChevronDownArrowIcon /> : <ChevronUpArrowIcon />}
                </figure>
              </div>
            </div>
            {dayBackAnlyFrndEng && (
              <div className="setting-child others">
                Select the time: From &nbsp;
                <TurnOnSettingsWarn enabledFeature={dayBackAnlyFrndEng}>
                  <DropSelector
                    selects={timeObj.slice(0, timeObj.length - 1)}
                    value={dayBackAnlyFrndEngSelect1}
                    style={{}}
                    // handleChange={(e) => dayBackAnlyFrndEngDropSelectHandle(e, "select1")}
                    handleChange={e => setStartTime(e)}
                    setDisable={!dayBackAnlyFrndEng}
                    extraClass="tinyWrap"
                    height="30px"
                    width="90px"
                  />
                </TurnOnSettingsWarn>
                {" "}
                &nbsp; To &nbsp;
                <TurnOnSettingsWarn enabledFeature={dayBackAnlyFrndEng}>
                  <DropSelector
                    selects={
                      dayBackAnlyFrndEngSelect1
                        ? timeObj.slice(
                          timeObj.indexOf(
                            timeObj.filter(
                              (el) => el.value == dayBackAnlyFrndEngSelect1
                            )[0]
                          ) + 1
                        )
                        : timeObj
                    }
                    value={dayBackAnlyFrndEngSelect2}
                    style={{}}
                    handleChange={(e) => setDayBackAnlyFrndEngSelect2(e.target.value)}
                    setDisable={!dayBackAnlyFrndEng}
                    extraClass="tinyWrap"
                    height="30px"
                    width="90px"
                  />
                </TurnOnSettingsWarn>
                {" "}
                daily.
              </div>
            )}

            <div className="setting setting-paper">
              Friends will be considered as inactive after {" "}
              <div className={"input-num"}>
                <input
                  type="number"
                  className="setting-input"
                  value={frndWillInactiveAfterDays}
                  onChange={handleValWillInactiveAfterDays}
                />

                <div className="input-arrows">
                  <button className="btn inline-btn btn-transparent"
                    onClick={() => setValOfFrndWillInactiveAfterDays("INCREMENT")}
                  >
                    <ChevronUpArrowIcon size={15} />
                  </button>

                  <button className="btn inline-btn btn-transparent"
                    onClick={() => setValOfFrndWillInactiveAfterDays("DECREMENT")}
                  >
                    <ChevronDownArrowIcon size={15} />
                  </button>
                </div>
              </div>
              {" "} day(s)
            </div>

            {/* ========== Friends Settings ============ */}
            <p className="fr-heading">
              <span>Friend request settings</span>
            </p>

            <div className="setting">
              {/* <Modal
                headerText={"Unfriend"}
                bodyText={
                  "8 Friends selected. but 3 Whitelist friend are selected aswell. Are you sure you want to unfriend your friends."
                }
                open={modalOpen}
                setOpen={setModalOpen}
                ModalFun={() => {
                  //console.log("Modal opened");
                }}
                btnText={"Yes, Unfriend"}
              /> */}
              <div className="setting-child">
                <Switch
                  checked={dontSendFrindReqFrnd}
                  handleChange={() => {
                    setDontSendFrindReqFrnd(!dontSendFrindReqFrnd);
                  }}
                />
                Don’t send friend request(s) to people I’ve been friends with before.
              </div>
            </div>

            {/* <div className="setting no-click"> */}
            <div className="setting">
              {/* <div className="setting-child muted-text"> */}
              <div className="setting-child">
                <Switch
                  // upComing
                  checked={dontSendFrindReqIRejct}
                  handleChange={() => {
                    setDontSendFrindReqIRejct(!dontSendFrindReqIRejct);
                  }}
                />{" "}
                Don’t send friend request(s) to people who sent me friend request and I rejected.
              </div>

              {/* <span className="warn-badget">Coming soon</span> */}
            </div>

            <div className="setting">
              <div className="setting-child">
                <Switch
                  checked={dontSendFrindReqThyRejct}
                  handleChange={() => {
                    setDontSendFrindReqThyRejct(!dontSendFrindReqThyRejct);
                  }}
                />
                Don’t send friend request(s) to people I sent friend request(s) and they rejected.
              </div>
            </div>


            {/* Re-Friending  setting start*/}
            {/* <div className={`setting ${refrienderingOpen ? "setting-actived" : ""}`} onClick={() => setRefrienderingOpen(!refrienderingOpen)}> */}
            <div className={`setting ${reFrndng ? "setting-actived" : ""}`}>
              <div className="setting-child ">
                <Switch
                  checked={reFrndng}
                  handleChange={() => {
                    setReFrndng(!reFrndng);
                    setRefrienderingOpen(!refrienderingOpen);
                  }}
                />
                Automated re-friending
              </div>
              <div className="setting-control">
                <figure className="icon-arrow-down">
                  {!reFrndng ? <ChevronDownArrowIcon /> : <ChevronUpArrowIcon />}
                </figure>
              </div>

            </div>
            {reFrndng && (
              <div className="setting-child">

                <span className="smallTxt">Automatically cancel friend request(s) that have been pending for more than</span>
                {" "}
                <span onClick={() => {
                  if (!reFrndng) {
                    Alertbox(
                      "Please turn on the setting to make changes",
                      "warning",
                      1000,
                      "bottom-right"
                    );
                    return;
                  }
                }}>
                  <div className={!reFrndng ? "input-num disabled" : "input-num"}>
                    <input
                      type="number"
                      className="setting-input"
                      value={reFrndngInput1}
                      //onKeyDown={e => checkData(e)}
                      onChange={reFriendingInput1Handle}
                    // onBlur={deletePendingRequestWithDaysHandle}
                    />

                    <div className="input-arrows">
                      <button className="btn inline-btn btn-transparent"
                        onClick={() => setValOfReFrndngIncDic("INCREMENT")}
                      >
                        <ChevronUpArrowIcon size={15} />
                      </button>

                      <button className="btn inline-btn btn-transparent"
                        onClick={() => setValOfReFrndngIncDic("DECREMENT")}
                      >
                        <ChevronDownArrowIcon size={15} />
                      </button>
                    </div>
                  </div>
                </span>
                {" "}
                <span className="smallTxt">  day(s), and immediately send a new friend request. Choose how often to retry friending up to</span>
                {" "}
                <TurnOnSettingsWarn enabledFeature={reFrndng}>
                  <DropSelector
                    setDisable={!reFrndng}
                    selects={noOfRefrendering}
                    value={reFrndSelect1}
                    handleChange={handleChangeReFrndngSelect1}
                    extraClass="tinyWrap"
                    height="30px"
                    width="90px"
                  />
                </TurnOnSettingsWarn>
                {" "}
                <span className="smallTxt"> attempt(s)</span>

                <div className="keywordBlock">
                  <div className="saveBlock">
                    <TurnOnSettingsWarn enabledFeature={reFrndng}>
                      <Switch
                        upComing={!reFrndng}
                        isDisabled={!reFrndng}
                        checked={reFriendOpenKeywords}
                        handleChange={() => {
                          if (reFrndng) {
                            setReFriendOpenKeywords(!reFriendOpenKeywords);
                          }
                        }}
                      />
                    </TurnOnSettingsWarn>
                    {" "}
                    <span className="smallTxt"> Keyword(s)
                      <ToolTipPro
                        isInteract={false}
                        textContent={"Enabling this feature will resend friend request(s) to those targeted friends who have matched the designated keyword(s)"}
                        type={"info"}
                      />
                    </span>
                    {" "}

                    {reFriendSaveActive && reFriendOpenKeywords && (
                      <>
                        <button
                          className={`saveBtn activated`}
                          onClick={() => {
                            setReFriendSaveActive(false);
                            saveReFrndngKeywords(reFrndngKeywords);
                          }}
                        >
                          Save
                        </button>  {/* add class "activated" for blue color */}
                        <span className="doomedText">* Enter a comma after each keyword</span>
                      </>
                    )}

                    {!reFriendSaveActive && reFrndngKeywords?.length > 0 && reFriendOpenKeywords && (
                      <>
                        <button
                          className={`saveBtn activated`}
                          onClick={() => setReFriendSaveActive(true)}
                        >
                          Modify
                        </button>
                      </>
                    )}
                  </div>

                  {reFriendOpenKeywords &&
                    <Keyword
                      reFrndngKeywords={reFrndngKeywords}
                      isModified={reFriendSaveActive}
                      setFrndngKeywords={setFrndngKeywords}
                      onMouseDownHandler={(e) => { setReFriendSaveActive(true) }}
                    />
                  }
                </div>
              </div>
            )}

            {/* <div className={`setting ${deletePendingFrndOpen ? "setting-actived" : ""}`} onClick={() => setDeletePendingFrndOpen(!deletePendingFrndOpen)}> */}
            <div className={`setting ${autoCnclFrndRque ? "setting-actived" : ""}`}>
              <Switch
                checked={autoCnclFrndRque}
                // handleOnBlur={e => setAutoCnclFrndRque(!autoCnclFrndRque)}
                handleChange={() => {
                  setAutoCnclFrndRque(!autoCnclFrndRque);
                  setDeletePendingFrndOpen(!deletePendingFrndOpen);
                }}
              />
              Delete pending friend request(s) automatically

              <div className="setting-control">
                Delete all pending request(s) now
                {" "}
                <button
                  className={
                    deletePendingFrndStartFinding ?
                      "btn delete-pending-frnd btn-deleting" : "btn delete-pending-frnd"}
                  onClick={() => setDeletePendingFrndModalOpen(true)}
                  // style={{ background: !deletePendingFrndStartFinding ? '#B54B54' : '#ba7c82' }}
                  disabled={deletePendingFrndStartFinding}
                >
                  {!deletePendingFrndStartFinding ? (
                    <>
                      <span><OutlinedDeleteIcon color="white" /></span>
                      Delete all
                    </>
                  ) : (
                    <>
                      <span>
                        <RefreshIconLight />
                      </span>
                      Deleting..
                    </>
                  )}
                </button>

                <figure className="icon-arrow-down">
                  {!autoCnclFrndRque ? <ChevronDownArrowIcon /> : <ChevronUpArrowIcon />}
                </figure>
              </div>
            </div>

            {autoCnclFrndRque && (
              <div className="setting-child others">
                Cancel sent friend request(s) after
                {" "}
                <span onClick={() => {
                  if (!autoCnclFrndRque) {
                    Alertbox(
                      "Please turn on the setting to make changes",
                      "warning",
                      1000,
                      "bottom-right"
                    );
                    return;
                  }
                }}>
                  <div className={!autoCnclFrndRque ? "input-num disabled" : "input-num"}>
                    <input
                      type="number"
                      className="setting-input"
                      value={cnclFrndRqueInput}
                      onKeyDown={e => checkData(e)}
                      onChange={deletePendingFrndInputHandle}
                    // onBlur={deletePendingRequestWithDaysHandle}
                    />

                    <div className="input-arrows">
                      <button className="btn inline-btn btn-transparent" onClick={() => setValOfDeletePendingFrndIncDic("INCREMENT")}>
                        <ChevronUpArrowIcon size={15} />
                      </button>

                      <button className="btn inline-btn btn-transparent" onClick={() => setValOfDeletePendingFrndIncDic("DECREMENT")}>
                        <ChevronDownArrowIcon size={15} />
                      </button>
                    </div>
                  </div>
                </span>
                {" "}
                day(s)
                {deletePendingFrndError && <span className="error-text">Provided value must be within the range of 1 to 31</span>}
              </div>
            )}


            {/* ========== Message Settings ============ */}
            <p className="fr-heading">
              {/*<span>Message settings<span className="warn-badget">Coming soon</span></span>*/}
              <span>Message settings</span>
            </p>

            {/* {======= Send Message When someone accepted my friend request =======} */}
            {/* <div className={`setting ${sndMsgAcptsFrndReqOpen ? "setting-actived" : ""}`} onClick={() => setSndMsgAcptsFrndReqOpen(!sndMsgAcptsFrndReqOpen)}> */}
            <div className={`setting ${sndMsgAcptsFrndReqToggle ? "setting-actived" : ""}`}>
              <div className="setting-child first">
                <Switch
                  checked={sndMsgAcptsFrndReqToggle}
                  handleChange={() => {
                    setSndMsgAcptsFrndReqToggle(!sndMsgAcptsFrndReqToggle);
                  }}
                />
                Send message when someone accepts my friend request
              </div>

              <div className="setting-control">
                <figure className="icon-arrow-down">
                  {!sndMsgAcptsFrndReqToggle ? <ChevronDownArrowIcon /> : <ChevronUpArrowIcon />}
                </figure>
              </div>
            </div>

            {sndMsgAcptsFrndReqToggle && (
              <div className="setting-child others">
                <div className="custom-select-drop-area">
                  Select the message template you want to send &nbsp;
                  <TurnOnSettingsWarn enabledFeature={sndMsgAcptsFrndReqToggle}>
                    <DropSelectMessage
                      type="ACCEPT_REQ"
                      openSelectOption={selectMsgTempAcceptsFrndReq && sndMsgAcptsFrndReqToggle}
                      handleIsOpenSelectOption={sndMsgAcptsFrndReqToggle && setSelectMsgTempAcceptsFrndReq}
                      groupList={groupsToSelect}
                      groupSelect={sndMsgAcptsFrndReqGroupSelect}
                      setGroupSelect={setSndMsgAcptsFrndReqGroupSelect}
                      quickMessage={quickMsgAcptsFrndReq && quickMsgAcptsFrndReq}
                      setQuickMessage={setQuickMsgAcptsFrndReq}
                      quickMsgModalOpen={sndMsgAcptsQuickMsgModalOpen}
                      setQuickMsgOpen={setSndMsgAcptsQuickMsgOpen}
                      isDisabled={!sndMsgAcptsFrndReqToggle}
                      usingSelectOptions={usingSelectOptions}
                      setUsingSelectOptions={setUsingSelectOptions}
                      saveMySetting={saveMySetting}
                    />
                  </TurnOnSettingsWarn>
                </div>
              </div>
            )}


            {/* {======= Send Message When someone rejected my friend request =======} */}
            {/* <div className={`setting ${sndMsgRejtFrndReqOpen ? "setting-actived" : ""}`} onClick={() => setSndMsgRejtFrndReqOpen(!sndMsgRejtFrndReqOpen)}> */}
            <div className={`setting ${sndMsgRejtFrndReqToggle ? "setting-actived" : ""}`}>
              <div className="setting-child first">
                <Switch
                  checked={sndMsgRejtFrndReqToggle}
                  handleChange={() => {
                    setSndMsgRejtFrndReqToggle(!sndMsgRejtFrndReqToggle);
                    setSndMsgRejtFrndReqOpen(!sndMsgRejtFrndReqOpen);
                  }}
                />
                Send message when someone reject my friend request
              </div>

              <div className="setting-control">
                <figure className="icon-arrow-down">
                  {!sndMsgRejtFrndReqToggle ? <ChevronDownArrowIcon /> : <ChevronUpArrowIcon />}
                </figure>
              </div>
            </div>

            {sndMsgRejtFrndReqToggle && (
              <div className="setting-child others">
                <div className="custom-select-drop-area">
                  Select the message template you want to send &nbsp;
                  <TurnOnSettingsWarn enabledFeature={sndMsgRejtFrndReqToggle}>
                    <DropSelectMessage
                      type="REJECT_REQ"
                      openSelectOption={selectMsgTempRejectFrndReq && sndMsgRejtFrndReqToggle}
                      handleIsOpenSelectOption={sndMsgRejtFrndReqToggle && setSelectMsgTempRejectFrndReq}
                      groupList={groupsToSelect}
                      groupSelect={sndMsgRejtFrndReqGroupSelect}
                      setGroupSelect={setSndMsgRejtFrndReqGroupSelect}
                      isDisabled={!sndMsgRejtFrndReqToggle}
                      quickMessage={quickMsgRejtFrndReq && quickMsgRejtFrndReq}
                      setQuickMessage={setQuickMsgRejtFrndReq}
                      quickMsgModalOpen={sndMsgRejtQuickMsgModalOpen}
                      setQuickMsgOpen={setSndMsgRejtQuickMsgOpen}
                      setUsingSelectOptions={setUsingSelectOptions2}
                      usingSelectOptions={usingSelectOptions2}
                      saveMySetting={saveMySetting}
                    />
                  </TurnOnSettingsWarn>
                </div>
              </div>
            )}


            {/* {======= Send message when someone sends me a friend request =======} */}
            {/* <div className="setting  setting-paper no-click"> */}
            <div className={`setting ${sndMsgSomeoneSndFrndReqToggle ? "setting-actived" : ""}`}>
              {/* <div className="setting-child first muted-text"> */}
              <div className="setting-child first">
                <Switch
                  // upComing
                  checked={sndMsgSomeoneSndFrndReqToggle}
                  handleChange={() => {
                    sertSndMsgSomeoneSndFrndReqToggle(!sndMsgSomeoneSndFrndReqToggle);
                  }}
                />
                Send message when someone sends me a friend request

                {/* <span className="warn-badget">Coming soon</span> */}
              </div>

              <div className="setting-control">
                <figure className="icon-arrow-down">
                  {!sndMsgSomeoneSndFrndReqToggle ? <ChevronDownArrowIcon /> : <ChevronUpArrowIcon />}
                </figure>
              </div>
            </div>

            {sndMsgSomeoneSndFrndReqToggle && (
              <div className="setting-child others">
                <div className="custom-select-drop-area">
                  Select the message &nbsp;
                  <TurnOnSettingsWarn enabledFeature={sndMsgSomeoneSndFrndReqToggle}>
                    <DropSelectMessage
                      type="SOMEONE_SEND_REQ"
                      openSelectOption={selectMsgSomeoneSndFrndReq && sndMsgSomeoneSndFrndReqToggle}
                      handleIsOpenSelectOption={sndMsgSomeoneSndFrndReqToggle && setSelectMsgSomeoneSndFrndReq}
                      groupList={groupsToSelect}
                      groupSelect={sndMsgSomeoneSndFrndReqGroupSelect}
                      setGroupSelect={setSndMsgSomeoneSndFrndReqGroupSelect}
                      isDisabled={!sndMsgSomeoneSndFrndReqToggle}
                      quickMessage={quickMsgSomeoneSndFrndReq && quickMsgSomeoneSndFrndReq}
                      setQuickMessage={setQuickMsgSomeoneSndFrndReq}
                      quickMsgModalOpen={sndMsgSomeoneSndFrndReqQuickMsgModalOpen}
                      setQuickMsgOpen={setSndMsgSomeoneSndFrndReqQuickMsgModalOpen}
                      setUsingSelectOptions={setUsingSelectOptions3}
                      usingSelectOptions={usingSelectOptions3}
                      saveMySetting={saveMySetting}
                    />
                  </TurnOnSettingsWarn>
                </div>
              </div>
            )}


            {/* {======= Send message when I reject an incoming friend request =======} */}
            <div className={`setting ${sndMsgRejtIncomingFrndReqToggle ? "setting-actived" : ""}`}>
              <div className="setting-child first">
                {" "}
                <Switch
                  checked={sndMsgRejtIncomingFrndReqToggle}
                  handleChange={() => {
                    setSndMsgRejtIncomingFrndReqToggle(!sndMsgRejtIncomingFrndReqToggle);
                  }}
                />
                Send message when I reject an incoming friend request

                {/* <span className="warn-badget">Coming soon</span> */}
              </div>

              <div className="setting-control">
                <figure className="icon-arrow-down">
                  {!sndMsgRejtIncomingFrndReqToggle ? <ChevronDownArrowIcon /> : <ChevronUpArrowIcon />}
                </figure>
              </div>
            </div>

            {sndMsgRejtIncomingFrndReqToggle && (
              <div className="setting-child others">
                <div className="custom-select-drop-area">
                  Select the message &nbsp;
                  <TurnOnSettingsWarn enabledFeature={sndMsgRejtIncomingFrndReqToggle}>
                    <DropSelectMessage
                      type="REJT_INCOMING_REQ"
                      openSelectOption={selectMsgRejtIncomingFrndReq && sndMsgRejtIncomingFrndReqToggle}
                      handleIsOpenSelectOption={sndMsgRejtIncomingFrndReqToggle && setSelectMsgRejtIncomingFrndReq}
                      groupList={groupsToSelect}
                      groupSelect={sndMsgRejtIncomingFrndReqGroupSelect}
                      setGroupSelect={setSndMsgRejtIncomingFrndReqGroupSelect}
                      isDisabled={!sndMsgRejtIncomingFrndReqToggle}
                      quickMessage={quickMsgRejtIncomingFrndReqFrndReq && quickMsgRejtIncomingFrndReqFrndReq}
                      setQuickMessage={setQuickMsgRejtIncomingFrndReqFrndReq}
                      quickMsgModalOpen={sndMsgRejtIncomingFrndReqQuickMsgModalOpen}
                      setQuickMsgOpen={setSndMsgRejtIncomingFrndReqQuickMsgModalOpen}
                      setUsingSelectOptions={setUsingSelectOptions4}
                      usingSelectOptions={usingSelectOptions4}
                      saveMySetting={saveMySetting}
                    />
                  </TurnOnSettingsWarn>
                </div>
              </div>
            )}


            {/* {======= Send message when I accept an incoming friend request =======} */}
            <div className={`setting ${sndMsgAcptsIncomingFrndReqToggle ? "setting-actived" : ""}`}>
              <div className="setting-child first">
                <Switch
                  checked={sndMsgAcptsIncomingFrndReqToggle}
                  handleChange={() => {
                    setSndMsgAcptsIncomingFrndReqToggle(!sndMsgAcptsIncomingFrndReqToggle);
                  }}
                />
                Send message when I accept an incoming friend request

                {/* <span className="warn-badget">Coming soon</span> */}
              </div>

              <div className="setting-control">
                <figure className="icon-arrow-down">
                  {!sndMsgAcptsIncomingFrndReqToggle ? <ChevronDownArrowIcon /> : <ChevronUpArrowIcon />}
                </figure>
              </div>
            </div>

            {sndMsgAcptsIncomingFrndReqToggle && (
              <div className="setting-child others">
                <div className="custom-select-drop-area">
                  Select the message &nbsp;
                  <TurnOnSettingsWarn enabledFeature={sndMsgAcptsIncomingFrndReqToggle}>
                    <DropSelectMessage
                      type="ACCEPT_INCOMING_REQ"
                      openSelectOption={selectMsgAcptsIncomingFrndReq && sndMsgAcptsIncomingFrndReqToggle}
                      handleIsOpenSelectOption={sndMsgAcptsIncomingFrndReqToggle && setSelectMsgAcptsIncomingFrndReq}
                      groupList={groupsToSelect}
                      groupSelect={sndMsgAcptsIncomingFrndReqGroupSelect}
                      setGroupSelect={setSndMsgAcptsIncomingFrndReqGroupSelect}
                      isDisabled={!sndMsgAcptsIncomingFrndReqToggle}
                      quickMessage={quickMsgAcptsIncomingFrndReqFrndReq && quickMsgAcptsIncomingFrndReqFrndReq}
                      setQuickMessage={setQuickMsgAcptsIncomingFrndReqFrndReq}
                      quickMsgModalOpen={sndMsgAcptsIncomingFrndReqQuickMsgModalOpen}
                      setQuickMsgOpen={setSndMsgAcptsIncomingFrndReqQuickMsgModalOpen}
                      setUsingSelectOptions={setUsingSelectOptions5}
                      usingSelectOptions={usingSelectOptions5}
                      saveMySetting={saveMySetting}
                    />
                  </TurnOnSettingsWarn>
                </div>
              </div>
            )}


            {/* <div className="setting  setting-paper setting-checked">
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

                          handleChange={(e) => {
                            setDayBackAnlyFrndEngSelect1(e.target.value);
                          }}
                        />{" "}
                        &nbsp; To &nbsp;
                        <DropSelector
                          selects={timeObj}
                          value={dayBackAnlyFrndEngSelect2}

                          handleChange={(e) => {
                            setDayBackAnlyFrndEngSelect2(e.target.value);
                          }}
                        />
                      </div>
                    )}
                  </div> */}

            {/* <div className="setting  setting-paper setting-checked"> */}
            {/* <div className="setting-child first"> */}
            {/* <Switch
                checked={dayBackAnlyFrndEng}
                handleChange={() => {
                  setDayBackAnlyFrndEng(!dayBackAnlyFrndEng);
                }}
              /> */}
            {/* Day back to analyse friends engagement */}
            {/* Friend list and engagement sync time */}
            {/* </div> */}
            {/* {dayBackAnlyFrndEng && (
              <div className="setting-child others">
                Select the time: From &nbsp;
                <DropSelector
                  selects={timeObj}
                  value={dayBackAnlyFrndEngSelect1}

                  handleChange={(e) => {
                    setDayBackAnlyFrndEngSelect1(e.target.value);
                  }}
                />{" "}
                &nbsp; To &nbsp;
                <DropSelector
                  selects={timeObj}
                  value={dayBackAnlyFrndEngSelect2}

                  handleChange={(e) => {
                    setDayBackAnlyFrndEngSelect2(e.target.value);
                  }}
                />{" "}
                daily.
              </div>
            )} */}
            {/* </div> */}

            {/* <div className="setting  setting-paper no-click">
              <div className="setting-child first muted-text">
                <Switch
                  upComing
                  checked={dayBackAnlyFrndEngNEW}
                  handleChange={() => {
                    setDayBackAnlyFrndEngNEW(!dayBackAnlyFrndEngNEW);
                  }}
                />
                Interval to analyse friends engagement &nbsp;
                <DropSelector
                  selects={dayObj}
                  value={dayBackAnlyFrndEngSelect1NEW}

                  handleChange={(e) => {
                    setDayBackAnlyFrndEngSelect1NEW(e.target.value);
                  }}
                />
                &nbsp;

              </div>
            </div> */}

            {/* all setting list with switchs ends*/}
          </div>
        </>
      )}
      {loading && <SettingLoader />}
    </div>
  );
};

export default MySetting;
