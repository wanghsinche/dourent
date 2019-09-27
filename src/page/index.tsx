import * as React from 'react';
import {State as StoreState} from '../store/state';
import {IActionFunc, actions} from '../store/action';
import { connect } from 'react-redux';
type Props = Partial<StoreState> & IActionFunc;

type State = {

}

class Index extends React.Component<Props, State>{
    componentDidMount(){
        this.props.init();
    }

    render(){
        return <>
            <h2>dourent</h2>
            <div>content</div>
            <div>{this.props.id}</div>
        </>;
    }
}

function mapStoreToProps(s:StoreState):Partial<StoreState>{
    return {
        id:s.id, item:s.item
    };
}

export default connect(mapStoreToProps, actions)(Index);