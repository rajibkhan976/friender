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

 const initialState = {
     mySettings: null,
    isLoading: true,
  };


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
            console.log('here');
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

          console.log("Delete Resposnse -- ", deleteRes.data);

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
    const res =saveSettings(payload);
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
