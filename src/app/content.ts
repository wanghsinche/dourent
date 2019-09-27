import {logError} from '../lib/log';

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
            const pkg = await import('../page/init');
            await pkg.init();
        } catch (error) {
            logError(error);
        }    
    }
})
