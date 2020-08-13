import React from 'react'
import { Box, makeStyles } from '@material-ui/core'
import Navbar from 'components/Navbar'
import clsx from 'clsx'
import { useLocation } from 'react-router-dom'
import { HOMEPAGE_ANIMATION_TIME } from 'constans'
import { shallowEqualObjects } from 'shallow-equal'
import Footer from 'components/Footer'

const useStyles = makeStyles(theme => ({
    root: {
        overflowX: 'hidden',
        overflowY: 'hidden',
        backgroundColor: '#fff',
        transition: `background-color ${HOMEPAGE_ANIMATION_TIME}s`
    },
    fullPage: {
        overflowY: 'hidden',
    },
    darkBg: {
        backgroundColor: '#000'
    }
}))

const darkBgRoutes = ['/']
const fullPageRoutes = ['/']

const shouldUseDarkBg = path => {
    return darkBgRoutes.some(x => x === path)
}

const shouldUseFullPage = path => {
    return fullPageRoutes.some(x => x === path)
}

const Layout = ({ children, className }) => {
    const classes = useStyles()
    const location = useLocation()
    const darkBg = React.useMemo(() => shouldUseDarkBg(location.pathname), [location.pathname])
    // todo chowanie scrolla jak sie zmienia home -> shop
    const isFullPageRoute = React.useMemo(() => shouldUseFullPage(location.pathname), [location.pathname])

    return (
        <Box display="flex" flexDirection="column" minHeight="100vh" maxWidth="100%" className={clsx(classes.root, {
            [classes.darkBg]: darkBg,
            [classes.fullPage]: isFullPageRoute,
        }, className)}>
            <Navbar {...{ darkBg }} />

            <Box position="relative" display="flex" flexDirection="column" flexGrow={1}>
                {children}
            </Box>

            {!isFullPageRoute && <Footer />}
        </Box>
    )
}

export default React.memo(Layout, shallowEqualObjects)
