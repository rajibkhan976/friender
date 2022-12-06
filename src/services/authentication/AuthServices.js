import axios from "axios";
import config from "../../configuration/config";

let headers = {
  "Content-Type": "application/json"
};

export const userRegister = (email, name)=>{
  return new Promise((resolve, reject)=>{
    axios
      .post(
          config.registerUrl,
          {"email": email, "name": name },
          {headers: headers}
      ).then((result)=>{
          resolve(result.data);
      })
      .catch((error)=>{
        console.log("ERROR REGISTER:::", error?.response?.data ? error.response.data : error.message);
        reject(error?.response?.data ? error.response.data : error.message);
      })
  })
}

export const userLogin = (email, password)=>{
  return new Promise((resolve, reject)=>{
    axios
      .post(
          config.loginsUrl,
          {"email": email, "password": password }, 
          { headers: headers }
      ).then((result)=>{
          localStorage.setItem('fr_token', result.data.token);
          localStorage.setItem('fr_pass_changed', result.data.password_reset_status)
          localStorage.setItem('fr_onboarding', result.data.user_onbording_status)
          resolve(result.data);
      })
      .catch((error)=>{
        console.log("ERROR LOGIN:::", error?.response?.data ? error.response.data : error.message);
        reject(error?.response?.data ? error.response.data : error.message);
      })
  })
}

export const userLogout = () => {
  localStorage.removeItem("fr_token");
  localStorage.removeItem("fr_pass_changed");
  localStorage.removeItem("fr_onboarding");
  localStorage.removeItem("fr_default_fb");
  localStorage.removeItem("fr_default_email");
  localStorage.removeItem('syncedFriend');
  return true;
};

export const forgetPassword = (email)=>{
  return new Promise((resolve, reject)=>{
    axios
      .post(
        config.forgetpasswordUrl,
        {"email": email},
        {headers: headers}
      ).then((result)=>{
          resolve(result.data);
      })
      .catch((error)=>{
        console.log("ERROR FORGET:::", error);
        reject(error?.response?.data ? error.response.data : error.message);
      })
  })
}

export const resetPassword = (token, password)=>{
  return new Promise((resolve, reject)=>{
    axios
      .post(
        config.resetpasswordUrl,
        {
          "token": token,
          "password": password
        },
        {headers: headers}
      ).then((result)=>{
          resolve(result.data);
      })
      .catch((error)=>{
        console.log("ERROR RESET:::", error);
        reject(error?.response?.data ? error.response.data : error.message);
      })
  })
}




export const resetUserPassword = (token, password)=>{
  return new Promise((resolve, reject)=>{
    axios
      .post(
        config.resetuserpasswordUrl,
        {
          "token": token,
          "password": password
        },
        {headers: headers}
      ).then((result)=>{
          resolve(result.data);
          localStorage.setItem('fr_pass_changed', 1);
      })
      .catch((error)=>{
        console.log("ERROR USER RESET:::", error);
        reject(error?.response?.data ? error.response.data : error.message);
      })
  })
}


export const onboarding = (token,question_one, question_two, question_three)=>{
  return new Promise((resolve, reject)=>{
    axios
      .post(
          config.onboardingUrl,
          {"question_one": question_one, "question_two": question_two, "question_three": question_three,"token": token  }, 
          { headers: headers }
      ).then((result)=>{
          resolve(result.data);
          //localStorage.setItem('fr_onboarding', result.data.user_onbording_status)
      })
      .catch((error)=>{
        console.log("ERROR ONBOARDING:::", error);
        reject(error?.response?.data ? error.response.data : error.message);
      })
  })
}