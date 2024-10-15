import { json, LoaderFunctionArgs } from '@remix-run/node';

const sampleData = {
  results: [
    {
      objectId: 245,
      title: 'API-22: APIs working too fast',
      link: 'http://example.com/1',
      created: '2016-09-15',
      priority: 'HIGH',
      project: 'API',
      description:
        'Customer reported that the APIs are just running too fast.',
      reporter_type: 'Account Manager',
      status: 'In Progress',
      ticket_type: 'Bug',
      updated: '2016-09-28',
      actions: [
        {
          type: 'IFRAME',
          width: 890,
          height: 748,
          uri: 'https://example.com/edit-iframe-contents',
          label: 'Edit',
          associatedObjectProperties: [],
        },
        {
          type: 'IFRAME',
          width: 890,
          height: 748,
          uri: 'https://example.com/reassign-iframe-contents',
          label: 'Reassign',
          associatedObjectProperties: [],
        },
        {
          type: 'ACTION_HOOK',
          httpMethod: 'PUT',
          associatedObjectProperties: [],
          uri: 'https://example.com/tickets/245/resolve',
          label: 'Resolve',
        },
        {
          type: 'CONFIRMATION_ACTION_HOOK',
          confirmationMessage:
            'Are you sure you want to delete this ticket?',
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          httpMethod: 'DELETE',
          associatedObjectProperties: ['protected_account'],
          uri: 'https://example.com/tickets/245',
          label: 'Delete',
        },
      ],
    },
  ],
  settingsAction: {
    type: 'IFRAME',
    width: 890,
    height: 748,
    uri: 'https://example.com/settings-iframe-contents',
    label: 'Settings',
  },
  primaryAction: {
    type: 'IFRAME',
    width: 890,
    height: 748,
    uri: 'poc-hubspot.vercel.app/create',
    label: 'Create Signature Request',
  },
};

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const userId = url.searchParams.get('userId');
  if (!userId) {
    return new Response('No userId found', { status: 400 });
  }

  return json(sampleData, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}
