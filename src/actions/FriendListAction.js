import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { deleteFriends,whiteListFriends } from "../services/friends/FriendListServices";
const initialState={
    isLoading:true,
    selected_friends:[],
    relevant_listing:0
}


export const whiteListFriend=createAsyncThunk(
    "friendlist/getFriendList",
    async ({payload})=>{
        // try{
            const res= await whiteListFriends(payload);
            return res;
        // }catch(err){
        //     console.log("whiitteee list error*****->>>",err);
        // return rejectWithValue(err)    
        // }
     
    }

)

export const deleteFriend=createAsyncThunk(
    "friendlist/getFriendList",
    async ({payload})=>{
        const res= await deleteFriends(payload)
        console.log("delete friend data dispatch response",res)
        return res;
    }

)



export const frindListSlice=createSlice({
     name:"friendlist",
     initialState,
     reducers:{
       updateSelectedFriends:(state,action)=>{
            state.selected_friends=action.payload;
        },
        removeSelectedFriends:(state,action)=>{
            state.selected_friends=[]
        },
        updateNumberofListing:(state,action)=>{
            state.relevant_listing=action.payload ? action.payload : 0
        }
        
     },
     extraReducers:{
        [deleteFriend.fulfilled]:(action)=>{
            console.log("it is done delete]]]]]]]]>>>>>>>>>>>>>--------))))))",action);

        },
        [deleteFriend.rejected]:()=>{
            console.log("it is delete rejected");
        },
        //change state for white listing 
        [whiteListFriend.fulfilled]:(state,action)=>{
            console.log("i am the fully action",action)
            console.log("it is done white list]]]]]]]]>>>>>>>>>>>>>--------))))))",action);
            // state.isLoading=false;
            // state.fb_data=action.payload.data[0];
            // state.current_fb_id=action.payload.data[0].fb_user_id;
            // state.current_friend_list=action.payload.data[0].friend_details;
        },
        [whiteListFriend.rejected]:(state,action)=>{
            console.log("the whiteslisting is rejected",action);
        },
     }
})



export const {updateSelectedFriends,removeSelectedFriends, updateNumberofListing}=frindListSlice.actions;
export default frindListSlice.reducer;
