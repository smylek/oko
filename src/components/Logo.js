import React from 'react'
import { ReactComponent as LogoSvg } from 'assets/images/logo.svg';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core';
import { HOMEPAGE_ANIMATION_TIME } from 'constans';
import deepEqual from 'fast-deep-equal/react'

const useStyles = makeStyles(theme => ({
    root: {
        transition: `fill ${HOMEPAGE_ANIMATION_TIME}s ease`
    },
    light: {
        fill: theme.palette.common.white
    },
    dark: {
        fill: theme.palette.common.black
    },
    sizeSmall: {
        width: 54,
        height: 52
    },
    sizeNormal: {
        width: 108,
        height: 104
    },
    sizeFull: {
        width: '100%',
        height: '100%'
    }
}))

const Logo = ({ logo, color, size, ...props }) => {
    const classes = useStyles()

    //color={darkBg ? "light" : "dark"}  component={motion.svg}

    return (
        <LogoSvg
            className={clsx(classes.root, {
                [classes.light]: color === 'light',
                [classes.dark]: color === 'dark',
                [classes.sizeSmall]: size === 'small',
                [classes.sizeNormal]: size === 'medium',
                [classes.sizeFull]: size === 'full',
            })}
            {...props}
        />
    )
}

Logo.defaultProps = {
    size: 'medium'
}

Logo.whyDidYouRender = true

export default React.memo(Logo, deepEqual)
