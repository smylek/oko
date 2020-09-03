import React from 'react'
import { Box, Grid, Button } from '@material-ui/core'
import { gql, useQuery } from '@apollo/client'
import ShopItemsCard from './ShopItemsCard';
import { shallowEqualObjects } from 'shallow-equal';
import deepEqual from 'fast-deep-equal/react'
import set from 'lodash.set';
import { cloneDeep } from '@apollo/client/utilities';

export const LOAD_ITEMS = gql`
query GetProducts($perPage: Int = 5, $query: String, $cursor: String) {    
    products(first: $perPage, query: $query, after: $cursor) {
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      edges {
        cursor
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
  const { loading, error, data, refetch, fetchMore } = useQuery(LOAD_ITEMS);

  const handleLoadMore = React.useCallback(() => {
    console.log(data)
    fetchMore({
      variables: {
        cursor: data.products.edges[data.products.edges.length - 1].cursor
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        const result = cloneDeep(prev)

        set(result, 'products.edges', [...prev.products.edges, ...fetchMoreResult.products.edges])

        console.log({ result })
        return result
      }
    })
  }, [data, fetchMore])

  React.useEffect(() => {
    !loading && refetch({ query })
  }, [filter,])

  if (loading) return <Box minHeight="80vh">Loading...</Box>

  if (error) return <Box>Error :(</Box>

  return (
    <Box minHeight="80vh" p={1}>
      <Button onClick={handleLoadMore}>
        wczytaj wiecej
      </Button>
      <Grid container spacing={2}>
        {data.products.edges.map(({ node: item }, index) => <Grid key={item.id + index} item xs={6} sm={6} md={4} xl={3}>
          <ShopItemsCard data={item} />
        </Grid>)}
      </Grid>
    </Box>
  )
}

export default React.memo(ShopItems, deepEqual)
