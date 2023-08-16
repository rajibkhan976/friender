import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  profiles: [],
  defaultProfileId: localStorage.getItem('fr_default_fb')
};

const profilespace = createSlice({
  name: "profilespace",
  initialState,
  reducers: {
    setProfileSpaces: (state, action) => {
      console.log("before update profile spaces",action.payload)
      state.profiles = action.payload;
      console.log("after update profile spaces",initialState)

    },
    addProfileSpace: (state, action) => {
      state.profiles = [ ...state.profiles, action.payload];
    },
    setDefaultProfileId: (state, action) => {
      state.defaultProfileId = action.payload;
    }
  },
});

export const { 
  setProfileSpaces, 
  setDefaultProfileId,
  addProfileSpace
 } = profilespace.actions;
export default profilespace.reducer;
