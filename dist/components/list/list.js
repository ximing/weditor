/**
 * Created by yeanzhi on 17/2/20.
 */
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _class;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import './style/item.scss';
import './style/file.scss';
import React, { Component } from 'react';
import FileItem from './item';
import FileListHeader from './fileListHeader';
import { routerRedux } from '@rab/router';
var push = routerRedux.push;

import { connect } from '@rab';
import Crumb from './crumb';

var List = (_dec = connect(function (state) {
    return {
        file: state.file
    };
}), _dec(_class = function (_Component) {
    _inherits(List, _Component);

    function List() {
        _classCallCheck(this, List);

        return _possibleConstructorReturn(this, (List.__proto__ || Object.getPrototypeOf(List)).call(this));
    }

    _createClass(List, [{
        key: 'edit',
        value: function edit(item) {
            var _this2 = this;

            return function () {
                if (item.isDir) {
                    _this2.props.dispatch({ type: 'file.getList', payload: item.path });
                } else {
                    _this2.props.dispatch(push('/ot/edit?path=' + item.path));
                }
            };
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            try {
                return React.createElement(
                    'div',
                    { className: 'file-list-container' },
                    React.createElement(Crumb, null),
                    React.createElement(FileListHeader, null),
                    React.createElement(
                        'div',
                        { className: 'file-list-view' },
                        this.props.file.list.map(function (_, i) {
                            return React.createElement(FileItem, { onSelect: function onSelect() {},
                                clickItem: _this3.edit(_),
                                item: _, key: i });
                        })
                    )
                );
            } catch (err) {
                console.log(err);
            }
        }
    }]);

    return List;
}(Component)) || _class);
export { List as default };