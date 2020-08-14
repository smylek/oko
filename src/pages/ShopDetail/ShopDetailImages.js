import React from 'react'
import { Box, CardMedia, makeStyles, Grid, useTheme } from '@material-ui/core'
import { motion, AnimatePresence } from 'framer-motion'
import get from 'lodash.get'

const useStyles = makeStyles(theme => ({
    image: {
        paddingBottom: '133.333333333%',
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0
    },
    smallImage: {
        paddingBottom: '100%',
        width: '100%',
        cursor: 'pointer'
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

const ShopDetailImages = ({ layoutIdForFirstImage, items }) => {
    const classes = useStyles()
    const theme = useTheme()
    const [currentIndex, setCurrentIndex] = React.useState(0)

    const current = get(items, `${currentIndex}`, {})
    const { transformedSrc, altText = '' } = current

    const handleThumbnailClick = React.useCallback(nextIndex => setCurrentIndex(nextIndex), [])

    return (
        <Box width="100%" position="relative">
            <Box className={classes.imageSpaceHolder} />

            <AnimatePresence>
                <CardMedia
                    layoutId={layoutIdForFirstImage}
                    component={motion.img}
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
                    {items.map(({ transformedSrc, altText = '' }, index) => <Grid item xs={12}>
                        <CardMedia
                            component={motion.img}
                            image={transformedSrc}
                            title={altText}
                            key={transformedSrc}
                            className={classes.smallImage}
                            style={{ opacity: .6 }}
                            whileHover={{ opacity: 1 }}
                            onClick={() => handleThumbnailClick(index)}
                        />
                    </Grid>)}
                </Grid>

            </Box>
        </Box>)
}

export default ShopDetailImages
