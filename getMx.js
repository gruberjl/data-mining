const key = process.env.HUBSPOT_KEY
var request = require('request-promise');
const parseDomain = require('parse-domain')
const dns = require('dns');
var os = require('os');

const getCompanies = (properties = [], limit = 250) => new Promise((res, rej) => {
    request(`https://api.hubapi.com/companies/v2/companies/paged?hapikey=${key}&properties=${properties.join("&properties=")}&limit=${limit}`).then((results) => {
        const result = JSON.parse(results)
        res(result.companies)
    }, (err) => {
        rej(err)
    })
})

const getDomain = (company) => `${parseDomain(company.properties.website.value).domain}.${parseDomain(company.properties.website.value).tld}`

const getMX = (domain) => new Promise((res, rej) => {
    dns.resolveMx(domain, (err, mxResults) => {
        if (err) {
            rej(err)
        } else {
            res(mxResults.map((val) => val.exchange))
        }
    })
})

const setMx = (company, records) => request({
    method: 'PUT',
    uri: `https://api.hubapi.com/companies/v2/companies/${company.companyId}?hapikey=${key}`,
    body: {
        "properties": [
            {
                "name": "mx_records",
                "value": records.join(os.EOL)
            }
        ]
    },
    json: true
})


// Works but I need to limit because of HubSpot crap.
getCompanies(["website", "email_provider", "spam_filter_service", "mx_records"]).then((companies) => {
    companies.forEach((company, idx) => {
        getMX(getDomain(company)).then((records) => {
            setTimeout(() => {
                setMx(company, records)
            }, idx * 500)
        }, (err) => {
            console.log(getDomain(company))
            console.log(err)
            console.log('')
        })
    })
})