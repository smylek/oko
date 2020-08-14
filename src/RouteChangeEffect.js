import React from 'react'
import { withRouter } from 'react-router'

class RouteChangeEffect extends React.Component {
    componentWillReceiveProps(nextProps) {
        if (this.props.location.pathname !== nextProps.location.pathname) {
            window.scrollTo(0)
        }
    }
    render() {
        return null
    }
}


export default RouteChangeEffect
