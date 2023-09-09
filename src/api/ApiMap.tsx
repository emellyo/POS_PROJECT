import axios, { AxiosResponse, AxiosError } from 'axios';
import * as Utils from '../Helpers/Utils';

const ApiMap = axios.create({
    baseURL: 'https://dev.virtualearth.net/REST/v1',
    // withCredentials: true
});

ApiMap.interceptors.response.use((response) => {
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
    else if (axiosError.response!.status === 400) {
      // Handle 400
      console.log(error.response.data);
      // console.log("axioserror:",JSON.stringify(axiosError));
      errorResponse = error.response.data;
    }
    else if(axiosError.message.trim().toLowerCase().includes('timeout of'))
    {
      errorResponse = 'Servers is not available.';
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
      errorResponse = error; // it is not an AxiosError
    }    
  }
  throw errorResponse;
  // return Promise.resolve({ error });
});

export default ApiMap;
