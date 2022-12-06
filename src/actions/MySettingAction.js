import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchProfileSetting } from "../services/SettingServices";
 const initialState = {
     mySettings: [],
    isLoading: true,
  };
  

  export const getMySettings = createAsyncThunk(
    "product/getMySettings",
    async (props,{ rejectWithValue }) => {
  
        console.log("i am fetching the the setting api props", props);

        try{
          console.log("gasjdgjgjsdagj hiiiii")
          const res=await fetchProfileSetting({
            token: props.token,
            fbUserId: props.fbUserId
          })
          return res.data[0];
        }catch(err){
          rejectWithValue(err.response.data)
        }

      // return fetchProfileSetting({
      //   token: token,
      //   fbUserId: fbUserId
      // }).then((res) => {
      //   console.log("i am the ressss",res);
      //   return res.data[0];
      // })
      // .catch((err) => console.log("i am the eerrror",err));
    }
  );
  

  export const mysettingSlice=createSlice({
    name:"mySetting",
    initialState,
    reducers:{
        updateMysetting:(state,action)=>{
            console.log("hi my setting fetch******->>",action.payload);
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