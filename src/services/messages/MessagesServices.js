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