import React from 'react'
import { Box, CardMedia, makeStyles } from '@material-ui/core'
import { motion, AnimatePresence } from 'framer-motion'

const useStyles = makeStyles(theme => ({
    image: {
        paddingBottom: '133.333333333%',
        width: '100%'
    }
}))


const ShopDetailImages = ({ layoutIdForFirstImage, items }) => {
    const classes = useStyles()

    return (
        <Box width="100%">
            <AnimatePresence exitBeforeEnter>
                {items.map(({ transformedSrc, altText = '' }, index) => <CardMedia
                    layoutId={index === 0 ? layoutIdForFirstImage : undefined}
                    component={motion.img}
                    image={transformedSrc}
                    title={altText}
                    key={transformedSrc}
                    className={classes.image}
                />)}
            </AnimatePresence>
        </Box>)
}

export default ShopDetailImages
