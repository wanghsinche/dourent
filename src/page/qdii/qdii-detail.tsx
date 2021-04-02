import * as React from 'react';
import { Modal } from 'antd';
import { Chart } from '@antv/g2';
import useQdiiDetail from "../../store/qdii-detail";
const { DataView } = require('@antv/data-set');

export const Detail = (p:  {code: string, premium: number}) => {
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
    if (!boxContainer.current || !qdiiDetail.boxValues) {
      return;
    }
    const data = [qdiiDetail.boxValues];
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
      width: 200,
      height: 150,
    });
    chart.data(dv.rows);
    chart.scale('range', {
      max: qdiiDetail.boxValues.high * 1.2,
      nice: true,
    });
    // chart.tooltip({
    //   showMarkers: false,
    //   showTitle: false
    // });
    chart.tooltip(false);
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
      chart.annotation().line({
        start: [p.premium,0],
        end: [p.premium,1],
        style: {
          stroke: '#177ddc',
          lineWidth: 1,
          lineDash: [3, 3],
        },
        text: {
          content: (p.premium).toFixed(4),
        },
      });
    chart.render();
    return ()=>chart.destroy();
  }, [qdiiDetail.boxValues]);

return <Modal visible={show} closable={true} closeIcon={<span style={{color:'#fff'}}>x</span>} footer={false} onCancel={()=>setShow(false)}>
  <div>{qdiiDetail.code}  </div>
  <div ref={boxContainer} ></div>
</Modal>;
}