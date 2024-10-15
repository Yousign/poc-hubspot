import { redirect } from '@remix-run/react';

const client_id = process.env.HUBSPOT_CLIENT_ID;
const redirect_uri = process.env.HUBSPOT_REDIRECT_URI;
const scope = process.env.HUBSPOT_SCOPE;

const authUrl = `https://app.hubspot.com/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}`;

export const loader = async () => redirect(authUrl);
