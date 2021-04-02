import { useState } from "react";
import { createModel } from "hox";
import {fakerpc} from '../lib/fakerpc';
import {rpc as truerpc} from '../lib/rpc';
import { quantile } from '../lib/calc';
const rpc = ENV!=='extension' ? fakerpc : truerpc;

function model() {
    const [qdii, setQDII] = useState<any[]>([]);
    const getQDII = ()=>{
        if (qdii.length > 0) {
            return;
        } 
        rpc('getQDII', null).then((res:any[])=>setQDII(res));
    }
    return {
        qdii,
        getQDII
      };
    }

export default createModel(model);