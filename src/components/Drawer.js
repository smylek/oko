import React from 'react'
import DrawerHeader from 'components/DrawerHeader'
import { Box, Drawer as MuiDrawer } from '@material-ui/core'

const Drawer = ({ children, open, onClose, anchor, title }) => {
    return (
        <MuiDrawer
            anchor={anchor}
            open={open}
            onClose={onClose}
        >
            <Box width={400} maxWidth={'100vw'} display="flex" flexDirection="column" height="100%">
                <DrawerHeader
                    title={title}
                    onClose={onClose}
                />

                {children}
            </Box>
        </MuiDrawer>
    )
}

Drawer.defaultProps = {
    anchor: 'right'
}

export default Drawer
