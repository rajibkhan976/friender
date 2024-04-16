import { configureStore } from "@reduxjs/toolkit";
import mysettingReducer from "../actions/MySettingAction";
import authReducer from "../actions/AuthAction";
import fbReducer from "../actions/FriendsAction";
import friendListReducer from "../actions/FriendListAction";
import profilespace from "../actions/ProfilespaceActions"
import messageReducer from "../actions/MessageAction";
import campaignReducer from "../actions/CampaignsActions";
import friendsQueueReducer from "../actions/FriendsQueueActions";
// import productReducer from "../features/product/productSlice";
// import searchReducer from "../features/Search/searchSlice";

export const store = configureStore({
	reducer: {
		settings: mysettingReducer,
		auth: authReducer,
		facebook_data: fbReducer,
		friendlist: friendListReducer,
		profilespace: profilespace,
		message: messageReducer,
		campaign: campaignReducer,
		friendsQueue: friendsQueueReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
});
