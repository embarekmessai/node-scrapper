const scraperObject = (browser, link) => {
    let browser;
	browser = await browserInstance;
    let page = await browser.newPage();

    console.log(`Navigating to ${link}...`);
    await page.goto(link);
    // Wait for the required DOM to be rendered
    let block = await page.waitForSelector('#primary_block');
    // Get the link to all the required books

    let productEl = () => new Promise(async(resolve, reject) => {
        let dataObj = {};
        
        dataObj['title'] = await page.$eval('h1', text => text.textContent);
        dataObj['price'] = await page.$eval('#pb-left-column > .price > #our_price_display', text => text.textContent);
        dataObj['description'] = await page.$eval('#short_description_block', innerHTML => innerHTML.innerHTML);
        dataObj['image'] = await page.$eval('#view_full_size > img', img => img.src);
        dataObj['images'] = await page.$$eval('#thumbs_list_frame > li', links => {
            // Make sure the book to be scraped is in stock
            // links = links.filter(link => link.querySelector('.instock.availability > i').textContent !== "In stock")
            // Extract the links from the data
            links = links.map(el => { image : el.querySelector('a').href})
            return links;
        
        });

        resolve(dataObj);
        await newPage.close();

    });

    return  productEl().then((value) => console.log(value));
    
    
            // Loop through each of those links, open a new page instance and get the relevant data from them
            // let pagePromise = (link) => new Promise(async(resolve, reject) => {
            //     let dataObj = {};
            //     let newPage = await browser.newPage();
            //     await newPage.goto(link);
            //     dataObj['bookTitle'] = await newPage.$eval('.product_main > h1', text => text.textContent);
            //     dataObj['bookPrice'] = await newPage.$eval('.price_color', text => text.textContent);
            //     dataObj['noAvailable'] = await newPage.$eval('.instock.availability', text => {
            //         // Strip new line and tab spaces
            //         text = text.textContent.replace(/(\r\n\t|\n|\r|\t)/gm, "");
            //         // Get the number of stock available
            //         let regexp = /^.*\((.*)\).*$/i;
            //         let stockAvailable = regexp.exec(text)[1].split(' ')[0];
            //         return stockAvailable;
            //     });
            //     dataObj['imageUrl'] = await newPage.$eval('#product_gallery img', img => img.src);
            //     dataObj['bookDescription'] = await newPage.$eval('#product_description', div => div.nextSibling.nextSibling.textContent);
            //     dataObj['upc'] = await newPage.$eval('.table.table-striped > tbody > tr > td', table => table.textContent);
            //     resolve(dataObj);
            //     await newPage.close();
            // });
    
            // for(link in urls){
            //     let currentPageData = await pagePromise(urls[link]);
            //     // scrapedData.push(currentPageData);
            //     console.log(currentPageData);
            // }
        

}

module.exports = scraperObject;