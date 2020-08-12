import React from 'react'
import { Box, Grid } from '@material-ui/core'
import { usePresence } from 'framer-motion'
import ShopSidebar from './ShopSidebar'
import ShopBreadcrumbs from './ShopBreadcrumbs'
import { gql, useQuery } from '@apollo/client'
import ShopItems from './ShopItems'
import { shallowEqualObjects as shallowEqual } from "shallow-equal";

const LOAD_ITEMS = gql`
  query GetCollections {    
    
        collections(first: 20) {
          edges {
            node {
              id
              title
            }
          }
        }
      }  
      `;



const Shop = () => {
    const [isPresent, safeToRemove] = usePresence()
    const { loading, error, data } = useQuery(LOAD_ITEMS);

    React.useEffect(() => {
        !isPresent && safeToRemove()
    }, [isPresent])

    const breadcrumbs = React.useMemo(() => [
        {
            label: 'Clothing',
            to: '/shop'
        },
        {
            label: 'T-shirts',
            to: '/shop'
        },
    ], [])

    // const collections = data ? data.collections.edges.map(({ node }) => ({ ...node })) : []

    return (
        <Box px={6}>
            <Grid container>
                <Grid item md={2}>
                    <ShopSidebar />
                </Grid>
                <Grid item md={9} container direction="column">
                    <Box px={1}>
                        <ShopBreadcrumbs items={breadcrumbs} />

                        <Box mb={2} />

                        <ShopItems />
                    </Box>
                </Grid>
                <Grid item md={1}></Grid>
            </Grid>
        </Box>
    )
}

export default React.memo(Shop, shallowEqual)
