import axios from 'axios';
import * as React from 'react';
import * as cookie from 'js-cookie';
import * as constant from './constant';
import {logError} from './log';
import {Modal, Input, message} from 'antd';
import * as LZUTF8 from 'lzutf8';
/**
 * captcha-id: pr3TnRPoUFyOkt5CBysl4Bto:en
 * captcha-solution: drawer
 */

/**
 * captcha_id: "4Nzcxug21Lp2kZrRO0rXKOKj:en"
 * captcha_img: "https://www.douban.com/misc/captcha?id=4Nzcxug21Lp2kZrRO0rXKOKj:en&size=s"
 * error: "请输入正确的验证码"
 */

 /**
  * 缺少数据完整性校验
  */

export function getUid(){
    const txt:string = cookie.get('dbcl2');
    const uid = txt.substr(1, txt.indexOf(':')-1);
    return uid;    
}

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
    const res = await axios.post(url,body);
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

async function get(url:string){
    const res = await axios.get(url);
    if (res.status !== 200) {
        throw Error(url + ' : '+res.statusText);
    } 
    return res;
}

export interface Item{
    id: string;
    tags: string[];
    price: number|null;
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
function encode(obj:any){
    // const s = btoa(encodeURIComponent((JSON.stringify(obj))));
    const s = LZUTF8.compress(JSON.stringify(obj), {inputEncoding:'String', outputEncoding:'Base64'});
    return wrapData(s);
}
function decode(s:string){
    const ss = LZUTF8.decompress(extractData(s), {inputEncoding:'Base64', outputEncoding:'String'});
    // const ss = decodeURIComponent(atob(extractData(s)));
    return JSON.parse(ss);
}

function getPath(id:string, type:'note'|'publish'|'peopleNotes'|'searchNotes'){
    const i = new URL('https://www.douban.com');
    if (type === 'note'){
        i.pathname = `/note/${id}/`;
    }
    if (type === 'publish'){
        i.pathname = '/j/note/publish';
    }
    if (type === 'peopleNotes'){
        i.pathname = `/people/${id}/notes/`;
    }
    if (type === 'searchNotes'){
        i.pathname = `/search`;
        i.searchParams.set('cat','1015');
        i.searchParams.set('q', constant.DB_NOTE_ID);
    }
    return i.href;
}
export async function getRecord(id:string):Promise<Array<Item>>{
    const res = await get(getPath(id, 'note'));
    if (res.status === 200) {
        return decode(res.data);
    }
    return [];
}

export async function createRecord(obj:Array<Item>){
    const s = encode(obj);
    const body = new FormData();
    const json = {
        is_rich: '0',
        note_id: '',
        note_title: constant.DB_NOTE_ID + '@' + Date.now(),
        note_text: s,
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
    const s = encode(obj);
    const body = new FormData();
    const json = {
        is_rich: '0',
        note_id: noteId,
        note_title: constant.DB_NOTE_ID + '@' + Date.now(),
        note_text: s,
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

function promptNoteId(){
    return new Promise<string>((res, rej)=>{
        let inputEle:HTMLInputElement;
        Modal.confirm({
            title: '请输入已有的记录ID',
            content: <div>
                <p>请填入之前建立的前缀为{constant.DB_NOTE_ID}的日志ID</p>
                <p>日志ID为日志链接地址的数字字段，如<strong>https://www.douban.com/note/735731400/</strong>中的735731400</p>
                <p>留空或者不填则会重新新的日志记录</p>
                <Input ref={dom=>{if(dom && dom.input){inputEle=dom.input;}}}/>
            </div>,
            onCancel:()=>{
                res('')
            },
            onOk:()=>{
                res(inputEle.value);
            }
        })
    });
}

export async function fetchNewest(myId:string, myStamp:number){
    const res = await get(getPath('', 'searchNotes'));
    if (res.data) {
        const dom = document.createElement('div');
        dom.innerHTML = res.data;
        const nodeLs = Array.from(dom.querySelectorAll('h3 a')).filter(el=>el.textContent.includes(constant.DB_NOTE_ID)).sort((a,b)=>a.textContent>b.textContent?1:-1);
        const newest = nodeLs[0];
        if (!newest){
            return;
        }
        const stamp = Number(newest.textContent.substr(constant.DB_NOTE_ID.length+1));
        // 新数据则更新，否则用老数据
        if (myStamp - stamp <= 1000){
            return await getRecord(myId);
        }
        const href = newest.getAttribute('href').match(/note%2F(\w+)%/);
        if (!href){
            return;
        }
        const id = href[1];
        const rec = await getRecord(id);
        await updateRecord(rec, myId);
        return rec;
    }
}

export async function getMyStamp(id:string){
    const res = await get(getPath(id, 'note'));
    if (!res.data){
        return 0;
    }

    const dom = document.createElement('div');
    dom.innerHTML = res.data;
    
    const h1 = dom.querySelector('h1');
    if (!h1){
        return 0;
    }
    const stamp = Number(h1.textContent.substr(constant.DB_NOTE_ID.length+1));
    return stamp;
}

export async function init(){
    let noteId = localStorage.getItem(constant.DB_NOTE_ID);
    if (noteId){
        console.log('note id is ', noteId);
        return noteId;
    }

    noteId = await promptNoteId();
    if (noteId){
        console.log('note id is ', noteId);
        localStorage.setItem(constant.DB_NOTE_ID, noteId);
        return noteId;
    }

    noteId = await createRecord([]);
    if (noteId) {
        Modal.info({title:'新建记录成功', content:'创建了前缀为'+constant.DB_NOTE_ID+'的日志用于记录数据，请勿删除'});
    }

    console.log('note id is ', noteId);
    localStorage.setItem(constant.DB_NOTE_ID, noteId);
    return noteId;
}
