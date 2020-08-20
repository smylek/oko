import React from 'react'
import { useTranslation } from 'react-i18next'
import { shallowEqualObjects } from 'shallow-equal'
import Sidebar from 'components/Sidebar'
import get from 'lodash.get'
import flatten from 'lodash.flatten'

const toggleOrFix = (_filter, namespace, value) => {
    return get(_filter, namespace, []).includes(value) ?
        get(_filter, namespace, []).filter(y => y !== value) :
        [...get(_filter, namespace, []), value]
}



const ShopSidebar = ({ filter, onFilterChange }) => {
    const [t] = useTranslation()

    const handleChange = React.useCallback((namespace, nextValue) => onFilterChange({
        ...filter,
        [namespace]: nextValue ?
            toggleOrFix(filter, namespace, nextValue) :
            [...nextValue]
    }), [filter, onFilterChange])


    const createClickableItem = React.useCallback(x => {
        const _filter = Array.isArray(filter[x.namespace]) ? filter : { ...filter, [x.namespace]: [] }

        const isSection = x.section

        if (isSection) {
            if (x.section === 'COLORS') {
                return [
                    ...t('colors', { returnObjects: true }).map(x => {
                        return createClickableItem({
                            ...x,
                            level: 1,
                            namespace: 'colors'
                        })
                    }),
                    createClickableItem({
                        value: 'MULTICOLOR',
                        title: 'Multicolor',
                        level: 1,
                        namespace: 'colors'
                    }),
                    ...(get(filter, 'colors', []).includes('MULTICOLOR') ? [
                        ...t('colors', { returnObjects: true }).map(x => {
                            return createClickableItem({
                                ...x,
                                level: 2,
                                namespace: 'mandatory-colors'
                            })
                        }),
                    ] : []),
                    createClickableItem({
                        value: 'COLORLESS',
                        title: 'Colorless',
                        level: 1,
                        namespace: 'colors'
                    }),
                ]
            }
        }

        const isSelectable = x.hasOwnProperty('namespace') && (x.hasOwnProperty('value') || x.hasOwnProperty('values'))

        const newObj = {
            ...x,
        }

        if (isSelectable) {
            newObj.onClick = handleChange
            newObj.isSelected = x.value ?
                get(_filter, x.namespace, []).includes(x.value) :
                x.values.every(o => _filter[x.namespace].includes(o))
        }

        return newObj
    }, [filter, handleChange, t])

    const sidebarItems = React.useMemo(() => flatten(
        t('shopMenu', { returnObjects: true }).map(createClickableItem)
    ), [t, createClickableItem])

    return (
        <Sidebar items={sidebarItems} />
    )
}

export default React.memo(ShopSidebar, shallowEqualObjects)
