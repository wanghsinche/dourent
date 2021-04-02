import * as React from 'react';
import { State as StoreState } from '../store/state';
import { IActionFunc, actions } from '../store/action';
import { connect } from 'react-redux';
import { Tag, Table, Timeline, Divider, Progress, Select, Descriptions } from 'antd';
import { Chart } from '@antv/g2';
import createQdiiModel from '../store/qdii';
import DescriptionsItem from 'antd/lib/descriptions/Item';
import Title from 'antd/lib/typography/Title';
import TimelineItem from 'antd/lib/timeline/TimelineItem';

type Props = Partial<StoreState> & IActionFunc;

function markShouldBuyIn(myChart: Chart, day: string, close: number, buyTimes: number, odd?: boolean) {
  const label = '买入' + (buyTimes > 1 ? ('x' + buyTimes) : '');
  myChart.annotation().dataMarker({
    top: true,
    direction: odd ? 'upward' : 'downward',
    position: [day, close],
    text: {
      content: label,
      style: { fill: '#fff' },
    },
    line: {
      length: 20,
    },
  });
}

function getTicks(scale) {
  const { values } = scale;
  const ticks = [];
  let lastDay: Date = null;
  values.forEach(day => {
    const current = new Date(day);
    if (lastDay && lastDay.getMonth() !== current.getMonth()) {
      ticks.push(day);
    }
    lastDay = current;
  });
  return ticks;
}


const Index: React.FC<Props> = p => {
  const model = createQdiiModel();
  const container = React.createRef<HTMLDivElement>();
  const chart = React.useRef<Chart>(null);
  const onChange = React.useCallback((e) => {
    p.set({ etfTarget: e });
    p.fetchETF({ code: e });
  }, []);

  React.useEffect(() => {
    model.getQDII();
  }, [])

  React.useEffect(() => {
    if (p.etfTarget) {
      p.fetchETF({ code: p.etfTarget });
    }
    const tmp = new Chart({
      container: container.current,
      autoFit: true,
      height: 250,
      padding: [30, 30, 30, 30]
    });

    tmp.axis('close', {
      position: 'left',
      grid: {
        line: {
          style: {
            stroke: '#D9D9D9',
            lineWidth: 1
          }
        }
      },
      line: {
        style: {
          stroke: '#D9D9D9',
          lineWidth: 1
        }
      }
    });

    tmp.axis('day', {
      grid: {
        line: {
          style: {
            stroke: '#D9D9D9'
          }
        }
      },
      line: {
        style: {
          stroke: '#D9D9D9'
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

  React.useEffect(() => {
    if (chart.current) {
      const maxLimit = Math.ceil(Math.max.apply(null, p.etf.map(el => el.close)) * 1.5)
      chart.current.annotation().clear(true);
      chart.current.data(p.etf);
      chart.current.scale({
        date: {
          minTickInterval: 30
        },
        close: {
          min: 0,
          max: maxLimit
        }
      });
      p.shouldBuyIn.forEach((el, idx) => {
        el && markShouldBuyIn(chart.current, el.day, el.close, el.buyTimes, idx % 2 === 0);
      })
      chart.current.render();
    }
  }, [p.etf]);


  const selectPanel = <div className="bottom-panel">
    定投标的：<Select value={p.etfTarget}
      defaultValue="sh513100"
      style={{ minWidth: 150 }}
      onChange={onChange}
      options={model.qdii && model.qdii.map(el => {
        const code = ((el.id as string).startsWith("1") ? 'sz' : 'sh') + el.id;
        return ({
          label: el.cell.fund_nm + `(${code})`, value: code
        })
      })} />
  </div>;

  return <div className="panel">
    {selectPanel}
    <Divider />
    <div ref={container} style={{ background: '#141414' }} />
    <Divider />
    <Timeline >
      <TimelineItem color="green" >
        相关文章：<a href="https://wiki.mbalib.com/wiki/Optimal_Stopping_Theory" target="blank">https://wiki.mbalib.com/wiki/Optimal_Stopping_Theory</a>
      </TimelineItem>
      <TimelineItem color="red">
        注意：受公共假期变动影响，该策略还需调试
      </TimelineItem>
    </Timeline>
  </div>;
}

function mapStoreToProps(s: StoreState): Partial<StoreState> {
  return s;
}

export default connect(mapStoreToProps, actions)(Index);

