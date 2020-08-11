import React from 'react'
import { Box, Grid } from '@material-ui/core'
import { usePresence } from 'framer-motion'
import ShopSidebar from './ShopSidebar'
import ShopBreadcrumbs from './ShopBreadcrumbs'


const Shop = () => {
    const [isPresent, safeToRemove] = usePresence()

    React.useEffect(() => {
        !isPresent && safeToRemove()
    }, [isPresent])

    const items = React.useMemo(() => [
        {
            label: 'Clothing',
            to: '/shop'
        },
        {
            label: 'T-shirts',
            to: '/shop'
        },
    ], [])

    return (
        <Box px={6}>
            <Grid container>
                <Grid item md={2}>
                    <ShopSidebar />
                </Grid>
                <Grid item md={9} container>
                    <Box ml={1} />
                    <ShopBreadcrumbs items={items} />
                </Grid>
                <Grid item md={1}></Grid>
            </Grid>
        </Box>
    )
}

export default Shop
