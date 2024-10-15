import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData, useNavigation } from '@remix-run/react';
import { getContacts } from '~/modules/hubspot';
import { initAccessToken } from '~/modules/tokens';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  if (!code) {
    return new Response('No code found', { status: 400 });
  }

  const token = await initAccessToken('hubspot', code);

  const contacts = await getContacts(token);

  return json({
    message: 'success',
    contacts: contacts,
  });
}

export default function Install() {
  const data = useLoaderData<typeof loader>();
  const navigation = useNavigation();

  return navigation.state === 'loading' ? (
    <div className="spinner">loading...</div>
  ) : (
    <div>
      success{' '}
      <pre>
        <code>{JSON.stringify(data.contacts, null, 2)}</code>
      </pre>
    </div>
  );
}
