import axios from "axios";
import config from "../../configuration/config";
import extensionAccesories from "../../configuration/extensionAccesories";
import helper from "../../helpers/helper"
let headers = {
  "Content-Type": "application/json",
};

export const userRegister = (email, name) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        config.registerUrl,
        { email: email, name: name },
        { headers: headers }
      )
      .then((result) => {
        resolve(result.data);
      })
      .catch((error) => {
        console.log(
          "ERROR REGISTER:::",
          error?.response?.data ? error.response.data : error.message
        );
        reject(error?.response?.data ? error.response.data : error.message);
      });
  });
};

export const userLogin = (email, password) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        config.loginsUrl,
        { email: email, password: password },
        { headers: headers }
      )
      .then(async(result) => {
        localStorage.setItem("fr_token", result.data.token);
        const isExtensionInstalled = await extensionAccesories.isExtensionInstalled({
          action: "extensionInstallation",
          frLoginToken: result.data.token,
          frDebugMode: result.data.debug_mode,
        });
        if(isExtensionInstalled){
          extensionAccesories.sendMessageToExt({
            action: "frienderLogin",
            frLoginToken: result.data.token
          });
        }
        localStorage.setItem(
          "fr_pass_changed",
          result.data.password_reset_status
        );
        localStorage.setItem(
          "fr_onboarding",
          result.data.user_onbording_status
        );
        localStorage.setItem(
          "fr_debug_mode",
          result.data.debug_mode
        );
        // call the function to store device info
        storeDeviceInformations();
        resolve(result.data);
      })
      .catch((error) => {
        // console.log(
        //   "ERROR LOGIN:::",
        //   error?.response?.data ? error.response.data : error.message
        // );
        reject(error?.response?.data ? error.response.data : error.message);
      });
  });
};

export const userLogout = () => {
  helper.deleteCookie("deleteAllPendingFR");
  localStorage.removeItem("fr_token");
  localStorage.removeItem("fr_pass_changed");
  localStorage.removeItem("fr_onboarding");
  localStorage.removeItem("fr_default_fb");
  localStorage.removeItem("fr_default_email");
  localStorage.removeItem("syncedFriend");
  localStorage.removeItem("onboaring_page_check")
  localStorage.removeItem('fr_gs_synced')
  /**
   * Removing facebook auth information when user is logging out.
   */
  localStorage.removeItem("fr_facebook_auth")
  extensionAccesories.isExtensionInstalled({
    action: "logout",
  });
  localStorage.removeItem("fr_device_id");
  localStorage.removeItem("fr_debug_mode");
  return true;
};

export const forgetPassword = (email) => {
  return new Promise((resolve, reject) => {
    axios
      .post(config.forgetpasswordUrl, { email: email }, { headers: headers })
      .then((result) => {
        resolve(result.data);
      })
      .catch((error) => {
        //console.log("ERROR FORGET:::", error);
        reject(error?.response?.data ? error.response.data : error.message);
      });
  });
};

export const resetPassword = (token, password) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        config.resetpasswordUrl,
        {
          token: token,
          password: password,
        },
        { headers: headers }
      )
      .then((result) => {
        resolve(result.data);
      })
      .catch((error) => {
        //console.log("ERROR RESET:::", error);
        reject(error?.response?.data ? error.response.data : error.message);
      });
  });
};

export const resetUserPassword = (token, password) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        config.resetuserpasswordUrl,
        {
          token: token,
          password: password,
        },
        { headers: headers }
      )
      .then((result) => {
        resolve(result.data);
        localStorage.setItem("fr_pass_changed", 1);
      })
      .catch((error) => {
        //console.log("ERROR USER RESET:::", error);
        reject(error?.response?.data ? error.response.data : error.message);
      });
  });
};

export const onboarding = (
  token,
  question_one,
  question_two,
  question_three,
  question_four
) => {
  return new Promise((resolve, reject) => {
    // console.log({
    //   question_one: question_one,
    //   question_two: question_two,
    //   question_three: question_three,
    //   question_four: question_four,
    //   token: token,
    // });
    axios
      .post(
        config.onboardingUrl,
        {
          question_one: question_one,
          question_two: question_two,
          question_three: question_three,
          question_four: question_four,
          token: token,
        },
        { headers: headers }
      )
      .then((result) => {
        resolve(result.data);
        //localStorage.setItem('fr_onboarding', result.data.user_onbording_status)
      })
      .catch((error) => {
        //console.log("ERROR ONBOARDING:::", error);
        reject(error?.response?.data ? error.response.data : error.message);
      });
  });
};

/**
 * Function to store device informations
 */
export const storeDeviceInformations = async () => {
  let isInstalled = await extensionAccesories.isExtensionInstalled({
    action: "extensionInstallation",
    frLoginToken: localStorage.getItem("fr_token"),
  });
  if (isInstalled) {
    let deviceId = generateDeviceId();
    let osName = getOsName();
    let browserName = getBrowserName();
    localStorage.setItem("fr_device_id", deviceId);
    return new Promise((resolve, reject) => {
      axios
        .post(
          config.storeDeviceInformationUrl,
          {
            deviceId: deviceId,
            automation: "No",
            os_name: osName,
            browser_name: browserName,
          },
          { headers: headers }
        )
        .then((result) => {
          resolve(result.data);
        })
        .catch((error) => {
          console.log("Error on storing device informations :::", error);
          reject(error?.response?.data ? error.response.data : error.message);
        });
    });
  }
};
/**
 * Function to generate unique device id
 * @returns
 */
export const generateDeviceId = () => {
  var navigator_info = window.navigator;
  var screen_info = window.screen;
  var uid = navigator_info.mimeTypes.length;
  uid += navigator_info.userAgent.replace(/\D+/g, "");
  uid += navigator_info.plugins.length;
  uid += screen_info.height || "";
  uid += screen_info.width || "";
  uid += screen_info.pixelDepth || "";
  return uid;
};
/**
 * Function to get OS name
 * @returns
 */
export const getOsName = () => {
  var detectOS = "Unknown OS";
  if (navigator.appVersion.indexOf("Win") != -1) detectOS = "Windows";
  if (navigator.appVersion.indexOf("Mac") != -1) detectOS = "Mac";
  if (navigator.appVersion.indexOf("Linux") != -1) detectOS = "Linux";
  return detectOS;
};
/**
 * Function to get browser name
 * @returns
 */
export const getBrowserName = () => {
  var browser;
  // Check for browser name
  if (navigator.userAgent.indexOf("Chrome") !== -1) {
    browser = "Chrome";
  } else if (navigator.userAgent.indexOf("Firefox") !== -1) {
    browser = "Firefox";
  } else if (navigator.userAgent.indexOf("Safari") !== -1) {
    browser = "Safari";
  } else if (navigator.userAgent.indexOf("MSIE") !== -1) {
    browser = "Internet explorer";
  } else if (navigator.userAgent.indexOf("Trident") !== -1) {
    browser = "Internet explorer";
  } else {
    browser = "Unknown";
  }
  let ieCheck = /Edg/.test(navigator.userAgent);
  if (ieCheck) {
    browser = "Edge";
  }
  let isOPR = /OPR/.test(navigator.userAgent);
  if (isOPR) {
    browser = "Opera";
  }
  if (navigator.brave) {
    browser = "Brave";
  }
  return browser;
};
