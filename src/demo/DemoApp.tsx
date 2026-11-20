import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { DemoLayout } from './DemoLayout';
import { DEMO_PAGES } from './pages/registry';
import { DEMO_FALLBACK_PATH, DEMO_ROUTES } from './routes';

export function DemoApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DemoLayout />} path="/">
          <Route index element={<Navigate replace to={DEMO_FALLBACK_PATH} />} />

          {DEMO_ROUTES.map(({ id, path }) => (
            <Route key={id} element={DEMO_PAGES[id]} path={path.slice(1)} />
          ))}

          <Route
            element={<Navigate replace to={DEMO_FALLBACK_PATH} />}
            path="*"
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
