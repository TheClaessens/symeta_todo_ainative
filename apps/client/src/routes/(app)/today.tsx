import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate, useRouter } from '@tanstack/react-router';
import { type AxiosError, isAxiosError } from 'axios';
import { z } from 'zod';

import {
  getListProjectsQueryKey,
  useCreateProject,
  useListProjects,
} from '@/api/generated';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useProfileQuery } from '@/graphql/generated';
import { useAuth } from '@/providers/auth-provider';

// ponytail: one page; paginate the sidebar when a workspace can hold more than 100 projects
const projectPage = { pageIndex: 0, pageSize: 100 };

interface ProjectNameValues {
  name: string;
}

const createErrorMessage = ({
  error,
  duplicate,
  nameRequired,
  createFailed,
}: {
  error: unknown;
  duplicate: string;
  nameRequired: string;
  createFailed: string;
}): string => {
  if (isAxiosError(error)) {
    if (error.response?.status === 409) {
      return duplicate;
    }
    if (error.response?.status === 400) {
      return nameRequired;
    }
  }
  return createFailed;
};

const Today = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const router = useRouter();
  const { logout, user } = useAuth();
  const { data: profileData } = useProfileQuery();
  const queryClient = useQueryClient();
  const projectsQuery = useListProjects(projectPage);
  const { mutate, isPending, error } = useCreateProject<AxiosError>();

  const projectNameSchema = useMemo(
    () =>
      z.object({
        name: z.string().trim().min(1, t('workspace.project.nameRequired')),
      }),
    [t]
  );

  const form = useForm<ProjectNameValues>({
    resolver: zodResolver(projectNameSchema),
    defaultValues: { name: '' },
  });

  const profile = profileData?.profile;
  const displayName = profile
    ? `${profile.firstName} ${profile.lastName}`
    : (user?.username ?? '');

  const handleSignOut = useCallback(async () => {
    logout();
    await router.invalidate();
    await navigate({ to: '/auth/login' });
  }, [logout, navigate, router]);

  const handleCreateProject = useCallback(
    (values: ProjectNameValues) => {
      if (isPending) {
        return;
      }
      mutate(
        { data: { name: values.name } },
        {
          onSuccess: () => {
            form.reset();
            queryClient
              .invalidateQueries({
                queryKey: getListProjectsQueryKey(projectPage),
              })
              .catch(() => undefined);
          },
        }
      );
    },
    [form, isPending, mutate, queryClient]
  );

  const projects = projectsQuery.data?.data ?? [];

  return (
    <div className='flex min-h-screen'>
      <aside className='flex w-56 shrink-0 flex-col gap-4 border-r bg-sidebar p-4 text-sidebar-foreground'>
        <p className='rounded-md bg-sidebar-accent px-3 py-2 text-left text-sm'>
          {t('workspace.today')}
        </p>
        <div className='flex flex-col gap-1'>
          <p className='px-3 text-xs text-muted-foreground'>
            {t('workspace.projects')}
          </p>
          {projectsQuery.isError && (
            <div className='flex flex-col gap-2 px-3'>
              <p
                className='text-sm text-destructive'
                role='alert'>
                {t('workspace.projectsLoadFailed')}
              </p>
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() => {
                  projectsQuery.refetch().catch(() => undefined);
                }}>
                {t('workspace.retry')}
              </Button>
            </div>
          )}
          <ul className='flex flex-col gap-1'>
            {projects.map((project) => (
              <li
                key={project.id}
                className='rounded-md px-3 py-2 text-left text-sm'>
                {project.name}
              </li>
            ))}
          </ul>
          <Form {...form}>
            <form
              className='flex flex-col gap-2 px-3'
              onSubmit={form.handleSubmit(handleCreateProject)}>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='sr-only'>
                      {t('workspace.project.name')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        autoComplete='off'
                        placeholder={t('workspace.project.name')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!!error && (
                <p
                  className='text-sm text-destructive'
                  role='alert'>
                  {createErrorMessage({
                    error,
                    duplicate: t('workspace.project.duplicate'),
                    nameRequired: t('workspace.project.nameRequired'),
                    createFailed: t('workspace.project.createFailed'),
                  })}
                </p>
              )}
              <Button
                type='submit'
                size='sm'
                disabled={isPending}>
                {t('workspace.project.create')}
              </Button>
            </form>
          </Form>
        </div>
        <button
          type='button'
          className='mt-auto rounded-md border px-3 py-2 text-left text-sm'
          onClick={handleSignOut}>
          {displayName}
        </button>
      </aside>
      <main className='flex min-w-0 flex-1 flex-col gap-6 p-8'>
        <h1 className='text-xl font-semibold'>{t('workspace.today')}</h1>
      </main>
    </div>
  );
};

export default Today;
