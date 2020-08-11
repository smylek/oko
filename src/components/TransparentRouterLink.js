import React from 'react'
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
    root: {
        textDecoration: 'unset',
        color: 'unset'
    }
}))

const externalLeads = ['http://', 'https://', 'mailto:']

const isExternal = url => {
    return externalLeads.some(x => url.includes(x))
}

const TransparentRouterLink = React.forwardRef(({ className, ...props }, ref) => {
    const classes = useStyles()

    return isExternal(props.to) ?
        <a ref={ref} href={props.to} className={clsx(classes.root, className)} {...props} /> :
        <RouterLink ref={ref} className={clsx(classes.root, className)} {...props} />


})

export default TransparentRouterLink
