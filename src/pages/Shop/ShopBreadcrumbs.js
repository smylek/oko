import React from 'react'
import { Breadcrumbs, Typography, Link } from '@material-ui/core'
import ArrowRightIcon from '@material-ui/icons/ArrowRight';


const ShopBreadcrumbs = ({ items }) => {
    return (
        <Breadcrumbs separator={<ArrowRightIcon color="action" fontSize="small" />}>
            {items.map(({ label, to }, index, arr) => arr.length - 1 === index ?
                <Typography color="textSecondary">
                    {label}
                </Typography> :
                <Link to={to}>
                    {label}
                </Link>
            )}
        </Breadcrumbs>
    )
}

export default ShopBreadcrumbs
