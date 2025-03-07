import React from 'react'
import Layout from 'components/layouts/Layout'
import { useTranslation } from 'react-i18next'
import { Box, Typography, makeStyles, useMediaQuery } from '@material-ui/core'
import Button from 'components/Button'
import AnimatedGigaLogo from 'components/AnimatedGigaLogo'
import { motion, usePresence, AnimatePresence } from 'framer-motion'
import { HOMEPAGE_ANIMATION_TIME } from 'constans'
import TransparentRouterLink from 'components/TransparentRouterLink'

const useStyles = makeStyles(theme => ({
    layout: {
        maxHeight: '100vh',
        overflowY: 'hidden'
    },
    buttonWrapper: {
        position: 'fixed',
        bottom: '38vh',
        left: '50%',
        transform: 'translateX(-50%)',
        transition: 'opacity .3s',
    }
}))

const animationProps = {
    initial: { opacity: 0, scale: 2, y: '40vh' },
    animate: { opacity: 1, scale: 1, y: '-5vh' },
    exit: { opacity: 0, scale: 2, y: '40vh' },
    transition: { duration: HOMEPAGE_ANIMATION_TIME }
}

const buttonAnimationProps = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0, scale: .1 },
}

const Home = () => {
    const { t } = useTranslation()
    const classes = useStyles()
    const [isPresent, safeToRemove] = usePresence()

    React.useEffect(() => {
        !isPresent && setTimeout(safeToRemove, HOMEPAGE_ANIMATION_TIME * 1000)
    }, [isPresent])

    return (<>
        <Box display="flex" justifyContent="center" alignItems="center">
            <Box color="white" width={250} textAlign="center" mt={6} position="relative" zIndex={3}>
                <Typography
                    variant="h4"
                    color="inherit"
                    component={motion.p}
                    {...animationProps}
                >
                    {t('heroText')}
                </Typography>

                <Box mt={12} />

                <AnimatePresence>
                    <Box
                        component={motion.div}
                        className={classes.buttonWrapper}
                        {...buttonAnimationProps}
                    >
                        <Button color="primary-inversed" component={TransparentRouterLink} to="/shop">
                            {t("start")}
                        </Button>
                    </Box>
                </AnimatePresence>
            </Box>
        </Box>

        <AnimatedGigaLogo />
    </>
    )
}

export default Home
