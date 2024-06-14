import { Fragment, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { publicRoutes, adminRoutes } from '~/routes';
import { DefaultLayout } from '~/layouts';
import Loader from '~/common/Loader';

function RoutesComponent() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <Routes>
      {publicRoutes.map((route, index) => {
        const Page = route.component;
        let Layout = route.layout ?? DefaultLayout;

        return (
          <Route
            key={index}
            path={route.path}
            element={
              <Layout>
                <Page />
              </Layout>
            }
          />
        );
      })}

      {adminRoutes.map((route, index) => {
        const Page = route.component;
        let Layout = route.layout ?? DefaultLayout;

        return (
          <Route
            key={index}
            path={route.path}
            element={
              localStorage.getItem('Role') === 'admin' ? (
                <Layout>
                  <Page />
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        );
      })}
    </Routes>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <Router>
      <div className="App">
        <RoutesComponent />
      </div>
    </Router>
  );
}

export default App;
