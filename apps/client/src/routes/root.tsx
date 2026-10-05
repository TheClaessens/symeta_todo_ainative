import { Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Toaster } from 'sonner';

const Root = () => (
  <>
    <Outlet />
    <TanStackRouterDevtools position='bottom-right' />
    <Toaster />
  </>
);

export default Root;
