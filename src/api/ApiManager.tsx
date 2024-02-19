import axios, { AxiosResponse, AxiosError } from 'axios';
import * as Utils from '../Helpers/Utils';

const ApiManager = axios.create({
    //baseURL: 'https://bluverseapi23.azurewebsites.net/api',    
    baseURL: 'http://localhost:8080/BluversePOS/BluverseAPI/api',
    //baseURL: 'http://10.0.2.2:44312',
    //responseType:'json'
    withCredentials: true,
    timeout: 2000, // only wait for 2s
    // signal: newAbortSignal(10000), //Aborts request after 5 seconds
});

ApiManager.interceptors.response.use((response) => {
  // console.log(response);
  return response;
}, async (error: any) => {
  let errorResponse: any;
  var isConnected = (await Utils.isNetworkAvailable());
  if(!isConnected){
    errorResponse = "Please Check Your Connectivity.";
  }
  else if (error?.isAxiosError) {
    const axiosError = error as AxiosError;
    console.log("axioserror:",JSON.stringify(axiosError));
    if(axiosError.message == "Network Error")
    {
      errorResponse = 'Servers is not available.';
    }
    else if(axiosError.message.trim().toLowerCase().includes('timeout of'))
    {
      errorResponse = 'Servers is not available.';
    }    
    else if(axiosError.message.trim().toLowerCase().includes('Auth')) //have data message
    {
      errorResponse = axiosError.message.replace('Auth :','');
    }
    else if (axiosError.response!.status === 400) {
      // Handle 400
      errorResponse = error.response.data.replace('Auth :','');      
    }
    else{
      errorResponse = axiosError.message; //all the info here
    }
  } else {
    if(!error.message)  //get from message
    {
      errorResponse = error.message;
      if(error.message.trim().toLowerCase().includes('timeout of'))
      {
        errorResponse = 'Servers is not available.';
      }
      else if(error.message.trim().toLowerCase().includes('status code')) //have data message
      {
        errorResponse = error.response.data.replace('Auth :','');                
      }
    }
    else{
      errorResponse = error; // it is not an A.xiosError
    }    
  }
  console.info(errorResponse);
  throw new Error(errorResponse);
  // return Promise.resolve({ error });
});

// function newAbortSignal(timeoutMs) {
//   const abortController = new AbortController();
//   setTimeout(() => abortController.abort(), timeoutMs || 0);

//   return abortController.signal;
// }

export default ApiManager;