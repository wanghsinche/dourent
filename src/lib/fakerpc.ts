import {wrapRPCReq, RPCRes} from './rpc';
import {listener} from './service';
export function fakerpc(name:string, payload:any){
    return new Promise((res, rej)=>{
        listener(wrapRPCReq(name, payload), void 0,  (msg:RPCRes)=>{
            if (msg.error){
                rej(msg.error);
            } else{
                res(msg.res);
            }
            return true;
        })
    });
}