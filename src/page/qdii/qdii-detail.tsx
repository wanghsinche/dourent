import * as React from 'react';
import { Modal } from 'antd';
import { Chart } from '@antv/g2';
import useQdiiDetail from "../../store/qdii-detail";
const { DataView } = require('@antv/data-set');

export const Detail = (p:  {code: string}) => {
  const boxContainer = React.createRef<HTMLDivElement>();
  const qdiiDetail = useQdiiDetail();
  const [show, setShow] = React.useState(false);
  React.useEffect(()=>{
    if (p.code) {
      qdiiDetail.setCode(p.code);
      qdiiDetail.getQDII(p.code);
      setShow(true);
    }
  }, [p.code])

  React.useEffect(()=>{
    if (!boxContainer.current) {
      return;
    }
    const data = [{ low: 1, q1: 9, median: 16, q3: 22, high: 24 }];
    const dv = new DataView().source(data);
    dv.transform({
      type: 'map',
      callback: (obj) => {
        obj.range = [obj.low, obj.q1, obj.median, obj.q3, obj.high];
        return obj;
      },
    });
    const chart = new Chart({
      container: boxContainer.current,
      autoFit: true,
      height: 500,
    });
    chart.data(dv.rows);
    chart.scale('range', {
      max: 35,
      nice: true,
    });
    chart.tooltip({
      showMarkers: false,
      showTitle: false
    });
    
    chart
      .schema()
      .position('range*1')
      .shape('box')
      .tooltip('x*low*q1*median*q3*high')
      .style({
        stroke: '#545454',
        fill: '#1890FF',
        fillOpacity: 0.3,
      })
      .animate({
        appear: {
          animation: 'scale-in-x',
        },
      });
    chart.render();
    return ()=>chart.destroy();
  }, [p.code]);

return <Modal visible={show} closable={true} closeIcon={<span style={{color:'#fff'}}>x</span>} footer={false} onCancel={()=>setShow(false)}>
  <div>{qdiiDetail.code} detail </div>
  <div ref={boxContainer}></div>
</Modal>;
}