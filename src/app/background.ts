import * as service from '../lib/service';
import {RPCReq, RPCRes, wrapRPCRes} from '../lib/rpc';

chrome.runtime.onMessage.addListener(function(request:RPCReq, sender, sendResponse){
    console.log("Background got a rpc!", request);
    if (request.rpc == "getMetro") {
            service.getMetro(request.params.city).then(metro=>{
                sendResponse(wrapRPCRes(request.rpc, request.guid, void 0, metro));
            }).catch(err=>{
                sendResponse(wrapRPCRes(request.rpc, request.guid, err, ));
            })

            return true;
        }    


      sendResponse({});
      return true; 
})