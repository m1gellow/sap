import axios from 'axios';
import qs from 'qs';
const CLIENT_ID = 'laULSPzwadeR1ZJ86pezTudkdhiWKBFH';
const CLIENT_SECRET = '5f9cBI02HikdjbIyvVny9kmIw0WeTPac';
const CDEK_API_URL = 'https://apidoc.cdek.ru';

let accessToken = '';
let tokenExpires = 0;

export const authenticate = async () => {
  try {
    const response = await axios.post(
      `${CDEK_API_URL}/v2/oauth/token`,
      qs.stringify({
        grant_type: 'client_credentials',
        client_id: CLIENT_ID,    // ← исправлено
        client_secret: CLIENT_SECRET  // ← исправлено (обратите внимание на опечатку в 'client_secret')
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        withCredentials: false
      },
    );

    accessToken = response.data.access_token;
    tokenExpires = Date.now() + response.data.expires_in * 1000;

    return accessToken;
  } catch (error) {
    console.error('CDEK auth error:', error);
    return false;
  }
};

// https://iixstmihupsjzubekbpl.supabase.co/functions/v1/cdek-api

// https://iixstmihupsjzubekbpl.supabase.co/functions/v1/cdek-api