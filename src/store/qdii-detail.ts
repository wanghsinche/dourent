import { useState } from "react";
import { createModel } from "hox";
import {fakerpc} from '../lib/fakerpc';
import {rpc as truerpc} from '../lib/rpc';
const rpc = ENV!=='extension' ? fakerpc : truerpc;

function model() {
  const [code, setCode] = useState('');
  const [records, setRecords] = useState([]);

  const getQDII = (code: string)=> {
    rpc('getQDIIHis', {code, type: '3yrs'}).then((res:any)=>{
      setRecords(res);
    });
  };

  return {
    code,
    records,
    setCode,
    getQDII
  };
}

export default createModel(model);
