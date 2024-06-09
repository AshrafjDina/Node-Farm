//const hello = 'hello world';
//console.log(hello);

//fs: (file system)

const fs = require('fs');
const http = require('http'); //require build Inn Network Application. 
const url = require('url');

const slugify = require('slugify');

const replaceTemplate = require('./modules/replaceTemplate', 'utf-8');

/*
reading a File(Input);
Blocking synchronous way;
const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
console.log(textIn);

writting File(Output);
const textOut = `This (newFile) is what we know about the avocado: ${textIn}.\n Created on ${Date.now()}`;
fs.writeFileSync('./txt/output.txt', textOut);
console.log('File written!');

const textOutTwo = `This is to test New file-folder creation`;
fs.writeFileSync('./txt/nextput.txt', textOutTwo);
console.log('textOutTwo');

_____________________________________________________________
Non blocking, asynchronous way

fs.readFile('txt/start.txt', 'utf-8', (err, data) => {
    console.log(data);
})
console.log('Will read file')
*/

/*
fs.readFile('txt/start.txt', 'utf-8', (err, data1) => {
    if (err) return console.log('ERROR');

    fs.readFile('txt/start.txt', 'utf-8', (err, data2) => {
        //console.log(data2);
        fs.readFile('txt/append.txt', 'utf-8', (err, data3) => {
            //console.log(data3);

             fs.writeFile('./txt/final.txt',  `${data1}\n${data3}`, 'utf-8', err => {
            console.log('This file has been written');

            })
        });
    });
});
*/

//__________________________________________________________________________________________________________________________________

//SERVER
// create-server method accepts the Call back function(with two very important variables).
//res.end simple method of replying/responding.



//This is a top Level Code, can not be added to the function below as it needs to be called once
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');             
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8',);
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
    const dataObj = JSON.parse(data);                                         
  

const server = http.createServer((req, res) => {
    //console.log(req.url);
    //console.log(url.parse(req.url, true));
    const { query, pathname } = url.parse(req.url, true);


    //Implimenting Routing
    //const pathName = req.url;

    //OVERVIEW PAGE
    if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {'content-type': 'text/html'});

    //looping thr the objects using map in order to return an array
    const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%', cardsHtml);
    //console.log(cardsHtml);

    res.end(output);

    //PRODUCT PAGE
    } else if (pathname === '/product') {
        //console.log(query);
        res.writeHead(200, {'content-type': 'text/html'});
        const product = dataObj [query.id]
        const output = replaceTemplate(tempProduct, product);
    res.end(output);

    //API
    }else if(pathname ==='/api'){
    res.writeHead(200, {'content-type': 'application/json'});
    res.end(data); 

    // PAGE NOT FOUND
    }else {
    res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
        })
    res.end('<h1>Page not found!</h1>');    
    }
});

//listens to incoming request
server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to the request from port 8000');
})

