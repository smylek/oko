import React from 'react'
import Logo from 'components/Logo'
import { Box, Typography, makeStyles, Grid, ThemeProvider, useMediaQuery, IconButton } from '@material-ui/core'
import TransparentRouterLink from 'components/TransparentRouterLink'
import { useTranslation } from 'react-i18next'
import NavbarSearch from './NavbarSearch'
import { motion } from 'framer-motion'
import { HOMEPAGE_ANIMATION_TIME } from 'constans'
import { shallowEqualObjects } from 'shallow-equal'
import LanguageSelect from 'components/LanguageSelect'
import { ShopContext, MenuContext } from 'App'
import get from 'lodash.get'
import { createTheme, theme } from 'theme'
import MenuIcon from '@material-ui/icons/Menu'
import { SwipeableDrawer } from '@material-ui/core';

const darkTheme = createTheme({ dark: true })

const useStyles = makeStyles(theme => ({
    linkActive: {
        textDecoration: 'underline'
    },
    bagButtonWrapper: {
        [theme.breakpoints.up('sm')]: {
            position: 'fixed',
            transform: 'translateY(-50%)'
        },
        whiteSpace: 'nowrap'

    },
    bagButton: { cursor: 'pointer' },
    menuButton: {
        color: props => props.darkBg ? theme.palette.common.white : theme.palette.text.primary
    }
}))

const variants = {
    dark: { color: '#fff' },
    light: { color: '#000' },
}

const duration = { duration: HOMEPAGE_ANIMATION_TIME }


const Navbar = ({ darkBg }) => {
    const classes = useStyles({ darkBg })
    const { t } = useTranslation();
    const { checkout, handleCartOpen } = React.useContext(ShopContext)
    const mobile = useMediaQuery(theme => theme.breakpoints.down('sm'))
    const { handleMenuClose, handleMenuOpen, isMenuOpen } = React.useContext(MenuContext)

    const summedQuantity = ((checkout?.lineItems) || []).reduce((acc, current) => acc + current.quantity, 0)

    return (
        <Box
            display="flex"
            alignItems="center"
            px={mobile ? 2 : 6}
            pb={mobile ? 2 : 6}
            pt={mobile ? 2 : 4}
            component={motion.nav}
            variants={variants}
            animate={darkBg ? "dark" : "light"}
            transition={duration}
        >
            <ThemeProvider theme={darkBg ? darkTheme : theme}>
                <Grid container alignItems="center" spacing={mobile ? 2 : 6} wrap="nowrap">
                    <Grid item xs={3} sm={2} container alignItems="center" justify="space-between" wrap="nowrap">
                        {mobile && <IconButton edge="start" className={classes.menuButton} onClick={handleMenuOpen}>
                            <MenuIcon />
                        </IconButton>}

                        <Box
                            component={TransparentRouterLink}
                            to="/"
                            display="inline-flex"
                            mr={mobile ? undefined : 1}
                            width={mobile ? 52 : undefined}
                            height={mobile ? 52 : undefined}>
                            <Logo color={darkBg ? "light" : "dark"} size={mobile ? 'small' : 'medium'} />
                        </Box>

                        {!mobile && <LanguageSelect />}
                    </Grid>

                    <Grid item container alignItems="center" spacing={4} xs={7} md={9}>
                        {!mobile && <>
                            <Grid item>
                                <Typography color="inherit" variant="h3" component={TransparentRouterLink} to="/">{t('home')}</Typography>
                            </Grid>

                            <Grid item>
                                <Typography color="inherit" variant="h3" component={TransparentRouterLink} useNavLink to="/shop" activeClassName={classes.linkActive}>
                                    {t('shop')}
                                </Typography>
                            </Grid>
                        </>}

                        <Grid item style={{ marginLeft: 'auto' }}>
                            <NavbarSearch {...({ t, darkBg })} />
                        </Grid>
                    </Grid>

                    <Grid item xs={2} md={1}>
                        <Box position="relative">
                            <Box component={motion.div} className={classes.bagButtonWrapper} onClick={handleCartOpen}>
                                <Typography
                                    color="inherit"
                                    variant="h3"
                                    component={motion.p}
                                    className={classes.bagButton}
                                >
                                    {t('bag')} {summedQuantity}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>

                {mobile && <SwipeableDrawer anchor="left" open={isMenuOpen} onClose={handleMenuClose} component={motion.div} animate>
                    <Box width={300} maxWidth="100%" p={4}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Box component={TransparentRouterLink} to="/">
                                    <Logo color={darkBg ? "light" : "dark"} size={mobile ? 'small' : 'medium'} />
                                </Box>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography color="inherit" variant="h3" component={TransparentRouterLink} useNavLink to="/" exact activeClassName={classes.linkActive}>
                                    {t('home')}
                                </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography color="inherit" variant="h3" component={TransparentRouterLink} useNavLink to="/shop" activeClassName={classes.linkActive}>
                                    {t('shop')}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </SwipeableDrawer>}
            </ThemeProvider>
        </Box>
    )
}

export default React.memo(Navbar, shallowEqualObjects)
