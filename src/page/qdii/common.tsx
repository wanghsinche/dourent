import { ColumnProps } from "antd/lib/table";
import * as React from 'react';
import { Tag } from "antd";
export function shouldBuy(score: Record<string, number>) {
  return score.score >0.8?1:score.score <0.3?-1:0;
}
export function Fund({id, title, onClick}:{id:string, title:string, onClick?:Function}){
  return <a data-href={`https://xueqiu.com/S/${id}/`} target="blank" onClick={()=>onClick && onClick()}>{title}</a>;
}

export const getColumn:(onClick: Function)=>ColumnProps<any>[] = (onClick: Function)=>[
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
    render: (r, rec)=><Fund title={r.fund_nm} id={rec.score.code} onClick={()=>onClick(rec)}/>
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
