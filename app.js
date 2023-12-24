const express= require("express");
const cors = require('cors');
const morgan = require('morgan');
const scrap = require("./src/scraping/scrap");
const fs = require('node:fs');
const path = require("node:path");

var app = express();

var router = express.Router();

app.listen(process.env.PORT || 5000, () => {
    console.log("  App is running at http://localhost:%d in %s mode",
                process.env.PORT || 5000
              );
  });


var corsOptions = {
    credentials: true,
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/v1', 
    router.post('/url', async (req, res) => {
        // console.log(req.body.url);
        //res.send('Hel.body
        // return console.log(path.join(__dirname,`/book-scraper/products/${(req.body.url.split('https://')[1]).split('?')[0]}.json`));
        return await scrap(req.body.url).then(() => {
            
            // Return success response
            return res.status(200).send('Scraping done');
            
            // fs.readFile(path.join(__dirname,`/products/${(req.body.url.split('https://')[1]).split('?')[0]}.json`), 'utf8', (data) => {
            //     console.log('Data', data);
            //     return res.status(200).send(data)
            // });
            
        });
    })
);