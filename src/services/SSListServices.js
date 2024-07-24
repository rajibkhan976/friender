import axios from "axios";
import config from "../configuration/config";

let headers = {
  "Content-Type": "application/json",
};

/**
 * ===== Bulk Actions for Listing =====
 */

export const fetchFriendCount = (payload) => {
    const params = payload.queryParam;
    return new Promise((res, rej) => {
        axios
            .get(
                config.fetchFriendCount,
                {params},
                {headers:headers}
            )
            .then((result) => {
                console.log('AND THEN...', result);
                res(result)
            })
            .catch((error) => {
                rej(error)
            })
    })
}

export const bulkOperationContacts = async (payload)=>{
  console.log('PAYLOAD IN SERVICE', payload);
    return new Promise((resolve, reject)=>{
      axios
        .post(
            config.bulkOperationFriends,
            payload,
            {headers: headers}
        ).then((res)=>{
            console.log('RES IN SERVICE', res);
            resolve(res)
        })
        .catch((error)=>{
          // console.log("ERROR WHITELIST::::", error?.response?.data ? error.response.data : error.message);
          reject(error?.response?.data ? error.response.data : error.message);
        })
    })
  }

export const fetchGroupById = (groupId) => {
  return new Promise((res, rej) => {
    axios
      .get(config.fetchGroupByIdUrl + `/${groupId}`, { headers: headers })
      .then((result) => {
        res(result.data);
      })
      .catch((error) => {
        rej(error?.response?.data ? error.response.data : error.message);
      });
  });
};

export const bulkOperationFriendsQueueS = async (payload) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        config.bulkOperationFriendsQueue,
        payload,
        {headers:headers}
      ).then((res) => {
        console.log('res >>>>>> IN SERVICE', res);
        resolve(res)
      }).catch((error) => {
        console.log(error);
        reject(error)
      })
  })
}