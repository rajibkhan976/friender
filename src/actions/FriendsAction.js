import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  BlockListFriends,
  deleteFriends,
  fetchFriendList,
  fetchSenFriendReqList,
  getUserSyncDataS,
  whiteListFriends,
} from "../services/friends/FriendListServices";
import { fetchFriendLost } from "../services/friends/FriendListServices";
//import { useLiveQuery } from "dexie-react-hooks";
// import { clientDB } from "../app/db";

const initialState = {
  isLoading: true,
  current_fb_id: null,
  fb_data: null,
  current_whitelist: {},
  current_blacklist: {},
  current_friend_list: [],
  refresher_fr_list:[],
};

export const storeFriendListIndexDb = async (fbId, friendList) => {
  // // console.log("starting storing the dat in IDB with fb id", fbId);
  // try {
  //   // Add the new friend!
  //   const id = await clientDB.friendsLists.put({
  //     fbId: fbId,
  //     friendsData: friendList,
  //   });
  //   // console.log("index dvb id", id);
  // } catch (error) {
  //   // console.log(`Failed to add : ${error}`);
  // }
};

export const getFriendList = createAsyncThunk(
  "facebook/getFriendList",
  // async (payload) => {
  //   let frlistResp = await fetchFriendList(payload);
  //   if(frlistResp?.data?.[0].total_no_of_friends>4000){
  //      let maxBatch = Math.ceil(frlistResp.data[0].total_no_of_friends/4000);
  //      for(let i=2;i<=maxBatch;i++){
  //            let currResp = await fetchFriendList({...payload,page:i});
  //            if(currResp.data[0].friend_details.length>0){
  //             frlistResp.data[0].friend_details.push(...currResp.data[0].friend_details);
  //            }
  //      }
  //   }

  //   let friendList = frlistResp?.data?.[0].friend_details
  //     ? frlistResp.data[0].friend_details.length
  //     : false;

  //   if (friendList) {
  //     // storeFriendListIndexDb(payload.fbUserId, frlistResp);
  //   }

  //   // console.log("************res***********",res)
  //   return frlistResp;
  // }
);

// export const getFriendListFromIndexDb = createAsyncThunk(
//   "facebook/getFriendListFromIndexDb",
//   async (payload) => {
//     const indFriendList = await clientDB.friendsLists
//       .where("fbId")
//       .equals(payload.fbUserId)
//       .first();

//     return indFriendList;
//   }
// );

export const getFriendLost = createAsyncThunk(
  "facebook/getFriendLost",
  async (payload) => {
    const res = await fetchFriendLost(payload);
    return res;
  }
);
export const getSendFriendReqst = createAsyncThunk(
  "facebook/getSendFriendReqst",
  async (payload) => {
    const res = await fetchSenFriendReqList(payload);
    return res;
  }
);
export const whiteListFriend = createAsyncThunk(
  "facebook/whiteListFriend",
  async ({ payload }) => {
    const res = await whiteListFriends(payload);
    return res;
  }
);
export const BlockListFriend = createAsyncThunk(
  "facebook/BlockListFriend",
  async ({ payload }) => {
    const res = await BlockListFriends(payload);
    return res;
  }
);


export const deleteFriend = createAsyncThunk(
  "facebook/deleteFriend",
  async ({ payload }) => {
    console.log('payload IN ACTION :::', payload);
    const res = await deleteFriends(payload);
    console.log(res, ' :::: res in action');
    return res;
  }
);

const updateWhiteList = (currnList, payload) => {
  payload.forEach((item) => {
    // console.log(' >>>>>> ', item);
    let upateItem = currnList.find((obj) => obj.friendFbId === item.friendFbId);
    upateItem.whitelist_status = item.status;
  });
  return currnList;
};

const updateBlockList = (currnList, payload) => {
  payload.forEach((item) => {
    let upateItem = currnList.find((obj) => obj.friendFbId === item.friendFbId);
    upateItem.blacklist_status = item.status;
  });
  return currnList;
};

const updateUnfriendList = (currnList, payload) => {
  payload.forEach((item) => {
    console.log('item :::::: ', item);
    console.log('<<<<<<<<<<< currnList ::::::::::', currnList);
    let upateItem = currnList.find((obj) => obj.friendFbId === item.friendFbId);
    console.log('upateItem ::::::: ', upateItem);
    upateItem.deleted_status = item?.deleted_status;
    upateItem.deleted_at = item?.deleted_at;

    // Parse the input date
    // const date = new Date();

    // // Format the date to the desired output format
    // const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
    //   .toString()
    //   .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")} ${date.getHours().toString().padStart(2, "0")
    //   }:${date.getMinutes().toString().padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`;

    // upateItem.deleted_at = String(formattedDate);
  });
  return currnList;
};

export const getUserSyncData = createAsyncThunk(
  "facebook/getUserSyncData",
  async(payload) => {
    // console.log('payload >>>>>>>>>>>>>', payload);
    const res = await getUserSyncDataS(payload);
    // console.log('res >>>>>>>', res);
    return res
  }
)

