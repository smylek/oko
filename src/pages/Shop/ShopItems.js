import React from 'react'
import { Box, Grid } from '@material-ui/core'
import { gql, useQuery } from '@apollo/client'
import ShopItemsCard from './ShopItemsCard';
import { shallowEqualObjects } from 'shallow-equal';
import get from 'lodash.get';

export const LOAD_ITEMS = gql`
query GetProducts($query: String) {    
    products(first: 20, query: $query) {
      edges {
        node {
          id
          handle
          title          
          priceRange {
            minVariantPrice {
              currencyCode
              amount
            }
            maxVariantPrice {
              currencyCode
              amount
            }
          }
          presentmentPriceRanges(first: 1) {
            edges {
              node{
                minVariantPrice {
                    currencyCode
                    amount
                }
                maxVariantPrice {
                    currencyCode
                    amount
                }                
              }
            }            
          }
          variants(first: 1) {
            edges {
              node {
                compareAtPriceV2 {
                  amount
                  currencyCode
                }
              }
            }
          }
          images(first: 2) {
            edges {
              node {
                id
                originalSrc
                transformedSrc
                altText
              }
            }
          }
        }
      }
    }        
  }  
`;

const computeQuery = filter => {
  const producType = get(filter, 'productType')
  const colors = get(filter, 'productType')

  return `product_type:${producType}`
}

const ShopItems = ({ filter }) => {
  const query = computeQuery(filter)
  const { loading, error, data, refetch } = useQuery(LOAD_ITEMS);

  React.useEffect(() => {
    !loading && refetch({ query })
  }, [filter,])

  if (loading) return <div style={{ minHeight: '80vh' }}>Loading...</div>

  if (error) return <div>Error :(</div>

  console.log({ query, filter })
  //  "product_type:T-shirts")
  return (
    <Box>
      <Grid container spacing={2}>
        {data.products.edges.map(({ node: item }) => <Grid key={item.id} item xs={12} sm={6} md={4} xl={3}>
          <ShopItemsCard data={item} />
        </Grid>)}
      </Grid>
    </Box>
  )
}

export default React.memo(ShopItems, shallowEqualObjects)
