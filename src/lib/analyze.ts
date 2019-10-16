import {Item, getPath, get} from './database';
import {logError} from './log';
import * as Readability from 'readability';
export interface IRecord {
    href: string;
    content: string;
    timeStamp: number;
    id:string;
    tags?: string[];
    title: string;
    commentNum: number;
    lastCommentTime?: Date;
    author: string;
    authorLink: string;
    price: number;
}
export class Analyze {
    heuristicData:Item[];
    currentItem = 0;
    currentStart = 0;
    offset = 50;
    tags: string[];
    price: number;
    gpId: string;
    constructor(gpId: string, data:Item[], tags:string[], price: number){
        this.heuristicData = data;
        this.tags = tags;
        this.price = price;
        this.gpId = gpId;
    }
    private sleep(ms=200){
        return new Promise(res=>setTimeout(() => {
            res();
        }, ms*Math.random()+ms/2))
    }
    private hrefToId(href:string){
        const id = href.match(/topic\/(\d+)\//);
        if (id) {
            return id[1];
        }
        return '';
    }
    private getTag(tags:string[], content:string){
        const found:string[] = tags.filter(el=>content.includes(el));
        return found;
    }
    private getPrice(content:string) {
        const partern = [
            /(\d+)元/, /每月(\d+)/, /价格(\d+)/, /(\d+)每月/,/房租(\d+)/,/租金(\d+)/,/只要(\d+)/,
            /(\d+)一个月/,
            /(\d{4})/, /(\d+)\//,
        ];
        for(let p of partern){
            const matchRes = content.match(p);
            if (matchRes) {
                return matchRes[1];
            }
        }
        return NaN;
    }
    async process(){
        // 用内置搜索 + 关键字提取
        console.log('waiting...');
        try {
            const url = new URL(getPath(this.gpId, 'searchInGp'));
            url.searchParams.set('q', this.tags.join('+'));
            url.searchParams.set('start', this.currentStart+'');
            const listPage = await get(url.href);
            const dom = document.createElement('div');
            dom.innerHTML = listPage.data;
            const elelist:IRecord[] = Array.from(dom.querySelectorAll('.article tr'))
            .filter(el=>el.className!=='th')
            .map(el=>{
                const title = el.querySelector('.td-subject a');
                let time = el.querySelector('.td-time').getAttribute('title');
                // if (time.includes(':')){
                //     time = (new Date()).getFullYear() + '-' +time;
                // }
                
                return {
                    authorLink: '',
                    author: '',
                    id: this.hrefToId(title.getAttribute('href')),
                    href: title.getAttribute('href'),
                    timeStamp: (new Date(time)).valueOf(),
                    content: '',
                    title: title.textContent,
                    commentNum: 0,
                    price: NaN
                };}
            );
            const contents: IRecord[] = [];
            for (let i = 0; i< elelist.length;i++){
                const el = elelist[i];
                if (i% 5 === 0){
                    await this.sleep();
                }
                const res = await get(el.href);
                if(res) {
                    var doc = document.implementation.createDocument (null, 'html', null);
                    var body = document.createElement('body');
                    body.innerHTML = res.data;
                    doc.documentElement.appendChild(body);

                    const author = body.querySelector('.from a');
                    const lastComment = body.querySelector('#comments > li:last-child .pubtime');


                    // var art = new Readability(doc).parse();
    
                    contents.push({
                        ...el, 
                        content: body.textContent,
                        authorLink: author?author.getAttribute('href'):'',
                        author: author?author.textContent:'',
                        lastCommentTime: lastComment?new Date(lastComment.textContent):void 0,
                        commentNum: body.querySelectorAll('.comment-item').length,
                     });//art.title + ' : ' + art.content};    
                } else{
                    contents.push(el);
                }
            }

            this.currentStart += contents.length;

            return contents.map(el=>({
                ...el,
                price: this.getPrice(el.content),
                tags: this.getTag(this.tags, el.content),
            }));

        } catch (error) {
            logError(error);
        }
    }
}