import React from 'react'
import { Box, Typography, makeStyles, IconButton } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import { shallowEqualObjects } from 'shallow-equal'

const useStyles = makeStyles(theme => ({
    header: {
      ...theme.typography.h3,
      fontWeight: 900
    },
    uppercase: {
      textDecoration: 'uppercase'
    },
    checkoutButton: {
      borderRadius: 0
    }
  }))

const DrawerHeader = ({ title, onClose }) => {
    const classes = useStyles()
    
    return (
        <Box display="flex" alignItems="center" justifyContent="space-between" width="100%" p={2}>
          <Typography className={classes.header}>
            {title}
          </Typography>

          <IconButton edge="end" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
    )
}

export default React.memo(DrawerHeader, shallowEqualObjects)
