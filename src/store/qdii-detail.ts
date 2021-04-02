import { useState } from "react";
import { createModel } from "hox";
import {fakerpc} from '../lib/fakerpc';
import {rpc as truerpc} from '../lib/rpc';
import { quantile } from '../lib/calc';
const rpc = ENV!=='extension' ? fakerpc : truerpc;

function calcBox(arr: number[]){
  const q3 = quantile(arr, .75);
  const q1 = quantile(arr, .25);
  const IQR = q3 - q1
  const median = quantile(arr, .5);
  const high = q3 + 1.5 * IQR
  const low = q1 - 1.5 * IQR
  return { low: Math.fround(low), q1:Math.fround(q1), median:Math.fround(median), q3:Math.fround(q3), high:Math.fround(high) };
}

function model() {
  const [code, setCode] = useState('');
  const [records, setRecords] = useState([]);
  const [boxValues, setBoxValues] = useState<{ low:number, q1:number, median:number, q3:number, high:number }>(null)

  const getQDII = (code: string)=> {
    rpc('getQDIIHis', {code: code.substr(2), type: '3yrs'}).then((res:any)=>{
      setRecords(res);
      setBoxValues(calcBox(res.map((el)=>el.premium as number)))
    });
  };

  return {
    boxValues,
    code,
    records,
    setCode,
    getQDII
  };
}

export default createModel(model);
