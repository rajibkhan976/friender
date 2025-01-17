import { configureStore } from "@reduxjs/toolkit";
import mysettingReducer from "../actions/MySettingAction";
import authReducer from "../actions/AuthAction";
import fbReducer from "../actions/FriendsAction";
import friendListReducer from "../actions/FriendListAction";
import profilespace from "../actions/ProfilespaceActions"
import messageReducer from "../actions/MessageAction";
import campaignReducer from "../actions/CampaignsActions";
import friendsQueueReducer from "../actions/FriendsQueueActions";
import ssListSliceReducer from "../actions/SSListAction";
// import productReducer from "../features/product/productSlice";
// import searchReducer from "../features/Search/searchSlice";
import planReducer from "../actions/PlanAction"

export const store = configureStore({
	reducer: {
		settings: mysettingReducer,
		auth: authReducer,
		facebook_data: fbReducer,
		friendlist: friendListReducer,
		ssList: ssListSliceReducer,
		profilespace: profilespace,
		message: messageReducer,
		campaign: campaignReducer,
		friendsQueue: friendsQueueReducer,
		plan: planReducer
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
});
