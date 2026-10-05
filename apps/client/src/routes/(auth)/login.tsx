import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from '@tanstack/react-router';
import { toast } from 'sonner';

import { useLogin } from '@/api/generated';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';
import { LoginForm } from '@/routes/(auth)/components/login-form';
import { type LoginSchema, loginSchema } from '@/routes/(auth)/lib/schema';

const Login = () => {
  const { t } = useTranslation();
  const { mutate } = useLogin();
  const { login } = useAuth();
  const router = useRouter();
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const handleSubmit = useCallback(
    (data: LoginSchema) => {
      mutate(
        {
          data: {
            username: data.email,
            password: data.password,
          },
        },
        {
          onSuccess: (response) => {
            toast.success(t('auth.login.success'));
            login(response);
            setTimeout(async () => {
              await router.invalidate();
            }, 200);
          },
          onError(error) {
            toast.error(t('auth.login.error'));
            console.error(error);
          },
        }
      );
    },
    [login, mutate, router, t]
  );

  return (
    <Form {...form}>
      <form
        className={cn('flex flex-col gap-6')}
        onSubmit={form.handleSubmit(handleSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>{t('auth.login.title')}</CardTitle>
            <CardDescription>{t('auth.login.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};

export default Login;
