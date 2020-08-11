import React from 'react'
import { IconButton, makeStyles, Box, TextField, InputBase } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(theme => ({
    root: {
        borderRadius: 50,
        overflow: 'hidden',
        border: '3px solid',
        borderColor: theme.palette.common.white,
        transition: 'border-color .2s'
    },
    rootOpen: {
        borderColor: theme.palette.common.black
    },
    rootDarkBg: {
        borderColor: theme.palette.common.black
    },
    icon: {
        color: theme.palette.common.black
    },
    iconDarkBg: {
        color: theme.palette.common.white
    },
    input: {
        height: '100%',
        padding: theme.spacing(0, 3),
    },
    inputInput: {
        ...theme.typography.h6,
        '&::placeholder': {
            ...theme.typography.body1
        }
    },
    inputClosed: {
        width: 0
    }
}))

const variants = {
    open: {
        width: '600px',
    },
    closed: {
        width: 'auto',
    }
}

const NavbarSearch = ({ darkBg }) => {
    const [t] = useTranslation()
    const classes = useStyles()
    const [open, setOpen] = React.useState(false)

    const handleToggle = React.useCallback(() => { setOpen(state => !state) }, [])

    const animateVariant = open ? "open" : "closed"

    return (
        <Box
            display="flex"
            className={clsx(classes.root, { [classes.rootOpen]: open })}
            component={motion.div}
            variants={variants}
            animate={animateVariant}
        >
            <Box flexGrow={1}>
                <InputBase
                    placeholder={t('startTyping')}
                    fullWidth
                    classes={{
                        root: clsx(classes.input, { [classes.inputClosed]: !open }),
                        input: classes.inputInput
                    }}
                />
            </Box>
            <IconButton onClick={handleToggle}>
                <SearchIcon
                    className={clsx(classes.icon, {
                        [classes.open]: open,
                        [classes.iconDarkBg]: darkBg
                    })}
                />
            </IconButton>
        </Box>

    )
}

export default NavbarSearch
