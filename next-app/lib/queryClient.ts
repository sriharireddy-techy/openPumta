import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24,
      staleTime: 1000 * 60 * 5,
    },
  },
});
declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__: import('@tanstack/react-query').QueryClient;
  }
}

window.__TANSTACK_QUERY_CLIENT__ = queryClient;

export const invalidateSubjectTimerQueries = async () => {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: ['subjects'] }),
    queryClient.invalidateQueries({ queryKey: ['habits'] }),
    queryClient.invalidateQueries({ queryKey: ['habitDashboard'] }),
    queryClient.invalidateQueries({ queryKey: ['habitsWithLogs'] }),
    queryClient.invalidateQueries({ queryKey: ['timeline'] }),
    queryClient.invalidateQueries({ queryKey: ['dashboardStats'] }),
    queryClient.invalidateQueries({ queryKey: ['subjectsWithLogs21'] }),
  ]);
};
