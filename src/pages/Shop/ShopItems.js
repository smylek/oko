import React from 'react'
import { Box, Grid } from '@material-ui/core'
import { gql, useQuery } from '@apollo/client'
import ShopItemsCard from './ShopItemsCard';

const LOAD_ITEMS = gql`
query GetProducts {    
    products(first: 20) {
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
          images(first: 10) {
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



const ShopItems = () => {
  const { loading, error, data } = useQuery(LOAD_ITEMS);

  if (loading) return <div>Loading...</div>

  if (error) return <div>Error :(</div>

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

export default ShopItems
