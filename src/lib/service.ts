import axios from 'axios';
import {getcode, IMetro} from './city';
import * as constant from './constant';
import {logError} from './log';

export async function getMetro(city:string):Promise<IMetro[]>{
    const url = 'https://map.baidu.com/?qt=bsi&c='+encodeURIComponent(getcode(city));
    const res = await axios.get(url);
    if (res.status === 200 && res.data.content){
        return res.data.content;
    }
    return [];
}

