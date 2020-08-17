import React from 'react'
import { Box, Grid, Typography, makeStyles, CardMedia, Button, Select, MenuItem, useTheme, TextField } from '@material-ui/core';
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
import { shopifyClient, BuyButtonContext } from 'App';
import ShopifyBuy from 'shopify-buy';

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

const VariantSelector = ({ option, handleOptionChange, error }) => {
    return (<Box display="flex" alignItems="center">
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
            value={option.value}
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



const ShopDetail = ({ match: { params: { slug } } }) => {
    const { addVariantToCart, openCheckout } = React.useContext(BuyButtonContext)

    const { t } = useTranslation()
    const theme = useTheme()
    const classes = useStyles()
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
            />
        );
    });

    return <Box px={6}>
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
                                        Buy
                                    </Button>

                                    <Box ml={1} />

                                    <Button variant="outlined" color="primary" disabled={loadingVariant} onClick={handleAddToBagClick}>
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
                                    animate={{ opacity: 1 }}
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


    // <div className="Product">
    //     {data.images.length ? <img src={variantImage.src} alt={`${data.title} product shot`} /> : null}
    //     <h5 className="Product__title">{data.title}</h5>
    //     <span className="Product__price">{computePriceLabel(get(variantData, 'priceV2'))}</span>
    //     {variantSelectors}
    //     <label className="Product__option">
    //         Quantity
    //   <input min="1" type="number" value={variantQuantity} onChange={handleQuantityChange}></input>
    //     </label>
    //     <button className="Product__buy button" onClick={() => addVariantToCart(variantData.id, variantQuantity)}>Add to Cart</button>
    // </div>
}

export default ShopDetail

