import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchProfileSetting, fetchDiviceHistory, fetchAllPendingFrndRequest, deletePendingFrndRequest } from "../services/SettingServices";

 const initialState = {
     mySettings: [],
    isLoading: true,
  };
  
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
    "product/getMySettings",
    async (props,{ rejectWithValue }) => {
        try{
          const res=await fetchProfileSetting({
            // token: props.token,
            fbUserId: props.fbUserId
          })
          return res.data[0];
        }catch(err){
          rejectWithValue(err.response.data)
        }
    }
  );



  export const diviceHistoryList=createAsyncThunk(
    "product/getDiviceHistoryList",
    async ()=>{
      console.log("the consolelog below async" )
      const res=await fetchDiviceHistory()
      return res;
    }
  )
  

  export const mysettingSlice=createSlice({
    name:"mySetting",
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
      },

  })
  export const {updateMysetting}=mysettingSlice.actions;
  export default mysettingSlice.reducer;