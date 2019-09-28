import axios from 'axios';
import {getcode, IMetro} from './city';
import * as constant from './constant';
import {logError} from './log';

export async function getMetro(city:string):Promise<IMetro[]>{
    const url = 'https://map.baidu.com/?qt=bsi&c='+encodeURIComponent(getcode(city));
    const res = await axios.get(url);
    if (res.status === 200 && res.data.content){
        const lines = (res.data.content as IMetro[]).map(el=>{
            const line_name = el.line_name.replace(/\([^\(]+\)/,'').replace('(','').replace('地铁','');
            return {...el, line_name};
        });
        const myMap:Map<string, IMetro> = new Map();
        lines.forEach(ln=>{
            myMap.set(ln.line_name, ln);
        });
        return Array.from(myMap.values()).sort((a, b)=>parseInt(a.line_name,10)-parseInt(b.line_name,10));
    }
    return [];
}

