import * as React from 'react';
import {IMetro, IStation} from '../../lib/city';
import * as style from './index.module.less';
type Props = {
    metro:IMetro[];
    value: string[];
    onChange:(v:string[])=>void;
}

type State = {
    line?: IMetro;
}

export default class MetroSelect extends React.Component<Props, State>{
    state = {
        line: void 0
    }
    setLine=(line:IMetro)=>{
        this.setState({line});
        this.props.onChange([line.stops[0].name]);
    }
    addStation=(s:string)=>{
        this.props.onChange([...this.props.value, s]);
    }
    removeStation=(s:string)=>{
        this.props.onChange(this.props.value.filter(el=>el!==s));
    }
    clearAll=()=>{
        this.props.onChange([]);
        this.setState({line:void 0});
    }
    render(){
        return <div className={style.moduleSelect}>
            <label >地铁:</label>
            <ul >
                <li key={void 0}>{
                    this.props.value.length<1?
                    <span >不限</span>:
                    <a onClick={this.clearAll}>不限</a>
                }</li>
                {this.props.metro.map(el=>(
                    <li key={el.line_uid}>
                        {this.state.line === el?
                        <span className="category">{el.line_name}</span>:
                        <a onClick={()=>this.setLine(el)} >{el.line_name}</a>}
                    </li>
                ))}
            </ul>       
            <ul style={{marginTop: '.5em'}}>
            {!this.state.line?'':
            this.state.line.stops.map(el=>(
                <li key={el.uid}>{
                    this.props.value.indexOf(el.name)>-1?
                    <a onClick={()=>this.removeStation(el.name)} className="selected">{el.name}</a>:
                    <a onClick={()=>this.addStation(el.name)} >{el.name}</a>
                }</li>
            ))}
            </ul>
        </div>;
    }
}