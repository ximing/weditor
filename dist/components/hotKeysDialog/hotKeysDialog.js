/**
 * Created by yeanzhi on 17/4/4.
 */
'use strict';
import React, {Component} from 'react';
import Dialog from '../dialog';
import help from '../../model/help';

export default class HotKeysDialog extends Component {

    closeDialog = ()=>{
        help.hotKeysDialog = false;

    };

    render() {
        return (
            <Dialog
                title="键盘快捷键"
                className="weditor-hotkeys-dialog"
                content={(
                    < div className="weditor-hotkeys-inner">
                        <table
                            cellPadding="0"
                            tabIndex="0"
                            className="apps-shortcutshelppopup-content"
                            >
                            <tbody>
                                <tr>
                                    <th colSpan="2">
                                        <h3
                                        className="apps-shortcutshelppopup-content-header apps-shortcutshelppopup-content-header-first">
                                        文本格式</h3>
                                    </th>
                                </tr>
                                <tr>
                                    <td
                                    className="apps-shortcutshelppopup-shortcut-desc apps-shortcutshelppopup-content-element">
                                    粗体
                                </td>
                                    <td
                                    className="apps-shortcutshelppopup-shortcut-key apps-shortcutshelppopup-content-element">
                                        <span >⌘B</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td
                                    className="apps-shortcutshelppopup-shortcut-desc apps-shortcutshelppopup-content-element">
                                    斜体
                                </td>
                                    <td
                                    className="apps-shortcutshelppopup-shortcut-key apps-shortcutshelppopup-content-element">
                                        <span >⌘I</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td
                                    className="apps-shortcutshelppopup-shortcut-desc apps-shortcutshelppopup-content-element">
                                    加下划线
                                </td>
                                    <td
                                    className="apps-shortcutshelppopup-shortcut-key apps-shortcutshelppopup-content-element">
                                        <span >⌘U</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td
                                    className="apps-shortcutshelppopup-shortcut-desc apps-shortcutshelppopup-content-element">
                                    删除线
                                </td>
                                    <td
                                    className="apps-shortcutshelppopup-shortcut-key apps-shortcutshelppopup-content-element">
                                        <span >⌘+Shift+X</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td
                                    className="apps-shortcutshelppopup-shortcut-desc apps-shortcutshelppopup-content-element">
                                    清除格式
                                </td>
                                    <td
                                    className="apps-shortcutshelppopup-shortcut-key apps-shortcutshelppopup-content-element">
                                        <span >⌘+Shift+C</span>
                                    </td>
                                </tr>
                                <tr>
                                    <th colSpan="2">
                                        <h3 className="apps-shortcutshelppopup-content-header">段落格式</h3>
                                    </th>
                                </tr>
                                <tr>
                                    <td
                                    className="apps-shortcutshelppopup-shortcut-desc apps-shortcutshelppopup-content-element">
                                    应用“普通文本”
                                </td>
                                    <td
                                    className="apps-shortcutshelppopup-shortcut-key apps-shortcutshelppopup-content-element">
                                        <span >⌘+Alt+0</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td
                                    className="apps-shortcutshelppopup-shortcut-desc apps-shortcutshelppopup-content-element">
                                    应用“标题1”
                                </td>
                                    <td
                                    className="apps-shortcutshelppopup-shortcut-key apps-shortcutshelppopup-content-element">
                                        <span >⌘+Shift+1</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td
                                    className="apps-shortcutshelppopup-shortcut-desc apps-shortcutshelppopup-content-element">
                                    应用“标题2”
                                </td>
                                    <td
                                    className="apps-shortcutshelppopup-shortcut-key apps-shortcutshelppopup-content-element">
                                        <span >⌘+Alt+2</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td
                                    className="apps-shortcutshelppopup-shortcut-desc apps-shortcutshelppopup-content-element">
                                    应用“标题3”
                                </td>
                                    <td
                                    className="apps-shortcutshelppopup-shortcut-key apps-shortcutshelppopup-content-element">
                                        <span >⌘+Alt+3</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td
                                    className="apps-shortcutshelppopup-shortcut-desc apps-shortcutshelppopup-content-element">
                                    应用“标题4”
                                </td>
                                    <td
                                    className="apps-shortcutshelppopup-shortcut-key apps-shortcutshelppopup-content-element">
                                        <span >⌘+Alt+4</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td
                                    className="apps-shortcutshelppopup-shortcut-desc apps-shortcutshelppopup-content-element">
                                    应用“标题5”
                                </td>
                                    <td
                                    className="apps-shortcutshelppopup-shortcut-key apps-shortcutshelppopup-content-element">
                                        <span >⌘+Alt+5</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td
                                    className="apps-shortcutshelppopup-shortcut-desc apps-shortcutshelppopup-content-element">
                                    应用“标题6”
                                </td>
                                    <td
                                    className="apps-shortcutshelppopup-shortcut-key apps-shortcutshelppopup-content-element">
                                        <span >⌘+Alt+6</span>
                                    </td>
                                </tr>


                                <tr>
                                    <td
                                    className="apps-shortcutshelppopup-shortcut-desc apps-shortcutshelppopup-content-element">
                                    左对齐文本
                                </td>
                                    <td
                                    className="apps-shortcutshelppopup-shortcut-key apps-shortcutshelppopup-content-element">
                                        <span >⌘+Shift+L</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td
                                    className="apps-shortcutshelppopup-shortcut-desc apps-shortcutshelppopup-content-element">
                                    居中对齐文本
                                </td>
                                    <td
                                    className="apps-shortcutshelppopup-shortcut-key apps-shortcutshelppopup-content-element">
                                        <span >⌘+Shift+E</span>
                                    </td>
                                </tr>

                                <tr>
                                    <td
                                    className="apps-shortcutshelppopup-shortcut-desc apps-shortcutshelppopup-content-element">
                                    右对齐文本
                                </td>
                                    <td
                                    className="apps-shortcutshelppopup-shortcut-key apps-shortcutshelppopup-content-element">
                                        <span >⌘+Shift+R</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td
                                    className="apps-shortcutshelppopup-shortcut-desc apps-shortcutshelppopup-content-element">
                                    对齐文本
                                </td>
                                    <td
                                    className="apps-shortcutshelppopup-shortcut-key apps-shortcutshelppopup-content-element">
                                        <span >⌘+Shift+J</span>
                                    </td>
                                </tr>


                                <tr>
                                    <td
                                    className="apps-shortcutshelppopup-shortcut-desc apps-shortcutshelppopup-content-element">
                                    有序列表
                                </td>
                                    <td
                                    className="apps-shortcutshelppopup-shortcut-key apps-shortcutshelppopup-content-element">
                                        <span >⌘+Option+l</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td
                                    className="apps-shortcutshelppopup-shortcut-desc apps-shortcutshelppopup-content-element">
                                    无序列表
                                </td>
                                    <td
                                    className="apps-shortcutshelppopup-shortcut-key apps-shortcutshelppopup-content-element">
                                        <span >⌘+Option+u</span>
                                    </td>
                                </tr>
                                <tr>
                                    <th colSpan="2">
                                        <h3 className="apps-shortcutshelppopup-content-header">编辑</h3>
                                    </th>
                                </tr>
                                <tr>
                                    <td
                                    className="apps-shortcutshelppopup-shortcut-desc apps-shortcutshelppopup-content-element">
                                    撤销
                                </td>
                                    <td
                                    className="apps-shortcutshelppopup-shortcut-key apps-shortcutshelppopup-content-element">
                                        <span >⌘+z</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td
                                    className="apps-shortcutshelppopup-shortcut-desc apps-shortcutshelppopup-content-element">
                                    重做
                                </td>
                                    <td
                                    className="apps-shortcutshelppopup-shortcut-key apps-shortcutshelppopup-content-element">
                                        <span >⌘+y</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
                onClose={this.closeDialog}
            />
        );
    }
}
