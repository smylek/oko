import React from 'react'
import { useTranslation } from 'react-i18next'
import { shallowEqualObjects } from 'shallow-equal'
import Sidebar from 'components/Sidebar'

const ShopSidebar = () => {
    const [t] = useTranslation()

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
            title: 'Category'
        },
        {
            level: 1,
            title: 'Clothing'
        },
        {
            level: 1,
            title: 'T-shirts'
        },
        {
            level: 0,
            title: 'Colors'
        },
        ...colors.map(x => ({ level: 1, title: x.label}))
    ], [])

    return (
        <Sidebar items={sidebarItems} />

    )
}

export default React.memo(ShopSidebar, shallowEqualObjects)
