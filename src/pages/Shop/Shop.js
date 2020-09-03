import React from 'react'
import { Box, Grid, useMediaQuery, IconButton, Button, SwipeableDrawer, Chip } from '@material-ui/core'
import { usePresence } from 'framer-motion'
import ShopSidebar from './ShopSidebar'
import { gql, useQuery } from '@apollo/client'
import ShopItems from './ShopItems'
import deepEqual from 'fast-deep-equal/react'
import FilterIcon from '@material-ui/icons/FilterList'
import DrawerHeader from 'components/DrawerHeader'
import { useTranslation } from 'react-i18next'
import { ShopContext } from 'App'
import get from 'lodash.get'
import set from 'lodash.set'

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

const ShopChips = ({ t, filter, onFilterChange }) => {
    const handleDelete = React.useCallback(key => {
        const nextFilter = { ...filter }
        const arr = key.split('.')
        const [value, ...address] = [arr.pop(), ...arr];

        const group = get(filter, address, [])
        const nextGroup = group.filter(x => x !== value)

        set(nextFilter, address, nextGroup)
        onFilterChange(nextFilter)
    }, [filter, onFilterChange])

    const createHandleDelete = value => () => handleDelete(value)

    const items = React.useMemo(() => {
        return Object.entries(filter).reduce((acc, [k, v]) => {
            if (k !== 'query' && Array.isArray(v)) {
                v.forEach(x => acc.push({
                    label: `${k === 'mandatory-colors' ? t('mandatory') : ''} ${x}`,
                    value: `${k}.${x}`
                }))
            }

            return acc
        }, [])
    }, [filter])
    console.log({ filter, items })

    return <Box display="flex" flexWrap="wrap">
        {items.map(({ label, value }) => <Box mr={1} mb={1}>
            <Chip label={t(label)} onDelete={createHandleDelete(value)} />
        </Box>)}
    </Box>
}


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
                        <ShopChips t={t} filter={filter} onFilterChange={setFilter} />
                    </Grid>

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
