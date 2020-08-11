import React from 'react'
import { Button as MuiButton, makeStyles } from '@material-ui/core'
import { theme } from 'theme'
import clsx from 'clsx'

const useStyles = makeStyles(theme => ({
    primaryInversed: {
        color: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.contrastText,

        '&:hover': {
            color: theme.palette.primary.main,
            backgroundColor: theme.palette.primary.contrastText,
        }
    }
}))

const Button = ({ color, className, ...props }) => {
    const classes = useStyles()

    return (
        <MuiButton className={clsx({
            [classes.primaryInversed]: color === 'primary-inversed'
        }, className)}
            color="primary"
            {...props}
        />
    )
}

export default Button
