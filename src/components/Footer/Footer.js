import React from 'react'
import { Box, Typography, Grid, IconButton } from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';
import TwitterIcon from '@material-ui/icons/Twitter';
import TransparentRouterLink from 'components/TransparentRouterLink';
import Logo from 'components/Logo';

const socials = [
    {
        url: process.env.REACT_APP_SHOP_FB_URL,
        Icon: FacebookIcon
    },
    {
        url: process.env.REACT_APP_SHOP_INSTAGRAM_URL,
        Icon: InstagramIcon
    },
    {
        url: process.env.REACT_APP_SHOP_TWITTER_URL,
        Icon: TwitterIcon
    }
]

const Footer = () => {
    const { t } = useTranslation()

    const footerPages = t('pages', { returnObjects: true }).filter(x => x.showInFooter)

    return (
        <Box px={6} pt={6} pb={4}>
            <Grid container>
                <Grid item md={6}>
                    <Typography variant="body1" gutterBottom>
                        <Box component="span" fontStyle="italic" display="inline-block" maxWidth={400}>
                            {t('footerParagraph')}
                        </Box>
                    </Typography>

                    <Box display="flex" alignItems="center" mt={6}>
                        <Typography variant="h3">
                            {t('footerFollowUs')}
                        </Typography>

                        <Box ml={2}>
                            {socials.map(({ url, Icon }, index, arr) => url && <React.Fragment key={url}>
                                <IconButton to={url} component={TransparentRouterLink} target="_blank">
                                    <Icon fontSize="large" />
                                </IconButton>
                                {arr.length - 1 !== index && <Box ml={2} />}
                            </React.Fragment>)}
                        </Box>
                    </Box>
                </Grid>

                <Grid item md={6} container direction="column" justify="center" alignItems="flex-end">
                    <Logo />

                    <Box display="flex" alignItems="center" mt={6}>
                        {footerPages.map(x => <Box key={x.slug} mr={2} component={TransparentRouterLink} to={`/pages/${x.slug}`}>
                            <Box component="span" color="text.secondary">
                                {x.title}
                            </Box>
                        </Box>)}
                    </Box>
                </Grid>
            </Grid>
        </Box>
    )
}

export default Footer
