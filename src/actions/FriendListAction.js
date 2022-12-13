import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { deleteFriends,whiteListFriends } from "../services/friends/FriendListServices";
const initialState={
    isLoading:true,
    selected_friends:[],
    relevant_listing:0,
    curr_list_count:0,
}


export const whiteListFriend=createAsyncThunk(
    "friendlist/getFriendList",
    async ({payload})=>{
            const res= await whiteListFriends(payload);
            return res;
     
    }

)

export const deleteFriend=createAsyncThunk(
    "friendlist/getFriendList",
    async ({payload})=>{
        const res= await deleteFriends(payload)
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
        },
        countCurrentListsize:(state,action)=>{
            state.curr_list_count=action.payload;
        }

        
     },
     extraReducers:{
        [deleteFriend.fulfilled]:(action)=>{
        },
        [deleteFriend.rejected]:()=>{
            console.log("it is delete rejected");
        },
        [whiteListFriend.fulfilled]:(state,action)=>{
        },
        [whiteListFriend.rejected]:(state,action)=>{
            console.log("the whiteslisting is rejected",action);
        },
     }
})



export const {updateSelectedFriends,removeSelectedFriends, updateNumberofListing,countCurrentListsize}=frindListSlice.actions;
export default frindListSlice.reducer;
