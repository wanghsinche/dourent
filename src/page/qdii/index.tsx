import * as React from 'react';
import {State as StoreState} from '../../store/state';
import {IActionFunc, actions} from '../../store/action';
import { connect } from 'react-redux';
import { Table, Timeline, Divider, Progress } from 'antd';
import { Detail } from './qdii-detail';
import { getColumn, shouldBuy, Fund } from './common';

type Props = Partial<StoreState> & IActionFunc;



function ValueBar({max, min, curr}:{max:number, min:number, curr:number}){
  // return     <Progress percent={50} steps={3} />
return <span>{min}%<Progress percent={(curr-min)/(max-min)*100} showInfo={false} style={{width: 100, margin:"0 10px"}}/>{max}%</span>;
}

const Index:React.FC<Props> = p => {
  React.useEffect(()=>{
    p.fetchQDII();
  }, []);

  const [current, setCurrent] = React.useState<any>(null);

  const shouldBuyList = p.qdii.filter(el=>shouldBuy(el.score) > 0).sort((a,b)=>b.score.score - a.score.score);
  const shouldSellList = p.qdii.filter(el=>shouldBuy(el.score) < 0);

  const line =   <Timeline style={{maxHeight: 200, overflow: "scroll"}}>
    {shouldSellList.map(el=>{
        return(
        <Timeline.Item color="red" key={el.id}>
          <div>注意 {el.id} <Fund id={el.score.code} title={el.cell.fund_nm} /></div>
          <div>{el.id} 当前溢价处于历史高位， 高于 {(el.score.smaller*100).toFixed(2)}% 的时期:           <ValueBar max={el.score.max/100} min={el.score.min/100} curr={parseFloat(el.cell.discount_rt)}/></div>
          <div>成交量为 {el.cell.volume} 千万元，涨幅 {el.cell.increase_rt}</div>
        </Timeline.Item>
        );
    })}
    {shouldBuyList.map(el=>{
        return(
        <Timeline.Item color="green" key={el.id}>
          <div>推荐买入 {el.id} <Fund id={el.score.code} title={el.cell.fund_nm} /></div>
          <div>{el.id} 当前溢价处于历史低位， 低于 {(el.score.larger*100).toFixed(2)}% 的时期:           <ValueBar max={el.score.max/100} min={el.score.min/100} curr={parseFloat(el.cell.discount_rt)}/></div>
          <div>成交量为 {el.cell.volume} 千万元，涨幅 {el.cell.increase_rt}</div>
        </Timeline.Item>
        );
    })}
</Timeline>
  const column = React.useMemo(()=>getColumn(setCurrent), []);
  return <div className="panel">
    <Table dataSource={p.qdii} columns={column} pagination={false} rowKey="id" scroll={{ x: 80 * column.length + 1, y: 400 }} 
    onRow={(record) => {
      return {
        onClick: () => {setCurrent(record)}, // click row
      };
    }}
    />
    <Divider />
    <div  className="bottom-panel">
    {line}
    </div>
    <Detail record={current}/>
  </div>;
}

function mapStoreToProps(s:StoreState):Partial<StoreState>{
    return s;
}

export default connect(mapStoreToProps, actions)(Index);