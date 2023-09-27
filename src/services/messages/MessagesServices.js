import axios from "axios";
import config from "../../configuration/config";

let headers = {
  "Content-Type": "application/json",
  "Authorization": localStorage.getItem('fr_token')
};

export const fetchDMFs = ()=>{
    // console.log('called fetch', config.fetchDmfUrl);
    return new Promise((resolve, reject)=>{
      axios
        .get(config.fetchDmfUrl,{headers: headers})
        .then((result)=>{
            // console.log('got result');
            resolve(result.data);
        })
        .catch((error)=>{
            console.log('error', error);
          reject(error?.response?.data ? error.response.data : error.message);
        })
    })
  }

export const addNewDMF = (newDMF)=>{
    // console.log("newDMF", newDMF);
    return new Promise((resolve, reject)=>{
    axios
        .post(
            config.addUpdateDmfUrl,
            newDMF,
            {headers: headers}
        )
        .then((result)=>{
            // console.log('got result');
            resolve(result.data);
        })
        .catch((error)=>{
            console.log('error', error);
            reject(error?.response?.data ? error.response.data : error.message);
        })
    })
}

export const addNewSubDMF = (newSubDMF)=>{
    console.log("newDMF", newSubDMF);
    return new Promise((resolve, reject)=>{
    axios
        .post(
            config.addUpdateSubDmfUrl,
            newSubDMF,
            {headers: headers}
        )
        .then((result)=>{
            // console.log('got result', result.data);
            resolve(result.data);
        })
        .catch((error)=>{
            console.log('error', error);
            reject(error?.response?.data ? error.response.data : error.message);
        })
    })
}

export const deleteDMF = (deleteDmf)=>{
    return new Promise((resolve, reject)=>{
    axios
        .post(
            config.deleteDmfUrl,
            deleteDmf,
            {headers: headers}
        )
        .then((result)=>{
            // console.log('got deleted', result.data);
            resolve(result.data);
        })
        .catch((error)=>{
            console.log('error', error);
            reject(error?.response?.data ? error.response.data : error.message);
        })
    })
}

export const deleteSubDMF = (deleteSubDmf)=>{
    return new Promise((resolve, reject)=>{
    axios
        .post(
            config.deleteSubDmfUrl,
            deleteSubDmf,
            {headers: headers}
        )
        .then((result)=>{
            // console.log('got deleted', result.data);
            resolve(result.data);
        })
        .catch((error)=>{
            console.log('error', error);
            reject(error?.response?.data ? error.response.data : error.message);
        })
    })
}

export const prioritySubDMF = (updatePrioritySubDmf)=>{
    return new Promise((resolve, reject)=>{
    axios
        .post(
            config.prioritySubDMF,
            updatePrioritySubDmf,
            {headers: headers}
        )
        .then((result)=>{
            // console.log('got deleted', result.data);
            resolve(result.data);
        })
        .catch((error)=>{
            console.log('error', error);
            reject(error?.response?.data ? error.response.data : error.message);
        })
    })
}

export const fetchAllGroups = (pageRef) => {
    return new Promise((resolve, reject) => {
        axios
            .get(`${config.fetchMessageGroupsUrl}/${pageRef}`, {headers:headers})
            .then((res) => {
                resolve(res.data)
            })
            .catch((err) => {
                console.log("error fount in fetching", err);
            })
    })
}

export const fetchAllSegments = (pageRef) => {
    const url = pageRef ? `${config.fetchMessageSegmentsUrl}/${pageRef}` : `${config.fetchMessageSegmentsUrl}/all`;

    return new Promise((resolve, reject) => {
        axios
            .get(`${url}`, {headers:headers})
            .then((res) => {
                resolve(res.data)
            })
            .catch((err) => {
                console.log("error fount in fetching", err);
            })
    })
}

export const addOneSegment = (newSegment) => {
    return new Promise((resolve, reject) => {
        axios.post(config.createMessageSegmentUrl, newSegment, {headers:headers})
            .then((result) => {
                resolve(result?.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

export const deleteOneSegment = (groupId) => {
    return new Promise((resolve, reject) => {
        axios
            .post(
                config.deleteMessageSegmentUrl,
                groupId,
                {headers: headers}
            )
            .then((res) => {
                resolve(res.data)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

export const addNewSegmentMessage = (newSegmentMessage) => {
    return new Promise((resolve, reject) => {
        axios
            .post(
                config.addNewMessageSegmentMessageUrl,
                newSegmentMessage,
                {headers:headers}
            )
            .then((res) => {
                console.log('res', res);
                resolve(res.data)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

export const deleteSegmentMessage = (messageId) => {
    return new Promise((resolve, reject) => {
        axios
            .post(
                config.deleteMessageSegmentMessageUrl,
                {
                    "messageId": messageId
                },
                {headers: headers}
            )
            .then((res) => {
                resolve(res?.data)
            })
            .catch(error => {
                reject(error)
            })
    })
}

export const addOneGroup = (newGroup) => {
    console.log('got new message group', newGroup);
    return new Promise((resolve, reject) => {
        axios
            .post(
                config.createMessageGroupUrl,
                newGroup,
                {headers:headers}
            )
            .then((result) => {
                resolve(result?.data);
            })
            .catch((error) => {
                reject(error);
            })
    })
}

export const deleteOneGroup = (groupId) => {
    return new Promise((resolve, reject) => {
        axios
            .post(
                config.deleteMessageGroupUrl,
                groupId,
                {headers: headers}
            )
            .then((res) => {
                resolve(res.data)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

export const addNewGroupMessage = (newGroupMessage) => {
    return new Promise((resolve, reject) => {
        axios
            .post(
                config.addNewMessageGroupMessageUrl,
                newGroupMessage,
                {headers:headers}
            )
            .then((res) => {
                console.log('res', res);
                resolve(res.data)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

export const deleteGroupMessage = (messageId) => {
    return new Promise((resolve, reject) => {
        axios
            .post(
                config.deleteMessageGroupMessageUrl,
                {
                    "messageId": messageId
                },
                {headers: headers}
            )
            .then((res) => {
                resolve(res?.data)
            })
            .catch(error => {
                reject(error)
            })
    })
}
