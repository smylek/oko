import React from 'react'
import { Breadcrumbs, Typography, Link } from '@material-ui/core'
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import { shallowEqualObjects } from 'shallow-equal';


const ShopBreadcrumbs = ({ items }) => {
    return (
        <Breadcrumbs separator={<ArrowRightIcon color="action" fontSize="small" />}>
            {items.map(({ label, to }, index, arr) => arr.length - 1 === index ?
                <Typography color="textSecondary" key={to + label}>
                    {label}
                </Typography> :
                <Link to={to} key={to + label}>
                    {label}
                </Link>
            )}
        </Breadcrumbs>
    )
}

export default React.memo(ShopBreadcrumbs, shallowEqualObjects)
