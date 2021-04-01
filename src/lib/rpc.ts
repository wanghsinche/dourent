import {router} from './service';

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

export interface RPCReq{
    rpc:string;
    guid:string;
    params: Record<string, any>;
}
export interface RPCRes{
    rpc:string;
    guid:string;
    res: any;
    error?: any;
}
export function wrapRPCRes(rpc:string, guid:string, error:Error|undefined, res?:any){
    return {
        rpc, guid, res, error
    }
}
export function wrapRPCReq(rpc:string, params:any){
    return {
        rpc, guid:uuidv4(), params
    }
}

export function rpc(name:keyof typeof router, payload:any){
    return new Promise((res, rej)=>{
        chrome.runtime.sendMessage(wrapRPCReq(name, payload), (msg:RPCRes)=>{
            if (msg.error){
                rej(msg.error);
            } else{
                res(msg.res);
            }
            return true;
        });
    });
}
