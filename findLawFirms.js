'use strict';

var request = require('request-promise');
const cheerio = require('cheerio')
const key = process.env.HUBSPOT_KEY
const URL = require('url').URL;


const getHostname = (website) => {
    const myURL = new URL(website);
    return myURL.hostname
}

const isUnique = (website) => urls.indexOf(getHostname(website)) == -1

const createCompany = (domain) => new Promise((res, rej) => {
    const options = {
        method: 'POST',
        uri: `https://api.hubapi.com/companies/v2/companies?hapikey=${key}`,
        body: {
            "properties": [
                {
                    "name": "website",
                    "value": domain
                }
            ]
        },
        json: true
    }

    return request(options)
})

const createCompanies = (domains) => new Promise((res, rej) => {
    let counter = 1
    let idx = 0
    let splitDomains = [[]]

    domains.forEach((domain) => {
        splitDomains[idx].push(domain)

        counter++
        if (counter > 10) {
            counter = 1
            idx++
            splitDomains.push([])
        }
    })

    splitDomains.forEach((group, index) => {
        setTimeout(() => {
            group.forEach((domain) => {
                createCompany(domain)
            })
        }, index * 2000)
    })
})

const getFirmsByCity = (city, firms = [], pageNum = 1) => request(`http://www.lawyers.com/all-legal-issues/${city}/pennsylvania/law-firms-p${pageNum}`).then((page) => {
    const $ = cheerio.load(page)
    $(".search-results-area .search-results-list li.srl-website a").each(function (i, elem2) {
        const website = $(elem2).prop('href')
        const domain = getHostname(website)
        if (firms.indexOf(domain) == -1) {
            firms.push(domain)
        }
    })

    const hasAnotherPage = $(`.pagination-area a.num${pageNum + 1}`).length > 0
    if (hasAnotherPage) {
        return getFirmsByCity(city, firms, pageNum + 1)
    }

    return firms
})

const getCities = () => request("http://www.lawyers.com/pennsylvania/find-law-firms-by-city/").then((citiesPage) => {
    let $ = cheerio.load(citiesPage)
    let cities = []

    $("#panelCities .tabs-content .states li a").each(function (i, elem) {
        cities.push($(elem).text().replace(/\s+/g, '-').toLowerCase())
    })

    return cities
})

const getDomains = () => request(`https://api.hubapi.com/companies/v2/companies/paged?hapikey=${key}&properties=website&limit=250`).then((result) => {
    const urls = []

    JSON.parse(result).companies.forEach((element) => {
        urls.push(element.properties.website.value);
    });

    return urls
})

const mergeUnique = (oldFirms, newFirms, firmsToAdd) => {
    firmsToAdd.forEach((domain) => {
        if (oldFirms.indexOf(domain) == -1 && newFirms.indexOf(domain) == -1) {
            newFirms.push(domain)
        }
    })

    return newFirms
}

getDomains().then((oldFirms) => {
    let newFirms = []

    getFirmsByCity('phoenixville').then((phoenixvillFirms) => {
        newFirms = mergeUnique(oldFirms, newFirms, phoenixvillFirms)

        getFirmsByCity('philadelphia').then((phillyFirms) => {
            newFirms = mergeUnique(oldFirms, newFirms, phillyFirms)
            createCompanies(newFirms).then(() => {
                console.log('done creating companies')
            })
        })
    })
})