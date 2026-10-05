import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import { createRouter, RouterProvider } from '@tanstack/react-router';

import ApolloProvider from '@/providers/apollo-provider';
import { AuthProvider, useAuth } from '@/providers/auth-provider';
import { TanstackProvider } from '@/providers/tanstack-provider';
import { routes } from '@/routes';

import i18n from './i18n/config';

import './index.css';

const router = createRouter({
  routeTree: routes,
  defaultPreload: 'intent',
  scrollRestoration: true,
  context: {
    auth: undefined, // This will be set after we wrap the app in an AuthProvider
  },
});

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter<typeof routes>>;
  }
}

const App = () => {
  const auth = useAuth();
  return (
    <RouterProvider
      router={router}
      context={{ auth }}
    />
  );
};

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <I18nextProvider i18n={i18n}>
        <AuthProvider>
          <TanstackProvider>
            <ApolloProvider>
              <App />
            </ApolloProvider>
          </TanstackProvider>
        </AuthProvider>
      </I18nextProvider>
    </StrictMode>
  );
}
