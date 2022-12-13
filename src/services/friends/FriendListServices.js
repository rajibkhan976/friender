import axios from "axios";
import config from "../../configuration/config";

let headers = {
  "Content-Type": "application/json"
};

export const fetchFriendList = (payload)=>{
  return new Promise((resolve, reject)=>{
    axios
      .post(
          config.fetchFriendListUrl,
          payload,
          {headers: headers}
      ).then((result)=>{
          resolve(result.data);
      })
      .catch((error)=>{
        resolve({})
        console.log("ERROR FRIENDLIST::::", error?.response?.data ? error.response.data : error.message);
        reject(error?.response?.data ? error.response.data : error.message);
      })
  })
}
// export const deleteFriends = (payload)=>{
//   return new Promise((resolve, reject)=>{
//     axios
//       .post(
//           config.fetchFriendListUrl,
//           payload,
//           {headers: headers}
//       ).then((result)=>{
//           resolve(result.data);
//       })
//       .catch((error)=>{
//         console.log("ERROR DELETE FRIEND::::", error?.response?.data ? error.response.data : error.message);
//         reject(error?.response?.data ? error.response.data : error.message);
//       })
//   })
// }
export const whiteListFriends = async (payload)=>{
  return new Promise((resolve, reject)=>{
    axios
      .post(
          config.whiteListFriend,
          payload,
          {headers: headers}
      ).then((result)=>{
          resolve(result.data);
      })
      .catch((error)=>{
        console.log("ERROR WHITELIST::::", error?.response?.data ? error.response.data : error.message);
        reject(error?.response?.data ? error.response.data : error.message);
      })
  })
}
export const deleteFriends = (payload)=>{
  return new Promise((resolve, reject)=>{
    axios
      .post(
          config.deleteFriend,
          payload,
          {headers: headers}
      ).then((result)=>{
          resolve(result.data);
      })
      .catch((error)=>{
        console.log("ERROR WHITELIST::::", error?.response?.data ? error.response.data : error.message);
        reject(error?.response?.data ? error.response.data : error.message);
      })
  })
}

export const fetchFriendLost = (payload)=>{
  return new Promise((resolve, reject)=>{
    axios
      .post(
          config.fetchFriendLostUrl,
          payload,
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