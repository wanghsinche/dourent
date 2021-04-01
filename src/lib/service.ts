import * as jisilu from '../services/jisilu';
import * as etf from '../services/etf';
import * as github from '../services/github';
import {RPCReq, RPCRes, wrapRPCRes} from '../lib/rpc';

export const router = {
    getQDIIHis: github.getQDIIHis,
    getQDII: jisilu.getQDII,
    getQDIIScore: jisilu.getScrore,
    getETF: etf.getETF,
    shouldBuyIn: etf.shouldBuyIn,
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
            }, 10000);
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