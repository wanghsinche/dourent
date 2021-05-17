import * as React from 'react';
import { Empty } from 'antd';
export default () => {
    const ii = <>
        更多策略开发中<br />
        在 <a href="https://xueqiu.com/u/9993929565" target="blank">雪球</a> 关注我
    </>;
    return <div>
        <Empty description={ii}></Empty>
        <h2>相关文档下载：</h2>
        <ul>
            <li><a href="/download/2021-may-covid-sg.xlsx" download="2021-may-covid-sg.xlsx">2021-MAY-SG-covid数据</a></li>
        </ul>
    </div>

}