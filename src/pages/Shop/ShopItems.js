import React from 'react'
import { Box, Grid } from '@material-ui/core'
import { gql, useQuery } from '@apollo/client'
import ShopItemsCard from './ShopItemsCard';
import { shallowEqualObjects } from 'shallow-equal';
import deepEqual from 'fast-deep-equal/react'

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
  let result = []


  for (const namespace in filter) {
    if (namespace === 'query') {
      filter.query && result.push(`title:${filter.query}*`)
    } else if (namespace === 'categories') {
      result.push(`(${filter[namespace].map(x => `product_type:${x}`).join(' OR ')})`)
    } else {
      result.push(`(${filter[namespace].map(x => `tag:${x}`).join(' OR ')})`)
    }
  }

  return result.join(' AND ')
}

const ShopItems = ({ filter }) => {
  const query = computeQuery(filter)
  const { loading, error, data, refetch } = useQuery(LOAD_ITEMS);

  React.useEffect(() => {
    !loading && refetch({ query })
  }, [filter,])

  if (loading) return <Box minHeight="80vh">Loading...</Box>

  if (error) return <Box>Error :(</Box>

  return (
    <Box minHeight="80vh" p={1}>
      <Grid container spacing={2}>
        {data.products.edges.map(({ node: item }) => <Grid key={item.id} item xs={6} sm={6} md={4} xl={3}>
          <ShopItemsCard data={item} />
        </Grid>)}
      </Grid>
    </Box>
  )
}

export default React.memo(ShopItems, deepEqual)
