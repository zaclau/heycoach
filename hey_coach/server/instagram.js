/* 
Instagram API flow:
1. redirect to authorization window
2. get authorization code
3. exchange code for short-lived access token
4. exchange short-lived for long-lived access token
5. store token in db
6. redirect to landing page
*/

const { graphQLFetch } = require('../src/graphQL/graphQLFetch');
const axios = require('axios');

async function getAuthorization() {
    try {
        window.location.href = '/api/v1/instagram/get-auth-code';
    } catch (e) {
        console.log('Failed to authorize: ', e);
    }
}

async function getAuthorizationCode(req) {
    const { code, error, error_reason, error_description } = req.query;
    if (error) {
        console.log('Error authorizing: ', error, error_reason, error_description);
        throw new Error(`${error_reason}: ${error_description}`);
    }
    return code;
}

async function getAccessToken(code) {
    const shortAccessToken = await getShortAccessToken(code);
    if (!shortAccessToken) {
        throw new Error('Failed to get short access token');
    }

    const longAccessToken = await getLongAccessToken(shortAccessToken.access_token);
    if (!longAccessToken) {
        throw new Error('Failed to get long access token');
    }
    console.log('Got Long live Access Token: ', longAccessToken);

    return longAccessToken; 

    // const media = await getUserMedia(longAccessToken.access_token, userProfile.media.data[0].id);
}

async function getShortAccessToken(code) {
    const requestBody = {
        client_id: process.env.REACT_APP_INSTAGRAM_CLIENT_ID,
        client_secret: process.env.REACT_APP_INSTAGRAM_CLIENT_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: process.env.REACT_APP_INSTAGRAM_REDIRECT_URI,
        code
    };

    try {
        const response = await axios.post(
            'https://api.instagram.com/oauth/access_token', 
            requestBody, 
            {headers: { 'Content-Type': 'application/x-www-form-urlencoded' }});
        console.log('Short lived access token: ', response.data);
        return response.data;
    } catch (e) {
        console.log('Failed to get short access token: ', e);
        return null;
    }
}

async function getLongAccessToken(shortAccessToken) {
    const url = 'https://graph.instagram.com/access_token';
    const params = {
        client_secret: process.env.REACT_APP_INSTAGRAM_CLIENT_SECRET,
        grant_type: 'ig_exchange_token',
        access_token: shortAccessToken
    };

    try {
        const response = await axios.get(url, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            params: params
        });
        console.log('Long lived access token: ', response.data);
        return response.data;
    } catch (e) {
        console.log('Failed to get long access token: ', e.response.data);
        return null;
    }        
}

async function getUserProfile(longAccessToken) {
    const url = `https://graph.instagram.com/me`;
    const params = {
        fields: 'id,username,account_type,media_count,media',
        access_token: longAccessToken
    };

    try {
        const response = await axios.get(url, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            params: params
        });
        console.log('User profile: ', response.data);
        return response.data;
    } catch (e) {
        console.log('Failed to get user profile: ', e.response.data);
        return null;
    }
}

async function getUserMedia(
    fields = 'caption,id,media_type,media_url,permalink,thumbnail_url,timestamp,username', 
    longAccessToken,
    limit = 5
) {
    // https://developers.facebook.com/docs/instagram-basic-display-api/guides/getting-profiles-and-media
    const url = `https://graph.instagram.com/me/media`;
    const params = {
        fields: fields,
        access_token: longAccessToken,
        limit
    };

    try {
        const response = await axios.get(url, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            params: params
        });
        console.log(`Media returned: `, response.data);
        return response.data;
    } catch (e) {
        console.log(`Failed to get media: `, e.response.data);
        throw new Error('Failed to get media');
    }
}

module.exports = { getAuthorization, getAuthorizationCode, getAccessToken, getUserMedia };

// async function updateUserProfileWithToken(userId, accessToken) {
//     const updateUserProfileMutation = `
//         mutation updateUserProfile($userId: ID!, $updatedProfile: InputsForUserProfile!) {
//             updateUserProfile(userId: $userId, updatedProfile: $updatedProfile) {
//                 _id
//                 email
//                 firstName
//                 lastName
//                 instagramAccessToken
//             }
//         }
//     `;
//     const variables = {
//         userId,
//         updatedProfile: {
//             instagramAccessToken: accessToken
//         }
//     };
//     try {
//         const response = await graphQLFetch(updateUserProfileMutation, variables);
//         console.log('Updated user profile with token: ', response.updateUserProfile);
//         return response.updateUserProfile;
//     } catch (e) {
//         console.log('Failed to update user profile with token: ', e);
//         throw new Error('Failed to update user profile with token');
//     }
// }