import React from 'react'
import Logo from 'components/Logo'
import { Box, Typography, makeStyles, Grid } from '@material-ui/core'
import TransparentRouterLink from 'components/TransparentRouterLink'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import NavbarSearch from './NavbarSearch'
import { motion } from 'framer-motion'
import { HOMEPAGE_ANIMATION_TIME } from 'constans'
import { shallowEqualObjects } from 'shallow-equal'
import LanguageSelect from 'components/LanguageSelect'
import { BuyButtonContext } from 'App'
import get from 'lodash.get'

const useStyles = makeStyles(theme => ({
    rootDarkBg: {
        color: theme.palette.common.white
    },
    linkActive: {
        textDecoration: 'underline'
    },
    bagButtonWrapper: { position: 'fixed', transform: 'translateY(-50%)' },
    bagButton: {cursor: 'pointer'}
}))

const variants = {
    dark: { color: '#fff' },
    light: { color: '#000' },
}

const duration = { duration: HOMEPAGE_ANIMATION_TIME }

const Navbar = ({ darkBg }) => {
    const classes = useStyles()
    const { t } = useTranslation();
    const { checkout, handleCartOpen } = React.useContext(BuyButtonContext)

    return (
        <Box
            display="flex"
            alignItems="center"
            px={6}
            pb={6}
            pt={4}
            className={clsx({
                [classes.rootDarkBg]: darkBg
            })}
            component={motion.nav}
            variants={variants}
            animate={darkBg ? "dark" : "light"}
            transition={duration}
        >
            <Grid container alignItems="center" spacing={6}>
                <Grid item md={2} container alignItems="center" justify="space-between">
                    <Box component={TransparentRouterLink} to="/" display="inline-flex" mr={1}>
                        <Logo color={darkBg ? "light" : "dark"} />
                    </Box>
                    <LanguageSelect />
                </Grid>

                <Grid item container alignItems="center" spacing={4} md={9}>
                    <Grid item>
                        <Typography color="inherit" variant="h3" component={TransparentRouterLink} to="/">{t('home')}</Typography>
                    </Grid>

                    <Grid item>
                        <Typography color="inherit" variant="h3" component={TransparentRouterLink} useNavLink to="/shop" activeClassName={classes.linkActive}>
                            {t('shop')}
                        </Typography>
                    </Grid>

                    <Grid item style={{ marginLeft: 'auto' }}>
                        <NavbarSearch {...({ t, darkBg })} />
                    </Grid>
                </Grid>

                <Grid item md={1}>
                    <Box position="relative">
                        <Box component={motion.div} className={classes.bagButtonWrapper} onClick={handleCartOpen}>
                            <Typography
                                color="inherit"
                                variant="h3"
                                component={motion.p}
                                className={classes.bagButton}
                            >
                                {t('bag')} {get(checkout, 'lineItems.length', 0)}
                        </Typography>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    )
}

export default React.memo(Navbar, shallowEqualObjects)
