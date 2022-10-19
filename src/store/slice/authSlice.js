import { createSlice } from "@reduxjs/toolkit";

let token = localStorage.getItem('fr_token');

const authSlice = createSlice({
    name: 'auth',
    initialState: token ? {
        isLoggedIn: true,
        user: { 
            'token': token 
        }
    } : {
        isLoggedIn: true,
        user: null
    },
    reducers: {
        login(state, action) {
            console.log('Login function');
        },
    }
})

export const authActions = authSlice.actions;

export default authSlice;