import React from 'react'
import { Box, Grid, useMediaQuery, IconButton, Button, SwipeableDrawer } from '@material-ui/core'
import { usePresence } from 'framer-motion'
import ShopSidebar from './ShopSidebar'
import { gql, useQuery } from '@apollo/client'
import ShopItems from './ShopItems'
import deepEqual from 'fast-deep-equal/react'
import FilterIcon from '@material-ui/icons/FilterList'
import DrawerHeader from 'components/DrawerHeader'
import { useTranslation } from 'react-i18next'
import { ShopContext } from 'App'

const LOAD_COLLECTIONS = gql`
  query GetCollections {        
    productTypes(first:20) {
        edges {
            node
        }
    }
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
    const { t } = useTranslation()
    const [isPresent, safeToRemove] = usePresence()
    // const { loading, error, data } = useQuery(LOAD_COLLECTIONS);
    const { filter, setFilter } = React.useContext(ShopContext)    
    const mobile = useMediaQuery(theme => theme.breakpoints.down('sm'))
    const [isFilterOpen, setIsFilterOpen] = React.useState(false)


    React.useEffect(() => {
        !isPresent && safeToRemove()
    }, [isPresent])

    const handleFilterOpen = React.useCallback(() => {
        setIsFilterOpen(true)
    }, [])


    const handleFilterClose = React.useCallback(() => {
        setIsFilterOpen(false)
    }, [])

    // const collections = data ? data.collections.edges.map(({ node }) => ({ ...node })) : []

    return (
        <Box px={mobile ? 2 : 7} flexWrap="nowrap">
            <Grid container>
                {!mobile && <Grid item xs={12} md={2}>
                    <ShopSidebar filter={filter} onFilterChange={setFilter} />
                </Grid>}

                <Grid item xs={12} md={9} container>
                    {mobile && <Grid item xs={12} container justify="flex-end">
                        <Button endIcon={<FilterIcon fontSize="small" />} size="small" variant="text" onClick={handleFilterOpen}>
                            {t('filter')}
                        </Button>
                    </Grid>}

                    <Grid item xs={12}>
                        <ShopItems filter={filter} />
                    </Grid>
                </Grid>

                {!mobile && <Grid item md={1} />}
            </Grid>

            {mobile && <SwipeableDrawer anchor="right" open={isFilterOpen} onClose={handleFilterClose}>
                <Box minWidth={350} width={350} maxWidth={'100vw'} display="flex" flexDirection="column" height="100%">
                    <DrawerHeader
                        title={t('filter')}
                        onClose={handleFilterClose}
                    />

                    <Box px={2}>
                        <ShopSidebar filter={filter} onFilterChange={setFilter} />
                    </Box>
                </Box>
            </SwipeableDrawer>}
        </Box>
    )
}

export default React.memo(Shop, deepEqual)
