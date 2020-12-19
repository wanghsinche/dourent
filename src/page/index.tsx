import * as React from 'react';
import { Tabs } from 'antd';
import QDII from './qdii';
import AUTO from './auto';

// type Props = Partial<StoreState> & IActionFunc;

const TabPane = Tabs.TabPane;

export default class Index extends React.Component<{}>{
    getTitle=(v:string)=><span style={{padding: '0 10px'}}>
      {v}
    </span>
    render(){
        return   <Tabs defaultActiveKey="qdii">
        <TabPane tab={this.getTitle('QDII溢价策略')} key="qdii">
            <QDII />
        </TabPane>
        <TabPane tab={this.getTitle('低价择时定投')} key="auto">
            <AUTO />
        </TabPane>
        <TabPane tab={this.getTitle('other')} key="other">
          Content of Tab Pane 2
        </TabPane>
      </Tabs>;    
    }
}

// function mapStoreToProps(s:StoreState):Partial<StoreState>{
//     return s;
// }

// export default connect(mapStoreToProps, actions)(Index);