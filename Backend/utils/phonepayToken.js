import axios from "axios";
import qs from "qs";

let cachedToken = null;
let expiryTime = 0;

export const getPhonePeToken = async () => {
  const now = Date.now();

  if (cachedToken && now < expiryTime) {
    return cachedToken;
  }

  const data = qs.stringify({
    client_id: process.env.PHONEPE_CLIENT_ID,
    client_secret: process.env.PHONEPE_CLIENT_SECRET,
    grant_type: "client_credentials",
    client_version: process.env.PHONEPE_CLIENT_VERSION
  });

  const response = await axios.post(
    "https://api.phonepe.com/apis/identity-manager/v1/oauth/token",
    data,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json"
      }
    }
  );

  cachedToken = response.data.access_token;
  expiryTime = now + response.data.expires_in * 1000;

  return cachedToken;
};
