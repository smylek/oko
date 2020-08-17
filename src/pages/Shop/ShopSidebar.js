import React from 'react'
import { useTranslation } from 'react-i18next'
import { shallowEqualObjects } from 'shallow-equal'
import Sidebar from 'components/Sidebar'
import get from 'lodash.get'

const ShopSidebar = ({ filter, onFilterChange }) => {
    const [t] = useTranslation()

    const handleChange = React.useCallback(nextState => onFilterChange(nextState), [])

    const sidebarItems = React.useMemo(() => t('shopMenu', { returnObjects: true }).map(x => {
        const _filter = Array.isArray(filter[x.namespace]) ? filter : { ...filter, [x.namespace]: [] }

        const computed = x.namespace && x.value !== undefined ? {
            onClick: () => handleChange({
                ..._filter,
                [x.namespace]: get(_filter, x.namespace, []).includes(x.value) ?
                    get(_filter, x.namespace, []).filter(y => y !== x.value) :
                    [...get(_filter, x.namespace, []), x.value]
            }),
            isSelected: () => get(_filter, x.namespace, []).includes(x.value)
        } : {}

        return ({
            level: x.level,
            title: x.title,
            ...computed
        })
    }), [filter,])

    return (
        <Sidebar items={sidebarItems} />
    )
}

export default React.memo(ShopSidebar, shallowEqualObjects)
