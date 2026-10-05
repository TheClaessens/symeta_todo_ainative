import {
  createRootRouteWithContext,
  createRoute,
  Outlet,
  redirect,
} from '@tanstack/react-router';
import { z } from 'zod';

import AppLayout from '@/components/blocks/layout/app-layout';
import Centered from '@/components/blocks/layout/centered';
import type { AuthContextProps } from '@/providers/auth-provider';
import Item from '@/routes/(app)/(items)/item';
import Items from '@/routes/(app)/(items)/items';
import Login from '@/routes/(auth)/login';
import Root from '@/routes/root';

interface RouterContext {
  auth?: AuthContextProps;
}

const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: Root,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: ({ context }) => {
    if (context.auth?.isAuthenticated) {
      throw redirect({ to: '/app/items' });
    } else {
      throw redirect({ to: '/auth/login' });
    }
  },
});

const authRoute = createRoute({
  path: 'auth',
  getParentRoute: () => rootRoute,
  component: () => (
    <Centered>
      <Outlet />
    </Centered>
  ),
});

const loginRoute = createRoute({
  getParentRoute: () => authRoute,
  path: 'login',
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
  beforeLoad: ({ context, search }) => {
    if (context.auth?.isAuthenticated) {
      throw redirect({
        to: decodeURIComponent(
          search.redirect ?? encodeURIComponent('/app/items')
        ),
      });
    }
  },
  component: Login,
});

const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'app',
  beforeLoad: ({ context, location }) => {
    if (!context.auth?.isAuthenticated) {
      throw redirect({
        to: '/auth/login',
        search: {
          redirect: encodeURIComponent(location.href),
        },
      });
    }
  },
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ),
});

const itemsRoute = createRoute({
  getParentRoute: () => appRoute,
  path: 'items',
  component: Items,
});

const itemRoute = createRoute({
  getParentRoute: () => appRoute,
  path: 'items/$itemId',
  component: Item,
});

export const routes = rootRoute.addChildren([
  indexRoute,
  authRoute.addChildren([loginRoute]),
  appRoute.addChildren([itemsRoute, itemRoute]),
]);
