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
import Today from '@/routes/(app)/today';
import Login from '@/routes/(auth)/login';
import PrototypeToday from '@/routes/(prototype)/today';
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
      throw redirect({ to: '/today' });
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
        to: decodeURIComponent(search.redirect ?? encodeURIComponent('/today')),
      });
    }
  },
  component: Login,
});

const requireSignedIn = ({
  context,
  location,
}: {
  context: RouterContext;
  location: { href: string };
}) => {
  if (!context.auth?.isAuthenticated) {
    throw redirect({
      to: '/auth/login',
      search: {
        redirect: encodeURIComponent(location.href),
      },
    });
  }
};

const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'app',
  beforeLoad: requireSignedIn,
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ),
});

const todayRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'today',
  beforeLoad: requireSignedIn,
  component: Today,
});

const prototypeTodayRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'prototype/today',
  validateSearch: z.object({
    variant: z.enum(['A', 'B', 'C']).optional(),
  }),
  component: PrototypeToday,
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
  todayRoute,
  prototypeTodayRoute,
  authRoute.addChildren([loginRoute]),
  appRoute.addChildren([itemsRoute, itemRoute]),
]);
