import * as React from 'react';
import {State as StoreState, priceSorter} from '../store/state';
import {IActionFunc, actions} from '../store/action';
import { connect } from 'react-redux';
import {getCity, IStation} from '../lib/city';
import * as style from '../styles/navarea.module.less';
import MetroSelect from './metroSelect';
import District from './district';
import TagSelect from './tagSelect';
import Select from './select';
import * as constant from '../lib/constant';

type Props = Partial<StoreState> & IActionFunc;

type State = {
    station: string[];
    district: string[];
    structure: string[];
    rentType: string[];
}

class Index extends React.Component<Props, State>{
    state = {
        district: [],
        station: [],
        structure: [],
        rentType: []
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
        const {district, station, structure, rentType} = this.state;
        let tags:string[] = district.concat(station, structure, rentType);
        console.log(tags);
        this.props.process(tags);
        // main();
    }
    render(){
        const loadingIcon = this.props.loading?'...loading...':'';

        if (!this.props.isReady) {
            
        }

        const content = !this.props.isReady?
        <div>豆瓣rent™️暂时不支持该小组</div>:
        !this.props.launched?
        <div>初号机，发射准备...</div>
        :<div className={"group-intro"}>
            <District value={this.state.district} onChange={district=>this.setState({district})}/>
            <MetroSelect metro={this.props.metro} value={this.state.station} onChange={station=>this.setState({station})}/>
            <TagSelect title="房型" tags={constant.Structure} value={this.state.structure} onChange={structure=>this.setState({structure})}/>
            <TagSelect title="类型" tags={constant.RentType} value={this.state.rentType} onChange={rentType=>this.setState({rentType})}/>
            <Select title="价格" options={priceSorter} value={this.props.priceSort} onChange={(priceSort:any)=>this.props.set({priceSort})}/>
        </div>;

        const btnGp = !this.props.isReady?
        '':
        this.props.launched ?<div className="rec-sec">
            <span className="rec"><a onClick={this.search} className="btn">查询</a></span>
        </div>:<div className="rec-sec">
            <span className="rec"><a onClick={this.init} className="btn">启动</a></span>
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
    return s;
}

export default connect(mapStoreToProps, actions)(Index);