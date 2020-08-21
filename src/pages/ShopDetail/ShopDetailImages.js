import React from 'react'
import { Box, CardMedia, makeStyles, Grid, useTheme, useMediaQuery } from '@material-ui/core'
import { motion, AnimatePresence } from 'framer-motion'
import get from 'lodash.get'
import { Swiper, SwiperSlide, Controller } from 'swiper/react';
import 'swiper/swiper-bundle.css';


const useStyles = makeStyles(theme => ({
    image: {
        paddingBottom: '133.333333333%',
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0
    },
    mobileImage: {
        width: '100%',
        height: 'auto'
    },
    smallImage: {
        paddingBottom: '100%',
        width: '100%',
        cursor: 'pointer',
        opacity: .6
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

const opacity1 = { opacity: 1 }

const SwiperDots = ({ items, currentIndex, onSlideChange }) => (
    <Box my={2}>
        <Grid container spacing={2} justify="center">
            {items.map(({ transformedSrc, altText = '' }, index) => <Grid item key={transformedSrc + index}>
                <Box
                    width={20}
                    height={20}
                    bgcolor={currentIndex === index ? "grey.900" : "grey.400"}
                    borderRadius={'50%'}
                    whileHover={opacity1}
                    onClick={() => onSlideChange(index)}
                />
            </Grid>)}
        </Grid>
    </Box>
)

const ShopDetailImages = ({ layoutIdForFirstImage, items }) => {
    const classes = useStyles()
    const theme = useTheme()
    const mobile = useMediaQuery(theme => theme.breakpoints.down('sm'))
    const [currentIndex, setCurrentIndex] = React.useState(0)

    const current = get(items, `${currentIndex}`, {})
    const { transformedSrc, altText = '' } = current

    const handleThumbnailClick = React.useCallback(nextIndex => setCurrentIndex(nextIndex), [setCurrentIndex])
    const [swiper, setSwiper] = React.useState(null);

    const handleSwipeChange = React.useCallback(nextSwiper => setCurrentIndex(nextSwiper.activeIndex), [])

    const handleSlideChange = React.useCallback(nextIndex => {
        swiper.slideTo(nextIndex)
        setCurrentIndex(nextIndex)
    }, [swiper, setCurrentIndex])

    return (
        <Box width="100%" position="relative">
            {mobile ? <>
                <Swiper
                    onSwiper={setSwiper}
                    slidesPerView={1}
                    onSlideChange={handleSwipeChange}
                >
                    {items.map(({ transformedSrc, altText = '' }, index) => (
                        <SwiperSlide key={transformedSrc + index}>
                            <img
                                key={transformedSrc + index}
                                alt={altText}
                                src={transformedSrc}
                                className={classes.mobileImage}
                            />
                        </SwiperSlide>
                    )
                    )}
                </Swiper>

                <SwiperDots
                    items={items}
                    currentIndex={currentIndex}
                    onSlideChange={handleSlideChange}
                />
            </>
                :
                <>
                    <Box className={classes.imageSpaceHolder} />
                    <AnimatePresence>
                        <CardMedia
                            layoutId={layoutIdForFirstImage}
                            component={motion.div}
                            image={transformedSrc}
                            title={altText}
                            key={transformedSrc}
                            className={classes.image}
                            variants={imageVariants}
                            initial={"hidden"}
                            animate={"show"}
                            exit={"hidden"}
                        />
                    </AnimatePresence>

                    <Box position="absolute" right={`calc(100% + ${theme.spacing(2)}px)`} top={0} zIndex={5} width={'22%'} maxWidth={104} display="flex" flexDirection="column">
                        <Grid container spacing={2}>
                            {items.map(({ transformedSrc, altText = '' }, index) => <Grid item xs={12} key={transformedSrc + index}>
                                <CardMedia
                                    component={motion.div}
                                    image={transformedSrc}
                                    title={altText}
                                    key={transformedSrc}
                                    className={classes.smallImage}
                                    whileHover={opacity1}
                                    onClick={() => handleThumbnailClick(index)}
                                />
                            </Grid>)}
                        </Grid>
                    </Box>
                </>
            }
        </Box >)
}

export default ShopDetailImages
