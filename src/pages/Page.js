import React from 'react'
import { Box, Grid, Typography } from '@material-ui/core'
import ShopSidebar from './Shop/ShopSidebar'
import decorator from 'assets/images/static-page-decorator.png'
import { useTranslation } from 'react-i18next'

const Page = ({ keyName }) => {
    const { t } = useTranslation()

    return (
        <Box px={6}>
            <Grid container>
                <Grid item md={2}>
                    <ShopSidebar />
                </Grid>
                <Grid item md={9} container spacing={2}>
                    <Grid item md={5}>
                        <img src={decorator} />
                    </Grid>
                    <Grid item md={7}>
                        <Typography>
                            {t(keyName)}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item md={1}></Grid>
            </Grid>
        </Box>
    )
}

export default Page
