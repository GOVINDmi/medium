import axios from "axios";


export const getAccessToken = async (jwtToken:string) => {
 
  try {
    const response = await axios.post('https://oauth2.googleapis.com/token',
      {
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: jwtToken
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
 
    return response.data.access_token;
  } catch (error) {
    console.error("Error fetching access token: ", error);
  }
};
