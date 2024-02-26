import React, {useState, useEffect} from 'react';
import ApiManager from './ApiManager';

export const getpayment = async data => {
  try {
    const urlapi = 'Service/GetDataPaymentType';
    console.log('data: ', data);
    console.info(ApiManager.defaults.baseURL.concat('/', urlapi));

    result = await ApiManager(urlapi, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ArthaKey: 'jwhoC5vfL/Z01AszC3TaIQ==',
      },
      data: data,
    });
    return result;
  } catch (err) {
    throw err;
  }
};
