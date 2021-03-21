const express = require('express')
const proxy = require('express-http-proxy');

const app = express()
const port = 8000


app.use('/proxy/jisilu', proxy('https://www.jisilu.cn'));
app.use('/proxy/money.finance.sina.com.cn', proxy('https://money.finance.sina.com.cn'));

app.use(express.static('dist', {index:'popup.html'}));

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
})
