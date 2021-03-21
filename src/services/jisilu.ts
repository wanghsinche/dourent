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
    const url = "https://raw.githubusercontent.com/wanghsinche/dourent/master/serverless/static/qdii.json?ts="+Date.now();
    // const url = "https://cdn.jsdelivr.net/gh/wanghsinche/dourent@master/serverless/static/qdii.json";
    const res = await axios.get(url);
    if (res.status === 200 && res.data){
        return res.data;
    }
    return {};
}