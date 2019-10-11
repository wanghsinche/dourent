import * as React from 'react';
import {State as StoreState} from '../store/state';
import {IActionFunc, actions} from '../store/action';
import { connect } from 'react-redux';


type Props = Partial<StoreState> & IActionFunc;

class Result extends React.Component<Props>{
    render(){
        return 'result: '+ this.props.res.length;
    }
}


function mapStoreToProps(s:StoreState):Partial<StoreState>{
    return {
        res: s.res
    };
}

export default connect(mapStoreToProps, actions)(Result);
