import * as React from 'react';
import {State as StoreState} from '../store/state';
import {IActionFunc, actions} from '../store/action';
import { connect } from 'react-redux';
import { Tag, Table, Timeline, Divider, Progress, Select } from 'antd';
import { Chart } from '@antv/g2';


type Props = Partial<StoreState> & IActionFunc;

function markShouldBuyIn(myChart: Chart, day: string, close: number, buyTimes: number){
  const label = '买入'; //+ (buyTimes > 1?( 'X' + buyTimes) : '');
  myChart.annotation().dataMarker({
    top: true,
    position: [day, close],
    text: {
      content: label,
      style: {fill: 'green'}
    },
    line: {
      length:  20,
    },
  });
}

function getTicks(scale) {
  const { values } = scale;
  const ticks = [];
  let lastDay:Date = null;
  values.forEach(day => {
    const current = new Date(day);
    if (lastDay && lastDay.getMonth() !== current.getMonth()){
      ticks.push(day);
    }
    lastDay = current;
  });
  return ticks;
}


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

    tmp.axis('day', {
      grid: {
        line: {
          type: 'line'
        }
      }
    });
  
    tmp.scale('day', {
      tickMethod: getTicks
    });

    tmp.line().position('day*close').color('#1890ff');
    tmp.removeInteraction('legend-filter'); // 自定义图例，移除默认的分类图例筛选交互

    chart.current = tmp;

  }, []);

  React.useEffect(()=>{
    if(chart.current){
      chart.current.annotation().clear(true);
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
      p.shouldBuyIn.forEach(el=>{
        el && markShouldBuyIn(chart.current, el.day, el.close, el.buyTimes);
      })
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
        {label: 'sz159928', value: 'sz159928'},
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

