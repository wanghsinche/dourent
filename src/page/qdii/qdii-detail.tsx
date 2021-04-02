import * as React from 'react';
import { Col, Divider, Modal, Row } from 'antd';
import { Chart } from '@antv/g2';
import useQdiiDetail from "../../store/qdii-detail";
const { DataView } = require('@antv/data-set');
import { IRecord } from '../../services/jisilu';
export const Detail = ({record}: {record:IRecord}) => {
  const boxContainer = React.createRef<HTMLDivElement>();
  const qdiiDetail = useQdiiDetail();
  const [show, setShow] = React.useState(false);
  const premium =  record?(parseFloat(record.cell.discount_rt)/100).toFixed(4):0;
  const name = record && record.cell.fund_nm;
  const code = record && record.score.code;
  React.useEffect(()=>{
    if (code) {
      qdiiDetail.setCode(code);
      qdiiDetail.getQDII(code);
      setShow(true);
    }
  }, [code])

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
        start: [premium,0],
        end: [premium,1],
        style: {
          stroke: '#177ddc',
          lineWidth: 1,
          lineDash: [3, 3],
        },
        text: {
          content: '',
        },
      });
    chart.render();
    return ()=>chart.destroy();
  }, [qdiiDetail.boxValues]);

return <Modal visible={show} closable={true} closeIcon={<span style={{color:'#fff'}}>x</span>} footer={false} onCancel={()=>setShow(false)}>
  <div>{name} {code} </div>
  <Divider />
  <Row>
    <Col span="10">
    溢价箱型图
    <div ref={boxContainer} ></div>
    </Col>
    <Col span="10" offset="2">
      <p>基金公司：{record && record.cell.issuer_nm}</p>
      <p>当前溢价： {record && record.cell.discount_rt}</p>
      <p>对标指数：{record && record.cell.index_nm}</p>
      <p>详情： <a href={record && record.cell.urls} target="blank">{record && record.cell.urls}</a></p>
    </Col>
  </Row>
</Modal>;
}