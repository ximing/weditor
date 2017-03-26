/**
 * Created by pomy on 07/02/2017.
 */

'use strict';
import React, {Component} from "react";
import {observer,Provider} from 'mobx-react';

import './index.scss'
import 'quill/dist/quill.snow.css'
import WEditor from './weditor'

import Catalogue from './model/catalogue';

let catalogue = new Catalogue();

export default class  extends Component {
    render(){
        return(
            <Provider catalogue={catalogue} >
                <WEditor />
            </Provider>
        )
    }
}
