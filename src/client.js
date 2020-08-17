
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({ uri: `https://${ process.env.REACT_APP_SHOP_URI}/api/graphql` })

const middlewareLink = setContext(() => ({
  headers: {
    'X-Shopify-Storefront-Access-Token': process.env.REACT_APP_SHOP_STOREFRONT_TOKEN
  }
}))

export const client = new ApolloClient({
  link: middlewareLink.concat(httpLink),
  cache: new InMemoryCache()
});
