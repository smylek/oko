import React from 'react'
import { withRouter } from 'react-router'
import get from 'lodash.get'

class RouteChangeEffect extends React.Component {
    componentWillReceiveProps(nextProps) {
        if (get(this.props, 'location.pathname') !== get(nextProps, 'location.pathname')) {
            window.scrollTo(0)
        }
    }
    render() {
        return null
    }
}


export default RouteChangeEffect
