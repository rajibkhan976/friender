import axios from 'axios';
import { userLogout } from '../actions/AuthAction';
import { store } from '../app/store';

// const rbgInstance = axios.create({
//     baseURL: 'https://rbg.com/',
//     headers: {
//         "Content-Type": "application/json",
//         "Accept": "application/json"
//     }
// });


export const frInstance1 = {
  authorizerInterceptor: axios.interceptors.response.use((response) => {
    const token = (localStorage.getItem("fr_token") == null)?"":localStorage.getItem("fr_token");
              if(response.status === 200) {
                // store.dispatch(userLogout())
                localStorage.setItem('fr_token',token)
              }
              return response;
            }, (error) => {
              if (error.response && error.response.data && error.response.message) {   
                if(error.message==="Rejected") {
                  store.dispatch(userLogout())
                }                             
                  return Promise.reject(error?.response?.data ? error.response.data : error.message);
              }
              if(error?.message==='User is not authorized to access this resource with an explicit deny' || error.response.status===403){
                  store.dispatch(userLogout())
              } 
              return Promise.reject(error.message);
            })
          }


// // Clean up the interceptors when component unmounts
// return () => {
//   instance.interceptors.request.eject(requestInterceptor);
//   instance.interceptors.response.eject(responseInterceptor);
// };
// }, []); // Empty dependency array to ensure it runs only on mount and unmount


export const frInstance = {
  authorizerInterceptor: axios.interceptors.request.use(
     (req) => {
       const token = (localStorage.getItem("fr_token") == null)?"":localStorage.getItem("fr_token");  
       if(token){
       req.headers = {
         ...req.headers,
         Authorization: token
       }
      }
      if(!token){
        store.dispatch(userLogout())
      }        
       return req;
     },
     (err) => {
      console.log('token error',err.message)
        return Promise.reject(err);
     }
   ),
   disableProdConsole: () => {
     if (process.env.REACT_APP_ENV === 'prod') {
         console.log = function() {}
     }
   }
 };


