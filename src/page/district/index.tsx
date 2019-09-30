import * as React from 'react';
import {IMetro, IStation} from '../../lib/city';
import * as style from './index.module.less';
type Props = {
    value: string[];
    onChange:(v:string[])=>void;
}

type State = {

}

export default class District extends React.Component<Props, State>{
    inputEle:HTMLInputElement;
    state = {
    }
    componentWillUnmount(){
        if(this.inputEle){
            this.inputEle = void 0;
        }
    }
    addTag=()=>{
        const s = this.inputEle&&this.inputEle.value;
        if (s){
            this.inputEle.value = '';
            this.props.onChange([...this.props.value, s]);
        }
        
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
            <label >区域:</label>
            <ul >
                {this.props.value.map(el=>
                    <li><a className="tag">&nbsp;{el}&nbsp;&nbsp;<i onClick={()=>this.removeTag(el)}>&nbsp;x&nbsp;</i></a></li>)}
                <input placeholder="可不填或者输入多个区域" onBlur={this.addTag} onKeyUp={e=>e.keyCode===13&&this.addTag()} ref={dom=>this.inputEle=dom}/>
            </ul>
        </div>;
    }
}