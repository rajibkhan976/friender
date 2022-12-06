import { configureStore } from "@reduxjs/toolkit";
import mysettingReducer from "../actions/MySettingAction";
import authReducer from "../actions/AuthAction"
import fbReducer from "../actions/FriendsAction";
import friendListReducer from "../actions/FriendListAction";
import listingFilterReducer from "../actions/FilterActions"
// import productReducer from "../features/product/productSlice";
// import searchReducer from "../features/Search/searchSlice";

export const store = configureStore({
  reducer: {
    mySettings:mysettingReducer,
    auth:authReducer,
    facebook_data:fbReducer,
    friend_list_data:friendListReducer,
    listingFilter: listingFilterReducer
  },
});
