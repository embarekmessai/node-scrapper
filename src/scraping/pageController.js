// const pageScraper = require('./pageScraper');
const fs = require('node:fs');
const path = require('node:path');

async function scrapeAll(browserInstance, Url){
    let browser, url;
	try{
        url = await Url;
		browser = await browserInstance;
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        await page.setViewport({width: 1200, height: 720})
        // await page.goto('https://www.fetez-moi.net/authentification');
        await page.goto(url);
        // await page.waitForNavigation();
        await page.waitForSelector('a');
        await page.click('a');
        await page.waitForSelector("#email");
        await page.type('#email', 'fairepart@hotmail.fr', { delay: 50 });
        await page.waitForSelector("#passwd");
        await page.type('#passwd', '4xmmmm', { delay: 50 });
        await page.click('#SubmitLogin');

        let newPage = await browser.newPage();
        await newPage.setDefaultNavigationTimeout(0);
        await newPage.goto(url);

        let urls = await newPage.$$eval('.center_block', links => {
			// Make sure the book to be scraped is in stock
			// links = links.filter(link => link.querySelector('.instock.availability > i').textContent !== "In stock")
			// Extract the links from the data
			links = links.map(el => el.querySelector('a').href)
			return links;
		});
		

        // console.log(urls);
        let productPage = [];
        // let scrapedElement = [];
        const urlName = (url.split('https://')[1]).split('?')[0];
        
        urls.forEach( async(link, i) => {
            //pageScraper(browser, link);
            productPage[i] = await browser.newPage();
            
            productPage[i].setDefaultTimeout(0);

            await productPage[i].goto(link);
            // Wait for the required DOM to be rendered
            // const scrapedElement = page.$('#pb-short_description_block-column');
            
            // scrapedElement[i] = await productPage[i].$('#primary_block');

            // await productPage[i].waitForSelector('#primary_block');
            // Get the link to all the required books

            let productEl = () => new Promise(async(resolve, reject) => {

                let dataObj = {};
                
                dataObj['title'] = await productPage[i].$eval('h1', text => text.textContent);

                await productPage[i].waitForSelector('#pb-left-column');
                dataObj['price'] = await productPage[i].$eval('#our_price_display', text => text.textContent);

                // await productPage[i].waitForSelector('#pb-short_description_block-column');
                dataObj['description'] = await productPage[i].$$eval('ul#feature_list > li', elements => elements.map(element => element.innerHTML));

                await productPage[i].waitForSelector('#pb-right-column');
                dataObj['image'] = await productPage[i].$eval('#view_full_size > img', img => img.src);
                dataObj['images'] = await productPage[i].$$eval('ul#thumbs_list_frame > li > a', links => links.map(link => link.href));

                resolve(dataObj);
                //await newPage.close();

            });

            // await productPage[i].waitForNavigation();

            await productPage[i].waitForSelector('#primary_block').then( async() => {
                await productEl().then((response) => {
                    
                    fs.appendFile(path.join(__dirname, `/products/${urlName}.json`), JSON.stringify(response), (err) => { 
                        if (err) 
                          console.log(err); 
                        else { 
                          console.log("File written successfully\n"); 
                          return 
                        } 
                    });
                });
            });

        });

        // await page.waitForNavigation()
		// await newPage.waitForNavigation();

		// await page.scraper(browser);	
    
		// await newPage.scraper(browser);	
	}
	catch(err){
		console.log("Could not resolve the browser instance => ", err);
	}
}

module.exports = (browserInstance, Url) => scrapeAll(browserInstance, Url)