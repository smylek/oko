import React from 'react'
import { Box, Grid, Typography } from '@material-ui/core'

const Page404 = ({ sidebarSlot }) => {
    return (
        <Box px={6}>
            <Grid container>
                <Grid item md={2}>
                    {sidebarSlot}
                </Grid>
                <Grid item md={9} spacing={2}>
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
