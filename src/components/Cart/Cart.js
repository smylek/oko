import React from 'react';
import CartLineItem from './CartLineItem';
import { Drawer, Box, Typography, makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Button from 'components/Button';
import { computePriceLabel } from 'utils/price';
import DrawerHeader from 'components/DrawerHeader';

const useStyles = makeStyles(theme => ({
  uppercase: {
    textDecoration: 'uppercase'
  },
  checkoutButton: {
    borderRadius: 0
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

  let line_items = checkout.lineItems.map((line_item) => {
    return (
      <CartLineItem
        updateQuantityInCart={updateQuantityInCart}
        removeLineItemInCart={removeLineItemInCart}
        key={line_item.id.toString()}
        line_item={line_item}
      />
    );
  });

  return (
    <Drawer
      anchor={'right'}
      open={isCartOpen}
      onClose={handleCartClose}
    >
      <Box minWidth={350} width={350} maxWidth={'100vw'} display="flex" flexDirection="column" height="100%">
        <DrawerHeader
          title={t('yourCart')}
          onClose={handleCartClose}
        />
        
        <Box flexGrow={1} px={2}>
          {line_items}
        </Box>

        <Box px={2}>
          {[
            { name: t('subtotal'), key: 'subtotalPriceV2' },
            { name: t('taxes'), key: 'totalTaxV2' },
            { name: t('total'), key: 'totalPriceV2' },
          ].map(({ name, key }) => <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="textSecondary" className={classes.uppercase}>{name}</Typography>
            <Typography variant="body2">{computePriceLabel(checkout[key])}</Typography>
          </Box>)}
        </Box>

        <Box mt={2} p={.5}>
          <Button className={classes.checkoutButton} fullWidth>
            {t('checkout')}
          </Button>
        </Box>
      </Box>
    </Drawer>
  )
}

export default Cart;