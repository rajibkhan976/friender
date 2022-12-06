import axios from "axios";
import config from "../../configuration/config";

let headers = {
  "Content-Type": "application/json"
};

export const saveUserProfile = (profilebody)=>{
  return new Promise((resolve, reject)=>{
    axios
      .post(
        config.saveprofileDataUrl,
        profilebody,
        {headers: headers}
      ).then((result)=>{
          resolve(result.data);
      })
      .catch((error)=>{
        // console.log("error:::", error.message);
        reject(error?.response?.data ? error.response.data : error.message);
      })
  })
}

export const fetchUserProfile = (profilebody)=>{
    return new Promise((resolve, reject)=>{
      axios
        .post(
          config.fetchprofileDataUrl,
          profilebody,
          {headers: headers}
        ).then((result)=>{
            resolve(result.data.data);
        })
        .catch((error)=>{
          // console.log("error:::", error.message);
          reject(error?.response?.data ? error.response.data : error.message);
        })
    })
  }