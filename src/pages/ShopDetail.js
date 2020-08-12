import React from 'react'
import { Box, Grid, Typography, makeStyles, CardMedia } from '@material-ui/core';
import { usePresence, AnimatePresence, motion, AnimateSharedLayout } from 'framer-motion';
import { useQuery, gql } from '@apollo/client';
import ShopBreadcrumbs from './Shop/ShopBreadcrumbs';
import get from 'lodash.get';
import clsx from 'clsx';


const LOAD_ITEM_DETAIL = gql`
query GetProduct($slug: String!) {
    productByHandle(handle: $slug) {
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
    }
}))


const ShopDetail = ({ match: { params: { slug } } }) => {
    const classes = useStyles()
    const [isPresent, safeToRemove] = usePresence()
    const { loading, error, data: _data } = useQuery(LOAD_ITEM_DETAIL, { variables: { slug }, });
    const data = get(_data, 'productByHandle')
    const [show, setShow] = React.useState(false)

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

    if (loading) return <div>Loading...</div>

    if (error) return <div>Error :(</div>

    const images = data.images.edges

    const priceFormatter = new Intl.NumberFormat('pl-PL', {
        style: 'currency',
        currency: get(data, 'priceRange.minVariantPrice.currencyCode'),
    });
    const price = priceFormatter.format(get(data, 'priceRange.minVariantPrice.amount'))
    const compareAtPrice = priceFormatter.format(get(data, 'variants.edges.0.node.compareAtPriceV2.amount'))
    const productImageSrc = get(images, '0.node.transformedSrc', '')

    return (
        <Box px={6}>
            <Grid container>
                <Grid item md={2}>

                </Grid>
                <Grid item md={9} container direction="column">
                    <Box px={1}>
                        <ShopBreadcrumbs items={breadcrumbs} />

                        <Box mb={2} />

                        <Box display="flex">
                            <Box flexGrow={1}>
                                <Box display="flex">
                                    <Typography
                                        layoutId={`${data.handle}-product-price`}
                                        component={motion.span}
                                        variant="h3"
                                        className={clsx(classes.price, { [classes.withLowerPrice]: !!compareAtPrice })}
                                    >
                                        {price}
                                    </Typography>

                                    {compareAtPrice && <Typography
                                        layoutId={`${data.handle}-product-compare-at-price`}
                                        component={motion.span}
                                        variant="h3"
                                        color="textSecondary"
                                        className={clsx(classes.price, classes.compareAtPrice)}
                                    >
                                        {compareAtPrice}
                                    </Typography>}
                                </Box>
                                <AnimatePresence exitBeforeEnter>
                                    <Typography layoutId={`${data.handle}-product-name`} variant="h2" component={motion.h1} onClick={() => setShow(state => !state)}>
                                        {data.title}
                                    </Typography>
                                </AnimatePresence>
                            </Box>

                            <Box position="relative" width="33%">
                                <AnimatePresence exitBeforeEnter>
                                    <CardMedia
                                        layoutId={`${data.handle}-product-image`}
                                        component={motion.img}
                                        image={productImageSrc}
                                        title={data.title}
                                        key={productImageSrc}
                                        style={{ paddingBottom: '133.333333333%', width: '100%' }}
                                    //initial={{ opacity: 0 }}
                                    //animate={{ opacity: 1 }}
                                    //exit={{ opacity: 0 }}
                                    //transition={{ duration: .2 }}
                                    />
                                </AnimatePresence>
                            </Box>
                        </Box>
                    </Box>
                </Grid>
                <Grid item md={1}></Grid>
            </Grid>
        </Box>
    )
}

export default ShopDetail
