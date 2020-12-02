import {message} from 'antd';
export function logError(e:Error){
    console.log('dourent', e);
    message.error({text: '出现错误，请按F12打开控制台查看', type:'error'});
}