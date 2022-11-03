module.exports = {
    appUrl: process.env.REACT_APP_APP_URL,
    registerUrl: "https://"+process.env.REACT_APP_AUTH+".execute-api.us-east-1.amazonaws.com/"+process.env.REACT_APP_ENV+"/register",
    loginsUrl: "https://"+process.env.REACT_APP_AUTH+".execute-api.us-east-1.amazonaws.com/"+process.env.REACT_APP_ENV+"/login",
    forgetpasswordUrl: "https://"+process.env.REACT_APP_AUTH+".execute-api.us-east-1.amazonaws.com/"+process.env.REACT_APP_ENV+"/forget-password",
    resetpasswordUrl: "https://"+process.env.REACT_APP_AUTH+".execute-api.us-east-1.amazonaws.com/"+process.env.REACT_APP_ENV+"/reset-password"
}