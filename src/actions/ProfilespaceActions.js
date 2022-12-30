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
      state.profiles = action.payload;
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
