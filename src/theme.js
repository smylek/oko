import { createMuiTheme, } from '@material-ui/core/styles';
import './assets/fonts/fonts.css'
import TransparentRouterLink from 'components/TransparentRouterLink';

const HEADER_FONT_FAMILY = 'Quicksand, Helvetica, "serif"'

export const createTheme = (({ dark = false } = {}) => {
    const t = createMuiTheme({
        palette: {
            type: dark ? 'dark' : 'light',
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
            },
            error: {
                main: '#A02525'
            }
        },
        typography: {
            fontFamily: 'Raleway, Helvetica, Arial, "sans-serif"',
            h1: {
                fontFamily: HEADER_FONT_FAMILY
            },
            h2: { //nazwa w item detail
                fontFamily: HEADER_FONT_FAMILY,
                fontSize: 36,
                lineHeight: '48px'
            },
            h3: { // menu, cena w item detial
                fontFamily: HEADER_FONT_FAMILY,
                fontSize: 24,
                lineHeight: '31px'
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
                fontFamily: HEADER_FONT_FAMILY,
                fontSize: 18,
                lineHeight: 1.5,
            },
            body1: {
                fontSize: 18
            },
            subtitle1: {
                // body 1 + header font
                fontWeight: 400,
                fontSize: 18,
                lineHeight: 1.5,
                letterSpacing: "0.00938em",
                fontFamily: HEADER_FONT_FAMILY
            }
        },
        overrides: {
            MuiCssBaseline: {
                '@global': {
                    //'@font-face': [quicksand],
                },
            },
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
                borderRadius: 50,
            },
            outlined: {
                borderRadius: 50,
            },
            outlinedPrimary: {
                borderWidth: 3,
                borderColor: t.palette.primary.main,
                '&:hover': {
                    borderWidth: 3
                }
            }
        },
        MuiInput: {
            root: {
                fontWeight: 900
            },
            underline: {
                '&:before': {
                    display: 'none'
                }
            }
        },
        MuiSelect: {
            root: {
                paddingTop: 6,
                paddingBottom: 4
            }
        }
    }

    return t
})


export const theme = createTheme()