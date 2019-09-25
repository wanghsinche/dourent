import * as React from "react"
import * as ReactDOM from "react-dom"

// import "../styles/popup.css"
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
    }
    render() {
        return (
            <div className="popup-padded">
                <button onClick={()=>this.sendMsg('init')}>init</button>
            </div>
        )
    }
}

// --------------

ReactDOM.render(
    <Hello />,
    document.getElementById('root')
)