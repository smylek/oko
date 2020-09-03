import React from 'react'
import { Box, Grid, Typography, useMediaQuery } from '@material-ui/core'

const Page404 = ({ sidebarSlot }) => {
    const mobile = useMediaQuery(theme => theme.breakpoints.down('sm'))

    return (
        <Box px={mobile ? 2 : 7}>
            <Grid container>
                <Grid item xs={12} md={2}>
                    {sidebarSlot}
                </Grid>
                <Grid item xs={12} md={9}>
                    <Box px={1}>
                        <Typography variant="h1">
                            404
                        </Typography>
                    </Box>

                </Grid>
                <Grid item md={1}></Grid>
            </Grid>
        </Box>
    )
}

export default Page404
