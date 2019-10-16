import axios from 'axios';
import * as cookie from 'js-cookie';
import * as constant from './constant';
import * as LZUTF8 from 'lzutf8';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css'
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

function getCaptcha(captcha_img:string){
        return Swal.fire({
            titleText:'请输入验证码',
            html: `<img src="${captcha_img}" width="200"/>`,
            input:'text',
            inputPlaceholder:'验证码',
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            showCancelButton: true,
        }).then((val)=>{
            if (val.value){
                return val.value;
            }
            return '';
        })
}

export async function post(url:string, body:FormData){
    if (document.querySelector('.nav-login')){
        throw Error('login');
    }
    try {
        const res = await axios.post(url,body);
        if (res.status !== 200) {
            throw Error(url + ' : '+res.statusText);
        } 
        if (res.data.error) {
            if (res.data.captcha_img) {
                const sol = await getCaptcha(res.data.captcha_img);
                body.append('captcha-id', res.data.captcha_id);
                body.append('captcha-solution', sol);
                const i = await post(url, body);
                return i;
            }
            throw Error(url + ' : '+res.data.error);
        }
        return res;        
    } catch (error) {
        throw Error(url + ' : '+error);    
    }

}

export async function get(url:string){
    if (document.querySelector('.nav-login')){
        throw Error('login');
    }
    try {
        const res = await axios.get(url);
        if (res.status !== 200) {
            throw Error(url + ' : '+res.statusText);
        }
        return res;
            
    } catch (error) {
        throw Error(url + ' : '+error);        
    }
}

export interface Item{
    id: string;
    tags: string[];
    price: number|null;
    timestamp: number;
    loc: number[]|[number, number];
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

export function getPath(id:string, type:'note'|'publish'|'peopleNotes'|'searchNotes'|'discussion'|'searchInGp'){
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
    if (type === 'discussion'){
        i.pathname = `/group/${id}/discussion`;
    }
    if (type === 'searchNotes'){
        i.pathname = `/search`;
        i.searchParams.set('cat','1015');
        i.searchParams.set('q', constant.DB_NOTE_ID);
    }
    if (type === 'searchInGp') {
        i.pathname = `/group/search`;
        i.searchParams.set('cat','1013');
        i.searchParams.set('group', id);
        i.searchParams.set('sort', 'time');
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
        const ii = res.data;
        id = ii.url.substring(ii.url.indexOf('/note/')+6, ii.url.lastIndexOf('/'));        
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
    const dom = document.createElement('div');
    dom.innerHTML = `<p>请填入之前建立的前缀为${constant.DB_NOTE_ID}的日志ID</p>
    <p>日志ID为日志链接地址的数字字段，如<strong>https://www.douban.com/note/735731400/</strong>中的735731400</p>
    <p>留空或者不填则会重新新的日志记录</p>`;
    // const inputEle = document.createElement('input');
    // dom.append(inputEle);
    return Swal.fire({
        titleText:'初始化设置',
        html: `<p>请填入之前建立的前缀为${constant.DB_NOTE_ID}的日志ID</p>
        <p>日志ID为日志链接地址的数字字段，如<strong>https://www.douban.com/note/735731400/</strong>中的735731400</p>
        <p>留空或者不填则会重新新的日志记录</p>`,
        input:'text',
        inputPlaceholder:'日志ID',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showCancelButton: true,
    }).then(val=>{
        if (val.value){
            return val.value;
        }
        return '';
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
    try {
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
    } catch (error) {
        return 0;
    }

}

export async function init(force:boolean=false){
    let noteId = localStorage.getItem(constant.DB_NOTE_ID);
    if (!force && noteId){
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
        Swal.fire({title:'新建记录成功', text:'创建了前缀为'+constant.DB_NOTE_ID+'的日志用于记录数据，请勿删除', type:'success'});
    }

    console.log('note id is ', noteId);
    localStorage.setItem(constant.DB_NOTE_ID, noteId);
    return noteId;
}
