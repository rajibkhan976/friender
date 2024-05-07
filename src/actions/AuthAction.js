import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { response } from "express";
import { checkUserEmail, forgetPassword, onboarding, resetPassword, resetUserPassword, userLogin, userRegister } from "../services/authentication/AuthServices";
import extensionAccesories from "../configuration/extensionAccesories"
import helper from "../helpers/helper";
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


export const registerEmail=createAsyncThunk(
  "auth/emailCheck",
  async({email},{rejectWithValue})=>{
    try{
      const res = await checkUserEmail(email)
      return res;
    } catch(err) {
      return rejectWithValue(err)
    }
  }
)

// export const register=createAsyncThunk(
//   "auth/register",
//   async({email,name},{rejectWithValue})=>{
//     try{
//       const res= await userRegister(email,name)
//       return res;
//     }catch(err){
//       return rejectWithValue(err)
//     }
//   }
// )

export const register=createAsyncThunk(
  "auth/register",
  async(userRegPayload,{rejectWithValue})=>{
    try{
      const res= await userRegister(userRegPayload)
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
        // console.log('TRYING LOGGING IN WITH', email,password);
        const res=await userLogin(email,password);
        // console.log('loginuser responded ', res);
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
  async ({question_one,question_two,question_three,question_four,token})=>{
    // console.log(question_one,question_two,question_three,question_four,token);
    //console.log("token,question_one,question_two,question_three, :: ", token,question_one,question_two,question_three,);
      const res=await onboarding(token,question_one,question_two,question_three,question_four);
      return res;

  }
)


//::function to remove any item from localStrage with given prfix::
export function removeVariablesWithPrefix(prefix) {
  /**@params prefix=String */
  for (let key in window.localStorage) {
    if (key.startsWith(prefix)) {
      window.localStorage.removeItem(key);
    }
  }
}



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
        // localStorage.removeItem("fr_token");
        // localStorage.removeItem("fr_pass_changed");
        // localStorage.removeItem("fr_onboarding");
        // localStorage.removeItem("fr_default_fb");
        // localStorage.removeItem("fr_current_fbId");
        // localStorage.removeItem("fr_sidebarToogle");
        // localStorage.removeItem("fr_default_email");
        // localStorage.removeItem("fr_isSyncing");
        // localStorage.removeItem("fr_update");
        // localStorage.removeItem("fr_tooltip");
        // localStorage.removeItem("submenu_status");
        // localStorage.removeItem('syncedFriend');
        // localStorage.removeItem("friendLength");
        // localStorage.removeItem("fr-selected-friends");
        // localStorage.removeItem("fr_theme");
        helper.deleteCookie("fr_isSyncing");
        helper.deleteCookie("deleteAllPendingFR");
        localStorage.clear();
        // console.log("User is getting log out");
        extensionAccesories.sendMessageToExt({
          action : "logout", 
        });
        removeVariablesWithPrefix("fr_")
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
        //console.log("rejected",action.payload);
        state.isLoggedIn = false;
        state.message=action.payload;
      },
    }
})

export const {userLogout,regOut}=authSlice.actions;
export default authSlice.reducer;