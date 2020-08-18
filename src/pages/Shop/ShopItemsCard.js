import React from 'react'
import { Box, Typography, CardMedia, makeStyles } from '@material-ui/core'
import { motion, AnimatePresence } from 'framer-motion';
import get from 'lodash.get'
import clsx from 'clsx';
import TransparentRouterLink from 'components/TransparentRouterLink';
import { shallowEqualObjects } from 'shallow-equal';
import { computePriceLabel } from 'utils/price';
import Tilt from 'react-tilt'

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
    },
    image: {
        position: 'absolute',
        paddingBottom: '133.333333333%',
        width: '100%'
    },
    imageSpaceHolder: {
        paddingBottom: '133.333333333%',
        width: '100%'
    }
}))

const imageVariants = {
    show: {
        opacity: 1
    },
    hidden: {
        opacity: 0
    }
}
const tiltStyle = { width: '100%' }

const tiltOptions = {
    max: 10,
    scale: 1
}

const ShopItemsCard = ({ data }) => {
    const classes = useStyles()
    const [hover, setHover] = React.useState(false)
    const images = data.images.edges

    const productImageSrc = get(images, '0.node.transformedSrc', '')
    const modelImageSrc = get(images, '1.node.transformedSrc', productImageSrc)

    const compareAtPrice = computePriceLabel(get(data, 'variants.edges.0.node.compareAtPriceV2'))
    const price = computePriceLabel(get(data, 'priceRange.minVariantPrice'))

    const itemUrl = `/shop/${data.handle}`

    const handleMouseLeave = React.useCallback(e => setHover(false), [])

    const handleMouseEnter = React.useCallback(e => setHover(true), [])

    return (
        <Box
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
            <Tilt className="Tilt" options={tiltOptions} style={tiltStyle}>
                <Box flexGrow={1} display="flex" alignItems="center" position="relative" width="100%">

                    <AnimatePresence exitBeforeEnter>
                        <Box className={classes.imageSpaceHolder} />

                        <CardMedia
                            component={motion.img}
                            layoutId={`${data.handle}-product-image`}
                            image={productImageSrc}
                            title={data.title}
                            key={productImageSrc}
                            variants={imageVariants}
                            className={classes.image}
                            initial={"hidden"}
                            animate={!hover ? "show" : "hidden"}
                            exit={"show"}
                            transition={{ duration: .2 }}
                        />
                        <CardMedia
                            component={motion.img}
                            layoutId={`${data.handle}-model-image`}
                            image={modelImageSrc}
                            title={data.title}
                            key={modelImageSrc}
                            variants={imageVariants}
                            className={classes.image}
                            initial={"hidden"}
                            animate={hover ? "show" : "hidden"}
                            exit={"show"}
                            transition={{ duration: .2 }}
                        />
                    </AnimatePresence>
                </Box>
            </Tilt>

            <Box p={1} mb="auto" textAlign="center">
                <AnimatePresence exitBeforeEnter>
                    <Typography layoutId={`${data.handle}-product-name`} component={motion.span} variant="subtitle1" className={classes.productName}>
                        {data.title}
                    </Typography>
                </AnimatePresence>

                <Box display="flex" justifyContent="center">
                    <AnimatePresence exitBeforeEnter>
                        <Typography
                            layoutId={`${data.handle}-product-price`}
                            component={motion.span}
                            variant="body1"
                            className={clsx({
                                [classes.withLowerPrice]: compareAtPrice
                            })}
                        >
                            {price}
                        </Typography>
                    </AnimatePresence>

                    {compareAtPrice && <AnimatePresence exitBeforeEnter>
                        {compareAtPrice && <Typography layoutId={`${data.handle}-product-compare-at-price`} component={motion.span} variant="body1" className={classes.compareAtPrice}>
                            {compareAtPrice}
                        </Typography>}
                    </AnimatePresence>}
                </Box>
            </Box>
        </Box>
    )
}

export default React.memo(ShopItemsCard, shallowEqualObjects)
