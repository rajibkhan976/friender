import axios from "axios";
import config from "../../configuration/config";

let headers = {
  "Content-Type": "application/json"
};

export const userRegister = (email)=>{
  return new Promise((resolve, reject)=>{
    axios
      .post(
          config.registerUrl,
          {"email": email},
          {headers: headers}
      ).then((result)=>{
          resolve(result.data);
      })
      .catch((error)=>{
          reject(error);
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
          resolve(result.data);
      })
      .catch((error)=>{
        reject(error.response.data);
      })
  })
}

export const userLogout = () => {
  localStorage.removeItem("fr_token");
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
        // console.log("error:::", error.message);
          reject(error.message);
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
        // console.log("error:::", error.message);
          reject(error.message);
      })
  })
}