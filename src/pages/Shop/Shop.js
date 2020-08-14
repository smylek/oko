import React from 'react'
import { Box, Grid } from '@material-ui/core'
import { usePresence, motion } from 'framer-motion'
import ShopSidebar from './ShopSidebar'
import Breadcrumbs from 'components/Breadcrumbs'
import { gql, useQuery } from '@apollo/client'
import ShopItems from './ShopItems'
import { shallowEqualObjects as shallowEqual } from "shallow-equal";
import deepEqual from 'fast-deep-equal/react'

const LOAD_COLLECTIONS = gql`
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
    const { loading, error, data } = useQuery(LOAD_COLLECTIONS);
    const [filter, setFilter] = React.useState({ colors: [], productType: '' })

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
        <Box px={7} flexWrap="nowrap">
            <Grid container>
                <Grid item md={2}>
                    <ShopSidebar filter={filter} onFilterChange={setFilter} />
                </Grid>
                <Grid item md={9} container spacing={2}>
                    <Grid item xs={12}>
                        <Breadcrumbs items={breadcrumbs} />
                    </Grid>

                    <Grid item xs={12}>
                        <ShopItems filter={filter} />
                    </Grid>
                </Grid>
                <Grid item md={1}></Grid>
            </Grid>
        </Box>
    )
}

export default React.memo(Shop, deepEqual)
