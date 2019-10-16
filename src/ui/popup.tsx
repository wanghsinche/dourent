import * as React from "react"
import * as ReactDOM from "react-dom"

import "../styles/popup.css"
type IAction = 'init';
class Hello extends React.Component {
    sendMsg=(action:IAction)=>{
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs){
            const tb = tabs[0];
            if (tb.url.includes('douban')){
                chrome.tabs.sendMessage(tb.id, {action});
                console.log('sent from popup');
            }
        });
        chrome.tabs.create({url:'https://github.com/wanghsinche/dourent'})
    }
    render() {
        return (
            <div className="popup-padded">
                <h3>
                    豆瓣rent™ 
                </h3>
                <h4>
                    豆瓣租房小组插件：让大家更快找到心水的房子
                </h4>
                <button onClick={()=>this.sendMsg('init')}>About me</button>
            </div>
        )
    }
}

// --------------

ReactDOM.render(
    <Hello />,
    document.getElementById('root')
)