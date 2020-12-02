import * as React from 'react';
import {State as StoreState} from '../store/state';
import {IActionFunc, actions} from '../store/action';
import { connect } from 'react-redux';
import * as style from '../styles/navarea.module.less';
import * as constant from '../lib/constant';
import { Tag, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';

type Props = Partial<StoreState> & IActionFunc;

function shouldBuy(code: string) {
  if (code.includes('51')) return 1;
  if (code.includes('8')) return 0;
  return -1;
}

const Index:React.FC<Props> = p => {
  React.useEffect(()=>{
    p.fetchQDII();
  }, []);
  const column:ColumnProps<any>[] = [
    {
      dataIndex: 'id',
      title: '代码',
      width: 120,
      fixed: 'left',
      render: v => {
        const res = shouldBuy(v);
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
      render: (r)=>r.fund_nm
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
  return <div style={{width: 600}}>
    <Table dataSource={p.qdii} columns={column} pagination={false} rowKey="id" scroll={{ x: 80 * column.length + 1, y: 300 }} />
  </div>;
}

function mapStoreToProps(s:StoreState):Partial<StoreState>{
    return s;
}

export default connect(mapStoreToProps, actions)(Index);