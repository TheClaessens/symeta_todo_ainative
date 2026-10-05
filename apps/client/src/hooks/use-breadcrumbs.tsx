import { useMatchRoute, useParams, useRouter } from '@tanstack/react-router';

import { useAppConfig } from '@/hooks/use-app-config';

export interface BreadcrumbItem {
  title: string;
  href: string;
}

export function useBreadcrumbs(): Array<BreadcrumbItem> {
  const { items } = useAppConfig();
  const matchRoute = useMatchRoute();
  const router = useRouter();
  const params = useParams({ strict: false });

  for (const item of items) {
    const matchingSubItem = item.items?.find((subItem) =>
      matchRoute({ to: subItem.location.href, fuzzy: false })
    );

    if (matchingSubItem) {
      return [
        { title: item.title, href: item.location.href },
        {
          title: matchingSubItem.title,
          href: matchingSubItem.location.href,
        },
      ];
    }

    if (matchRoute({ to: item.location.href, fuzzy: false })) {
      return [{ title: item.title, href: item.location.href }];
    }

    if (
      item.items?.length &&
      matchRoute({ to: item.location.href, fuzzy: true })
    ) {
      const breadcrumbs: Array<BreadcrumbItem> = [
        { title: item.title, href: item.location.href },
      ];

      if (params.itemId) {
        breadcrumbs.push({
          title: String(params.itemId),
          href: router.state.location.href,
        });
      }

      return breadcrumbs;
    }
  }

  return [];
}
