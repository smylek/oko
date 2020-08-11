import { createMuiTheme, } from '@material-ui/core/styles';
import { Link as RouterLink } from 'react-router-dom';
import './assets/fonts/fonts.css'
import TransparentRouterLink from 'components/TransparentRouterLink';

const HEADER_FONT_FAMILY = 'Quicksand, Helvetica, "serif"'

export const theme = (() => {
    const t = createMuiTheme({
        typography: {
            fontFamily: 'Raleway, Helvetica, Arial, "sans-serif"',
            h1: {
                fontFamily: HEADER_FONT_FAMILY
            },
            h2: {
                fontFamily: HEADER_FONT_FAMILY
            },
            h3: {
                fontFamily: HEADER_FONT_FAMILY
            },
            h4: {
                fontFamily: HEADER_FONT_FAMILY
            },
            h5: {
                fontFamily: HEADER_FONT_FAMILY
            },
            h6: {
                fontFamily: HEADER_FONT_FAMILY
            },
            button: {
                fontFamily: HEADER_FONT_FAMILY
            },
        },
        overrides: {
            MuiCssBaseline: {
                '@global': {
                    //'@font-face': [quicksand],
                },
            },
        },
        palette: {
            primary: {
                main: '#000',
                contrastText: '#fff'
            },
            background: {
                default: '#fff',
                //paper: '#FAFAFA'
            },
            text: {
                secondary: 'rgba(0, 0, 0, 0.6)'
            }
        },
        props: {
            MuiLink: {
                underline: 'none',
                TypographyClasses: {
                    color: 'textSecondary'
                },
                component: TransparentRouterLink,
            },
            MuiButton: {
                disableElevation: true,
                variant: "contained"
            }
        }
    })

    t.overrides = {
        MuiButton: {
            contained: {
                borderRadius: 50
            }
        }
    }

    return t
})()