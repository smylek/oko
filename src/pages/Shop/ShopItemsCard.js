import React from 'react'
import { Box, Typography, CardMedia, makeStyles } from '@material-ui/core'
import { motion, AnimatePresence, AnimateSharedLayout } from 'framer-motion';
import get from 'lodash.get'
import clsx from 'clsx';
import TransparentRouterLink from 'components/TransparentRouterLink';


const useStyles = makeStyles(theme => ({
    productName: {
        fontWeight: "bold"
    },
    withLowerPrice: {
        color: theme.palette.error.main,
        marginRight: theme.spacing(2)
    },
    compareAtPrice: {
        textDecoration: 'line-through'
    }
}))

const ShopItemsCard = ({ data }) => {
    const classes = useStyles()
    const [hover, setHover] = React.useState(false)
    const images = data.images.edges

    const productImageSrc = get(images, '0.node.transformedSrc', '')
    const modelImageSrc = get(images, '1.node.transformedSrc', productImageSrc)

    const priceFormatter = new Intl.NumberFormat('pl-PL', {
        style: 'currency',
        currency: get(data, 'priceRange.minVariantPrice.currencyCode'),
    });
    const price = priceFormatter.format(get(data, 'priceRange.minVariantPrice.amount'))
    const compareAtPrice = priceFormatter.format(get(data, 'variants.edges.0.node.compareAtPriceV2.amount'))

    const itemUrl = `/shop/${data.handle}`

    const handleMouseLeave = React.useCallback(e => setHover(false), [])

    const handleMouseEnter = React.useCallback(e => setHover(true), [])

    return <Box
        component={TransparentRouterLink}
        to={itemUrl}
        height="100%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="flex-end"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
    >
        <Box flexGrow={1} display="flex" alignItems="center" position="relative" width="100%">
            <AnimatePresence exitBeforeEnter>
                <CardMedia
                    component={motion.img}
                    layoutId={`${data.handle}-product-image`}
                    image={hover ? modelImageSrc : productImageSrc}
                    title={data.title}
                    key={hover ? modelImageSrc : productImageSrc}
                    style={{ paddingBottom: '133.333333333%', width: '100%' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    //exit={{ opacity: 0 }}
                    transition={{ duration: .2 }}
                />
            </AnimatePresence>
        </Box>

        <Box p={1} textAlign="center">
            <AnimatePresence exitBeforeEnter>
                <Typography layoutId={`${data.handle}-product-name`} component={motion.span} variant="subtitle1" className={classes.productName}>
                    {data.title}
                </Typography>
            </AnimatePresence>

            <Box display="flex">
                <AnimatePresence exitBeforeEnter>
                    <Typography layoutId={`${data.handle}-product-price`} component={motion.span} variant="body1" className={clsx({ [classes.withLowerPrice]: !!compareAtPrice })}>
                        {price}
                    </Typography>
                </AnimatePresence>

                <AnimatePresence exitBeforeEnter>
                    {compareAtPrice && <Typography layoutId={`${data.handle}-product-compare-at-price`} component={motion.span} variant="body1" className={classes.compareAtPrice}>
                        {compareAtPrice}
                    </Typography>}
                </AnimatePresence>
            </Box>
        </Box>
    </Box>
}

export default ShopItemsCard
