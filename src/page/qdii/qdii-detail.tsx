import * as React from 'react';
import { Modal } from 'antd';
import { Chart } from '@antv/g2';
import useQdiiDetail from "../../store/qdii-detail";

export const Detail = (p:  {code: string}) => {
  const qdiiDetail = useQdiiDetail();
  const [show, setShow] = React.useState(false);
  React.useEffect(()=>{
    if (p.code) {
      qdiiDetail.setCode(p.code);
      qdiiDetail.getQDII(p.code);
      setShow(true);
    }
  }, [p.code])
console.log(qdiiDetail.records);
return <Modal visible={show} closable={true} closeIcon={<span style={{color:'#fff'}}>x</span>} footer={false} onCancel={()=>setShow(false)}>
  <div>{qdiiDetail.code} detail </div>
</Modal>;
}