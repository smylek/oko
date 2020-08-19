import React from 'react'
import { Box, Grid, Typography, makeStyles } from '@material-ui/core'
import ShopSidebar from './Shop/ShopSidebar'
import decorator from 'assets/images/static-page-decorator.png'
import { useTranslation } from 'react-i18next'
import Markdown from 'markdown-to-jsx';
import Page404 from './Page404'
import Sidebar from 'components/Sidebar'
import { usePresence } from 'framer-motion'
import Tilt from 'react-tilt'

const tiltStyle = { width: '100%' }

const tiltOptions = {
    max: 2,
    scale: 1
}

const options = {
    overrides: {
        h1: {
            component: Typography,
            props: {
                variant: 'h1'
            },
        },
        h2: {
            component: Typography,
            props: {
                variant: 'h2'
            },
        },
        h3: {
            component: Typography,
            props: {
                variant: 'h3'
            },
        },
        h4: {
            component: Typography,
            props: {
                variant: 'h4'
            },
        },
        h5: {
            component: Typography,
            props: {
                variant: 'h5'
            },
        },
        h6: {
            component: Typography,
            props: {
                variant: 'h6'
            },
        },
        p: {
            component: Typography,
            props: {
                variant: 'body1'
            },
        },
    },
}

const useStyles = makeStyles({
    decorator: {
        maxWidth: '100%'
    }
})

const Page = ({ match: { params: { slug } } }) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const pages = t('pages', { returnObjects: true })
    const pagesMenu = t('pagesMenu', { returnObjects: true })
    const page = pages.find(x => x.slug === slug)
    const [isPresent, safeToRemove] = usePresence()

    React.useEffect(() => {
        !isPresent && safeToRemove()
    }, [isPresent])

    if (!page) return <Page404 sidebarSlot={<Sidebar items={pagesMenu} />} />

    return (
        <Box px={6}>
            <Grid container>
                <Grid item md={2}>
                    <Sidebar items={pagesMenu} />
                </Grid>
                <Grid item md={9} spacing={2}>
                    <Box px={1}>
                        <Grid container spacing={2}>
                            {page.bodyDecorator === "left" && <Grid item md={3}>
                                <img src={decorator} alt="" className={classes.decorator} />
                            </Grid>}

                            <Grid item md={page.bodyDecorator ? 9 : 12}>
                                <Tilt options={tiltOptions} style={tiltStyle}>
                                    <Markdown children={page.body} option={options} />
                                </Tilt>
                            </Grid>

                            {page.bodyDecorator === "right" && <Grid item md={3}>
                                <img src={decorator} alt="" className={classes.decorator} />
                            </Grid>}
                        </Grid>
                    </Box>
                </Grid>
                <Grid item md={1}></Grid>
            </Grid>
        </Box>
    )
}

export default Page
