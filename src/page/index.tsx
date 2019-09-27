import * as React from 'react';
import {State as StoreState} from '../store/state';
import {IActionFunc, actions} from '../store/action';
import { connect } from 'react-redux';
type Props = Partial<StoreState> & IActionFunc;

type State = {

}

class Index extends React.Component<Props, State>{
    init=()=>{
        this.props.init();
        this.props.set({city:'广州'});
        this.props.fetchMetro();
    }
    render(){
        const loadingIcon = this.props.loading?'...loading...':'';
        console.log(this.props.loading);
        const content = this.props.id?
        <div className="group-intro">
            <div>{this.props.id}</div>
            <div>{this.props.metro.map(el=>el.line_name).join(',')}</div>
        </div>:<div>初号机，发射准备...</div>;
        return <>
            <p>豆瓣rent™&nbsp;&nbsp;&nbsp;&nbsp;豆瓣租房小组插件：让大家更快找到心水的房子</p>
            {content}
            {loadingIcon}
            <div className="rec-sec">
                <span className="rec"><a onClick={this.init}>启动</a></span>
            </div>
        </>;
    }
}

function mapStoreToProps(s:StoreState):Partial<StoreState>{
    return {
        id:s.id, item:s.item, metro: s.metro, city: s.city, loading:s.loading
    };
}

export default connect(mapStoreToProps, actions)(Index);