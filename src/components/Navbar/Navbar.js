import React from 'react'
import Logo from 'components/Logo'
import { Box, Typography, makeStyles, Grid } from '@material-ui/core'
import TransparentRouterLink from 'components/TransparentRouterLink'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import NavbarSearch from './NavbarSearch'
import { motion } from 'framer-motion'
import { HOMEPAGE_ANIMATION_TIME } from 'constans'

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
    console.log(t)
    return (
        <Box
            display="flex"
            alignItems="center"
            px={6}
            py={2}
            className={clsx({
                [classes.rootDarkBg]: darkBg
            })}
            component={motion.nav}
            variants={variants}
            animate={darkBg ? "dark" : "light"}
            transition={duration}
        >
            <Grid container alignItems="center" spacing={6}>
                <Grid item md={2}>
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
                    <Typography
                        color="inherit"
                        variant="h3"
                        component={motion.p}
                    >
                        {t('bag')} 0
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    )
}

export default Navbar
