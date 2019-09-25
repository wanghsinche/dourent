import * as db from '../lib/database';
import {logError} from '../lib/log';
import 'antd/dist/antd.css';

chrome.runtime.sendMessage({}, (response) => {
    var checkReady = setInterval(() => {
        if (document.readyState === "complete") {
            clearInterval(checkReady)
            console.log("We're in the injected content script!")
        }
    })
});

chrome.runtime.onMessage.addListener(async (msg)=>{
    console.log('get message ', msg);
    if (msg.action === 'init'){
        try {
            await init();
        } catch (error) {
            logError(error);
        }    
    }
})

async function init(){
    const id = await db.init();
    if (!id) {
        return;
    }
    const data = await db.getRecord(id);
    console.log('data is ', data);
    const newId = await db.updateRecord([{
        id:'153167379', tags:[], price: NaN, timestamp: Date.now(), loc: [0, 0], title: 'test'
    }], id);
    if (!newId) {
        return;
    }
    const newData = await db.getRecord(id);
    console.log(newData);
}