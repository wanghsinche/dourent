import * as jisilu from '../services/jisilu';
import {RPCReq, RPCRes, wrapRPCRes} from '../lib/rpc';

const router = {
    getQDII: jisilu.getQDII
};

export function listener(request:RPCReq, sender, sendResponse:(response: any) => void){
    console.log("Background got a rpc!", request);
    const func = router[request.rpc];

    if (!func) {
        sendResponse(wrapRPCRes(request.rpc, request.guid, Error("no such a rpc") ));
        return true;
    }

    Promise.race([
        func(request.params),
        new Promise((_, rej)=>{
            setTimeout(() => {
                rej("timeout");
            }, 3000);
        })
    ]).then(res=>{
        sendResponse(wrapRPCRes(request.rpc, request.guid, void 0, res));
    }).catch(err=>{
        // to do
        console.error(err);
        sendResponse(wrapRPCRes(request.rpc, request.guid, err));
    });

    return true; 
}