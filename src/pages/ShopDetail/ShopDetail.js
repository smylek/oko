import React from 'react'
import { Box, Grid, Typography, makeStyles, CardMedia, Button, Select, MenuItem, useTheme } from '@material-ui/core';
import { usePresence, AnimatePresence, motion } from 'framer-motion';
import { useQuery, gql } from '@apollo/client';
import Breadcrumbs from 'components/Breadcrumbs';
import get from 'lodash.get';
import clsx from 'clsx';
import { LOAD_ITEMS } from '../Shop/ShopItems';
import { useTranslation } from 'react-i18next';
import ShopDetailImages from './ShopDetailImages';

const LOAD_ITEM_DETAIL = gql`
query GetProduct($slug: String!) {
    productByHandle(handle: $slug) {
            id
            handle
            title        
            description  
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
            variants(first: 40) {
                edges {
                  node {
                    title
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
  
      `;

const useStyles = makeStyles(theme => ({
    price: {
        fontFamily: theme.typography.fontFamily
    },
    withLowerPrice: {
        color: theme.palette.error.main,
        marginRight: theme.spacing(2)
    },
    compareAtPrice: {
        textDecoration: 'line-through'
    },
    image: {
        paddingBottom: '133.333333333%',
        width: '100%'
    }
}))

const useCachedProductData = ({ client, slug }) => {
    try {
        const cachedProducts = client.readQuery({
            query: LOAD_ITEMS
        });
        const result = get(cachedProducts, 'products.edges', [])
        const x = result.find(({ node }) => slug === node.handle)
        const r = get(x, 'node', null)
        return [r]

    } catch (err) {
        return [null]
    }
}
const FALLBACK_CURRENCY = 'PLN'
const ShopDetail = ({ match: { params: { slug } } }) => {
    const { t } = useTranslation()
    const theme = useTheme()
    const classes = useStyles()
    const [isPresent, safeToRemove] = usePresence()
    const { loading, error, data: response, client } = useQuery(LOAD_ITEM_DETAIL, { variables: { slug }, });
    const responseData = get(response, 'productByHandle')
    const [cachedData] = useCachedProductData({ slug, client })

    const data = loading ? cachedData : responseData

    const [selectedSize, setSelectedSize] = React.useState()

    const handleSizeSelect = React.useCallback(e => setSelectedSize(e.target.value), [])

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

    if (loading && !data) return <div>Loading...</div>

    if (error) return <div>Error :(</div>

    const [productImageSrc, ...images] = get(data, 'images.edges.length') ?
        get(data, 'images.edges').map(({ node }) => ({ ...node })) :
        [null, []]

    const priceFormatter = new Intl.NumberFormat('pl-PL', {
        style: 'currency',
        currency: get(data, 'priceRange.minVariantPrice.currencyCode', FALLBACK_CURRENCY),
    });
    const price = priceFormatter.format(get(data, 'priceRange.minVariantPrice.amount'))
    const compareAtPrice = priceFormatter.format(get(data, 'variants.edges.0.node.compareAtPriceV2.amount'))

    const splitByTypes = (acc, current) => {
        const [size, color] = current.title.split('/')
        acc[0].push(size.trim())
        acc[1].push(color.trim())
        return acc
    }

    const variants = get(data, 'variants.edges', []).map(({ node }) => ({ ...node }))
    const [sizes = [], colors = []] = loading ? [] : variants.reduce(splitByTypes, [[], []])
    const uniqSizes = [...new Set(sizes)]
    const uniqColors = [...new Set(colors)]

    const descriptionBgColor = theme.palette.primary.main
    const descriptionTextColor = theme.palette.primary.contrastText

    return (
        <Box px={6}>
            <Grid container>
                <Grid item md={2}>

                </Grid>
                <Grid item md={9} container direction="column">
                    <Box px={1}>
                        <Breadcrumbs items={breadcrumbs} />

                        <Box mb={2} />

                        <Box display="flex">
                            <Box flexGrow={1}>
                                <Box display="flex">
                                    <AnimatePresence exitBeforeEnter>
                                        <Typography
                                            layoutId={`${data.handle}-product-price`}
                                            component={motion.span}
                                            variant="h3"
                                            className={clsx(classes.price, { [classes.withLowerPrice]: !!compareAtPrice })}
                                        >
                                            {price}
                                        </Typography>
                                    </AnimatePresence>

                                    <AnimatePresence exitBeforeEnter>
                                        {compareAtPrice && <Typography
                                            layoutId={`${data.handle}-product-compare-at-price`}
                                            component={motion.span}
                                            variant="h3"
                                            color="textSecondary"
                                            className={clsx(classes.price, classes.compareAtPrice)}
                                        >
                                            {compareAtPrice}
                                        </Typography>}
                                    </AnimatePresence>
                                </Box>

                                <AnimatePresence exitBeforeEnter>
                                    <Typography layoutId={`${data.handle}-product-name`} variant="h2" component={motion.h1}>
                                        {data.title}
                                    </Typography>
                                </AnimatePresence>

                                {(!loading && data) && <Box
                                    display="flex"
                                    flexDirection="column"
                                    component={motion.div}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <Box my={2}>
                                        <Box display="flex" alignItems="center">
                                            <Typography variant="body1" id="size-label-id" component="label">
                                                SIZE
                                            </Typography>

                                            <Box ml={1} />

                                            <Select
                                                labelId="size-label-id"
                                                id="size-input-id"
                                                value={selectedSize}
                                                onChange={handleSizeSelect}
                                            >
                                                {uniqSizes.map(x => <MenuItem key={x} value={x}>{t(x)}</MenuItem>)}
                                            </Select>
                                        </Box>
                                    </Box>

                                    <Box display="flex">
                                        <Button color="primary">
                                            Buy
                                        </Button>

                                        <Box ml={1} />

                                        <Button variant="outlined" color="primary">
                                            Add to bag
                                        </Button>
                                    </Box>
                                </Box>}
                            </Box>

                            <Box position="relative" width="33%">
                                <AnimatePresence exitBeforeEnter>
                                    <CardMedia
                                        layoutId={`${data.handle}-product-image`}
                                        component={motion.img}
                                        image={productImageSrc.transformedSrc}
                                        title={data.title}
                                        key={productImageSrc.transformedSrc}
                                        className={classes.image}
                                    />
                                </AnimatePresence>
                            </Box>
                        </Box>

                        <Box display="flex" position="relative">
                            <Box
                                zIndex={3}
                                position="relative"
                                width="33%"
                                flexShrink={0}
                                top={`-${theme.spacing(8)}px`}
                            >
                                <ShopDetailImages
                                    layoutIdForFirstImage={`${data.handle}-model-image`}
                                    items={images}
                                />
                            </Box>

                            <Box
                                component={motion.div}
                                ml={'-22%'}
                                pl={`calc(22% + ${theme.spacing(6)}px)`}
                                pt={6}
                                pr={6}
                                bgcolor={descriptionBgColor}
                                color={descriptionTextColor}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <Typography variant="h2" gutterBottom fontStyle="italic">
                                    {data.title}
                                </Typography>

                                <Typography variant="body1" gutterBottom>
                                    <Box component="span" fontStyle="italic">
                                        {data.description}
                                    </Box>
                                </Typography>

                                <Typography variant="body1" gutterBottom>
                                    <Box component="span" fontWeight="light" mr={1}>Composition:</Box>
                                    <Box component="span" fontWeight="bold">Cotton 100%</Box>
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Grid>
                <Grid item md={1}>

                </Grid>
            </Grid>
        </Box >
    )
}

export default ShopDetail
