import * as React from 'react';
import * as style from './index.module.less';

type Props = {
    value: string;
    onChange: (v:string)=>void;
    title: string;
    options: {label:string, value: any}[];
}
export default class Select extends React.Component<Props>{
    render(){
        return <div className={style.moduleTags}>
        <label >{this.props.title}:</label>
        <ul >
            {this.props.options.map(el=>(
                <li key={el.value}>{
                    this.props.value === el.value?
                    <a className="selected">{el.label}</a>:
                    <a onClick={()=>this.props.onChange(el.value)} >{el.label}</a>
                }</li>
            ))}
        </ul>
        </div>;
    }
}