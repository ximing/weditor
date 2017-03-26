/**
 * Created by yeanzhi on 17/3/26.
 */
'use strict';
import 'babel-polyfill';
import React, {Component} from "react";
import rab, {connect, createAction} from 'rabjs/index.js';
import {Router, Route} from 'rabjs/router';
import EditContainer from './editContainer';

class WrapEditContainer extends Component {
    render() {
        return(
            <div>
                {this.props.children}
            </div>
        );
    }
}

//1. init app
const app = rab({
    debug:true
});

app.router(({history}) => {
    return (
        <Router history={history}>
            <Route path="/ot" component={WrapEditContainer}>
                <Route path="edit" component={EditContainer}/>
            </Route>
        </Router>
    );
});

// 5. Start
app.start('#app');
