/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch } from "react-redux";
import Moment from "react-moment";
// import SettingLoader from "../../components/common/loaders/SettingLoader";
import Modal from "../../components/common/Modal";
import NoDataFound from "../../components/common/NoDataFound";
// import Chrome from "../../assets/images/chrome.png";
// import Opera from "../../assets/images/opera.png";
// import Windows from "../../assets/images/windows.png";
// import Mac from "../../assets/images/mac.png";
import DeleteImgIcon from "../../assets/images/deleteModal.png";
import {
  deleteDevice,
  fetchDiviceHistory,
  updateDeviceName,
} from "../../services/SettingServices";
import {
  EditNameIcon,
  Calender,
  Cross,
  BrowserIcon,
} from "../../assets/icons/Icons";
import Alertbox from "../../components/common/Toast";
import "../../assets/scss/component/common/_browserHistory.scss"
const BrowserManager = () => {
  let current_device_id = localStorage.getItem("fr_device_id");
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [updatedValue, setUpdatedValue] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [browserHistoryInfo, setBrowserHistoryInfo] = useState(null);
  const [editName, setEditName] = useState(false);
  const [blankName, setBlankName] = useState(false);
  const [deviceDelete, setDeviceDelete] = useState(null);
  const [deviceNameDelete, setDeviceNameDelete] = useState(null);
  //console.log("The updates value length", updatedValue.length);

  // if(updatedValue.length === 0) {
  //   setBlankName(true)
  // }

  const handleKeyDown = (el, idx) => {
    let browserItemsPlaceholder = [...browserHistoryInfo];

    if (el.key === "Enter") {
      browserItemsPlaceholder.filter(
        (item) => item._id === idx
      )[0].device_name = el.target.value;
      setBrowserHistoryInfo(browserItemsPlaceholder);
      if (!el.target.value) {
        let errMsg = "Device name is required!";
        Alertbox(errMsg, "error", 1000, "bottom-right");
        setBlankName(true);
        return;
      }
      const payloadUpdateDeveice = {
        deviceInformationsId: idx,
        deviceName: el.target.value,
      };
      updateDeviceName(payloadUpdateDeveice)
        .then((res) => {
          if (res) {
            browserItemsPlaceholder.filter((item) => item._id === idx)[0] =
              res.data;
            setBrowserHistoryInfo(browserItemsPlaceholder);
            // console.log("ITEM UPDATED");
            // console.log("name updated!", res.data);
            setBlankName(false);
            setUpdatedValue(false);
          }
        })
        .catch((err) => {
          //console.log(err);
        })
        .finally(() => {
          setEditName(null);
        });
    }
  };

  const startDeletion = (deviceId, deviceName) => {
    setDeviceDelete(deviceId);
    setDeviceNameDelete(deviceName);
    setModalOpen(true);
  };

  const confirmDeletion = () => {
    const deletePayload = {
      deviceInformationsId: deviceDelete,
    };

    deleteDevice(deletePayload)
      .then((res) => {
        if (res) {
          fetchDevices();
          setModalOpen(false);
        }
      })
      .catch((err) => {
        //console.log(err);
      });
  };

  useEffect(() => {
    if (!modalOpen) {
      setDeviceDelete(null);
      setDeviceNameDelete(null);
    }
  }, [modalOpen]);

  useEffect(() => {
    if (updatedValue.length === 0) {
      setBlankName(true);
      //console.log("the state value is", blankName);
    } else {
      setBlankName(false);
    }
  }, [blankName, updatedValue]);

  const fetchDevices = () => {
    setLoading(true);
    fetchDiviceHistory()
      .then((res) => {
        if (res) {
          //console.log("res:::::", res);
          setBrowserHistoryInfo(res.data);
        }
      })
      .catch((err) => {
        //console.log("the response of broswerHistory", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDevices();
  }, []);

//   useEffect(() => {
//   const thisBrowserInfo = browserHistoryInfo.filter(item =>
//     item.device_id === current_device_id

//   );

//   console.log("The new array info is is", thisBrowserInfo);
// }, []);

  return (
    <div className="setting-content request-sent-wraper browser-manager">
      <div className="settings paper">
        <div className="setting">
          <div className="info-wraper">
            <div className="setting  paper setting-checked inividual-info allocated-browser">
              <figure>
                <BrowserIcon />
              </figure>
              <div className="individuals-informations">
                <h4 className="allowed-browser-info">&infin;</h4>
                <p>Number of allowed browsers</p>
              </div>
            </div>
          </div>
          {browserHistoryInfo != null && (
            <p className="signin-details-info">
              Where you’re signed in <span>{browserHistoryInfo?.length}</span>
            </p>
          )}
        </div>

        {browserHistoryInfo != null && (
          <div className="history-listing-wrapers browsers-history ">
            <div className="browser-table-wraper">
              <div className="browser-table-row">
                <div className="browser-table-column">
                  <p className="table-heading">Device Info</p>
                </div>
                <div className="browser-table-column">
                  <p className="table-heading">System</p>
                </div>
                <div className="browser-table-column">
                  <p className="table-heading">IP address</p>
                </div>
                <div className="browser-table-column text-center">
                  <p className="table-heading">Automation </p>
                </div>
                <div className="browser-table-column">
                  <p className="table-heading">Last loged In</p>
                </div>
                <div className="browser-table-column">
                  <p className="table-heading"></p>
                </div>
              </div>

              {/* {console.log(browserHistoryInfo?.filter(el => el.device_id === current_device_id)[0])} */}
              {browserHistoryInfo?.filter(el => el.device_id === current_device_id)
                .map((item, index) => (
                <div className="browser-table-row" key={item._id}>
                  <div className="browser-table-column">
                    <div className="table-details">
                      <figure className={`device-icon ${item.os_name}`}>
                        {/* <img src={Windows} alt="" /> */}
                      </figure>
                      <div className="browser-name">
                        <div
                          className={
                            editName === item._id
                              ? "display-name-info hide"
                              : "display-name-info"
                          }
                        >
                          <p>{item.device_name}</p>
                          <span
                            className={
                              blankName
                                ? "edit-browser-name no-edit"
                                : "edit-browser-name"
                            }
                            onClick={() => setEditName(item._id)}
                          >
                            <EditNameIcon />
                          </span>
                        </div>
                        <div
                          className={
                            editName === item._id
                              ? "display-name-edit"
                              : "display-name-edit hide"
                          }
                        >
                          <span className="display-name-edit-wrapers">
                            <input
                              type="text"
                              onKeyDown={(e) => handleKeyDown(e, item._id)}
                              className="form-control"
                              defaultValue={item.device_name}
                              onChange={(e) => {
                                setUpdatedValue(e.target.value.trim());
                              }}
                            />
                            {/* {!blankName &&( */}
                            <span
                              className={
                                blankName ? "close-edit no-edit" : "close-edit"
                              }
                              onClick={() => setEditName(null)}
                            >
                              <Cross />
                            </span>
                            {/* )} */}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="browser-table-column">
                    <figure
                      className={`browser-logo ${item.browser_name}`}
                    ></figure>
                  </div>
                  <div className="browser-table-column">
                    <p>{item.ip_address}</p>
                  </div>
                  <div
                    className="browser-table-column">
                    <p className={`prefix-automation-${item.automation}`}>{item.automation}</p>
                  </div>
                  <div className="browser-table-column">
                    <div className="table-details">
                      <figure className="left-icon">
                        <Calender />
                      </figure>
                      <p className="info-texts">
                      <span className="time-section"><Moment format=" Do MMMM YYYY">
                          {item.updated_at}
                        </Moment></span>
                        <Moment format="h:mm a">
                          {item.updated_at}
                        </Moment>
                      </p>
                    </div>
                  </div>
                  <div className="browser-table-column">
                    <div
                      className="table-details this-device"
                    >
                      <button className="current-device">This device</button>
                    </div>
                  </div>
                </div>
              ))}

              {browserHistoryInfo?.filter(el => el.device_id !== current_device_id).map((item, index) => (
                <div className="browser-table-row" key={item._id}>
                  <div className="browser-table-column">
                    <div className="table-details">
                      <figure className={`device-icon ${item.os_name}`}>
                        {/* <img src={Windows} alt="" /> */}
                      </figure>
                      <div className="browser-name">
                        <div
                          className={
                            editName === item._id
                              ? "display-name-info hide"
                              : "display-name-info"
                          }
                        >
                          <p>{item.device_name}</p>
                          <span
                            className={
                              blankName
                                ? "edit-browser-name no-edit"
                                : "edit-browser-name"
                            }
                            onClick={() => setEditName(item._id)}
                          >
                            <EditNameIcon />
                          </span>
                        </div>
                        <div
                          className={
                            editName === item._id
                              ? "display-name-edit"
                              : "display-name-edit hide"
                          }
                        >
                          <span className="display-name-edit-wrapers">
                            <input
                              type="text"
                              onKeyDown={(e) => handleKeyDown(e, item._id)}
                              className="form-control"
                              defaultValue={item.device_name}
                              onChange={(e) => {
                                setUpdatedValue(e.target.value.trim());
                              }}
                            />
                            {/* {!blankName &&( */}
                            <span
                              className={
                                blankName ? "close-edit no-edit" : "close-edit"
                              }
                              onClick={() => setEditName(null)}
                            >
                              <Cross />
                            </span>
                            {/* )} */}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="browser-table-column">
                    <figure
                      className={`browser-logo ${item.browser_name}`}
                    ></figure>
                  </div>
                  <div className="browser-table-column">
                    <p>{item.ip_address}</p>
                  </div>
                  <div
                    className="browser-table-column">
                    <p className={`prefix-automation-${item.automation}`}>{item.automation}</p>
                  </div>
                  <div className="browser-table-column">
                    <div className="table-details">
                      <figure className="left-icon">
                        <Calender />
                      </figure>
                      <p className="info-texts">
                      <span className="time-section"><Moment format=" Do MMMM YYYY">
                          {item.updated_at}
                        </Moment></span>
                        <Moment format="h:mm a">
                          {item.updated_at}
                        </Moment>
                      </p>
                    </div>
                  </div>
                  <div className="browser-table-column">
                    <div
                      className={
                        current_device_id === item.device_id
                          ? "table-details this-device"
                          : "table-details other-device"
                      }
                      onClick={() => {
                        startDeletion(item._id, item.device_name);
                      }}
                    >
                      {item.device_id === current_device_id ? (
                        <button className="current-device">This device</button>
                      ) : (
                        <button className="different-device">REMOVE</button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {browserHistoryInfo === null && <NoDataFound />}
      </div>
      {modalOpen && (
        <Modal
          modalType="delete-type"
          modalIcon={DeleteImgIcon}
          headerText={"Remove"}
          bodyText={
            <p>
              Are you sure you want to remove &nbsp;<b>{deviceNameDelete}</b>
            </p>
          }
          open={modalOpen}
          setOpen={setModalOpen}
          ModalFun={() => confirmDeletion()}
          btnText={"Yes, Remove"}
        />
      )}
    </div>
  );
};

export default BrowserManager;
