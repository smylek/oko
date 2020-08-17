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
import Cart from 'components/Cart';
import Client from 'shopify-buy'
//import { getCookie, setCookie } from 'utils/cookies';
//import { defaultTo } from 'utils/functions';

export const shopifyClient = Client.buildClient({
  domain: process.env.REACT_APP_SHOP_URI,
  storefrontAccessToken: process.env.REACT_APP_SHOP_STOREFRONT_TOKEN,
});

export const BuyButtonContext = React.createContext();

function App() {
  const [isCartOpen, setIsCartOpen] = React.useState(false)
  const [checkout, setCheckout] = React.useState({ lineItems: [] })

  React.useEffect(() => {    
    shopifyClient.checkout.create().then((res) => {
      //const lineItems = getCookie(process.env.REACT_APP_CHECKOUT_COOKIE_NAME)      
      setCheckout(res) // ? {...res, lineItems} : res)
    });
  }, [])

  const openCheckout = React.useCallback(async () => {
    window.location.href = checkout.webUrl
  }, [checkout])

  const addVariantToCart = React.useCallback((variantId, quantity = 1) => {
    setIsCartOpen(true);

    const lineItemsToAdd = [{ variantId, quantity: parseInt(quantity, 10) }]
    const checkoutId = checkout.id

    return shopifyClient.checkout.addLineItems(checkoutId, lineItemsToAdd).then(res => {
      setCheckout(res);      
      //setCookie(process.env.REACT_APP_CHECKOUT_COOKIE_NAME, res.variableValues.lineItems)
    });
  }, [checkout, setCheckout])

  const updateQuantityInCart = React.useCallback((lineItemId, quantity) => {
    const checkoutId = checkout.id
    const lineItemsToUpdate = [{ id: lineItemId, quantity: parseInt(quantity, 10) }]

    return shopifyClient.checkout.updateLineItems(checkoutId, lineItemsToUpdate).then(res => {
      setCheckout(res);
      //setCookie(process.env.REACT_APP_CHECKOUT_COOKIE_NAME, res.variableValues.lineItems)
    });
  }, [checkout, setCheckout])

  const removeLineItemInCart = React.useCallback((lineItemId) => {
    const checkoutId = checkout.id

    return shopifyClient.checkout.removeLineItems(checkoutId, [lineItemId]).then(res => {
      setCheckout(res);
      //setCookie(process.env.REACT_APP_CHECKOUT_COOKIE_NAME, res.variableValues.lineItems)
    });
  }, [checkout, setCheckout])

  const handleCartOpen = React.useCallback(() => {
    setIsCartOpen(true);
  }, [])

  const handleCartClose = React.useCallback(() => {
    setIsCartOpen(false);
  }, [])

  const shopifyContext = React.useMemo(() => ({
    client: shopifyClient,
    isCartOpen,
    checkout,
    addVariantToCart,
    updateQuantityInCart,
    removeLineItemInCart,
    handleCartOpen,
    openCheckout
  }), [
    isCartOpen,
    checkout,
    addVariantToCart,
    updateQuantityInCart,
    removeLineItemInCart,
    handleCartOpen,
    openCheckout
  ])

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <React.Suspense fallback={<CircularProgress />}>
          <BrowserRouter>
            <RouteChangeEffect handleCartClose={handleCartClose} />

            <Cart
              openCheckout={openCheckout}
              isCartOpen={isCartOpen}
              checkout={checkout}
              handleCartClose={handleCartClose}
              updateQuantityInCart={updateQuantityInCart}
              removeLineItemInCart={removeLineItemInCart}
            />

            <AnimateSharedLayout>
              <BuyButtonContext.Provider value={shopifyContext}>
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
              </BuyButtonContext.Provider>
            </AnimateSharedLayout>
          </BrowserRouter>
        </React.Suspense>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;
