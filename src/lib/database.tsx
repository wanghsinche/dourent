import axios from 'axios';
import * as React from 'react';
import * as cookie from 'js-cookie';
import * as constant from './constant';
import {logError} from './log';
import {Modal, Input} from 'antd';
/**
 * captcha-id: pr3TnRPoUFyOkt5CBysl4Bto:en
 * captcha-solution: drawer
 */

/**
 * captcha_id: "4Nzcxug21Lp2kZrRO0rXKOKj:en"
 * captcha_img: "https://www.douban.com/misc/captcha?id=4Nzcxug21Lp2kZrRO0rXKOKj:en&size=s"
 * error: "请输入正确的验证码"
 */

function getCaptcha(data:any){
    let inputEle:HTMLInputElement;
    return new Promise<string>((res,rej)=>{
        Modal.confirm({
            title: data.error,
            content: <div><img src={data.captcha_img} width="250"/><Input style={{width: 250, marginTop: '1em'}} ref={dom=>{if(dom && dom.input){inputEle=dom.input;}}}/></div>,
            onCancel:()=>{rej('验证码错误')},
            onOk: ()=>{
                res(inputEle.value);
            }
        });
    });
}

async function post(url:string, body:FormData){
    const res = await axios.post(getPath('', 'publish'),body);
    if (res.status !== 200) {
        throw Error(url + ' : '+res.statusText);
    } 
    if (res.data.error) {
        if (res.data.captcha_img) {
            const sol = await getCaptcha(res.data);
            body.append('captcha-id', res.data.captcha_id);
            body.append('captcha-solution', sol);
            const i = await post(url, body);
            return i;
        }
        throw Error(url + ' : '+res.data.error);
    }
    return res;
}

export interface Item{
    id: string;
    tags: string[];
    price: number;
    timestamp: number;
    loc: number[]|[number, number];
    title: string;
}

function extractData(s:string){
    const CONTENT_REGEXP = /\$rent_start\$(.*)\$rent_end\$/;
    const res = s.match(CONTENT_REGEXP);
    return res[1];
}

function wrapData(s:string){
    return '$rent_start$'+s+'$rent_end$';
}

function getPath(id:string, type:'note'|'publish'){
    const i = new URL('https://www.douban.com');
    if (type === 'note'){
        i.pathname = `/note/${id}`;
    }
    if (type === 'publish'){
        i.pathname = '/j/note/publish';
    }
    return i.href;
}
export async function getRecord(id:string):Promise<Array<Item>>{
    const res = await axios.get(getPath(id, 'note'));
    if (res.status === 200) {
        return JSON.parse(decodeURIComponent(atob(extractData(res.data as string))));
    }
    return [];
}

export async function createRecord(obj:Array<Item>){
    const s = btoa(encodeURIComponent(JSON.stringify(obj)));
    const body = new FormData();
    const json = {
        is_rich: '0',
        note_id: '',
        note_title: constant.DB_NOTE_ID,
        note_text: wrapData(s),
        introduction: '',
        note_privacy: '',
        cannot_reply: '',
        author_tags: '',
        accept_donation:'', 
        donation_notice: '',
        is_original: '',
        ck: cookie.get('ck'),
        action: 'new'
    };
    Object.keys(json).forEach(k=>{
        body.append(k, String(json[k]));
    });
    const res = await post(getPath('', 'publish'),body);
    if (res.status === 200) {
        let id = '';
        try {
            const ii = res.data;
            id = ii.url.substring(ii.url.indexOf('/note/')+6, ii.url.lastIndexOf('/'));
        } catch (error) {
            logError(error);
        }
        return id;
    }
    return '';
}


export async function updateRecord(obj:Array<Item>, noteId:string){
    const s = btoa(encodeURIComponent(JSON.stringify(obj)));
    const body = new FormData();
    const json = {
        is_rich: '0',
        note_id: noteId,
        note_title: constant.DB_NOTE_ID,
        note_text: wrapData(s),
        introduction: '',
        note_privacy: '',
        cannot_reply: '',
        author_tags: '',
        accept_donation:'', 
        donation_notice: '',
        is_original: '',
        ck: cookie.get('ck'),
        action: 'edit'
    };
    Object.keys(json).forEach(k=>{
        body.append(k, String(json[k]));
    });
    const res = await post(getPath('', 'publish'),body);
    if (res.status === 200) {
        let id = '';
        const ii = res.data;
        id = ii.url.substring(ii.url.indexOf('/note/')+6, ii.url.lastIndexOf('/'));
        return id;
    }
    return '';
}

export async function init(){
    let noteId = localStorage.getItem(constant.DB_NOTE_ID);
    if (noteId){
        console.log('note id is ', noteId);
        return noteId;
    }
    noteId = await createRecord([]);
    console.log('note id is ', noteId);
    localStorage.setItem(constant.DB_NOTE_ID, noteId);
    return noteId;
}
