import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchProfileSetting } from "../services/SettingServices";
 const initialState = {
     mySettings: [],
    isLoading: true,
  };
  

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