import React from 'react'
import { Box, Grid, Typography, makeStyles, SwipeableDrawer, useMediaQuery, Button } from '@material-ui/core'
import decorator from 'assets/images/static-page-decorator.png'
import { useTranslation } from 'react-i18next'
import Markdown from 'markdown-to-jsx';
import Page404 from './Page404'
import Sidebar from 'components/Sidebar'
import { usePresence } from 'framer-motion'
import DrawerHeader from 'components/DrawerHeader';
import MenuIcon from '@material-ui/icons/Menu'
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
    decorator: {
        maxWidth: '100%'
    },
    contentRight: {
        textAlign: "right"
    }
}))


const Page = ({ match: { params: { slug } } }) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const pages = t('pages', { returnObjects: true })
    const pagesMenu = t('pagesMenu', { returnObjects: true })
    const page = pages.find(x => x.slug === slug)
    const [isPresent, safeToRemove] = usePresence()

    const mobile = useMediaQuery(theme => theme.breakpoints.down('sm'))
    const [isMenuOpen, setIsMenuOpen] = React.useState(false)

    const handleMenuOpen = React.useCallback(() => setIsMenuOpen(true), [])

    const handleMenuClose = React.useCallback(() => setIsMenuOpen(false), [])

    React.useEffect(() => {
        !isPresent && safeToRemove()
    }, [isPresent])

    const options = React.useMemo(() => ({
        overrides: {
            h1: {
                component: Typography,
                props: {
                    variant: 'h1',
                    gutterBottom: true
                },
            },
            h2: {
                component: Typography,
                props: {
                    variant: 'h2',
                    gutterBottom: true
                },
            },
            h3: {
                component: Typography,
                props: {
                    variant: 'h3',
                    gutterBottom: true
                },
            },
            h4: {
                component: Typography,
                props: {
                    variant: 'h4',
                    gutterBottom: true
                },
            },
            h5: {
                component: Typography,
                props: {
                    variant: 'h5',
                    gutterBottom: true
                },
            },
            h6: {
                component: Typography,
                props: {
                    variant: 'h6',
                    gutterBottom: true
                },
            },
            p: {
                component: Typography,
                props: {
                    variant: 'body1',
                    gutterBottom: true
                },
            },
        },
    }), [classes])

    const drawer = mobile && <SwipeableDrawer anchor="right" open={isMenuOpen} onOpen={handleMenuOpen} onClose={handleMenuClose}>
        <Box minWidth={350} width={350} maxWidth={'100vw'} display="flex" flexDirection="column" height="100%">
            <DrawerHeader
                //title={t('filter')}
                onClose={handleMenuClose}
            />

            <Box px={2}>
                <Sidebar items={pagesMenu} />
            </Box>
        </Box>
    </SwipeableDrawer>

    if (!page) return <Page404 sidebarSlot={mobile ? <>
        <Box display="flex" justifyContent="flex-end" width="100%">
            <Button endIcon={<MenuIcon fontSize="small" />} size="small" variant="text" onClick={handleMenuOpen}>
                {t('menu')}
            </Button>
        </Box>
        {drawer}
    </> :
        <Sidebar items={pagesMenu} />}
    />

    return (
        <Box px={mobile ? 2 : 7} >
            {drawer}

            <Grid container>
                {!mobile && <Grid item md={2}>
                    <Sidebar items={pagesMenu} />
                </Grid>}
                <Grid item xs={12} md={9} spacing={2}>

                    <Box px={1}>
                        <Grid container spacing={6}>
                            {mobile && <Grid item xs={12} container justify="flex-end">
                                <Button endIcon={<MenuIcon fontSize="small" />} size="small" variant="text" onClick={handleMenuOpen}>
                                    {t('menu')}
                                </Button>
                            </Grid>}

                            {page.bodyDecorator === "left" && <Grid item md={3}>
                                <img src={decorator} alt="" className={classes.decorator} />
                            </Grid>}

                            <Grid item md={page.bodyDecorator ? 9 : 12} className={clsx({
                                [classes.contentRight]: page.justify === 'right'
                            })}>
                                <Markdown children={page.body} options={options} />
                            </Grid>

                            {page.bodyDecorator === "right" && <Grid item md={3}>
                                <img src={decorator} alt="" className={classes.decorator} />
                            </Grid>}
                        </Grid>
                    </Box>
                </Grid>
                {!mobile && <Grid item md={1}></Grid>}
            </Grid>
        </Box>
    )
}

export default Page
