import { lazy, Suspense, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PageShell } from './components/layout/PageShell';
import { RouteLoading } from './components/layout/RouteLoading';

const HomePage = lazy(() => import('./pages/HomePage'));
const FindYourFCPage = lazy(() => import('./pages/FindYourFCPage'));
const FCDirectoryPage = lazy(() => import('./pages/FCDirectoryPage'));
const FCProfilePage = lazy(() => import('./pages/FCProfilePage'));
const ResourcesPage = lazy(() => import('./pages/ResourcesPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

export default function App() {
  // Stable QueryClient via lazy initializer — see react-best-practices: rerender-lazy-state-init
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5min — proxy already caches, this is just SPA-level dedup
            gcTime: 30 * 60 * 1000,
            retry: 2,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename="/cactuaralliance.com">
        <PageShell>
          <Suspense fallback={<RouteLoading />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/find-your-fc" element={<FindYourFCPage />} />
              <Route path="/fcs" element={<FCDirectoryPage />} />
              <Route path="/fcs/:lodestoneId" element={<FCProfilePage />} />
              <Route path="/resources" element={<ResourcesPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </PageShell>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
