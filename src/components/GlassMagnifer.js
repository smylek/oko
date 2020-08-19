import React from 'react'
import Magnifier from "react-magnifier";

/*
<CardMedia
    layoutId={`${data.handle}-product-image`}
    component={motion.div}
    image={productImageSrc.transformedSrc}
    title={data.title}
    key={productImageSrc.transformedSrc}
    className={classes.image}
    animate={{ opacity: 1 }}
/>
*/
const GlassMagnifer = ({ src }) => {
    return (
        <Magnifier src={src} />
    )
}

export default GlassMagnifer
