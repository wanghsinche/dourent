import * as React from 'react';
import {State as StoreState} from '../store/state';
import {IActionFunc, actions} from '../store/action';
import { connect } from 'react-redux';
import { Tag, Table, Timeline, Divider, Progress, Select } from 'antd';
import { Chart } from '@antv/g2';
const data = [
  {
    "date": "2020-01-01",
    "BTC": 7182
  },
  {
    "date": "2020-02-13",
    "BTC": 10522
  },
  {
    "date": "2020-03-12",
    "BTC": 4829
  },
  {
    "date": "2020-06-01",
    "BTC": 10400
  },
  {
    "date": "2020-10-05",
    "BTC": 10529
  },
  {
    "date": "2020-12-19",
    "BTC": 23150
  },
];

type Props = Partial<StoreState> & IActionFunc;

const Index:React.FC<Props> = p => {
  const container = React.createRef<HTMLDivElement>();
  const chart = React.useRef<Chart>(null);
  const onChange = React.useCallback((e)=>{
    p.set({etfTarget: e});
    p.fetchETF({code: e});
  }, []);

  React.useEffect(()=>{
    p.fetchETF({code: p.etfTarget});
    const tmp = new Chart({
      container: container.current,
      autoFit: true,
      height: 250,
      padding: [10, 10, 30, 50]
    });

    tmp.axis('close', {
      position: 'left',
      grid: null,
      line: {
        style: {
          width: 2,
          stroke: 'rgba(255, 255, 255, 0.85)'
        }
      }
    });
  
    tmp.line().position('day*close').color('#1890ff');
    tmp.removeInteraction('legend-filter'); // 自定义图例，移除默认的分类图例筛选交互

    chart.current = tmp;

  }, []);

  React.useEffect(()=>{
    if(chart.current){
      chart.current.annotation().clear();
      chart.current.data(p.etf);
      chart.current.scale({
        date: {
          minTickInterval: 30
        },    
        close: {
          min: 0,
          max: Math.max.apply(null, p.etf.map(el=>el.close)) * 1.2
        }
      });
  
      if (p.etf[50]){
        chart.current.annotation().dataMarker({
          top: true,
          position: [p.etf[50].day, p.etf[50].close],
          text: {
            content: '买入',
          },
          line: {
            length:  20,
          },
        });
      }
      chart.current.render();
    } 
  }, [p.etf]);




    return <div className="panel">
    <div ref={container}/>
    <Divider />
    <div className="bottom-panel">
      定投标的：<Select value={p.etfTarget}
      onChange={onChange}
      options={[
        {label: 'sh513100', value: 'sh513100'},
        {label: 'sh513500', value: 'sh513500'}
      ]}/>
    </div>
  </div>;
}

function mapStoreToProps(s:StoreState):Partial<StoreState>{
    return s;
}

export default connect(mapStoreToProps, actions)(Index);

