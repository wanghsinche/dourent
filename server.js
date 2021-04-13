const express = require('express')
const proxy = require('express-http-proxy');

const app = express()
const port = process.env.PORT || 8000



app.use('/proxy/jisilu', proxy('https://www.jisilu.cn'));
app.use('/proxy/money.finance.sina.com.cn', proxy('https://money.finance.sina.com.cn'));
app.use('/proxy/raw.githubusercontent.com', proxy('https://raw.githubusercontent.com'));

app.use(express.static('dist', {index:'index.html'}));

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
})
