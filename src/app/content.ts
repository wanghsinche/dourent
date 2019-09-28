import {logError} from '../lib/log';
import {main} from './app';
chrome.runtime.sendMessage({}, (response) => {
    var checkReady = setInterval(() => {
        if (document.readyState === "complete") {
            clearInterval(checkReady)
            console.log("We're in the injected content script!")
        }
    })
});

if (document.title.includes('租房')&&location.href.includes('douban.com/group')) {
    main();
}