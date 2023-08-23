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
    updateWhiteListStatusOfSelectesList:(state,action)=>{
      // console.log("list satussss   action ommmmm",action.payload)
      let statusObj={};
      action.payload.forEach((item)=>{
        statusObj[item.friendFbId]=item.status;
      });
      state.selected_friends=state.selected_friends.map((item)=>{
        if(item.friendFbId in statusObj){
          item.whitelist_status=statusObj[item.friendFbId];
        }
        return item;
      });
    },
    updateBlackListStatusOfSelectesList:(state,action)=>{
      let statusObj={};
      action.payload.forEach((item)=>{
        statusObj[item.friendFbId]=item.status;
      });
      state.selected_friends=state.selected_friends.map((item)=>{
        if(item.friendFbId in statusObj){
          item.blacklist_status=statusObj[item.friendFbId];
        }
        return item;
      });
    },
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
  updateWhiteListStatusOfSelectesList,
  updateBlackListStatusOfSelectesList
} = frindListSlice.actions;
export default frindListSlice.reducer;
