import axios from "axios";
import config from "../configuration/config";
let headers = {
  "Content-Type": "application/json",
};



/**
 * ==== Fetch All Pending Friend Request ====
 * @param {object} data 
 * @returns 
 */
export const deletePendingFrndRequest = (data) => {
  return new Promise((res, rej) => {
    axios.post(config.deletePendingFrndsRequest, data, { headers: headers })
      .then((result) => {
        console.log("Delete Pending Frnd Request -- ", result.data);
        res(result.data);
      })
      .catch((error) => {
        rej(error?.response?.data ? error.response.data : error.message);
      });
  });
};


/**
 * ==== Fetch All Pending Friend Request ====
 * @param {object} data 
 * @returns 
 */
export const fetchAllPendingFrndRequest = (data) => {
  console.log("Sending to -- ", data);
  return new Promise((res, rej) => {
    axios.post(config.fetchAllPendingFrnds, data, { headers: headers })
      .then((result) => {
        res(result.data);
      })
      .catch((error) => {
        rej(error?.response?.data ? error.response.data : error.message);
      });
  });
};

export const saveSettings = (data) => {
  // console.log("API PAYLOAD", data);
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

export const fetchDiviceHistory = () => {
  return new Promise((res, rej) => {
    axios
      .get(config.fetchDiviceHistoryUrl, { headers: headers })
      .then((result) => {
        res(result.data);
      })
      .catch((error) => {
        rej(error?.response?.data ? error.response.data : error.message);
      });
  });
};

export const fetchFriendRequestSettings = (data) => {
  return new Promise((res, rej) => {
    axios
      .post(config.fetchRequestSettingsUrl, data, { headers: headers })
      .then((result) => {
        // console.log("fetched data", result);
        res(result?.data?.data);
      })
      .catch((error) => {
        rej(error?.response?.data ? error.response.data : error.message);
      });
  });
};

export const updateDefaultFriendRequestSettings = (data) => {
  return new Promise((res, rej) => {
    axios
      .post(config.updateDefaultFriendRequestSettings, data, {
        headers: headers,
      })
      .then((result) => {
        //console.log(result.data.data);
        res(result.data.data);
      })
      .catch((error) => {
        //console.log(error);
        rej(error?.response?.data ? error.response.data : error.message);
      });
  });
};

export const updateDeviceName = (data) => {
  return new Promise((res, rej) => {
    axios
      .post(config.updateDeviceNameUrl, data, { headers: headers })
      .then((result) => {
        res(result.data);
      })
      .catch((error) => {
        rej(error?.response?.data ? error.response.data : error.message);
      });
  });
};

export const deleteDevice = (data) => {
  //console.log("data", data);
  return new Promise((res, rej) => {
    axios
      .post(config.deleteDeviceUrl, data, { headers: headers })
      .then((result) => {
        res(result.data);
        //console.log("Result after delete",result.data);
      })
      .catch((error) => {
        rej(error?.response?.data ? error.response.data : error.message);
      });
  });
};
