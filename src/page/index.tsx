import * as React from 'react';
import {State as StoreState} from '../store/state';
import {IActionFunc, actions} from '../store/action';
import { connect } from 'react-redux';
import {getCity, IStation} from '../lib/city';
import * as style from '../styles/navarea.module.less';
import MetroSelect from './metroSelect';
import District from './district';
type Props = Partial<StoreState> & IActionFunc;

type State = {
    station: string[];
    district: string[];
}

class Index extends React.Component<Props, State>{
    state = {
        district: [],
        station: []
    }
    componentDidMount(){
        const p = location.pathname;
        const group = p.substring(p.indexOf('group')+6, p.lastIndexOf('/'));
        this.props.set({city:getCity(document.title), group});
    }
    init=()=>{
        this.props.init();
        this.props.fetchMetro();
    }
    search=()=>{
        console.log('---')
    }
    render(){
        const loadingIcon = this.props.loading?'...loading...':'';
        const content = !this.props.id?
        <div>初号机，发射准备...</div>
        :<div className={"group-intro"}>
            <District value={this.state.district} onChange={district=>this.setState({district})}/>
            <MetroSelect metro={this.props.metro} value={this.state.station} onChange={station=>this.setState({station})}/>
        </div>;

        const btnGp = this.props.id?<div className="rec-sec">
            <span className="rec"><a onClick={this.search}>查询</a></span>
        </div>:<div className="rec-sec">
            <span className="rec"><a onClick={this.init}>启动</a></span>
        </div>;

        return <div className={style.navArea}>
            <p>豆瓣rent™&nbsp;&nbsp;&nbsp;&nbsp;豆瓣租房小组插件：让大家更快找到心水的房子
                &nbsp;&nbsp;&nbsp;&nbsp;当前城市:<a >{this.props.city}</a>
                &nbsp;&nbsp;&nbsp;&nbsp;讨论组ID:<a >{this.props.group}</a></p>
            {content}
            {loadingIcon}
            {btnGp}
        </div>;
    }
}

function mapStoreToProps(s:StoreState):Partial<StoreState>{
    return {
        id:s.id, item:s.item, metro: s.metro, city: s.city, loading:s.loading,
        group: s.group
    };
}

export default connect(mapStoreToProps, actions)(Index);