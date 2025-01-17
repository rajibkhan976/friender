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
        // console.log("ERROR FRIENDLIST::::", error?.response?.data ? error.response.data : error.message);
        reject(error?.response?.data ? error.response.data : error.message);
      })
  })
}

const fb_user_id= localStorage.getItem("fr_default_fb");
export const fetchFriendList2 = (queryParams)=>{
  return new Promise((resolve, reject)=>{
    axios
      .get(
          config.fetchFriendListUrlv2,
          { params: { ...queryParams, fb_user_id }, headers: headers },
      ).then((result)=>{
          resolve(result.data);
      })
      .catch((error)=>{
        resolve({})
        // console.log("ERROR FRIENDLIST::::", error?.response?.data ? error.response.data : error.message);
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
      ).then((res)=>{
        resolve({data:JSON.parse(res.config.data),message:res.data});
      })
      .catch((error)=>{
        // console.log("ERROR WHITELIST::::", error?.response?.data ? error.response.data : error.message);
        reject(error?.response?.data ? error.response.data : error.message);
      })
  })
}


export const BlockListFriends = async (payload)=>{
  return new Promise((resolve, reject)=>{
    axios
      .post(
          config.blockListUserUrl,
          payload,
          {headers: headers}
      ).then((res)=>{
        resolve({data:JSON.parse(res.config.data),message:res.data})
      })
      .catch((error)=>{
        // console.log("ERROR WHITELIST::::", error?.response?.data ? error.response.data : error.message);
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
          console.log("RESULT __ ", result);
          resolve(result.data);
      })
      .catch((error)=>{
        // console.log("ERROR WHITELIST::::", error?.response?.data ? error.response.data : error.message);
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
        // console.log("ERROR LOST FRIEND:::", error?.response?.data ? error.response.data : error.message);
        reject(error?.response?.data ? error.response.data : error.message);
      })
  })
}



export const fetchSenFriendReqList= (payload)=>{
  return new Promise((resolve, reject)=>{
    axios
      .post(
          config.fetchSendFriendReqUrl,
          payload,
          {headers: headers}
      ).then((result)=>{
          resolve(result.data);
      })
      .catch((error)=>{
        // console.log("ERROR LOST FRIEND:::", error?.response?.data ? error.response.data : error.message);
        reject(error?.response?.data ? error.response.data : error.message);
      })
  })
}

export const getUserSyncDataS = (payload) => {
  // console.log('fb_user_id >>>>>>>', fb_user_id, ':::::::::::::::', payload);
  return new Promise((resolve, reject) => {
    axios
      .get(
        config.userSyncDataFetchUrl+`?fb_user_id=${payload}`,
        {headers: headers}
      ).then((res) => {
        resolve(res.data);
      }).catch((error) => {
        console.log('error >>>>>>', error);
        reject(error)
      })
  })
}