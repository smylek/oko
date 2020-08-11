import React from 'react'
import { Box, Grid, Typography, makeStyles } from '@material-ui/core'
import { usePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'

const getVariant = level => {
    switch (level) {
        case 0:
            return 'subtitle2'
        case 1:
            return 'body1'
        default:
            return 'body1'
    }
}

const useStyles = makeStyles(theme => ({
    uppercase: {
        textTransform: 'uppercase'
    },
}))

const Item = ({ children, level = 0 }) => {
    const classes = useStyles()

    return <Box pl={level * 2} py={.25}>
        <Typography
            variant={getVariant(level)}
            className={clsx({
                [classes.uppercase]: level === 0
            })}
        >
            {children}
        </Typography>
    </Box>
}
const Shop = () => {
    const [t] = useTranslation()
    const [isPresent, safeToRemove] = usePresence()

    const colors = [
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
    ]


    React.useEffect(() => {
        !isPresent && safeToRemove()
    }, [isPresent])

    return (
        <Box px={6}>
            <Grid container>
                <Grid item md={2}>
                    <Item>Category</Item>
                    <Item level={1}>Clothing</Item>
                    <Item level={2}>T-shirts</Item>

                    <Box mt={1} />

                    <Item>Color</Item>
                    {colors.map(({ label, value }) => <Item key={value} level={2}>{label}</Item>)}
                </Grid>
                <Grid item md={9}></Grid>
                <Grid item md={1}></Grid>
            </Grid>
        </Box>
    )
}

export default Shop
