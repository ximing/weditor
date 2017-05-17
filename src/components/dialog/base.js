/**
 * Created by zhangling11 on 17/2/8.
 */
import React, {Component} from 'react';



class Layout extends Component {
    static defaultProps = {
        prefixCls: 'nx-layout'
    };
    render () {
        const {prefixCls,children} = this.props;
        let cls = prefixCls;
        return (
            <div className={cls}>{children}</div>
        );
    }
}

export default Layout;
