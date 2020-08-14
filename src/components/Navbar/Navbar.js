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

const useStyles = makeStyles(theme => ({
    rootDarkBg: {
        color: theme.palette.common.white
    },
    linkActive: {
        textDecoration: 'underline'
    }
}))

const variants = {
    dark: { color: '#fff' },
    light: { color: '#000' },
}

const duration = { duration: HOMEPAGE_ANIMATION_TIME }

const Navbar = ({ darkBg }) => {
    const classes = useStyles()
    const { t } = useTranslation();

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
                <Grid item md={2} component={TransparentRouterLink} to="/">
                    <Logo color={darkBg ? "light" : "dark"} />
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
                        <Box component={motion.div} style={{ position: 'fixed', transform: 'translateY(-50%)' }}>
                            <Typography
                                color="inherit"
                                variant="h3"
                                component={motion.p}
                            >
                                {t('bag')} 0
                        </Typography>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    )
}

export default React.memo(Navbar, shallowEqualObjects)
