import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchUrl = uploadData
      ? await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(uploadData),
        })
      : await fetch(url);
    const res = await Promise.race([fetchUrl, timeout(TIMEOUT_SEC)]);
    // `https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bcb34`

    const data = await res.json();

    if (!res.ok)
      throw new Error(`${data.message} with Error Code (${res.status})`);

    return data;
  } catch (err) {
    throw err;
  }
};

// export const getJSON = async function (url) {
//   try {
//     // collecting recipe data
//     const fetchUrl = await fetch(url);
//     const res = await Promise.race([fetchUrl, timeout(TIMEOUT_SEC)]);
//     // `https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bcb34`

//     const data = await res.json();

//     if (!res.ok)
//       throw new Error(`${data.message} with Error Code (${res.status})`);

//     return data;
//   } catch (err) {
//     throw err;
//   }
// };
// export const sendJSON = async function (url, uploadData) {
//   try {
//     // collecting recipe data
//     const fetchUrl = await fetch(url, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(uploadData),
//     });
//     const res = await Promise.race([fetchUrl, timeout(TIMEOUT_SEC)]);
//     // `https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bcb34`

//     const data = await res.json();

//     if (!res.ok)
//       throw new Error(`${data.message} with Error Code (${res.status})`);

//     return data;
//   } catch (err) {
//     throw err;
//   }
// };
