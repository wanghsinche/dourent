import FingerprintJS from '@fingerprintjs/fingerprintjs';
export const mixpanel = require('mixpanel-browser');
mixpanel.init("4139891504da7f844cac76469a07abe6");

async function getFingerprint() {
    const fp = await FingerprintJS.load();

    // The FingerprintJS agent is ready.
    // Get a visitor identifier when you'd like to.
    const result = await fp.get();
  
    // This is the visitor identifier:
    return result;
}

export const monitor = () => {    
    getFingerprint().then((user)=>{
        const {visitorId, components} = user;
        mixpanel.identify(visitorId);
        mixpanel.people.set({
            "USER_ID": visitorId,    // use human-readable names
            ...components
          });              
        console.log(visitorId, components);
    }).catch(err=>{
        console.error(err);
    })
}

