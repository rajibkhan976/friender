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
import { useDispatch } from "react-redux";
import { getMySettings, updateMysetting } from "../../actions/MySettingAction";
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

const MySetting = () => {
  //:::: This is a child Setting my-setting::::
  const current_fb_id = localStorage.getItem("fr_default_fb");
  const userToken = localStorage.getItem("fr_token");
  const render = useRef(0);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const [settingFetched, setSettingFetched] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  //states for setting switches
  const [dontSendFrindReqFrnd, setDontSendFrindReqFrnd] = useState(false);
  const [dontSendFrindReqIRejct, setDontSendFrindReqIRejct] = useState(false);
  const [dontSendFrindReqThyRejct, setDontSendFrindReqThyRejct] =
    useState(false);
  const [reFrndng, setReFrndng] = useState(false);
  const [autoCnclFrndRque, setAutoCnclFrndRque] = useState(null);
  const [sndMsgRcvFrndRqu, setSndMsgRcvFrndRqu] = useState(false);
  const [sndMsgAcptFrndRqu, setSndMsgAcptFrndRqu] = useState(false);
  const [sndMsgDlcFrndRqu, setSndMsgDlcFrndRqu] = useState(false);
  const [sndMsgExptFrndRqu, setSndMsgExptFrndRqu] = useState(false);
  const [dayBackAnlyFrndEng, setDayBackAnlyFrndEng] = useState(false);
  const [dayBackAnlyFrndEngNEW, setDayBackAnlyFrndEngNEW] = useState(false);
  const [dayBackAnlyFrndEngOpen, setDayBackAnlyFrndEngOpen] = useState(false);
  const [deletePendingFrnd, setDeletePendingFrnd] = useState(false);
  const [deletePendingFrndOpen, setDeletePendingFrndOpen] = useState(false);
  const [deletePendingFrndValue, setDeletePendingFrndValue] = useState(1);
  const [deletePendingFrndModalOpen, setDeletePendingFrndModalOpen] = useState(false);
  const [deletePendingFrndStartFinding, setDeletePendingFrndStartFinding] = useState(false);
  const [deletePendingFrndError, setDeletePendingFrndError] = useState(false);


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

  //selector states
  const [reFrndSelect1, setReFrndSelect1] = useState(() => {
    const storedData = localStorage.getItem('fr_refriending_data');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      return parsedData.reFrndngSelect || 1;
    }
    return 1;
  });

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
    timeObj[0].value
  );
  const [dayBackAnlyFrndEngSelect2, setDayBackAnlyFrndEngSelect2] = useState(
    timeObj[1].value
  );

  const [dayBackAnlyFrndEngSelect1NEW, setDayBackAnlyFrndEngSelect1NEW] =
    useState(dayObj[0].value);

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
      return parsedData.keywords || '';
    }
    return '';
  });
  const [cnclFrndRqueInput, setCnclFrndRqueInput] = useState(1);
  const [sndMsgRcvFrndRquInput, setSndMsgRcvFrndRquInput] = useState(1);
  const [sndMsgAcptFrndRquInput, setSndMsgAcptFrndRquInput] = useState(1);
  const [sndMsgDlcFrndRquInput, setSndMsgDlcFrndRquinput] = useState(1);
  const [sndMsgExptFrndRquInput, setSndMsgExptFrndRquInput] = useState(1);

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
  const [sndMsgExptFrndRquMsgSelect, setSndMsgExptFrndRquMsgSelect] = useState(
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

  useEffect(() => {
    setLoading(true)
    console.log("before", render.current)
    if (render.current <= 5) {
      render.current = render.current + 1;
    }
    // console.log("after", render.current)
    if (render.current > 1) {
      if (settingFetched) {
        //console.log("the setting saving is optimized-._>");
        const handler = setTimeout(() => saveMySetting(), 1000);
        setLoading(false)
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
  }, [
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
    sndMsgExptFrndRqu,
    dayBackAnlyFrndEng,
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
    reFrndngInput2,
    cnclFrndRqueInput,
    sndMsgRcvFrndRquInput,
    sndMsgAcptFrndRquInput,
    sndMsgDlcFrndRquInput,
    sndMsgExptFrndRquInput,
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
      }
      else {
        setDeletePendingFrndStartFinding(false);
        localStorage.removeItem("fr_delete_id");
      }
    }
    dispatch(getMySettings({ fbUserId: `${current_fb_id}` }));
    //update api call with redux
    fetchProfileSetting({
      fbUserId: `${current_fb_id}`,
    })
      .then((response) => {
        syncSettings(response.data[0]);

        setSettingFetched(true);
        setLoading(false);

        // console.log("my res **", response.data[0]);
      })
      .catch((err) => {
        //console.log(err);
      });
  }, []);

  /**
   * ----- Delete Pending Friend Request(s) API integration -----
   */
  // useEffect(() => {
  //   console.log("Current FB user id -- ", current_fb_id);


  // }, []);

  /**
   * Make Child Toggle Turn Off when parent settings Toggle is Turned Off.
   */
  useEffect(() => {
    if (reFrndng === false) {
      setReFriendOpenKeywords(false);
    }
  }, [reFrndng]);

  console.log('refrnding -- ', reFrndng);

  //massege template select end
  const saveMySetting = (forceSave = false) => {
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
      send_message_when_someone_accept_new_friend_request: sndMsgExptFrndRqu,
      day_bak_to_analyse_friend_engagement: dayBackAnlyFrndEng,
      automatic_cancel_friend_requests_settings: {
        remove_after: cnclFrndRqueInput
      },
    };
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
          keywords: reFrndngKeywords,
        };

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
        keywords: reFrndngKeywords,
      };
    }
    //refriending end

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

    if (sndMsgRcvFrndRqu) {
      if (sndMsgRcvFrndRquInput && Number(sndMsgRcvFrndRquInput) !== 0) {
        payload.send_message_when_receive_new_friend_request_settings = {
          message_template_id: 1,
          send_message_time: sndMsgRcvFrndRquInput ? sndMsgRcvFrndRquInput : 1,
          send_message_time_type: sndMsgRcvFrndRquSelect,
        };
      } else {
        Alertbox(
          "Input should not be empty or 0",
          "warning",
          1000,
          "bottom-right"
        );
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
        Alertbox(
          "Input should not be empty or 0",
          "warning",
          1000,
          "bottom-right"
        );
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
        Alertbox(
          "Input should not be empty or 0",
          "warning",
          1000,
          "bottom-right"
        );
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
        Alertbox(
          "Input should not be empty or 0",
          "warning",
          1000,
          "bottom-right"
        );
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

    //console.log("i am payload****-----|||||>>>", payload);
    dispatch(updateMysetting(payload));
    saveSettings(payload).then(() => {
      if (render.current > 2 && !forceSave) {
        Alertbox("setting updated successfully", "success", 1000, "bottom-right");
      }

      if (forceSave && render.current > 1) {
        Alertbox("settings updated successfully", "success", 1000, "bottom-right");
      }
    });
  };

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

    if (data.re_friending && data.re_friending_settings) {
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
      console.log('data', data.automatic_cancel_friend_requests_settings[0].remove_after);
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

      // !!!! Never Delete the comment!!!!
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

  //if you want to use the common debounce function jus use it here i have used wth useCallback

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
      console.log("here");
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
   * ======== Handle The Select Drop Down for Interval for auto sync friend list ========
   * @param {object} event 
   * @param {string} variant 
   */
  const dayBackAnlyFrndEngDropSelectHandle = (event, variant) => {
    const { value } = event.target;

    if (!dayBackAnlyFrndEng) {
      Alertbox(
        "Please turn on the setting to make changes",
        "warning",
        1000,
        "bottom-right"
      );
    }

    if (dayBackAnlyFrndEng) {
      if (variant === "select1") {
        setDayBackAnlyFrndEngSelect1(value);
      }
      if (variant === "select2") {
        setDayBackAnlyFrndEngSelect2(value);
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
   * ===== Handle Change Re-Friending =====
   */
  const handleChangeReFrndingToggle = () => {
    setReFrndng(!reFrndng);
  };

  /**
   * Set Delete Pending Requests Increment & Decrement..
   */
  const setValOfDeletePendingFrndIncDic = (type) => {
    console.log("autoCnclFrndRque", autoCnclFrndRque);
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

      } else if (parseInt(value) > 31) {
        setDeletePendingFrndError(true);
        // setDeletePendingFrndValue(31);
        setCnclFrndRqueInput(31)

      } else if (value.includes('.')) {
        setDeletePendingFrndError(true);
        // setDeletePendingFrndValue(Math.floor(parseFloat(value)));
        setCnclFrndRqueInput(Math.floor(parseFloat(value)))
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
      console.log("checking deleting PFR status");
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
   * Delete Pending Request with Days Handler Function..
   */
  const deletePendingRequestWithDaysHandle = (event) => {
    if (autoCnclFrndRque) {
      setDeletePendingFrndError(false);
      console.log('deletePendingFrndValue', deletePendingFrndValue);

      if (!deletePendingFrndValue) {
        setDeletePendingFrndValue(1)
        setCnclFrndRqueInput(1)
      } else {
        setCnclFrndRqueInput(deletePendingFrndValue)
      }
    }
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
    saveMySetting(true);
    const storageData = {
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
              "Are you sure you want to delete all of your pending friend request(s)."
            }
            open={deletePendingFrndModalOpen}
            setOpen={setDeletePendingFrndModalOpen}
            ModalFun={deletePendingRequestHandle}
            btnText={"Yes, Delete"}
            ModalIconElement={() => <DangerIcon />}
          />
          <div className="settings setting-paper currenctly-active">

            {/* ========== Friends Settings ============ */}
            <p className="fr-heading">
              <span>Friends settings</span>
            </p>

            <div className="setting no-click">
              <Modal
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
              />
              <div className="setting-child muted-text">
                <Switch
                  upComing
                  checked={dontSendFrindReqFrnd}
                  handleChange={() => {
                    setDontSendFrindReqFrnd(!dontSendFrindReqFrnd);
                  }}
                />
                Don’t send friend request(s) to people I’ve been friends with before.
              </div>

              <span className="warn-badget">Coming soon</span>
            </div>

            <div className="setting no-click">
              <div className="setting-child muted-text">
                <Switch
                  upComing
                  checked={dontSendFrindReqIRejct}
                  handleChange={() => {
                    setDontSendFrindReqIRejct(!dontSendFrindReqIRejct);
                  }}
                />{" "}
                Don’t send friend request(s) to people who sent me friend request(s) and I rejected.
              </div>

              <span className="warn-badget">Coming soon</span>
            </div>

            <div className="setting no-click">
              <div className="setting-child muted-text">
                <Switch
                  upComing
                  checked={dontSendFrindReqThyRejct}
                  handleChange={() => {
                    setDontSendFrindReqThyRejct(!dontSendFrindReqThyRejct);
                  }}
                />
                Don’t send friend request(s) to people I sent friend request(s) and they rejected.
              </div>

              <span className="warn-badget">Coming soon</span>
            </div>


            {/* Re-Friending  setting start*/}
            <div className={`setting ${refrienderingOpen ? "setting-actived" : ""}`} onClick={() => setRefrienderingOpen(!refrienderingOpen)}>
              <div className="setting-child ">
                <Switch
                  checked={reFrndng}
                  handleChange={handleChangeReFrndingToggle}
                />
                Automated re-friending
              </div>
              <div className="setting-control">
                <figure className="icon-arrow-down">
                  {!refrienderingOpen ? <ChevronDownArrowIcon /> : <ChevronUpArrowIcon />}
                </figure>
              </div>

            </div>
            {refrienderingOpen && (
              <div className="setting-child">

                <span className="smallTxt">Automatically cancel friend request(s) that have been pending for more than</span>
                {" "}
                <TurnOnSettingsWarn enabledFeature={reFrndng}>
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
                </TurnOnSettingsWarn>
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

            <div className={`setting ${deletePendingFrndOpen ? "setting-actived" : ""}`} onClick={() => setDeletePendingFrndOpen(!deletePendingFrndOpen)}>
              <Switch
                checked={autoCnclFrndRque}
                // handleOnBlur={e => setAutoCnclFrndRque(!autoCnclFrndRque)}
                handleChange={() => setAutoCnclFrndRque(!autoCnclFrndRque)}
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
                  {!deletePendingFrndOpen ? <ChevronDownArrowIcon /> : <ChevronUpArrowIcon />}
                </figure>
              </div>
            </div>

            {deletePendingFrndOpen && (
              <div className="setting-child others">
                Cancel sent friend request(s) after
                {" "}
                <TurnOnSettingsWarn enabledFeature={autoCnclFrndRque}>
                  <div className={!autoCnclFrndRque ? "input-num disabled" : "input-num"}>
                    <input
                      type="number"
                      className="setting-input"
                      value={deletePendingFrndValue}
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
                </TurnOnSettingsWarn>
                {" "}
                day(s)

                {deletePendingFrndError && <span className="error-text">Provided value must be within the range of 1 to 31</span>}
              </div>
            )}


            <div className="setting  setting-paper no-click">
              <div className="setting-child first muted-text">
                <Switch
                  upComing
                // checked={autoCnclFrndRque}
                // handleChange={() => {
                //   setAutoCnclFrndRque(!autoCnclFrndRque);
                // }}
                />
                Friend inactivity period
              </div>
              {/* {autoCnclFrndRque && (
                <div className="setting-child others">
                  Remove sent friend request after &nbsp;{" "}
                  <input
                    type="number"
                    className="setting-input"
                    value={cnclFrndRqueInput}
                    onChange={(e) => {
                      setCnclFrndRqueInput(e.target.value);
                    }}
                  />
                  &nbsp;Time(s).
                </div>
              )} */}

              <span className="warn-badget">Coming soon</span>
            </div>

            <div className={`setting ${dayBackAnlyFrndEngOpen ? "setting-actived" : ""}`} onClick={() => setDayBackAnlyFrndEngOpen(!dayBackAnlyFrndEngOpen)}>
              <Switch
                checked={dayBackAnlyFrndEng}
                // handleOnBlur={e => setDayBackAnlyFrndEng(!dayBackAnlyFrndEng)}
                handleChange={() => setDayBackAnlyFrndEng(!dayBackAnlyFrndEng)}
              />
              {/* Day back to analyse friends engagement */}
              {/* Friend list and engagement sync time */}
              Interval for auto sync friend list

              <div className="setting-control">
                <figure className="icon-arrow-down">
                  {!dayBackAnlyFrndEngOpen ? <ChevronDownArrowIcon /> : <ChevronUpArrowIcon />}
                </figure>
              </div>
            </div>
            {dayBackAnlyFrndEngOpen && (
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


            {/* ========== Message Settings ============ */}
            <p className="fr-heading">
              <span>Message settings<span className="warn-badget">Coming soon</span></span>
            </p>

            <div className="setting  setting-paper no-click">
              <div className="setting-child first muted-text">
                <Switch
                  upComing
                  checked={sndMsgRcvFrndRqu}
                  handleChange={() => {
                    setSndMsgRcvFrndRqu(!sndMsgRcvFrndRqu);
                  }}
                />
                Send message when I accept an incoming friend request
              </div>

              {sndMsgRcvFrndRqu && (
                <div className="setting-child others no-click">
                  Select the message template you want to send &nbsp;
                  <DropSelector
                    selects={msgTmpltObj}
                    value={sndMsgRcvFrndRquMsgSelect}

                    width={"297px"}
                    handleChange={(e) => {
                      setSndMsgRcvFrndRquMsgSelect(e.target.value);
                    }}
                  />
                  &nbsp; and then, &nbsp;{" "}
                  <input
                    type="number"
                    className="setting-input"
                    value={sndMsgRcvFrndRquInput}
                    onChange={(e) => {
                      setSndMsgRcvFrndRquInput(e.target.value);
                    }}
                  />
                  <DropSelector
                    selects={periodObj}
                    value={sndMsgRcvFrndRquSelect}

                    handleChange={(e) => {
                      setSndMsgRcvFrndRquSelect(e.target.value);
                    }}
                  />
                  &nbsp; the mesage will be sent
                </div>
              )}


            </div>


            <div className="setting  setting-paper no-click">
              <div className="setting-child first muted-text">
                {" "}
                <Switch
                  upComing
                  checked={sndMsgAcptFrndRqu}
                  handleChange={() => {
                    setSndMsgAcptFrndRqu(!sndMsgAcptFrndRqu);
                  }}
                />
                Send message when I reject an incoming friend request
              </div>
              {sndMsgAcptFrndRqu && (
                <div className="setting-child others">
                  Select the message template you want to send &nbsp;
                  <DropSelector
                    selects={msgTmpltObj}
                    value={sndMsgAcptFrndRquMsgSelect}

                    width={"297px"}
                    handleChange={(e) => {
                      setSndMsgAcptFrndRquMsgSelect(e.target.value);
                    }}
                  />{" "}
                  &nbsp; and then, &nbsp;{" "}
                  <input
                    type="number"
                    className="setting-input"
                    value={sndMsgAcptFrndRquInput}
                    onChange={(e) => {
                      setSndMsgAcptFrndRquInput(e.target.value);
                    }}
                  />
                  <DropSelector
                    selects={periodObj}
                    value={sndMsgAcptFrndRquSelect}

                    handleChange={(e) => {
                      setSndMsgAcptFrndRquSelect(e.target.value);
                    }}
                  />
                  &nbsp; the mesage will be sent
                </div>
              )}


            </div>


            <div className="setting  setting-paper no-click">
              <div className="setting-child first muted-text">
                <Switch
                  upComing
                  checked={sndMsgDlcFrndRqu}
                  handleChange={() => {
                    setSndMsgDlcFrndRqu(!sndMsgDlcFrndRqu);
                  }}
                />
                Send message when someone sends me a friend request
              </div>

              {sndMsgDlcFrndRqu && (
                <div className="setting-child others">
                  Select the message template you want to send &nbsp;
                  <DropSelector
                    selects={msgTmpltObj}
                    value={sndMsgDlcFrndRquMsgSelect}

                    width={"297px"}
                    handleChange={(e) => {
                      setSndMsgDlcFrndRquMsgSelect(e.target.value);
                    }}
                  />{" "}
                  &nbsp; and then, &nbsp;{" "}
                  <input
                    type="number"
                    className="setting-input"
                    value={sndMsgDlcFrndRquInput}
                    onChange={(e) => {
                      setSndMsgDlcFrndRquinput(e.target.value);
                    }}
                  />
                  <DropSelector
                    selects={periodObj}
                    value={sndMsgDlcFrndRquSelect}

                    handleChange={(e) => {
                      setSndMsgDlcFrndRquSelect(e.target.value);
                    }}
                  />
                  &nbsp; the mesage will be sent
                </div>
              )}


            </div>


            <div className="setting  setting-paper no-click">
              <div className="setting-child first muted-text">
                <Switch
                  upComing
                  checked={sndMsgExptFrndRqu}
                  handleChange={() => {
                    setSndMsgExptFrndRqu(!sndMsgExptFrndRqu);
                  }}
                />
                Send message when someone accepted my friend request
              </div>

              {sndMsgExptFrndRqu && (
                <div className="setting-child others">
                  Select the message template you want to send &nbsp;
                  <DropSelector
                    selects={msgTmpltObj}
                    value={sndMsgExptFrndRquMsgSelect}

                    width={"297px"}
                    handleChange={(e) => {
                      setSndMsgExptFrndRquMsgSelect(e.target.value);
                    }}
                  />{" "}
                  &nbsp; and then, &nbsp;{" "}
                  <input
                    type="number"
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

            <div className="setting  setting-paper no-click">
              <div className="setting-child first muted-text">
                <Switch
                  upComing
                  checked={sndMsgExptFrndRqu}
                  handleChange={() => {
                    setSndMsgExptFrndRqu(!sndMsgExptFrndRqu);
                  }}
                />
                Send message when someone reject my friend request
              </div>

              {sndMsgExptFrndRqu && (
                <div className="setting-child others">
                  Select the message template you want to send &nbsp;
                  <DropSelector
                    selects={msgTmpltObj}
                    value={sndMsgExptFrndRquMsgSelect}

                    width={"297px"}
                    handleChange={(e) => {
                      setSndMsgExptFrndRquMsgSelect(e.target.value);
                    }}
                  />{" "}
                  &nbsp; and then, &nbsp;{" "}
                  <input
                    type="number"
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
