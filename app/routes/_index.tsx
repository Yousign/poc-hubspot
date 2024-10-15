import type { MetaFunction } from '@remix-run/node';
import { NavLink } from '@remix-run/react';

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
};

export default function Index() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-16">
        <header className="flex flex-col items-center gap-9">
          <h1 className="leading text-2xl font-bold text-gray-800 dark:text-gray-100">
            Welcome in this PoC hubspot application
          </h1>
        </header>
        <nav className="flex flex-col items-center justify-center gap-4">
          <p className="leading-2 text-gray-700 dark:text-gray-200">
            <NavLink
              className="rounded-xl border border-gray-200 px-4 py-2 dark:border-gray-700"
              to="/install"
            >
              install
            </NavLink>
          </p>
        </nav>
      </div>
    </div>
  );
}
