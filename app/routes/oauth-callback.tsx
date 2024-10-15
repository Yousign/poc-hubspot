import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData, useNavigation } from '@remix-run/react';

const client_id = process.env.HUBSPOT_CLIENT_ID ?? '';
const client_secret = process.env.HUBSPOT_CLIENT_SECRET ?? '';
const redirect_uri = process.env.HUBSPOT_REDIRECT_URI ?? '';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  if (!code) {
    return new Response('No code found', { status: 400 });
  }

  const formData = new FormData();

  formData.append('grant_type', 'authorization_code');
  formData.append('client_id', client_id);
  formData.append('client_secret', client_secret);
  formData.append('redirect_uri', redirect_uri);
  formData.append('code', code);

  await fetch('https://api.hubapi.com/oauth/v1/token', {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return json({ message: 'success', client_id });
}

export default function Install() {
  const data = useLoaderData<typeof loader>();
  const navigation = useNavigation();

  return navigation.state === 'loading' ? (
    <div className="spinner">loading...</div>
  ) : (
    <div>
      success{' '}
      <span className="font-light italic">{data.client_id}</span>
    </div>
  );
}
