import React, {Component} from 'react'
import {HashRouter, Switch, Route, Redirect} from 'react-router-dom'
import asyncComponent from '../utils/asyncComponent'

const invoice = asyncComponent(() => import("../pages/invoice/invoice"))

export default class RouteConfig extends Component {
    render() {
        return (
            <HashRouter>
                <Switch>
                    <Route path="/invoice" component= {invoice} />
                    <Redirect exact from='/' to='/invoice' />
                </Switch>
            </HashRouter>
        )
    }
}