import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
  selected_friends: [],
  relevant_listing: 0,
  curr_list_count: 0,
  searched_filter: "",
};

export const frindListSlice = createSlice({
  name: "friendlist",
  initialState,
  reducers: {
    updateSelectedFriends: (state, action) => {
      state.selected_friends = action.payload;
    },
    removeSelectedFriends: (state, action) => {
      state.selected_friends = [];
    },
    updateNumberofListing: (state, action) => {
      state.relevant_listing = action.payload ? action.payload : 0;
    },
    countCurrentListsize: (state, action) => {
      state.curr_list_count = action.payload;
    },
    updateFilter: (state, action) => {
      state.searched_filter = action.payload;
    },
    crealFilter: (state) => {
      //console.log(":Clear Search Reducer fired");
      state.searched_filter = "";
    },
  },
  extraReducers: {},
});

export const {
  updateFilter,
  crealFilter,
  updateSelectedFriends,
  removeSelectedFriends,
  updateNumberofListing,
  countCurrentListsize,
} = frindListSlice.actions;
export default frindListSlice.reducer;
