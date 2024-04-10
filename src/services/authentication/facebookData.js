import axios from "axios";
import config from "../../configuration/config";
import Alertbox from "../../components/common/Toast";
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
        // console.log("result",result)
          resolve(result);
      })
      .catch((error)=>{ 
        if(error == "Request failed with status code 409"){
           Alertbox(
            `The facebook account you are trying to connect is already connected to a different account.`,
            "error",
            1000,
            "bottom-right"
          );
        }
        resolve(error?.response?.data ? error.response.data : error.message);
      })
  })
}

export const fetchUserProfile = ()=>{
  return new Promise((resolve, reject)=>{
    axios
      .get(
        config.fetchprofileDataUrl,
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
