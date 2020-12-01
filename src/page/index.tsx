import * as React from 'react';
import { Tabs } from 'antd';
import QDII from './qdii';

// type Props = Partial<StoreState> & IActionFunc;

const TabPane = Tabs.TabPane;

export default class Index extends React.Component<{}>{

    render(){
        return   <Tabs defaultActiveKey="qdii" >
        <TabPane tab="qdii" key="qdii">
            <QDII />
        </TabPane>
        <TabPane tab="other" key="other">
          Content of Tab Pane 2
        </TabPane>
      </Tabs>;    
    }
}

// function mapStoreToProps(s:StoreState):Partial<StoreState>{
//     return s;
// }

// export default connect(mapStoreToProps, actions)(Index);