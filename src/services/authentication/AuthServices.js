import axios from "axios";
import config from "../../configuration/config";
import extensionAccesories from "../../configuration/extensionAccesories";
import helper from "../../helpers/helper"
import { fRQueueExtMsgSendHandler } from "../../actions/FriendsQueueActions";
let headers = {
  "Content-Type": "application/json",
};


/**
 // #region Alert Status Update
 * @returns 
 */
export const alertUserStatusUpdate = () => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        config.userAlertStatusUpdateUrl,
        { headers: headers }
      ).then((result) => {
        resolve(result.data);

      }).catch((error) => {
        console.log('ERROR IN COMMUNICATION TO ALERT USER UPDATE::::', error);
        reject(error?.response?.data ? error.response.data : error.message);
      })
  })
}


/**
 // #region Kyubi User Check
 * @param {*} extId 
 * @param {*} email 
 * @returns 
 */
export const kyubiUserCheck = (extId, email) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        config.kyubiServerCheckUserUrl,
        {
          "extId": extId,
          "email": email,
        },
        { headers: headers }
      ).then((result) => {
        resolve(result.data)
      }).catch((error) => {
        console.log('ERROR IN COMMUNICATION TO KYUBI SERVER::::', error);
        reject(error?.response?.data ? error.response.data : error.message);
      })
  })
}



export const checkUserEmail = (email) => {
  console.log('email >>>', email);
  return new Promise((resolve, reject) => {
    axios
      .post(
        config.checkRegisterEmail,
        {
          "email": email
        },
        { headers: headers }
      ).then((result) => {
        resolve(result.data)
      }).catch((error) => {
        console.log('ERROR IN REGISTERING EMAIL::::', error);
        reject(error?.response?.data ? error.response.data : error.message);
      })
  })
}

export const userRegister = (regPayload) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        config.registerUrl,
        regPayload,
        { headers: headers }
      )
      .then((result) => {
        resolve(result.data);
      })
      .catch((error) => {
        console.log(
          "ERROR REGISTER:::",
          error
        );
        reject(error?.response?.data ? error.response.data : error.message);
      });
  });
};

// export const userLoginOld = (email, password) => {
//   console.log('TRYING LOGGING IN WITH IN SERVICE', email, password);
//   return new Promise((resolve, reject) => {
//     axios
//       .post(
//         config.loginsUrl,
//         { email: email, password: password },
//         { headers: headers }
//       )
//       .then(async (result) => {
//         console.log('USER LOGIN RESULT (resolve) - ', result?.request?.status);
//         // console.log('GOT RESULT IN SERVICE::::', result);
//         if (result.request?.status === 200) {
//           localStorage.setItem("fr_token", result.data.token);
//           const isExtensionInstalled = await extensionAccesories.isExtensionInstalled({
//             action: "extensionInstallation",
//             frLoginToken: result.data.token,
//             frDebugMode: result.data.debug_mode,
//           });

//           console.log('Login error here - ', result);

//           console.log("log innnnnn")
//           const res = await fRQueueExtMsgSendHandler({
//             frQueueRunning: false,
//             requestLimited: false,
//             requestLimitValue: 0
//           })
//           console.log("frq msg resp", res);
//           if (isExtensionInstalled) {
//             // console.log('GOT RESULT IN SERVICE:::: EXTENSION IS INSTALLED');
//             extensionAccesories.sendMessageToExt({
//               action: "frienderLogin",
//               frLoginToken: result.data.token,
//               userPlan: result?.data?.plan ? result.data.plan : "0"
//             });
//           }
//           localStorage.setItem(
//             "fr_pass_changed",
//             result.data.password_reset_status
//           );
//           localStorage.setItem(
//             "fr_onboarding",
//             result.data.user_onbording_status
//           );
//           localStorage.setItem(
//             "fr_debug_mode",
//             result.data.debug_mode
//           );
//           localStorage.setItem(
//             "fr_plan",
//             result?.data?.plan
//           );
//           localStorage.setItem(
//             "fr_plan_name",
//             result?.data?.plan_name
//           );
//           // call the function to store device info
//           storeDeviceInformations();
//           // console.log('loginuser responded IN SERVICE ', result);
//           console.log('USER LOGIN RESULT (resolve) - ', result);
//           resolve(result.data);
//         } else {
//           console.log('USER LOGIN RESULT (reject) - ', result);
//           reject(result);
//         }
//       })
//       .catch((error) => {
//         // console.log(
//         //   "ERROR LOGIN:::",
//         //   error?.response?.data ? error.response.data : error.message
//         // );
//         console.log('USER LOGIN RESULT (error) - ', error);
//         reject(error?.response?.data ? error.response.data : error.message);
//       });
//   });
// };

/**
 * USER LOGIN WITH PROPER ERROR MESSAGE HANDLE
 * @param {*} email 
 * @param {*} password 
 * @returns 
 */
export const userLogin = (email, password) => {
  return new Promise((resolve, reject) => {
    fetch(config.loginsUrl, {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then(async (response) => {
        const result = await response.json();
        // console.log('USER LOGIN RESULT - ', result);

        if (response.ok) {
          // Handle successful response
          // console.log('Login successful:', result);
          localStorage.setItem("fr_token", result.token);
          localStorage.setItem("fr_amount", result?.amount);

          // Check if extension is installed
          const isExtensionInstalled = await extensionAccesories.isExtensionInstalled({
            action: "extensionInstallation",
            amount: result.amount,
            frLoginToken: result.token,
            frDebugMode: result.debug_mode,
          });

          // Send message to extension if installed
          if (isExtensionInstalled) {
            extensionAccesories.sendMessageToExt({
              action: "frienderLogin",
              amount: result.amount,
              frLoginToken: result.token,
              userPlan: result.plan || "0"
            });
          }

          // Store additional information in localStorage
          localStorage.setItem("fr_pass_changed", result.password_reset_status);
          localStorage.setItem("fr_onboarding", result.user_onbording_status);
          localStorage.setItem("fr_debug_mode", result.debug_mode);
          localStorage.setItem("fr_plan", result.plan);
          localStorage.setItem("fr_plan_name", result.plan_name);

          // Call function to store device info
          storeDeviceInformations();

          // console.log('USER LOGIN RESULT (resolve) - ', result);

          // Resolve with successful data
          resolve(result);
        } else {
          // console.log('USER LOGIN RESULT (reject) - ', result);
          reject(result);
        }
      })
      .catch((error) => {
        // console.error('Error during login:', error);
        reject(error.message || 'Network error');
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
        // console.log("ERROR USER RESET:::", error);
        if (error === "Request failed with status code 400") {
          reject("Password is not accepted please re-try with a new password!")
        } else {
          reject(error?.response?.data ? error.response.data : error.message);
        }
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
    amount: localStorage.getItem("fr_amount")
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
