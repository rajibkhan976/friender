
const 
env = process.env,
appAuth = env.REACT_APP_AUTH,
appEnv = env.REACT_APP_ENV,
profileService = env.REACT_APP_PROFILE_SERVICE;
module.exports = {
    appUrl: process.env.REACT_APP_APP_URL,
    registerUrl: "https://"+process.env.REACT_APP_AUTH+".execute-api.us-east-1.amazonaws.com/"+process.env.REACT_APP_ENV+"/register",
    loginsUrl: "https://"+process.env.REACT_APP_AUTH+".execute-api.us-east-1.amazonaws.com/"+process.env.REACT_APP_ENV+"/login",
    forgetpasswordUrl: "https://"+process.env.REACT_APP_AUTH+".execute-api.us-east-1.amazonaws.com/"+process.env.REACT_APP_ENV+"/forget-password",
    resetpasswordUrl: "https://"+process.env.REACT_APP_AUTH+".execute-api.us-east-1.amazonaws.com/"+process.env.REACT_APP_ENV+"/reset-password",
    resetuserpasswordUrl: "https://"+process.env.REACT_APP_AUTH+".execute-api.us-east-1.amazonaws.com/"+process.env.REACT_APP_ENV+"/user-reset-password",
    mysettingSaveUrl: "https://"+process.env.REACT_APP_PROFILE_SERVICE+".execute-api.us-east-1.amazonaws.com/"+process.env.REACT_APP_ENV+"/save-user-profile-settings",
    onboardingUrl:"https://"+process.env.REACT_APP_AUTH+".execute-api.us-east-1.amazonaws.com/"+process.env.REACT_APP_ENV+"/user-onbording-step-one",
    // // // resetuserpasswordUrl: "https://"+appAuth+".execute-api.us-east-1.amazonaws.com/"+appEnv+"/user-reset-password",
    saveprofileDataUrl : "https://"+profileService+".execute-api.us-east-1.amazonaws.com/"+appEnv+"/store-user-profile",
    fetchprofileDataUrl : "https://"+profileService+".execute-api.us-east-1.amazonaws.com/"+appEnv+"/fetch-user-profiles",
    fetchprofileSettingUrl: "https://"+profileService+".execute-api.us-east-1.amazonaws.com/"+appEnv+"/fetch-user-profile-settings",
    fetchFriendListUrl: "https://"+profileService+".execute-api.us-east-1.amazonaws.com/"+appEnv+"/fetch-user-friendlist",
    whiteListFriend:"https://"+profileService+".execute-api.us-east-1.amazonaws.com/"+appEnv+"/user-whitelist-friend",
    deleteFriend:"https://"+profileService+".execute-api.us-east-1.amazonaws.com/"+appEnv+"/user-delete-friend",
    fetchFriendLostUrl: "https://"+profileService+".execute-api.us-east-1.amazonaws.com/"+appEnv+"/fetch-lost-friends"
}
