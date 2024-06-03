import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    fetchProfileSetting,
    fetchDiviceHistory,
    fetchAllPendingFrndRequest,
    deletePendingFrndRequest,
    saveSettings,
    fetchAllGroupMessages,
    fetchGroupById,
} from "../services/SettingServices";
import { clientDB } from "../app/db";

 const initialState = {
     mySettings: {
      data:[{
      "friends_willbe_inactive_after":0
     }]},
    isLoading: true,
  };

  /**
   * function  store profile setting in index DB
   * @param {string} fbId 
   * @param {object} profileSetting 
   */
  export const storeProfileSettingIndexDb = async (fbId, profileSetting) => {
    if (!fbId || typeof fbId !== 'string') {
      console.error("Error: fbId must be a valid string",typeof fbId);
      return;
    }
    
    try {
      // Use put to set the fbId as the key
      await clientDB.profileSettings.put({
        fbId: fbId,
        profileSettingData:profileSetting,
      });
      console.log("Profile setting stored successfully!");
    } catch (error) {
      console.error("Error storing profile setting:", error);
    }
  };

export const getProfileSettingFromIndexDb = createAsyncThunk(
  "settings/getProfileSettingFromIndexDb",
  async (fbUserId) => {
    let indProfileSetting = [];
    try {
      const res = await clientDB.profileSettings
        .where("fbId")
        .equals(fbUserId)
        .first();
      indProfileSetting = res?.profileSettingData;
      if( !indProfileSetting || indProfileSetting.length <= 0){
        throw new Error("No profile setting in index DB");
      }
    } catch (err) {
      console.log("Error in fetching in idex DB of setting", err)

      if ( !indProfileSetting || indProfileSetting.length <= 0) {
        const resp = await fetchProfileSetting({ fbUserId: fbUserId });
        indProfileSetting = resp?.data[0];
        storeProfileSettingIndexDb(fbUserId,indProfileSetting);
      }
    }
    return indProfileSetting;
  }
);


/**
 * ------- Fetch Group By GroupID --------
 * @type {AsyncThunk<Promise<*>, void, AsyncThunkConfig>}
 */
export const getGroupById = createAsyncThunk(
     "",
     async (groupId) => {
         const res = await fetchGroupById(groupId);
         return res;
     }
 );

/**
 * ------ Fetch all Group Messages -------
 */
export const getAllGroupMessages = createAsyncThunk(
    "settings/getAllGroupMessages",
    async () => {
        const res = await fetchAllGroupMessages();
        return res;
    }
);

/**
   * ------ Delete Pending Friend Request -------
   */
  export const makeDeletePendingFrndReq = createAsyncThunk(
    "",
    async (props,{ rejectWithValue }) => {
        try{
          const { fbUserId, deleteDelayDay } = props;
          let res = null;

          // console.log(fbUserId, deleteDelayDay);

          if (fbUserId && !deleteDelayDay) {
            // console.log('here');
            res = await fetchAllPendingFrndRequest({
              fbUserId,
            });
          }

          // if (fbUserId && deleteDelayDay) {
          //   console.log('here');
          //   res = await fetchAllPendingFrndRequest({
          //     fbUserId,
          //     deleteDelayDay,
          //   });
          // }

          const { data } = res;
          const pendingFrndIds = data.map(obj => obj._id);

          // Delete Pending Friends By Friend Id's..
          const deleteRes = await deletePendingFrndRequest({
            fbUserId,
            sendFriendRequestLogId: pendingFrndIds,
          });

          // console.log("Delete Resposnse -- ", deleteRes.data);

          return res.data[0];
        }catch(err){
          rejectWithValue(err.response.data)
        }
    }
  );

  export const getMySettings = createAsyncThunk(
    "settings/getMySettings",
    async (payload) => {
          const res=await fetchProfileSetting(payload)
         // console.log("getsetting payload",res);
          return res;

    }
  );



  export const diviceHistoryList=createAsyncThunk(
    "settings/getDiviceHistoryList",
    async ()=>{
      //console.log("the consolelog below async" )
      const res=await fetchDiviceHistory()
      return res;
    }
  )
  export const saveAllSettings=createAsyncThunk(
    "settings/saveAllSettings",
    async (payload)=>{
    const res = await saveSettings(payload);
    if(res.data[0]){
      console.log("fbid",payload);
      storeProfileSettingIndexDb(payload.facebookUserId,res.data[0])
    }
    return res;
    }
  );


  export const settingSlice=createSlice({
    name:"settings",
    initialState,
    reducers:{
        updateMysetting:(state,action)=>{
              state.mySettings=action.payload;
        }
    },
    extraReducers: {
      [getProfileSettingFromIndexDb.pending]: (state) => {
        state.isLoading = true;
      },
      [getProfileSettingFromIndexDb.fulfilled]: (state, action) => {
        let syncData = {
           "data" : action?.payload ? [action?.payload]
                  : [] }
        state.mySettings = syncData;
        state.isLoading = false;
      },
      [getProfileSettingFromIndexDb.rejected]: (state) => {
        state.isLoading = false;
      },
        [getMySettings.pending]: (state) => {
          state.isLoading = true;
        },
        [getMySettings.fulfilled]: (state, action) => {
          state.mySettings = action.payload;
          state.isLoading = false;
        },
        [getMySettings.rejected]: (state) => {
          state.isLoading = false;
        },
        [saveAllSettings.fulfilled]:(state,action)=>{
          state.mySettings=action.payload;
          state.isLoading = false;
        }
      },

  })
  export const {updateMysetting}=settingSlice.actions;
  export default settingSlice.reducer;
