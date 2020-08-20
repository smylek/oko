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
import { setCookie, getCookie } from 'utils/cookies';
import { defaultTo } from 'utils/functions';
import { shallowEqualObjects } from 'shallow-equal';

export const shopifyClient = Client.buildClient({
  domain: process.env.REACT_APP_SHOP_URI,
  storefrontAccessToken: process.env.REACT_APP_SHOP_STOREFRONT_TOKEN,
});

export const ShopContext = React.createContext();
export const MenuContext = React.createContext();

function App() {
  const [isCartOpen, setIsCartOpen] = React.useState(false)
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const [checkout, setCheckout] = React.useState({
    lineItems: []
  })
  const [filter, setFilter] = React.useState({ query: '' })

  const handleMenuOpen = React.useCallback(() => setIsMenuOpen(true), [setIsMenuOpen])

  const handleMenuClose = React.useCallback(() => setIsMenuOpen(false), [setIsMenuOpen])

  React.useEffect(() => {
    const checkoutFromCookies = getCookie(process.env.REACT_APP_CHECKOUT_COOKIE_NAME)

    if (checkoutFromCookies) {
      setCheckout(checkoutFromCookies)
    }
    else {
      shopifyClient.checkout.create().then(res => setCheckout(res))
    }
  }, [])

  React.useEffect(() => {
    setCookie(process.env.REACT_APP_CHECKOUT_COOKIE_NAME, checkout)
  }, [checkout])

  const openCheckout = React.useCallback(() => {
    window.location.href = checkout.webUrl
  }, [checkout])

  const addVariantToCart = React.useCallback((variantId, quantity = 1) => {
    setIsCartOpen(true);

    const lineItemsToAdd = [{ variantId, quantity: parseInt(quantity, 10) }]
    return shopifyClient.checkout.addLineItems(checkout.id, lineItemsToAdd).then(res => setCheckout(res))
  }, [checkout, setCheckout])

  const updateQuantityInCart = React.useCallback((lineItemId, quantity) => {
    const lineItemsToUpdate = [{ id: lineItemId, quantity: parseInt(quantity, 10) }]
    return shopifyClient.checkout.updateLineItems(checkout.id, lineItemsToUpdate).then(res => setCheckout(res))
  }, [checkout, setCheckout])

  const removeLineItemInCart = React.useCallback((lineItemId) => {
    return shopifyClient.checkout.removeLineItems(checkout.id, [lineItemId]).then(res => setCheckout(res))
  }, [checkout, setCheckout])

  const handleCartOpen = React.useCallback(() => {
    setIsCartOpen(true);
  }, [])

  const handleCartClose = React.useCallback(() => {
    setIsCartOpen(false);
  }, [])

  const shopifyContextValue = React.useMemo(() => ({
    client: shopifyClient,
    isCartOpen,
    checkout,
    addVariantToCart,
    updateQuantityInCart,
    removeLineItemInCart,
    handleCartOpen,
    openCheckout,
    filter,
    setFilter
  }), [
    isCartOpen,
    checkout,
    addVariantToCart,
    updateQuantityInCart,
    removeLineItemInCart,
    handleCartOpen,
    openCheckout,
    filter,
    setFilter
  ])

  const menuContextValue = React.useMemo(() => ({
    isMenuOpen,
    handleMenuOpen,
    handleMenuClose
  }), [
    isMenuOpen,
    handleMenuOpen,
    handleMenuClose
  ])

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <React.Suspense fallback={<CircularProgress />}>
          <BrowserRouter>
            <RouteChangeEffect handleCartClose={handleCartClose} handleMenuClose={handleMenuClose} />

            <Cart
              openCheckout={openCheckout}
              isCartOpen={isCartOpen}
              checkout={checkout}
              handleCartClose={handleCartClose}
              updateQuantityInCart={updateQuantityInCart}
              removeLineItemInCart={removeLineItemInCart}
            />

            <MenuContext.Provider value={menuContextValue}>
              <ShopContext.Provider value={shopifyContextValue}>
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
              </ShopContext.Provider>
            </MenuContext.Provider>
          </BrowserRouter>
        </React.Suspense>
      </ThemeProvider>
    </ApolloProvider>
  );
}

App.whyDidYouRender = true

export default React.memo(App, (a, b) => {
  console.log({ a, b })
  return shallowEqualObjects(a, b)
});
