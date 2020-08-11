import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, CircularProgress } from '@material-ui/core';
import { theme } from './theme';
import Home from './pages/Home';
import Shop from 'pages/Shop';
import { AnimatePresence } from 'framer-motion';
import Layout from 'components/layouts/Layout';



function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <React.Suspense fallback={<CircularProgress />}>
        <BrowserRouter>
          <Layout>
            <Route
              render={({ location }) => (
                <AnimatePresence exitBeforeEnter>
                  <Switch location={location} key={location.pathname}>
                    <Route exact path='/shop' component={Shop} />
                    <Route exact path='/' component={Home} />
                  </Switch>
                </AnimatePresence>
              )}
            />
          </Layout>
        </BrowserRouter>
      </React.Suspense>
    </ThemeProvider>
  );
}

export default App;
