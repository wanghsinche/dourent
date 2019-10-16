import * as React from 'react';
import { State as StoreState } from '../store/state';
import { IActionFunc, actions } from '../store/action';
import { connect } from 'react-redux';
import { IRecord } from '../lib/analyze';
import * as style from '../styles/result.module.less';
import * as memo from 'memorize-one';
import Loading from './loading';
import {dateFormat} from '../lib/utils';
type Props = Partial<StoreState> & IActionFunc;

class Result extends React.Component<Props>{
    
    getRes = memo((items:IRecord[], sort:'asc'|'desc')=>{
        if (sort === 'asc') {
            return items.sort((a, b)=>a.price-b.price);
        } 
        if (sort === 'desc') {
            return items.sort((a, b)=>b.price - a.price);
        }
        if (sort === 'none') {
            return items;
        }
    })

    loadMore=()=>{
        if (!this.props.loading){
            this.props.process();
        }
    }
    renderBtn=()=>this.props.more?<div className={"gallery-more "+style.loadMore} onClick={this.loadMore}>
            {this.props.loading?<a className="a_more" >加载中...</a>:<a className="a_more" >加载更多</a>}
        </div>:'';
    renderRes=(item:IRecord)=>
    <>
        <tr key={item.id}>
            <td className="title">
                <a href={item.href} title="" >{item.title}
            </a>
            </td>
            <td><a href={item.authorLink}>{item.author}</a></td>
            <td >{item.commentNum}</td>
            <td className="time">{item.lastCommentTime?dateFormat(item.lastCommentTime):''}</td>
        </tr>
        <tr key={item.id+'-more'}>
            <td >{item.tags&&item.tags.map(t=><a className="tag" href="">{t}</a>)}</td>
            <td style={{color: '#999'}}>价格: {item.price}</td>
        </tr>
    </>
    render() {
        return <>
            <table className="olt">
                <tbody><tr className="th">
                    <td>讨论</td><td>作者</td><td>回应</td><td align="right">最后回应</td>
                </tr>
                    {this.props.res.length>0?this.getRes(this.props.res, this.props.priceSort).map(el=>this.renderRes(el)):<tr />}
                </tbody>
            </table>
            {this.props.loading?<Loading />:this.props.res.length<0?'暂无结果':''}
            {this.props.res && this.props.res.length > 0? this.renderBtn():''}
        </>
    }
}


function mapStoreToProps(s: StoreState): Partial<StoreState> {
    return s;
}

export default connect(mapStoreToProps, actions)(Result);
