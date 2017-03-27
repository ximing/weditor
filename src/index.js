/**
 * Created by pomy on 07/02/2017.
 */

'use strict';
import React, {Component} from "react";
import {observer,Provider} from 'mobx-react';

import './index.scss'
import 'quill/dist/quill.snow.css'
import WEditor from './weditor'

import catalogue from './model/catalogue';
import insert from './model/insert';


export default class  extends Component {
    render(){
        return(
            <Provider
                catalogue={catalogue}
                insert={insert}
            >
                <WEditor />
            </Provider>
        )
    }
}
