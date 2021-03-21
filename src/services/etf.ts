import axios from 'axios';
const domain = ENV!=='extension'? '/proxy/money.finance.sina.com.cn' : 'http://money.finance.sina.com.cn';
console.log(ENV==='extension', domain);

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

export function shouldBuyIn(data:{day, close}[]){
    const result:{day:string; close:number; buyTimes: number}[] = [];
    const monthTable = [13, 8, 11, 13, 14, 11, 13, 12, 10, 15, 10, 13];  // 2021 边界日期
    let minPrice = data[0].close;
    let lastEle:{day, close} = null;
    let invested = false;
    let buyTimes = 0;
    for (let el of data) {
        const dateObj = new Date(el.day);
        if (!lastEle || dateObj.getMonth() !== new Date(lastEle.day).getMonth()) {
            // new month

            // initialize state
            minPrice = el.close;
            invested = false;
            buyTimes += 1;
        }
        else if (dateObj.getDate() < monthTable[dateObj.getMonth()]) {
            // less than 1/3 days
            minPrice = Math.min(el.close, minPrice);
        }
        else if(!invested){
            if (el.close < minPrice) {
                result.push({...el, buyTimes});
                invested = true;    
                buyTimes = 0;
            }
        }
        lastEle = el;
    }
    return result;
}