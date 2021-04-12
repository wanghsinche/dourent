import axios from 'axios';

export async function getQDIIHis({code}:{code:string}){
    // const url = "https://raw.githubusercontent.com/wanghsinche/dourent/master/serverless/static/qdii.json?ts="+Date.now();
    const url = "https://cdn.jsdelivr.net/gh/wanghsinche/dourent@master/serverless/static/";

    const res = await axios.get(`${url}${code}-data.json?ts=${new Date().getDate()}`);
    if (res.status === 200 && res.data){
        return res.data;
    }
    return {};
}