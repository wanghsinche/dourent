import * as React from 'react';
import {State as StoreState} from '../store/state';
import {IActionFunc, actions} from '../store/action';
import { connect } from 'react-redux';
import * as style from '../styles/navarea.module.less';
import * as constant from '../lib/constant';
import { Tag, Table, Timeline, Divider, Progress, Select } from 'antd';
import { ColumnProps } from 'antd/lib/table';
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
  
  React.useEffect(()=>{
    const tmp = new Chart({
      container: container.current,
      autoFit: true,
      height: 250,
      padding: [10, 10, 30, 50]
    });

    tmp.scale({
      date: {
        minTickInterval: 90
      },    
      BTC: {
        min: 0,
        max: Math.max.apply(null, data.map(el=>el.BTC)) + 1000
      }
    });
    tmp.axis('BTC', {
      position: 'left',
      grid: null,
      line: {
        style: {
          width: 2,
          stroke: 'rgba(255, 255, 255, 0.85)'
        }
      }
    });
  
    tmp.line().position('date*BTC').color('#1890ff');
    tmp.removeInteraction('legend-filter'); // 自定义图例，移除默认的分类图例筛选交互

    tmp.annotation().dataMarker({
      top: true,
      position: [data[2].date, data[2].BTC+50],
      text: {
        content: '买入',
      },
      line: {
        length: 30,
      },
    });

    chart.current = tmp;

  }, []);

  React.useEffect(()=>{
    if(chart.current){
      chart.current.data(data);
      chart.current.render();
    } 
  }, [data]);




    return <div className="panel">
    <div ref={container}/>
    <Divider />
    <div className="bottom-panel">
      定投标的：<Select defaultValue="513100" options={[
        {label: '513100', value: '513100'}
      ]}/>
    </div>
  </div>;
}

function mapStoreToProps(s:StoreState):Partial<StoreState>{
    return s;
}

export default connect(mapStoreToProps, actions)(Index);

