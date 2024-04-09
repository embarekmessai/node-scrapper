const express= require("express");
const cors = require('cors');
const morgan = require('morgan');
const scrap = require("./src/scraping/scrap");
const fs = require('node:fs');
const path = require("node:path");
const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;

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

app.use('/api/v1',  
    router.get('/files', async (req, res) => { 
        fs.readdir(path.join(__dirname,`/src/scraping/products/www.fetez-moi.net/`), (err, files) => {
            if (err) 
            console.log(err); 
            else { 
            // console.log("Files: ", files); 
            return res.status(200).send(files);
            } 
        });
    })   
);

// Send file content to client
app.use('/api/v1',  
    router.get('/file/:name', async (req, res) => { 
        fs.readFile(path.join(__dirname,`/src/scraping/products/www.fetez-moi.net/${req.params.name}`), 'utf8', async (err, data) => {
            if (err) 
            console.log(err); 
            else { 
            // console.log("Files: ", files); 
            const wpData = [];

            await JSON.parse(data).forEach(element => {
                const imgs = (element.images).reduce((acc, img) => {
                            return [...acc, { src: img }]
                        }, []);
                        
                const {image, description , ...newElement} = element;

                    wpData.push({
                        ...newElement,
                        description: description.toString(), 
                        images : [{src: element.image} , ...imgs]
                    })
                });

            return res.status(200).send(wpData);

            } 
        });
    })   
);

const wooApi = new WooCommerceRestApi({
    url: "https://www.magentamariage.fr/",
    consumerKey: "ck_0a1bbcbc9a9c21df025b1489ecc496542c2e9259",
    consumerSecret: "cs_c0bd1f87b2604fca78b22fef2eb4c4281e126103",
    version: "wc/v3"
});


app.use('/api/v1',
    router.post('/products', async (req, res) => {
        
        try {
            let i = 1;
            await req.body.products.forEach( async (product) => {
                console.log(product);
                await wooApi.post("products", product).then((response) => {
                    console.log(i+"-success");
                    i++;
                }).catch((error) => {
                    console.log(error.response.data);
                });
            });
            console.log('Finish');
            return res.status(200).send('Products added');
        } catch (error) {
            console.log(error);
            return res.status(500).send('Error');
        }
        
    }
));
