const extensionId = process.env.REACT_APP_EXTENSION_ID;
const extensionMethods = {
    extensionId : extensionId,
    isExtensionInstalled : async (extensionPayload) => {
                                return new Promise((resolve, reject) => {
                                    if(chrome.runtime)
                                    chrome.runtime.sendMessage(extensionId, extensionPayload, (res) => {
                                        if(!chrome.runtime.lastError){
                                            if(res) resolve(true); else resolve(false);
                                        }else resolve(false);
                                    }); 
                                    else resolve(false);
                                })
                            },
    sendMessageToExt :  async (extensionPayload) => {
                                return new Promise((resolve, reject) => {
                                    if(chrome.runtime)
                                    chrome.runtime.sendMessage(extensionId, extensionPayload, (res) => {
                                        if(!chrome.runtime.lastError){
                                            if(res) resolve(res); else resolve({error : "error"});
                                        }else resolve({error : "error"});
                                    }); 
                                    else resolve({error : "error"});
                                })
                            },
}

export default extensionMethods;