import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Box, makeStyles, Typography } from '@material-ui/core'
import clsx from 'clsx'
import TransparentRouterLink from './TransparentRouterLink'


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
    hoverable: {
        cursor: 'pointer'
    },
    selected: {
        fontWeight: 900
    },
    uppercase: {
        textTransform: 'uppercase'
    },
}))

const SidebarItem = ({ children, level = 0, to, isSelected, onClick }) => {
    const classes = useStyles()

    const props = to ? { to, component: TransparentRouterLink } : {}

    console.log({ isSelected, x: isSelected && isSelected() })

    return <Box pl={level * 2} py={.25} onClick={onClick}>
        <Typography
            variant={getVariant(level)}
            className={clsx({
                [classes.hoverable]: to || onClick,
                [classes.selected]: isSelected && isSelected(),
                [classes.uppercase]: level === 0
            })}
            {...props}
        >
            {children}
        </Typography>
    </Box>
}


const Sidebar = ({ items }) => {
    return (
        <AnimatePresence>
            <Box
                component={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                {items.map(({ title, level, to, onClick, isSelected }) => <SidebarItem
                    key={title}
                    level={level}
                    to={to}
                    onClick={onClick}
                    isSelected={isSelected}
                >
                    {title}
                </SidebarItem>)}

            </Box>
        </AnimatePresence>
    )
}

export default Sidebar
