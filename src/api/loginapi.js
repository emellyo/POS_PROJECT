import React, {useState, useEffect} from 'react';
import ApiManager from './ApiManager';

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
    return result;
  } catch (err) {
    throw err;
  }
};
