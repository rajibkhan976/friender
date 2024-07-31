
const getExtensionId = () => {
    const local_extension_id = localStorage.getItem("local_extension_id");
    const extensionId = local_extension_id ? local_extension_id : process.env.REACT_APP_EXTENSION_ID;
    return extensionId;
}
const extensionMethods = {
    extensionId : getExtensionId(),
    isExtensionInstalled : async (extensionPayload) => {
                                return new Promise((resolve, reject) => {
                                    console.log("extensionId",getExtensionId())
                                    if(chrome.runtime) {
                                        chrome.runtime.sendMessage(getExtensionId(), extensionPayload, (res) => {
                                            if(!chrome.runtime.lastError){
                                                if(res) resolve(true); else resolve(false);
                                            }else resolve(false);
                                        }); 
                                    } else {
                                        resolve(false);
                                    }
                                    
                                })
                            },
    sendMessageToExt :  async (extensionPayload) => {
                                return new Promise((resolve, reject) => {
                                    if(chrome.runtime) {
                                        chrome.runtime.sendMessage(getExtensionId(), extensionPayload, (res,err) => {
                                            console.log("resssss",res,err)
                                            if(!chrome.runtime.lastError){
                                                if(res) resolve(res); else resolve({error : {message : "No response"}});
                                            } else {
                                                resolve({error : chrome.runtime.lastError})
                                            };
                                        }); 
                                    } else {
                                        console.log("actual error is chrome runtime was not found",chrome)
                                        resolve({error : {message : "Could not establish connection. Receiving end does not exist."}});
                                    }
                                })
                            }
}

export default extensionMethods;