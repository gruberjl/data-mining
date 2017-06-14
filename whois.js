const { join } = require('path');
const hubspot = require(join(__dirname, 'HubSpot.js'))
var os = require('os');
var request = require('request-promise');
const key = process.env.HUBSPOT_KEY
const parseDomain = require('parse-domain')
var Crawler = require("crawler");

const getDomain = (company) => `${parseDomain(company.properties.website.value).domain}.${parseDomain(company.properties.website.value).tld}`
console.log('fuck you')
const crawlOWA = (company) => {
    var c = new Crawler({
        maxConnections: 10,
        callback: function (error, res, done) {
            if (error) {
                console.log(error);
            } else {
                var $ = res.$;
                console.log($("title").text());
            }
            done();
        }
    })
}

const asdf = () => {
    hubspot.getCompanies(["website", "email_provider", "spam_filter_service", "mx_records"]).then((companies) => {
        const companiesWithMx = companies.filter((company) => Boolean(company.properties.mx_records))
        companiesWithMx.forEach((company, idx) => {
            const domain = getDomain(company)
            request(`https://mail.${domain}/owa`).then((results) => {
                console.log(domain)
                console.log(results)
                console.log('')
            }, (err) => {
                console.log(domain)
                console.log(err)
                console.log('')
            })
        })
    })
}

/*
request({
    uri: `https://mail.${"raynesmccarty.com"}/owa`,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
        'Accept-Language': 'en-US, en;q=0.8',
        Accept: 'text / html, application/xhtml+xml,application/xml;q=0.9, image/webp,*;q=0.8'
    }
}).then((results) => {
    console.log('success')
    console.log(results)
    console.log('')
}, (err) => {
    console.log('fail')
    console.log(err)
    console.log('')
            })
*/