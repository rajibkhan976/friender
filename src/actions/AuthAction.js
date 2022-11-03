import { userLogin, userRegister, forgetPassword, userLogout, resetPassword } from "../services/authentication/AuthServices";
import * as actionTypes from "./types";
import { history } from '../helpers/history';

const register  = (email)=>{
    return dispatch => {
        return new Promise((resolve, reject)=>{
            userRegister(email)
                .then(response =>{
                    if(response){
                        dispatch({
                            type: actionTypes.USER_REGISTER,
                            user: response
                        });
                        resolve(response);
                    }
                })
                .catch(error=>{
                    if (error) {
                        dispatch({
                            type: actionTypes.USER_REGISTER_ERROR,
                            message: error
                        });
                    }
                    reject(error);
                })
            })
    }
}

const login  = (email,password)=>{
  return dispatch => {
      return new Promise((resolve, reject) => {
          userLogin(email, password)
              .then(response => {
                  if (response) {
                      dispatch({
                          type: actionTypes.USER_LOGIN,
                          user: response
                      });
                      resolve(response);
                  }
              })
              .catch(error => {
                  if (error) {
                      dispatch({
                          type: actionTypes.LOGIN_FAILURE,
                          message: error
                      });
                  }
                  reject(error);
              });
          
      });
  };
}

const logout = () => {
    return dispatch => {
        userLogout();
        dispatch({
            type: actionTypes.LOGOUT,
        })
        history.push('/login');
    };
}

const forgetpassword  = (email)=>{
    return dispatch => {
        return new Promise((resolve, reject)=>{
            forgetPassword(email)
            .then(response =>{
                if(response){
                    dispatch({
                        type: actionTypes.FORGET_PASSWORD,
                        user: response
                    });
                    resolve(response);
                }
            })
            .catch(error=>{
                // console.log("error", error);
                if (error) {
                    dispatch({
                        type: actionTypes.FORGET_PASSWORD_ERROR,
                        message: error
                    })
                }
                reject(error);
            });
        })
    }
} 

const resetPass = (token, password) => {
    // console.log("token, password", token, password);
    return dispatch => {
        return new Promise((resolve, reject)=>{
            resetPassword(token, password)
            .then(response =>{
                if(response){
                    dispatch({
                        type: actionTypes.RESET_PASSWORD,
                        user: response
                    });
                    resolve(response);
                }
            })
            .catch(error=>{
                // console.log("error", error);
                if (error) {
                    dispatch({
                        type: actionTypes.RESET_PASSWORD_ERROR,
                        message: error
                    })
                }
                reject(error);
            });
        })
    }
}

export default{register, login, forgetpassword, logout, resetPass};