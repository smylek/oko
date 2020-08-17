import get from "lodash.get";

const FALLBACK_CURRENCY = 'PLN'

export const computePriceLabel = (priceModel = null) => {
    if (!priceModel) return ''

    const priceFormatter = new Intl.NumberFormat('pl-PL', {
        style: 'currency',
        currency: get(priceModel, 'currencyCode', FALLBACK_CURRENCY),
    });
    const result = priceFormatter.format(get(priceModel, 'amount'))

    return result
}
