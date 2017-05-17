/**
 * Created by yeanzhi on 17/3/29.
 */
'use strict';
import React, {Component} from 'react';
import Notification from 'rc-notification';
import './index.scss';
import Icon from '../icon';
const notification = Notification.newInstance({});

export const warning = function (content,onClose) {
    notification.notice({
        content: <p className="weditor-toast"><Icon type="warning"/><span>{content}</span> </p>,
        onClose
    });
};
export const info = function (content,onClose) {
    notification.notice({
        content: <p className="weditor-toast"><Icon type="info"/><span>{content}</span></p>,
        onClose
    });
};
export const success = function (content,onClose) {
    notification.notice({
        content: <p className="weditor-toast"><Icon type="success"/><span>{content}</span></p>,
        onClose
    });
};
export const error = function (content,onClose) {
    notification.notice({
        content: <p className="weditor-toast"><Icon type="error"/><span>{content}</span></p>,
        onClose
    });
};
