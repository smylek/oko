import React from 'react'
import { IconButton, makeStyles, Box, InputBase, fade } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { HOMEPAGE_ANIMATION_TIME } from 'constans';
import { SearchTextContext, ShopContext } from 'App';

const useStyles = makeStyles(theme => ({
    root: {
        borderRadius: 50,
        overflow: 'hidden',
        border: '3px solid',
        borderColor: fade(theme.palette.common.white, 0),
        transition: `border-color .15s`
    },
    rootOpen: {
        borderColor: theme.palette.common.black
    },
    rootDarkBg: {
        borderColor: fade(theme.palette.common.black, 0)
    },
    rootDarkBgOpen: {
        borderColor: theme.palette.common.white
    },
    icon: {
        color: theme.palette.common.black,
        transition: `color ${HOMEPAGE_ANIMATION_TIME}s`
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
        transition: { type: 'spring', damping: 10, mass: .5 }
    },
    closed: {
        width: 'auto',
        transition: { type: 'spring', damping: 10, mass: .1 }
    }
}

const NavbarSearch = ({ darkBg }) => {
    const [t] = useTranslation()
    const ref = React.useRef()
    const classes = useStyles()
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState('')
    const { filter, setFilter } = React.useContext(ShopContext)

    const handleToggle = React.useCallback(() => {
        !open && ref.current.focus()
        setOpen(state => !state)
    }, [])

    const handleSearch = React.useCallback(e => setFilter({ ...filter, query: e.target.value}), [filter, setFilter])

    const handleChange = React.useCallback(e => setValue(e.target.value), [])

    const handleKeyDown = React.useCallback(e => e.key === 'Enter' && handleSearch(e), [handleSearch])

    const handleBlur = React.useCallback(e => value === '' && setOpen(false), [])

    const animateVariant = open ? "open" : "closed"

    const classesObj = React.useMemo(() => ({
        root: clsx(classes.input, { [classes.inputClosed]: !open }),
        input: classes.inputInput
    }), [classes, open])

    return (
        <Box
            display="flex"
            className={clsx(classes.root, {
                [classes.rootDarkBg]: darkBg,
                [classes.rootDarkBgOpen]: darkBg && open,
                [classes.rootOpen]: open
            })}
            component={motion.div}
            variants={variants}
            animate={animateVariant}

        >
            <Box flexGrow={1}>
                <InputBase
                    inputRef={ref}
                    value={value}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                    placeholder={t('startTyping')}
                    fullWidth
                    classes={classesObj}
                />
            </Box>
            <IconButton onClick={handleToggle}>
                <SearchIcon
                    className={clsx(classes.icon, {
                        [classes.iconDarkBg]: darkBg
                    })}
                />
            </IconButton>
        </Box>

    )
}

export default NavbarSearch
