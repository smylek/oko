import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, CircularProgress } from '@material-ui/core';
import { theme } from './theme';
import Home from './pages/Home';
import Shop from 'pages/Shop';
import { AnimatePresence, AnimateSharedLayout } from 'framer-motion';
import Layout from 'components/layouts/Layout';
import { ApolloProvider } from '@apollo/client';
import { client } from './client'
import ShopDetail from 'pages/ShopDetail';
import Page from 'pages/Page';
import RouteChangeEffect from 'RouteChangeEffect';


function App() {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <React.Suspense fallback={<CircularProgress />}>
          <BrowserRouter>
            <RouteChangeEffect />

            <AnimateSharedLayout>
              <Layout>
                <Route
                  render={({ location }) => (
                    <AnimatePresence exitBeforeEnter>
                      <Switch location={location} key={location.pathname}>
                        <Route exact path='/shop/:slug' component={ShopDetail} />
                        <Route exact path='/shop' component={Shop} />
                        <Route exact path='/pages/:slug' component={Page} />
                        <Route exact path='/' component={Home} />
                      </Switch>
                    </AnimatePresence>
                  )}
                />
              </Layout>
            </AnimateSharedLayout>
          </BrowserRouter>
        </React.Suspense>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;
