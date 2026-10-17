'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

export const queryKeys = {
  auth: ['auth'] as const,
  walks: ['walks'] as const,
  pastWalks: ['walks', 'past'] as const,
  birds: ['birds'] as const,
  members: ['members'] as const,
};

export async function apiRequest<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.success === false) {
    throw new Error(data.error || `Request failed (${response.status})`);
  }

  return data as T;
}
export function useApiMutation(invalidatedKeys: readonly (readonly unknown[])[]) {
  const queryClient = useQueryClient();
  type Variables = { url: string; method: string; body?: unknown; headers?: HeadersInit };
  type Item = { id?: number | string };
  type Context = { key: readonly unknown[]; previous: Item[] } | undefined;

  return useMutation<unknown, Error, Variables, Context>({
    mutationFn: ({ url, method, body, headers }) => {
      const requestHeaders = new Headers(headers);
      if (body) requestHeaders.set('Content-Type', 'application/json');
      return apiRequest<unknown>(url, {
        method,
        headers: requestHeaders,
        ...(body ? { body: JSON.stringify(body) } : {}),
      });
    },
    onMutate: async ({ url, method }) => {
      if (method !== 'DELETE') return undefined;
      const key = url.includes('/members/')
        ? queryKeys.members
        : url.includes('/birds/')
          ? queryKeys.birds
          : url.includes('/walks/past/')
            ? queryKeys.pastWalks
            : queryKeys.walks;
      const previous = queryClient.getQueryData<Item[]>(key) ?? [];
      const id = decodeURIComponent(url.split('/').pop() ?? '');
      queryClient.setQueryData<Item[]>(key, previous.filter((item) => String(item.id) !== id));
      return { key, previous };
    },
    onError: (_error, _variables, context) => {
      if (context) queryClient.setQueryData(context.key, context.previous);
    },
    onSuccess: (data, variables) => {
      if (variables.method === 'POST' && data && typeof data === 'object' && 'id' in data) {
        const key = variables.url === '/api/members'
          ? queryKeys.members
          : variables.url === '/api/birds'
            ? queryKeys.birds
            : variables.url === '/api/walks/past'
              ? queryKeys.pastWalks
              : queryKeys.walks;
        queryClient.setQueryData<Item[]>(key, (current = []) => [data as Item, ...current]);
      }
      invalidatedKeys.forEach((queryKey) => {
        void queryClient.invalidateQueries({ queryKey });
      });
    },
  });
}
