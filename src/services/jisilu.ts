import axios from 'axios';
const domain = ENV!=='extension'? '/proxy/jisilu' : 'https://www.jisilu.cn';
console.log(ENV==='extension', domain);
export async function getQDII():Promise<any[]>{
    const url = domain + '/data/qdii/qdii_list/E';
    const res = await axios.get(url);
    if (res.status === 200 && res.data.rows){
        return res.data.rows;
    }
    return [];
}

export async function getScrore(){
    // const url = "https://raw.githubusercontent.com/wanghsinche/dourent/master/serverless/static/qdii.json?ts="+Date.now();
    const url = "https://cdn.jsdelivr.net/gh/wanghsinche/dourent@master/serverless/static/qdii.json?ts="+Date.now();
    const res = await axios.get(url);
    if (res.status === 200 && res.data){
        return res.data;
    }
    return {};
}

export interface IRecord {
    cell:{
        amount: number;
        amount_incr: string;
        amount_incr_tips: string;
        amount_increase_rt: string;
        apply_fee: string;
        apply_fee_tips: string; // "M＜100万	1.20% 100万≤M＜200万	0.80% ↵200万≤M＜500万	0.50% ↵M≥500万	按笔收取，1000.00元/笔"
        apply_redeem_status: string; //"暂停大额申购 限额500元/开放赎回"
        apply_status: string; // "暂停大额申购 限额500元"
        asset_ratio: string; //"95.000"
        cal_index_id: string; //"SPSIBI.SPI"
        cal_tips: string; //"指数从 2021-03-31 10705.34  到 2021-04-01 10810.60；汇率美元对人民币中间价从 2021-03-31 6.57130  到 2021-04-01 6.55840"
        discount_rt: string; //"0.29%"
        discount_rt2: string; //"-"
        est_val_dt: string;// "2021-04-01"
        est_val_dt2: string;//"-"
        est_val_dt_s: string; //"21-04-01"
        est_val_increase_rt: string; //"0.74%"
        est_val_increase_rt2: string; //"-"
        est_val_tm2: string; //"-"
        estimate_value: string; //"1.8516"
        estimate_value2: string; //"-"
        fund_id: string; //"161127"
        fund_id_color: string; //"161127"
        fund_nav: string; ///"1.8514"
        fund_nm: string; //"标普生物"
        fund_nm_color: string; //"标普生物"
        holded: number;
        increase_rt: string; //"0.32%"
        index_id: string; //"Y"
        index_nm: string; //"标普生物科技精选行业指数"
        issuer_nm: string; //"易方达"
        last_est_datetime: string; //"2021-04-02 15:00:03"
        last_est_dt: string; //"2021-04-02"
        last_est_time: string; //"15:00:03"
        last_time: string; //"15:00:03"
        lof_type: string; //"QDII"
        min_amt: number;
        money_cd: string; //"USD"
        nav_dt: string; ///"2021-04-01"
        nav_dt_s: string; //"21-04-01"
        notes: string;//""
        owned: number;
        price: string; //"1.857"
        price_dt: string; //"2021-04-02"
        qtype: string; //"E"
        redeem_fee: string; //"1.50%"
        redeem_fee_tips: string; //"0-6日	1.50%↵7日及以上	0.50%"
        redeem_status: string; //"开放赎回"
        ref_increase_rt: string; //"0.98%"
        ref_increase_rt2: string; //"-"
        ref_price: string; //"10810.60"
        ref_price2: string;//"-"
        stock_volume: string; //"24.0581"
        turnover_rt: string; //"1.88%"
        urls: string; //"http://www.efunds.com.cn/html/fund/161127_fundinfo.htm"
        volume: string; //"44.65"
    }
    id: string;//"161127"
    score:{    
        code: string; //"sz161127"
        larger: number
        max: number
        min: number
        score: number
        smaller: number
    }
}