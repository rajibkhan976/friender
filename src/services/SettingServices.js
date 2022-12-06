import axios from "axios";
import config from "../configuration/config";
let headers = {
  "Content-Type": "application/json",
};

export const saveSettings = (data) => {
  console.log("API PAYLOAD", data);
  return new Promise((res, rej) => {
    axios
      .post(config.mysettingSaveUrl, data, { headers: headers })
      .then((result) => {
        res(result.data);
      })
      .catch((error) => {
        rej(error?.response?.data ? error.response.data : error.message);
      });
  });
};

export const fetchProfileSetting = (data) => {
  return new Promise((res, rej) => {
    axios
      .post(config.fetchprofileSettingUrl, data, { headers: headers })
      .then((result) => {
        res(result.data);
      })
      .catch((error) => {
        rej(error?.response?.data ? error.response.data : error.message);
      });
  });
};
