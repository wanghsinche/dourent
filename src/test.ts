import * as Readability from 'readability' ;
import axios from 'axios';
export async function main(){
    const ii = await axios.get('https://www.douban.com');
    var doc = document.implementation.createDocument(null, 'html', null);
    var body = doc.createElement('body');
    // body.innerHTML = ii.data;
    body.innerHTML = `
    <html lang="zh-cmn-Hans" class="ua-mac ua-webkit">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="renderer" content="webkit">
        <meta name="referrer" content="always">
        <meta name="google-site-verification" content="ok0wCgT20tBBgo9_zat2iAcimtN4Ftf5ccsh092Xeyw" />
        <title>豆瓣</title>
        
        
    <meta content="提供图书、电影、音乐唱片的推荐、评论和价格比较，以及城市独特的文化生活。" name="description"/>
    
        <link href="https://img3.doubanio.com/f/shire/db7c8ab218cded634c1180ff7b56d3ca44393bc2/css/frontpage/_init_.css" rel="stylesheet" type="text/css">
        <script>_head_start = new Date();</script>
        <script src="https://img3.doubanio.com/f/shire/ebac5abada5de811d65dac57b2e62a89c7ddf55a/js/core/_init_.js" data-cfg-corelib="https://img3.doubanio.com/f/shire/72ced6df41d4d158420cebdd254f9562942464e3/js/jquery.min.js"></script>
        
        <style type="text/css"></style>
        <link rel="stylesheet" href="https://img3.doubanio.com/misc/mixed_static/1ccb48ae39700a30.css">
        <script>
            Do.global('https://img3.doubanio.com/f/shire/5ecaf46d6954d5a30bc7d99be86ae34031646e00/js/douban.js');
            
        </script>
    
        <link rel="shortcut icon" href="https://img3.doubanio.com/favicon.ico" type="image/x-icon">
    </head>
    
    <body>
      
      
        <script type="text/javascript">var _body_start = new Date();</script>
        
    
    
      
    
    
    
        <link href="//img3.doubanio.com/dae/accounts/resources/a4a38a5/shire/bundle.css" rel="stylesheet" type="text/css">
    
    
    
        <div id="db-global-nav" class="global-nav">
        </div>
    </body>
    </html>    
    `;
    doc.documentElement.appendChild(body);
    var res = new Readability(doc).parse();
    console.log(res);
}
