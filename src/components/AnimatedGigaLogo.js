import React from 'react'
import Logo from './Logo'
import { Box } from '@material-ui/core'
import { motion } from 'framer-motion'


const resultSize = {
    width: `${50}vw`,
    height: '97vh',
}

const style = {
    y: '8vh',
    x: '50%',
    ...resultSize
}

const animationProps = {
    initial: { scale: 5, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 5, opacity: 0 },
    transition: { duration: .9 }
}

const AnimatedGigaLogo = () => {
    return (
        <Box
            width="100vw"
            height="100vh"
            position="absolute"
            style={style}
            component={motion.div}
            {...animationProps}
        >
            <Logo color="light" size="full" />
        </Box>
    )
}

export default AnimatedGigaLogo
