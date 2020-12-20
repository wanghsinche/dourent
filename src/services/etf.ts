import axios from 'axios';
const domain = ENV==='dev'? '/money.finance.sina.com.cn' : 'http://money.finance.sina.com.cn';
console.log(ENV==='dev', domain);

export async function getETF({code, type='1yrs'}:{code:string, type:'1yrs'|'5yrs'|'3yrs'}){
    const datalen = Math.max(Math.min(parseInt(type, 10) * 250, 10* 250), 250);
    console.log("get", code);
    const etfraw = await axios.get(`${domain}/quotes_service/api/json_v2.php/CN_MarketData.getKLineData?scale=240&ma=no&datalen=${datalen}&symbol=${code}`)
    
    const etf = eval(etfraw.data).map((el:any)=>{
        const {day, ...others} = el;
        const otherV = Object.keys(others).reduce((am, cu)=>{
            am[cu] = Number(others[cu]);
            return am;
        }, {});
        return ({
            day, ...otherV
        });
    });
    return etf;
}

