import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { response } from "express";
import { forgetPassword, onboarding, resetPassword, resetUserPassword, userLogin, userRegister } from "../services/authentication/AuthServices";

let token = localStorage.getItem('fr_token');
const initialState = token ? {
  isLoggedIn: true,
  user: { 'token': token }
} : {
  isLoggedIn: false,
  user: null,
  message : null,
  type:null,
  regSuccess:false
};


export const register=createAsyncThunk(
  "auth/register",
  async({email,name},{rejectWithValue})=>{
    try{
      const res= await userRegister(email,name)
      return res;
    }catch(err){
      return rejectWithValue(err)
    }
  }

)

export const logUserIn= createAsyncThunk(
  "auth/logUserIn",
  async ({email,password},{ rejectWithValue }) => {
    /**  @param arg {{ email:string, password: string }} */
    //  const {email,password}=props
      try{
        const res=await userLogin(email,password);
        return res;
      }catch(err){
        return rejectWithValue(err)
      }
  }
);

export const forgetpassword=createAsyncThunk(
  "auth/forgetpassword",
  async({email})=>{
      const res=await forgetPassword(email);
      return res;
  }
)

export const resetPass=createAsyncThunk(
  "auth/resetPass",
  async ({token,password})=>{
    const res=await resetPassword(token,password);
    return res;
  }
)

export const resetUserPass=createAsyncThunk(
  "auth/resetUserPass",
  async ({token,password})=>{
    const res=await resetUserPassword(token,password)
    return res;
  }
)

export const onboardingUser=createAsyncThunk(
  "auth/onboardingUser",
  async ({question_one,question_two,question_three,token})=>{
    console.log("token,question_one,question_two,question_three, :: ", token,question_one,question_two,question_three,);
      const res=await onboarding(token,question_one,question_two,question_three,);
      return res;

  }
)






export const authSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{
      userLoging:()=>{

      },
      regOut:(state)=>{
  state.regSuccess=false;
      },
      userLogout:(state)=>{
        localStorage.removeItem("fr_token");
        localStorage.removeItem("fr_pass_changed");
        localStorage.removeItem("fr_onboarding");
        localStorage.removeItem("fr_default_fb");
        localStorage.removeItem("fr_current_fbId");
        localStorage.removeItem("fr_sidebarToogle");
        localStorage.removeItem("fr_default_email");
        localStorage.removeItem("fr_isSyncing");
        localStorage.removeItem("fr_update");
        localStorage.removeItem("fr_tooltip");
        localStorage.removeItem("submenu_status");
        localStorage.removeItem('syncedFriend');
          state.isLoggedIn=false;
      }
    },
    extraReducers:{
      //state change for registration
      [register.fulfilled]:(state,action)=>{
        state.user=action.payload;
        state.regSuccess=true;
      },
      [register.rejected]:(state,action)=>{
        state.isLoggedIn=false;
        state.message=action.payload;
        state.regSuccess=false;
      },
      //state change for login
      [logUserIn.fulfilled]: (state, action) => {
        state.user=action.payload
        state.isLoggedIn = true;
      },
      [logUserIn.rejected]: (state,action) => {
        console.log("rejected",action.payload);
        state.isLoggedIn = false;
        state.message=action.payload;
      },
    }
})

export const {userLogout,regOut}=authSlice.actions;
export default authSlice.reducer;