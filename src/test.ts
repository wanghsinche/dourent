import * as Readability from 'readability' ;
import axios from 'axios';
export async function main(){
    const ii = await axios.get('https://www.douban.com');
    var tmp = document.createElement('div');
    tmp.innerHTML = ii.data;
    const body = document.createElement('body');
    body.append(tmp);
    const doc = document.implementation.createDocument(null, 'html', null);
    doc.documentElement.append(body);
    Object.defineProperty(doc, 'body', {
        value: body,
        writable: true,
        enumerable: true,
    })
    var res = new Readability(doc).parse();
    console.log(res);

}
