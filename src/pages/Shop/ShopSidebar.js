import React from 'react'
import { useTranslation } from 'react-i18next'
import { shallowEqualObjects } from 'shallow-equal'
import Sidebar from 'components/Sidebar'

const ShopSidebar = ({ filter, onFilterChange }) => {
    const [t] = useTranslation()

    const handleChange = React.useCallback(nextState => onFilterChange(nextState), [])

    const colors = React.useMemo(() => [
        {
            label: t('white'),
            value: 'WHITE'
        },
        {
            label: t('blue'),
            value: 'BLUE'
        },
        {
            label: t('black'),
            value: 'BLACK'
        },
        {
            label: t('red'),
            value: 'RED'
        },
        {
            label: t('green'),
            value: 'GREEN'
        },
        {
            label: t('multicolor'),
            value: 'MULTICOLOR'
        },
        {
            label: t('colorless'),
            value: 'COLORLESS'
        },
    ], [])

    const sidebarItems = React.useMemo(() => [
        {
            level: 0,
            title: 'Category',
        },
        {
            level: 1,
            title: 'Clothing',
            onClick: () => handleChange({ ...filter, productType: 'Clothing' }),
            isSelected: () => filter.productType === 'Clothing'
        },
        {
            level: 1,
            title: 'T-shirts',
            onClick: () => handleChange({ ...filter, productType: 'T-shirts' }),
            isSelected: () => filter.productType === 'T-shirts'
        },
        {
            level: 0,
            title: 'Colors',
        },
        ...colors.map(x => ({
            level: 1,
            title: x.label,
            onClick: () => handleChange({
                ...filter,
                colors: filter.colors.includes(x.value) ?
                    filter.colors.filter(y => y === x.value) :
                    [...filter.colors, x.value]
            }),
            isSelected: () => filter.colors.includes(x.value)
        }))
    ], [filter,])

    return (
        <Sidebar items={sidebarItems} />
    )
}

export default React.memo(ShopSidebar, shallowEqualObjects)