/*
const _ShopDetail = ({ match: { params: { slug } } }) => {
    const [selectedSize, setSelectedSize] = React.useState()

    const handleSizeSelect = React.useCallback(e => setSelectedSize(e.target.value), [])



    const [productImageSrc, ...images] = get(data, 'images.edges.length') ?
        get(data, 'images.edges').map(({ node }) => ({ ...node })) :
        [null, []]


    const splitByTypes = (acc, current) => {
        const [size, color] = current.title.split('/')
        acc[0].push(size.trim())
        acc[1].push(color.trim())
        return acc
    }

    const compareAtPrice = computePriceLabel(get(data, 'variants.edges.0.node.compareAtPriceV2'))
    const price = computePriceLabel(get(data, 'priceRange.minVariantPrice'))

    const variants = get(data, 'variants.edges', []).map(({ node }) => ({ ...node }))
    const [sizes = [], colors = []] = loading ? [] : variants.reduce(splitByTypes, [[], []])
    const uniqSizes = [...new Set(sizes)]
    const uniqColors = [...new Set(colors)]

    const descriptionBgColor = theme.palette.primary.main
    const descriptionTextColor = theme.palette.primary.contrastText

    let variant = selectedVariant || product.variants[0]
    let variantQuantity = selectedVariantQuantity || 1
    let variantSelectors = this.props.product.options.map((option) => {

        return (
            <VariantSelector
                handleOptionChange={this.handleOptionChange}
                key={option.id.toString()}
                option={option}
            />
        );
    });


    return (

    )
}

export default React.memo(ShopDetail, deepEqual)

/*

const addVariantToCart = (variantId, quantity) => {
    this.setState({
        isCartOpen: true,
    });

    const lineItemsToAdd = [{ variantId, quantity: parseInt(quantity, 10) }]
    const checkoutId = this.state.checkout.id

    return this.props.client.checkout.addLineItems(checkoutId, lineItemsToAdd).then(res => {
        this.setState({
            checkout: res,
        });
    });
}
function loadBuyButton(node) {

    console.log({ShopifyBuy,shopifyClient})
    const ui = ShopifyBuy.UI.init(shopifyClient);

    ui.createComponent('product', {
        id: '5602202124438',
        node: document.getElementById('product-component-1597588094609'),
    })



    var scriptURL = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';
    if (window.ShopifyBuy) {
        if (window.ShopifyBuy.UI) {
            ShopifyBuyInit();
        } else {
            loadScript();
        }
    } else {
        loadScript();
    }



    function loadScript() {
        var script = document.createElement('script');
        script.async = true;
        script.src = scriptURL;
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(script);
        script.onload = ShopifyBuyInit;
    }
    function ShopifyBuyInit() {
        var client = window.ShopifyBuy.buildClient({
            domain: 'sklep-sklepik.myshopify.com',
            storefrontAccessToken: '3a1a15d5f97fbec3756f4d3de98ed549',
        });
        window.ShopifyBuy.UI.onReady(client).then(function (ui) {
            ui.createComponent('product', {
                id: '5602202124438',
                node, // document.getElementById('product-component-1597588094609'),
                moneyFormat: '%7B%7Bamount_with_comma_separator%7D%7D%20zl',
                options: {
                    product: {
                        iframe: false,
                        order: [
                            'button'
                        ]
                    }
                }
                /*
                "product": {
                    "styles": {
                        "product": {
                            "@media (min-width: 601px)": {
                                "max-width": "calc(25% - 20px)",
                                "margin-left": "20px",
                                "margin-bottom": "50px"
                            }
                        },
                        "button": {
                            "font-family": "Montserrat, sans-serif",
                            "font-size": "18px",
                            "padding-top": "17px",
                            "padding-bottom": "17px",
                            ":hover": {
                                "background-color": "#b157e6"
                            },
                            "background-color": "#c561ff",
                            ":focus": {
                                "background-color": "#b157e6"
                            },
                            "border-radius": "0px"
                        },
                        "quantityInput": {
                            "font-size": "18px",
                            "padding-top": "17px",
                            "padding-bottom": "17px"
                        }
                    },
                    "contents": {
                        "img": false,
                        "title": false,
                        "price": false
                    },
                    "text": {
                        "button": "Add to cart"
                    },
                    "googleFonts": [
                        "Montserrat"
                    ]
                },
                "productSet": {
                    "styles": {
                        "products": {
                            display: 'none',
                            "@media (min-width: 601px)": {
                                "margin-left": "-20px"
                            }
                        }
                    }
                },
                "modalProduct": {
                    "contents": {
                        "img": false,
                        "imgWithCarousel": true,
                        "button": false,
                        "buttonWithQuantity": true
                    },
                    "styles": {
                        "product": {
                            "@media (min-width: 601px)": {
                                "max-width": "100%",
                                "margin-left": "0px",
                                "margin-bottom": "0px"
                            }
                        },
                        "button": {
                            "font-family": "Montserrat, sans-serif",
                            "font-size": "18px",
                            "padding-top": "17px",
                            "padding-bottom": "17px",
                            ":hover": {
                                "background-color": "#b157e6"
                            },
                            "background-color": "#c561ff",
                            ":focus": {
                                "background-color": "#b157e6"
                            },
                            "border-radius": "0px"
                        },
                        "quantityInput": {
                            "font-size": "18px",
                            "padding-top": "17px",
                            "padding-bottom": "17px"
                        }
                    },
                    "googleFonts": [
                        "Montserrat"
                    ],
                    "text": {
                        "button": "Add to cart"
                    }
                },
                "cart": {
                    "styles": {
                        "button": {
                            "font-family": "Montserrat, sans-serif",
                            "font-size": "18px",
                            "padding-top": "17px",
                            "padding-bottom": "17px",
                            ":hover": {
                                "background-color": "#b157e6"
                            },
                            "background-color": "#c561ff",
                            ":focus": {
                                "background-color": "#b157e6"
                            },
                            "border-radius": "0px"
                        }
                    },
                    "text": {
                        "total": "Subtotal",
                        "button": "Checkout"
                    },
                    "googleFonts": [
                        "Montserrat"
                    ]
                },
                "toggle": {
                    "styles": {
                        "toggle": {
                            "font-family": "Montserrat, sans-serif",
                            "background-color": "#c561ff",
                            ":hover": {
                                "background-color": "#b157e6"
                            },
                            ":focus": {
                                "background-color": "#b157e6"
                            }
                        },
                        "count": {
                            "font-size": "18px"
                        }
                    },
                    "googleFonts": [
                        "Montserrat"
                    ]
                }
            }
            });
        });

    }

}
*/