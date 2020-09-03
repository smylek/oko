import React from 'react';
import CartLineItem from './CartLineItem';
import { Box, Typography, makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Button from 'components/Button';
import { computePriceLabel } from 'utils/price';
import Drawer from 'components/Drawer';

const useStyles = makeStyles(theme => ({
  uppercase: {
    textDecoration: 'uppercase'
  }
}))

const Cart = ({
  checkout,
  updateQuantityInCart,
  isCartOpen,
  handleCartClose,
  openCheckout,
  removeLineItemInCart
}) => {
  const { t } = useTranslation()
  const classes = useStyles()

  const priceComponents = React.useMemo(() => [
    { name: t('subtotal'), key: 'subtotalPriceV2' },
    { name: t('taxes'), key: 'totalTaxV2' },
    { name: t('total'), key: 'totalPriceV2' },
  ], [t])

  const lineItems = React.useMemo(() => checkout.lineItems.map((line_item) => {
    return (
      <CartLineItem
        key={line_item.id.toString()}
        updateQuantityInCart={updateQuantityInCart}
        removeLineItemInCart={removeLineItemInCart}
        lineItem={line_item}
      />
    );
  }), [checkout, removeLineItemInCart, updateQuantityInCart])
  
  return (
    <Drawer title={t('yourCart')} open={isCartOpen} onClose={handleCartClose}>
      <Box flexGrow={1} pl={2} pr={3}>
        {lineItems}
      </Box>

      <Box pl={2} pr={3}>
        {priceComponents.map(({ name, key }) => <Box
          key={key}
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="body2" color="textSecondary" className={classes.uppercase}>{name}</Typography>
          <Typography variant="body2">{computePriceLabel(checkout[key])}</Typography>
        </Box>)}
      </Box>

      <Box mt={2} mb={1} pl={2} pr={3}>
        <Button fullWidth onClick={openCheckout}>
          {t('checkout')}
        </Button>
      </Box>
    </Drawer>
  )
}

export default Cart