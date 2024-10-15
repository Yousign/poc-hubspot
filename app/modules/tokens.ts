import got, { HTTPError } from 'got';
import NodeCache from 'node-cache';

const CLIENT_ID = process.env.HUBSPOT_CLIENT_ID ?? '';
const CLIENT_SECRET = process.env.HUBSPOT_CLIENT_SECRET ?? '';
const REDIRECT_URI = process.env.HUBSPOT_REDIRECT_URI ?? '';

const refreshTokenStore: Record<string, string> = {};
const accessTokenCache = new NodeCache({ deleteOnExpire: true });

if (
  !process.env.HUBSPOT_CLIENT_ID ||
  !process.env.HUBSPOT_CLIENT_SECRET
) {
  throw new Error(
    'Missing HUBSPOT_CLIENT_ID or HUBSPOT_CLIENT_SECRET environment variable.'
  );
}

type TProof =
  | {
      grant_type: 'refresh_token';
      client_id: string;
      client_secret: string;
      redirect_uri: string;

      refresh_token: string;
    }
  | {
      grant_type: 'authorization_code';
      client_id: string;
      client_secret: string;
      redirect_uri: string;
      code: string;
    };

type TToken = {
  refresh_token: string;
  access_token: string;
  expires_in: number;
};

const exchangeForTokens = async (
  userId: string,
  exchangeProof: TProof
) => {
  try {
    const tokens: TToken = await got
      .post('https://api.hubapi.com/oauth/v1/token', {
        form: exchangeProof,
      })
      .json();

    // Usually, this token data should be persisted in a database and associated with
    // a user identity.

    refreshTokenStore[userId] = tokens.refresh_token;
    accessTokenCache.set(
      userId,
      tokens.access_token,
      Math.round(tokens.expires_in * 0.75)
    );

    console.log(
      '       > Received an access token and refresh token'
    );
    return tokens.access_token;
  } catch (e) {
    const error = e as HTTPError;
    console.error(
      `       > Error exchanging ${exchangeProof.grant_type} for access token`
    );
    return JSON.parse(error.response.body as string);
  }
};

const initAccessToken = async (userId: string, code: string) => {
  const refreshTokenProof = {
    grant_type: 'authorization_code',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    code,
  } satisfies TProof;
  const token = await exchangeForTokens(userId, refreshTokenProof);

  return token;
};

const refreshAccessToken = async (userId: string) => {
  const refreshTokenProof = {
    grant_type: 'refresh_token',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    refresh_token: refreshTokenStore[userId],
  } satisfies TProof;
  return await exchangeForTokens(userId, refreshTokenProof);
};

const getAccessToken = async (userId: string) => {
  // If the access token has expired, retrieve
  // a new one using the refresh token
  if (!accessTokenCache.get(userId)) {
    console.log('Refreshing expired access token');
    await refreshAccessToken(userId);
  }
  return accessTokenCache.get(userId);
};

const isAuthorized = (userId: string) => {
  return refreshTokenStore[userId] ? true : false;
};

export { initAccessToken, getAccessToken, isAuthorized };
