import React from 'react'
import { useTranslation } from 'react-i18next'
import { Select, MenuItem } from '@material-ui/core'
import { LANGUAGES } from 'constans'
import { shallowEqualObjects } from 'shallow-equal'

const LanguageSelect = () => {
    const { i18n } = useTranslation()

    const handleLangChange = React.useCallback(e => {
        i18n.changeLanguage(e.target.value)
    }, [])

    return (
        <Select
            id="language-select-id"
            value={i18n.language}
            onChange={handleLangChange}
        >
            {LANGUAGES.map(x => <MenuItem key={x.value} value={x.value}>{x.label}</MenuItem>)}
        </Select>
    )
}

export default React.memo(LanguageSelect, shallowEqualObjects)
