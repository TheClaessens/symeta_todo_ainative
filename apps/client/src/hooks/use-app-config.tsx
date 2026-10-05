import { useTranslation } from 'react-i18next';
import { type ParsedLocation, useRouter } from '@tanstack/react-router';
import { Rocket } from 'lucide-react';

export interface NavItem {
  title: string;
  description?: string;
  location: ParsedLocation;
  items?: Array<NavItem>;
}

/**
 * All application configuration should be stored/handled here.
 * Purpose of this hook: if a new project is setup using the kickstart template, you only need to modify this hook to change the application configuration.
 */
export function useAppConfig(): {
  name: string;
  logo: React.ReactNode;
  items: Array<NavItem>;
} {
  const { t } = useTranslation();
  const router = useRouter();
  return {
    name: 'Kickstart',
    logo: <Rocket className='h-8 w-8 p-2' />,
    items: [
      {
        title: t('navigation.main.title'),
        location: router.buildLocation({
          to: '/app/items',
        }),
        items: [
          {
            title: t('navigation.main.items.sub1.title'),
            description: t('navigation.main.items.sub1.description'),
            location: router.buildLocation({
              to: '/app/items/$itemId',
              params: {
                itemId: '1',
              },
            }),
          },
          {
            title: t('navigation.main.items.sub2.title'),
            description: t('navigation.main.items.sub2.description'),
            location: router.buildLocation({
              to: '/app/items/$itemId',
              params: {
                itemId: '2',
              },
            }),
          },
        ],
      },
    ],
  };
}
