import * as React from 'react';
import {State as StoreState} from '../store/state';
import {IActionFunc, actions} from '../store/action';
import { connect } from 'react-redux';
import * as style from '../styles/navarea.module.less';
import * as constant from '../lib/constant';

type Props = Partial<StoreState> & IActionFunc;


class Index extends React.Component<Props>{
    componentDidMount(){
        this.props.fetchQDII();
    }

    render(){
        return <div>
            {this.props.qdii && this.props.qdii.map(el=>JSON.stringify(el))}
        </div>;
    }
}

function mapStoreToProps(s:StoreState):Partial<StoreState>{
    return s;
}

export default connect(mapStoreToProps, actions)(Index);