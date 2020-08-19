import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Box, makeStyles, Typography } from '@material-ui/core'
import clsx from 'clsx'
import TransparentRouterLink from './TransparentRouterLink'
import { shallowEqualObjects } from 'shallow-equal'
import CheckIcon from '@material-ui/icons/Check'

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
    label: {
        marginRight: theme.spacing(1)
    }
}))

const SidebarItem = React.memo(({ children, level = 0, to, isSelected: isSelectedFn, onClick }) => {
    const classes = useStyles()

    const props = to ? { to, component: TransparentRouterLink } : {}
    
    const isSelected = isSelectedFn && isSelectedFn()

    return <Box display="flex" alignItems="center" pl={level * 2} py={.25} onClick={onClick}>
        <Typography
            variant={getVariant(level)}
            className={clsx(classes.label, {
                [classes.hoverable]: to || onClick,
                [classes.selected]: isSelected,
                [classes.uppercase]: level === 0
            })}
            {...props}
        >
            {children}
        </Typography>

        {isSelected && <CheckIcon fontSize="small" />}
    </Box>
}, shallowEqualObjects)


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

export default React.memo(Sidebar, shallowEqualObjects)
