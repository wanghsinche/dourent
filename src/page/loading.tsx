import * as React from 'react';
import * as img from '../styles/spinner.svg';
type State = {
    count:number
}
export default class Loading extends React.Component<{}, State>{
    timer:any;
    state = {
        count: 0
    }
    componentDidMount(){
        this.startCount();
    }
    componentWillUnmount(){
        if(this.timer){
            clearTimeout(this.timer)
        }
    }
    startCount=()=>{
        const self = this;
        this.setState({count:0});
        this.timer = setTimeout(function ii(){
            self.setState({count:self.state.count+1});
            self.timer = setTimeout(ii, 500*Math.random()+200);
        }, 500*Math.random()+200);
    }
    render(){
        const url = chrome.runtime.getURL('js/'+img);
        return <div style={{textAlign:'center'}}>
            <span style={{display:'block', background: `url(${url}) center center no-repeat`,backgroundSize:'100% auto', width: 50, height: 50, margin:'0 auto'}}></span>
            <span>已处理{this.state.count}个条目</span>
        </div>    
    }
}