import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  BlockListFriends,
  deleteFriends,
  fetchFriendList,
  fetchSenFriendReqList,
  whiteListFriends,
} from "../services/friends/FriendListServices";
import { fetchFriendLost } from "../services/friends/FriendListServices";
//import { useLiveQuery } from "dexie-react-hooks";
import { clientDB } from "../app/db";
const initialState = {
  isLoading: true,
  current_fb_id: null,
  fb_data: null,
  current_friend_list: [],
};

const storeFriendListIndexDb = async (fbId, friendList) => {
  // console.log("starting storing the dat in IDB with fb id", fbId);
  try {
    // Add the new friend!
    const id = await clientDB.friendsLists.put({
      fbId: fbId,
      friendsData: friendList,
    });
    // console.log("index dvb id", id);
  } catch (error) {
    console.log(`Failed to add : ${error}`);
  }
};

export const getFriendList = createAsyncThunk(
  "facebook/getFriendList",
  async (payload) => {
    const res = await fetchFriendList(payload);

    let friendList = res?.data[0].friend_details
      ? res.data[0].friend_details.length
      : false;

    if (friendList) {
      storeFriendListIndexDb(payload.fbUserId, res);
    }

    // console.log("************res***********",res)
    return res;
  }
);

export const getFriendListFromIndexDb = createAsyncThunk(
  "facebook/getFriendListFromIndexDb",
  async (payload) => {
    const indFriendList = await clientDB.friendsLists
      .where("fbId")
      .equals(payload.fbUserId)
      .first();

    return indFriendList;
  }
);

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
    const res = await deleteFriends(payload);
    console.log("unfriend");
    return res;
  }
);

const updateWhiteList = (currnList, payload) => {
  payload.forEach((item) => {
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
    let upateItem = currnList.find((obj) => obj.friendFbId === item.friendFbId);
    upateItem.deleted_status = item.status;
  });
  return currnList;
};

const fbSlice = createSlice({
  name: "facebook",
  initialState,
  reducers: {
    updateId: () => {},
    setFriendListArray: (state, action) => {
      //console.log("update fr list rdx", action);
      state.current_friend_list = action.payload;
    },
  },
  extraReducers: {
    [getFriendListFromIndexDb.pending]: (state) => {
      // console.log("Fetch friend pending state");
      state.isLoading = true;
    },
    [getFriendListFromIndexDb.fulfilled]: (state, action) => {
      // console.log("Updating data from index db");

      let syncData = action?.payload?.friendsData?.data
        ? action?.payload?.friendsData?.data[0]
        : "";
      state.fb_data = syncData;
      state.current_fb_id = syncData?.fb_user_id ? syncData.fb_user_id : "";
      state.current_friend_list = syncData?.friend_details
        ? syncData.friend_details
        : [];

      if (state.current_friend_list.length) {
        state.isLoading = false;
      } else {
        state.isLoading = true;
      }
    },
    [getFriendList.pending]: (state) => {
      // console.log("Fetch friend pending state");
      // state.isLoading = false;
    },
    [getFriendList.fulfilled]: (state, action) => {
      //console.log("Updating friend list from db");
      state.isLoading = false;
      state.fb_data = action?.payload?.data ? action?.payload?.data[0] : "";
      state.current_fb_id = action?.payload?.data
        ? action.payload.data[0].fb_user_id
        : "";
      state.current_friend_list =
        action?.payload?.data?.length > 0
          ? action.payload.data[0].friend_details
          : [];
    },
    [getFriendList.rejected]: (state, action) => {
   
    },
    [whiteListFriend.pending]: (state, action) => {
      state.current_friend_list = updateWhiteList(
        state.current_friend_list,
        action.meta.arg.payload
      );
    },
    [whiteListFriend.fulfilled]: (state, action) => {
    
    },
    [whiteListFriend.rejected]: (state, action) => {
      let pyld=action.meta.arg.payload
      pyld=pyld.map((item)=>{
        item.status=item.status===1?0:1;
        return item
      })
      state.current_friend_list = updateWhiteList(
        state.current_friend_list,
        pyld
      );
    },
    [BlockListFriend.pending]: (state, action) => {
      state.current_friend_list = updateBlockList(
        state.current_friend_list,
        action.meta.arg.payload
      );
    },
    [BlockListFriend.fulfilled]: (state, action) => {
    },
    [BlockListFriend.rejected]: (state, action) => {
      let pyld=action.meta.arg.payload
      pyld=pyld.map((item)=>{
        item.status=item.status===1?0:1;
        return item
      })
      state.current_friend_list = updateBlockList(
        state.current_friend_list,
        pyld
      );
    },
    [deleteFriend.fulfilled]: (state, action) => {
      state.current_friend_list = updateUnfriendList(
        state.current_friend_list,
        action.meta.arg.payload
      );
    },
    [deleteFriend.rejected]: () => {
      //console.log("it is delete rejected");
    },
    [getSendFriendReqst.fulfilled]: (state, action) => {
      state.send_friend_request_list = action?.payload?.data;
    },
  },
});

export const { updateId, setFriendListArray } = fbSlice.actions;
export default fbSlice.reducer;