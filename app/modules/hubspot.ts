//====================================================//
//   Using an Access Token to Query the HubSpot API   //
//====================================================//

import got, { HTTPError } from 'got';

const getContacts = async (accessToken: string) => {
  console.log('');
  console.log(
    '=== Retrieving a contact from HubSpot using the access token ==='
  );
  try {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
    console.log(
      '===> Replace the following request.get() to test other API calls'
    );
    console.log(
      "===> request.get('https://api.hubapi.com/contacts/v1/lists/all/contacts/all?count=10')"
    );
    const result = await got(
      'https://api.hubapi.com/contacts/v1/lists/all/contacts/all?count=1',
      {
        headers: headers,
      }
    ).json();

    return result;
  } catch (e) {
    const error = e as HTTPError;
    console.error('  > Unable to retrieve contact');
    return JSON.parse(error.response.body);
  }
};

export { getContacts };
