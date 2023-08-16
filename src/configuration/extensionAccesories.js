const extensionId = process.env.REACT_APP_EXTENSION_ID;
const extensionMethods = {
    extensionId : extensionId,
    isExtensionInstalled : async (extensionPayload) => {
                                return new Promise((resolve, reject) => {
                                    console.log("extensionId",extensionId)
                                    if(chrome.runtime) {
                                        chrome.runtime.sendMessage(extensionId, extensionPayload, (res) => {
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
                                        chrome.runtime.sendMessage(extensionId, extensionPayload, (res,err) => {
                                            console.log("resssss",res,err)
                                            if(!chrome.runtime.lastError){
                                                if(res) resolve(res); else resolve({error : {message : "No response"}});
                                            } else {
                                                resolve({error : chrome.runtime.lastError})
                                            };
                                        }); 
                                    } else {
                                        resolve({error : "chrome runtime not found"});
                                    }
                                })
                            }
}

export default extensionMethods;