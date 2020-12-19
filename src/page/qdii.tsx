import * as React from 'react';
import {State as StoreState} from '../store/state';
import {IActionFunc, actions} from '../store/action';
import { connect } from 'react-redux';
import * as style from '../styles/navarea.module.less';
import * as constant from '../lib/constant';
import { Tag, Table, Timeline, Divider, Progress } from 'antd';
import { ColumnProps } from 'antd/lib/table';

type Props = Partial<StoreState> & IActionFunc;

function shouldBuy(score: Record<string, number>) {
  return score.score >0.8?1:score.score <0.3?-1:0;
}

function Fund({id, title}:{id:string, title:string}){
  return <a href={`https://xueqiu.com/S/${id}/`} target="blank">{title}</a>;
}

function ValueBar({max, min, curr}:{max:number, min:number, curr:number}){
  // return     <Progress percent={50} steps={3} />
return <span>{min}%<Progress percent={(curr-min)/(max-min)*100} showInfo={false} style={{width: 100, margin:"0 10px"}}/>{max}%</span>;
}

const Index:React.FC<Props> = p => {
  React.useEffect(()=>{
    p.fetchQDII();
  }, []);
  const column:ColumnProps<any>[] = [
    {
      dataIndex: 'id',
      title: '代码',
      width: 100,
      fixed: 'left',
      render: (v, r) => {
        const res = shouldBuy(r.score);
        if (res === 1) return <>{v} <Tag color="green">B</Tag></>;
        if (res === -1) return <>{v} <Tag color="red">❕</Tag></>;
        return v;
      }
    },
    {
      dataIndex: 'cell',
      key: 'fund_nm',
      title: '名称',
      width: 80,
      render: (r, rec)=><Fund title={r.fund_nm} id={rec.score.code} />
    },
    {
      dataIndex: 'cell',
      key: 'price',
      title: '现价',
      width: 60,
      render: (r)=>r.price
    },
    {
      dataIndex: 'cell',
      key: 'increase_rt',
      title: '涨幅',
      width: 60,
      render: (r)=>r.increase_rt
    },
    {
      dataIndex: 'cell',
      key: 'volume',
      title: '交易量',
      width: 80,
      render: (r)=>r.volume
    },
    {
      dataIndex: 'cell',
      key: 'fund_nav',
      title: '净值',
      width: 60,
      render: (r)=>r.fund_nav
    },
    {
      dataIndex: 'cell',
      key: 'nav_dt',
      title: '净值日期',
      render: (r)=>r.nav_dt
    },
    {
      dataIndex: 'cell',
      key: 'estimate_value',
      title: '估值',
      width: 60,
      render: (r)=>r.estimate_value
    },
    {
      dataIndex: 'cell',
      key: 'est_val_dt',
      title: '估值日期',
      render: (r)=>r.est_val_dt
    },
    {
      dataIndex: 'cell',
      key: 'discount_rt',
      title: '估算溢价',
      width: 80,
      fixed: 'right',
      render: (r)=>r.discount_rt
    },
  ];

  const shouldBuyList = p.qdii.filter(el=>shouldBuy(el.score) > 0).sort((a,b)=>b.score.score - a.score.score);
  const shouldSellList = p.qdii.filter(el=>shouldBuy(el.score) < 0);


  const line =   <Timeline style={{maxHeight: 200, overflow: "scroll"}}>
    {shouldSellList.map(el=>{
        return(
        <Timeline.Item color="red" key={el.id}>
          <p>注意 {el.id} <Fund id={el.score.code} title={el.cell.fund_nm} /></p>
          <p>{el.id} 当前溢价处于历史高位， 高于 {(el.score.smaller*100).toFixed(2)}% 的时期:           <ValueBar max={el.score.max/100} min={el.score.min/100} curr={parseFloat(el.cell.discount_rt)}/></p>
          <p>成交量为 {el.cell.volume} 千万元，涨幅 {el.cell.increase_rt}</p>
        </Timeline.Item>
        );
    })}
    {shouldBuyList.map(el=>{
        return(
        <Timeline.Item color="green" key={el.id}>
          <p>推荐买入 {el.id} <Fund id={el.score.code} title={el.cell.fund_nm} /></p>
          <p>{el.id} 当前溢价处于历史低位， 低于 {(el.score.larger*100).toFixed(2)}% 的时期:           <ValueBar max={el.score.max/100} min={el.score.min/100} curr={parseFloat(el.cell.discount_rt)}/></p>
          <p>成交量为 {el.cell.volume} 千万元，涨幅 {el.cell.increase_rt}</p>
        </Timeline.Item>
        );
    })}
</Timeline>

  return <div className="panel">
    <Table dataSource={p.qdii} columns={column} pagination={false} rowKey="id" scroll={{ x: 80 * column.length + 1, y: 200 }} />
    <Divider />
    <div  className="bottom-panel">
    {line}
    </div>
  </div>;
}

function mapStoreToProps(s:StoreState):Partial<StoreState>{
    return s;
}

export default connect(mapStoreToProps, actions)(Index);