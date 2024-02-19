import React, {useState, useEffect} from 'react';
import ApiManager from './ApiManager';
import RNFetchBlob from 'rn-fetch-blob';

export const user_login = async data => {
  try {
    const loginapi = 'Service/getDataUser';
    console.log('data: ', data);
    console.info(ApiManager.defaults.baseURL.concat('/', loginapi));

    result = await ApiManager(loginapi, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ArthaKey: 'jwhoC5vfL/Z01AszC3TaIQ==',
      },
      data: data,
    });

    // result = RNFetchBlob.config({
    //   trusty: true,
    // }).fetch(
    //   'POST',
    //   ApiManager.defaults.baseURL.concat('/', loginapi),
    //   {
    //     //Accept: 'application/json',
    //     Authorization: 'jwhoC5vfL/Z01AszC3TaIQ==',
    //     'Content-Type': 'application/json; charset=utf-8',
    //   },
    //   JSON.stringify(data),
    // );
    return result;
  } catch (err) {
    throw err;
  }
};
