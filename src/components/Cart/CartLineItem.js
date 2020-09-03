import React from 'react';
import { debounce, makeStyles, Typography, CardMedia, Box, Input, IconButton } from '@material-ui/core';
import { computePriceLabel } from 'utils/price';
import AddIcon from '@material-ui/icons/Add'
import RemoveIcon from '@material-ui/icons/Remove'
import CloseIcon from '@material-ui/icons/Close'
import { defaultTo } from 'utils/functions';


const useStyles = makeStyles(theme => ({
  image: {
    paddingBottom: '100%',
    width: '100%'
  },
  quantityInput: {
    width: 30,
    textAlign: 'center'
  }
}))

const CartLineItem = ({ lineItem, updateQuantityInCart, removeLineItemInCart }) => {
  const classes = useStyles()
  const [quantity, setQuantity] = React.useState(lineItem?.quantity || 1)

  const syncQuantity = React.useCallback(() => {
    const lineItemId = lineItem.id
    updateQuantityInCart(lineItemId, quantity);
  }, [updateQuantityInCart, lineItem, quantity])

  const debouncedSyncQuantity = React.useCallback(debounce(syncQuantity, 300), [syncQuantity])

  React.useEffect(() => {
    lineItem?.quantity !== quantity && debouncedSyncQuantity()
  }, [debouncedSyncQuantity, quantity])

  const decrementQuantity = React.useCallback(() => {
    if (quantity > 1) {
      setQuantity(state => state - 1)
    }
  }, [quantity])

  const incrementQuantity = React.useCallback(() => {
    setQuantity(state => state + 1)    
  }, [])

  const handleRemove = React.useCallback(() => {
    removeLineItemInCart(lineItem.id)
  }, [removeLineItemInCart, lineItem])

  return <Box display="flex" mb={2}>
    <Box width={75} maxWidth={75}>
      {
        lineItem.variant.image ? <CardMedia
          image={lineItem.variant.image.src}
          title={`${lineItem.title} product shot`}
          className={classes.image}
        //whileHover={hoverStyle}
        //onClick={() => handleThumbnailClick(index)}
        /> :
          null
      }
    </Box>

    <Box flexGrow={1} ml={2}>
      <Typography variant="body2" color="textSecondary">
        {lineItem.title}
      </Typography>

      <Typography variant="body2" color="textSecondary">
        {lineItem.variant.title}
      </Typography>

      <Box>
        <Input
          startAdornment={<IconButton edge="start" size="small">
            <RemoveIcon onClick={decrementQuantity} />
          </IconButton>}
          endAdornment={<IconButton edge="end" size="small">
            <AddIcon onClick={incrementQuantity} />
          </IconButton>}
          value={quantity}
          disableUnderline
          classes={{
            input: classes.quantityInput
          }}
        />
      </Box>
    </Box>

    <Box display="flex" alignItems="flex-end" flexDirection="column">
      <Box>
        <IconButton edge="end" size="small" onClick={handleRemove}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box>
        <Typography>
          {
            computePriceLabel({
              ...lineItem.variant.priceV2,
              amount: (quantity * lineItem.variant.priceV2.amount).toFixed(2)
            })
          }
        </Typography>
      </Box>
    </Box>
  </Box>
}

export default CartLineItem;