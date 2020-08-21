import React from 'react'
import { Box, Grid, Typography, makeStyles, CardMedia, Button, Select, MenuItem, useTheme, TextField, useMediaQuery, Link } from '@material-ui/core';
import { usePresence, AnimatePresence, motion } from 'framer-motion';
import { useQuery, gql, useLazyQuery } from '@apollo/client';
import Breadcrumbs from 'components/Breadcrumbs';
import get from 'lodash.get';
import clsx from 'clsx';
import { LOAD_ITEMS } from '../Shop/ShopItems';
import { useTranslation } from 'react-i18next';
import ShopDetailImages from './ShopDetailImages';
import deepEqual from 'fast-deep-equal/react'
import { computePriceLabel } from 'utils/price'
import { shopifyClient, ShopContext } from 'App';
import ShopifyBuy from 'shopify-buy';
import { defaultTo } from 'utils/functions';
import ArrowBackIcon from '@material-ui/icons/ArrowBackIos'
import GlassMagnifer from 'components/GlassMagnifer';

const LOAD_VARIANT_BY_OPTIONS = gql`
query GetVariantByOptions($slug: String!, $selectedOptions: [SelectedOptionInput!]!) {   
  productByHandle(handle: $slug) {
    id
    variantBySelectedOptions(selectedOptions: $selectedOptions) {
      id
      priceV2 {
        amount
        currencyCode
      }
      compareAtPriceV2 {
        amount
        currencyCode
      }
    }
  }  
}
`

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
        node {
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
    options {
      name
      values
      id
    }
    variants(first: 40) {
      edges {
        node {
          id
          title
          compareAtPriceV2 {
            amount
            currencyCode
          }
        }
      }
    }
    images(first: 15) {
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
    },
    productName: {
        fontWeight: "bold"
    },
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

const VariantSelector = ({ value, option, handleOptionChange, error, mr }) => {
    return (<Box display="flex" alignItems="center" mr={mr}>
        <Typography variant="body1" id={`${option.name}-label-id`} component="label">
            {option.name}
        </Typography>

        <Box ml={1} />

        <Select
            error={error}
            labelId={`${option.name}-label-id`}
            id={`${option.name}-input-id`}
            name={option.name}
            key={option.name}
            value={value}
            onChange={handleOptionChange}
        >
            {option.values.map(val => {
                return (
                    <MenuItem key={val} value={val}>
                        {val}
                    </MenuItem>
                )
            })}
        </Select>
    </Box>
    );
}

const opacity0 = { opacity: 0 }

const opacity1 = { opacity: 1 }

const opacity1Delayed = { opacity: 1, transition: { delay: 1 } }

const animationAnimate = { opacity: [1, 0] }

const animationTransition = { times: [0, 1] }

const ShopDetail = ({ match: { params: { slug } } }) => {
    const { addVariantToCart, openCheckout } = React.useContext(ShopContext)

    const { t } = useTranslation()
    const theme = useTheme()
    const classes = useStyles()
    const mobile = useMediaQuery(theme => theme.breakpoints.down('sm'))
    const [isPresent, safeToRemove] = usePresence()

    const [selectedOptions, setSelectedOptions] = React.useState({})
    const [selectedVariantQuantity, setSelectedVariantQuantity] = React.useState(1)
    const [showError, setShowError] = React.useState(false)

    const { loading, error, data: { productByHandle } = {}, client: graphqlClient } = useQuery(LOAD_ITEM_DETAIL, { variables: { slug }, });
    const [fetchCurrentVariant, { loading: loadingVariant, data: fetchResultVariantData }] = useLazyQuery(LOAD_VARIANT_BY_OPTIONS)
    const variantData = get(fetchResultVariantData, 'productByHandle.variantBySelectedOptions')

    const [cachedData] = useCachedProductData({ slug, client: graphqlClient })
    const data = loading ? cachedData : productByHandle

    React.useEffect(() => {
        !isPresent && safeToRemove()
    }, [isPresent])

    React.useEffect(() => {
        if (checkIfAllOptionsAreFilled()) {
            if (showError) {
                setShowError(false)
            }

            fetchCurrentVariant({
                variables: {
                    slug,
                    selectedOptions: Object.entries(selectedOptions).map(([key, value]) => ({
                        name: key,
                        value
                    }))
                }
            })
        }
    }, [selectedOptions])

    const handleOptionChange = React.useCallback(async (event) => {
        const target = event.target

        setSelectedOptions(state => ({
            ...state,
            [target.name]: target.value
        }))
    }, [])

    const handleQuantityChange = React.useCallback((event) => {
        setSelectedVariantQuantity(event.target.value)
    }, [])

    const checkIfAllOptionsAreFilled = React.useCallback(() => {
        return get(data, 'options') && get(data, 'options').length && get(data, 'options').every(x => selectedOptions[x.name])
    }, [data, selectedOptions])

    const handleBuyClick = React.useCallback(() => {
        if (checkIfAllOptionsAreFilled()) {
            addVariantToCart(variantData.id, selectedVariantQuantity).then(() => {
                openCheckout()
            })
        } else {
            setShowError(true)
        }
    }, [addVariantToCart, variantData, selectedVariantQuantity])

    const handleAddToBagClick = React.useCallback(() => {
        if (checkIfAllOptionsAreFilled()) {
            addVariantToCart(variantData.id, selectedVariantQuantity)
        } else {
            setShowError(true)
        }
    }, [addVariantToCart, variantData, selectedVariantQuantity])

    if (loading && !data) return <div>Loading...</div>

    if (error) return <div>Error :(</div>

    const allImages = get(data, 'images.edges', []).map(({ node }) => ({ ...node }))
    const [productImageSrc, ...images] = allImages.length > 1 ? allImages : [null, []]

    const compareAtPrice = computePriceLabel(get(variantData, 'compareAtPriceV2', get(data, 'variants.edges.0.node.compareAtPriceV2')))
    const price = computePriceLabel(get(variantData, 'priceV2', get(data, 'priceRange.minVariantPrice')))

    const descriptionBgColor = theme.palette.primary.main
    const descriptionTextColor = theme.palette.primary.contrastText

    const variantSelectors = get(data, 'options', []).map((option) => {
        return (
            <VariantSelector
                error={showError}
                value={selectedOptions[option.name]}
                handleOptionChange={handleOptionChange}
                key={option.id.toString()}
                option={option}
                mr={mobile ? 2 : 0}
            />
        );
    });

    if (mobile) {
        return <Box px={2}>
            <Link to={'/shop'}>
                <Box display="flex" alignItems="center">
                    <ArrowBackIcon fontSize="inherit" color="inherit" />
                    {t('backToShop')}
                </Box>
            </Link>

            <Box mb={2} />

            <Grid container>
                <Grid item xs={12}>
                    <ShopDetailImages
                        layoutIdForFirstImage={`${data.handle}-product-image`}
                        items={allImages}
                    />
                </Grid>

                <Grid item xs={12} container direction="column" justify="center">
                    <AnimatePresence exitBeforeEnter>
                        <Typography layoutId={`${data.handle}-product-name`} align="center" component={motion.span} variant="subtitle1" className={classes.productName}>
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
                </Grid>

                {(!loading && data) && <Box
                    display="flex"
                    flexDirection="column"
                    component={motion.div}
                    initial={opacity0}
                    animate={opacity1}
                >
                    <Box my={2} display="flex" flexDirection="row" flexWrap="wrap">
                        {variantSelectors}

                        <Box display="flex" alignItems="center" width={140}>
                            <Typography variant="body1" id={`quanity-label-id`} component="label">
                                {t('quanity')}
                            </Typography>

                            <Box ml={1} />

                            <TextField
                                min="1"
                                type="number"
                                value={selectedVariantQuantity}
                                onChange={handleQuantityChange}
                            />
                        </Box>
                    </Box>

                    {showError && <Box mb={3}>
                        <Typography variant="body2" color="error">
                            {t('fillAllOptionsError')}
                        </Typography>
                    </Box>}

                    <Box display="flex">
                        <Button color="primary" disabled={loadingVariant} onClick={handleBuyClick} fullWidth>
                            {t('buy')}
                        </Button>

                        <Box ml={1} />

                        <Button variant="outlined" color="primary" disabled={loadingVariant} onClick={handleAddToBagClick} fullWidth>
                            {t('addToBag')}
                        </Button>
                    </Box>

                    <Box mt={3}>
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
                </Box>}
            </Grid>
        </Box >
    }

    return <Box px={6}>
        <Grid container>
            <Grid item md={2}>

            </Grid>
            <Grid item md={9} container direction="column">
                <Box px={1}>
                    <Link to={'/shop'}>
                        <Box display="flex" alignItems="center">
                            <ArrowBackIcon fontSize="inherit" color="inherit" />
                            {t('backToShop')}
                        </Box>
                    </Link>

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
                                initial={opacity0}
                                animate={opacity1}
                            >

                                <Box my={2}>
                                    {variantSelectors}

                                    <Box display="flex" alignItems="center" width={140}>
                                        <Typography variant="body1" id={`quanity-label-id`} component="label">
                                            {t('quanity')}
                                        </Typography>

                                        <Box ml={1} />

                                        <TextField
                                            min="1"
                                            type="number"
                                            value={selectedVariantQuantity}
                                            onChange={handleQuantityChange}
                                        />
                                    </Box>
                                </Box>

                                {showError && <Box mb={2}>
                                    <Typography variant="body2" color="error">
                                        {t('fillAllOptionsError')}
                                    </Typography>
                                </Box>}

                                <Box display="flex">
                                    <Button color="primary" disabled={loadingVariant} onClick={handleBuyClick} >
                                        {t('buy')}
                                    </Button>

                                    <Box ml={1} />

                                    <Button variant="outlined" color="primary" disabled={loadingVariant} onClick={handleAddToBagClick}>
                                        {t('addToBag')}
                                    </Button>
                                </Box>
                            </Box>}
                        </Box>

                        <Box position="relative" width="33%">
                            <AnimatePresence exitBeforeEnter>
                                <Box
                                    layoutId={`${data.handle}-product-image`}
                                    width="100%"
                                    component={motion.div}
                                    initial={opacity1}
                                    animate={opacity1}
                                >
                                    <GlassMagnifer
                                        src={productImageSrc.transformedSrc}
                                        image={productImageSrc.transformedSrc}
                                        className={classes.image}
                                        title={data.title}
                                    />
                                </Box>
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
                            initial={opacity0}
                            animate={opacity1}
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
    </Box>
}

export default ShopDetail