const fbSlice = createSlice({
  name: "facebook",
  initialState,
  reducers: {
    unLoadFrList: (state) => {
      state.refresher_fr_list=state.current_friend_list;
      state.current_friend_list=state.current_friend_list.slice(5);
     },
     reLoadFrList:(state)=>{
      state.current_friend_list=state.refresher_fr_list;
     },
    setFriendListArray: (state, action) => {
      //console.log("update fr list rdx", action);
      state.current_friend_list = action.payload;
    },
    syncWhiteList: (state, action) => {
      state.current_whitelist = action.payload.data;
    },
    syncBlackList: (state, action) => {
      state.current_blacklist = action.payload.data;
    },
    syncMainFriendList: (state) => {
      const blackObj = state.current_blacklist;
      const whiteObj = state.current_whitelist;
      if (Object.keys(blackObj).length > 0 || Object.keys(whiteObj).length > 0) {
        state.current_friend_list = state.current_friend_list.map(
          (item) => {
            //const newObj={...item};
            if (item.friendFbId in whiteObj) {
              item.whitelist_status = whiteObj[item.friendFbId]
            }
            if (item.friendFbId in blackObj) {
              item.blacklist_status = blackObj[item.friendFbId]
            }
            return item;
          }
        );
        state.current_blacklist = {};
        state.current_whitelist = {};
      }

    }
  },
  extraReducers: {
    // [getFriendListFromIndexDb.pending]: (state) => {
    //   // console.log("Fetch friend pending state");
    //   state.isLoading = true;
    // },
    // [getFriendListFromIndexDb.fulfilled]: (state, action) => {
    //   // console.log("Updating data from index db");

    //   let syncData = action?.payload?.friendsData?.data
    //     ? action?.payload?.friendsData?.data[0]
    //     : "";
    //   state.fb_data = syncData;
    //   state.current_fb_id = syncData?.fb_user_id ? syncData.fb_user_id : "";
    //   state.current_friend_list = syncData?.friend_details
    //     ? syncData.friend_details
    //     : [];

    //   if (state.current_friend_list.length) {
    //     state.isLoading = false;
    //   } else {
    //     state.isLoading = true;
    //   }
    // },
    // [getFriendListFromIndexDb.rejected]: (state) => {
    //   state.isLoading = false;
    // },
    // [getFriendList.pending]: (state) => {
    //   // console.log("Fetch friend pending state");
    //   // state.isLoading = false;
    // },
    // [getFriendList.fulfilled]: (state, action) => {
    //   //console.log("Updating friend list from db");
    //   state.isLoading = false;
    //   state.fb_data = action?.payload?.data ? action?.payload?.data[0] : "";
    //   state.current_fb_id = action?.payload?.data
    //     ? action.payload.data[0].fb_user_id
    //     : "";
    //   state.current_friend_list =
    //     action?.payload?.data?.length > 0
    //       ? action.payload.data[0].friend_details
    //       : [];
    // },
    // [getFriendList.rejected]: (state) => {
    //   state.isLoading = false;
    // },
    [whiteListFriend.pending]: (state, action) => {
      if (action.meta.arg?.bulkAction) {
        state.current_friend_list = updateWhiteList(
          state.current_friend_list,
          action.meta.arg.payload
        );
      } else {
        const whitelistObj = { ...state.current_whitelist }
        action.meta.arg.payload.forEach((item) => {
          whitelistObj[item.friendFbId] = item.status;
        });
        state.current_whitelist = whitelistObj;
      }

    },
    [whiteListFriend.fulfilled]: (state, action) => {

    },
    [whiteListFriend.rejected]: (state, action) => {
      let pyld = action.meta.arg.payload
      pyld = pyld.map((item) => {
        item.status = item.status === 1 ? 0 : 1;
        return item
      })
      state.current_friend_list = updateWhiteList(
        state.current_friend_list,
        pyld
      );
    },
    [BlockListFriend.pending]: (state, action) => {
      if (action.meta.arg?.bulkAction) {
        state.current_friend_list = updateBlockList(
          state.current_friend_list,
          action.meta.arg.payload
        );
      } else {
        const blacklistObj = { ...state.current_blacklist }
        action.meta.arg.payload.forEach((item) => {
          blacklistObj[item.friendFbId] = item.status;
        });
        state.current_blacklist = blacklistObj;
      }

    },
    [BlockListFriend.fulfilled]: (state, action) => {
    },
    [BlockListFriend.rejected]: (state, action) => {
      let pyld = action.meta.arg.payload
      pyld = pyld.map((item) => {
        item.status = item.status === 1 ? 0 : 1;
        return item
      })
      state.current_friend_list = updateBlockList(
        state.current_friend_list,
        pyld
      );
    },
    [deleteFriend.fulfilled]: (state, action) => {
      // state.current_friend_list = updateUnfriendList(
      //   state.current_friend_list,
      //   action.payload.data
      // );

      // console.log("CURRENT FRIEND LIST -- ", state.current_friend_list);
      // console.log("Meta Action ===== ", action);
    },
    [deleteFriend.rejected]: () => {
      //console.log("it is delete rejected");
    },
    [getSendFriendReqst.fulfilled]: (state, action) => {
      state.send_friend_request_list = action?.payload?.data;
    },
    [getUserSyncData.pending]: (state, action) => {
      // console.log('getUserSyncData PENDING');
    },
    [getUserSyncData.fulfilled]: (state, action) => {
      // console.log('getUserSyncData PENDING >>>>>>', action?.payload?.data[0]);
      if (action?.payload?.data?.length > 0) {
        state.fb_data = action?.payload?.data ? action?.payload?.data[0] : []
      }
    }
  },
});

export const { unLoadFrList,reLoadFrList, setFriendListArray, syncMainFriendList } = fbSlice.actions;
export default fbSlice.reducer;
