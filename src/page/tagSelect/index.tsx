import * as React from 'react';
import * as style from './index.module.less';
type Props = {
    value: string[];
    onChange: (v:string[])=>void;
    title: string;
    tags: string[];
}

export default class Index extends React.Component<Props>{
    addTag=(s:string)=>{
        this.props.onChange([...this.props.value, s]);
    }
    removeTag=(s:string)=>{
        this.props.onChange(this.props.value.filter(el=>el!==s));
    }
    clearAll=()=>{
        this.props.onChange([]);
        this.setState({line:void 0});
    }
    render(){
        return <div className={style.moduleTags}>
        <label >{this.props.title}:</label>
        <ul >
            <li key={void 0}>{
                this.props.value.length<1?
                <span >不限</span>:
                <a onClick={this.clearAll}>不限</a>
            }</li>
            {this.props.tags.map(el=>(
                <li key={el}>{
                    this.props.value.indexOf(el)>-1?
                    <a onClick={()=>this.removeTag(el)} className="selected">{el}</a>:
                    <a onClick={()=>this.addTag(el)} >{el}</a>
                }</li>
            ))}
        </ul>
        </div>;
    }
}
