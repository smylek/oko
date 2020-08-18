import React from 'react'
import Logo from './Logo'
import { Box, useMediaQuery } from '@material-ui/core'
import { motion } from 'framer-motion'

const mobileStyle = {
    y: '15vh',
    x: '-25vw',
    width: `150vw`,
    height: '97vh',
}

const style = {
    y: '8vh',
    x: '50%',
    width: `50vw`,
    height: '97vh',
}

const animationProps = {
    initial: { scale: 5, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 5, opacity: 0 },
    transition: { duration: .9 }
}

const AnimatedGigaLogo = () => {
    const mobile = useMediaQuery(theme => theme.breakpoints.down('sm'))

    return (
        <Box
            width="100vw"
            height="100vh"
            position="absolute"
            style={mobile ? mobileStyle : style}
            component={motion.div}
            {...animationProps}
        >
            <Logo color="light" size="full" />
        </Box>
    )
}

export default AnimatedGigaLogo
