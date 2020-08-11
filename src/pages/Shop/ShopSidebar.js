import React from 'react'
import { Box, Grid, Typography, makeStyles } from '@material-ui/core'
import { usePresence, motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'

const getVariant = level => {
    switch (level) {
        case 0:
            return 'subtitle2'
        case 1:
            return 'body1'
        default:
            return 'body1'
    }
}

const useStyles = makeStyles(theme => ({
    uppercase: {
        textTransform: 'uppercase'
    },
}))

const ShopSidebarItem = ({ children, level = 0 }) => {
    const classes = useStyles()

    return <Box pl={level * 2} py={.25}>
        <Typography
            variant={getVariant(level)}
            className={clsx({
                [classes.uppercase]: level === 0
            })}
        >
            {children}
        </Typography>
    </Box>
}


const ShopSidebar = () => {
    const [t] = useTranslation()

    const colors = React.useMemo(() => [
        {
            label: t('white'),
            value: 'WHITE'
        },
        {
            label: t('blue'),
            value: 'BLUE'
        },
        {
            label: t('black'),
            value: 'BLACK'
        },
        {
            label: t('red'),
            value: 'RED'
        },
        {
            label: t('green'),
            value: 'GREEN'
        },
        {
            label: t('multicolor'),
            value: 'MULTICOLOR'
        },
        {
            label: t('colorless'),
            value: 'COLORLESS'
        },
    ], [])

    return (
        <AnimatePresence>
            <Box
                component={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <ShopSidebarItem>Category</ShopSidebarItem>
                <ShopSidebarItem level={1}>Clothing</ShopSidebarItem>
                <ShopSidebarItem level={2}>T-shirts</ShopSidebarItem>

                <Box mt={1} />

                <ShopSidebarItem>Color</ShopSidebarItem>
                {colors.map(({ label, value }) => <ShopSidebarItem key={value} level={2}>{label}</ShopSidebarItem>)}

            </Box>
        </AnimatePresence>

    )
}

export default ShopSidebar
