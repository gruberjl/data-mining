const { join } = require('path');
const hubspot = require(join(__dirname, 'HubSpot.js'))
var os = require('os');
var request = require('request-promise');
const key = process.env.HUBSPOT_KEY
const parseDomain = require('parse-domain')
const cheerio = require('cheerio')

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const getDomain = (company) => `${parseDomain(company.properties.website.value).domain}.${parseDomain(company.properties.website.value).tld}`

const getExchangeVersion = (html) => {
  const $ = cheerio.load(html)
  const icon = $('link[rel="shortcut icon"]').prop('href')
  if (icon) {
      if (icon.startsWith("/owa/auth/")) {
        const exchangeVersion = icon.split('/')[3]
        return exchangeVersion
      } else if (icon.startsWith('/owa/')) {
        const exchangeVersion = icon.split('/')[2]
        return exchangeVersion
      }
  }
}

const crawlOWA = (domain, subdomain = "mail") => request({
  uri: `https://${subdomain}.${domain}/owa`,
  headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
      'Accept-Language': 'en-US, en;q=0.8',
      Accept: 'text / html, application/xhtml+xml,application/xml;q=0.9, image/webp,*;q=0.8'
  },
  timeout: 1500
}).then(getExchangeVersion)

const updateExchangeVersion = (company, url, exchangeVersion) => request({
    method: 'PUT',
    uri: `https://api.hubapi.com/companies/v2/companies/${company.companyId}?hapikey=${key}`,
    body: {
        "properties": [
            {
                "name": "exchange_version",
                "value": exchangeVersion
            },
            {
                "name": "exchange_owa_url",
                "value": url
            }
        ]
    },
    json: true
})

const getSetExchangeVersion = (company) => {
  const domain = getDomain(company)

  crawlOWA(domain, 'mail').then((exchangeVersion) => {
    updateExchangeVersion(company, `mail.${domain}`, exchangeVersion)
  }, (mailErr) => {
    crawlOWA(domain, 'webmail').then((webmailExchangeVersion) => {
      updateExchangeVersion(company, `webmail.${domain}`, webmailExchangeVersion)
    }, (webmailerr) => {
      crawlOWA(domain, 'smtp').then((smtpExchangeVersion) => {
        updateExchangeVersion(company, `smtp.${domain}`, smtpExchangeVersion)
      }, (smtpErr) => {
        console.log(`${domain}: Exchange OWA URL not found`)
      })
    })

  })
}

const run = () => {
    hubspot.getCompanies(["website", "email_provider", "spam_filter_service", "mx_records"]).then((companies) => {
        const companiesWithMx = companies.filter((company) => Boolean(company.properties.mx_records) && !company.properties.email_provider.value)
        companiesWithMx.forEach((company, idx) => {
          setTimeout(() => {
              getSetExchangeVersion(company)
          }, idx * 500)
        })
    })
}

//run()

crawlOWA("bazless.com", 'mail').then((exchangeVersion) => {
  console.log(exchangeVersion)
  //updateExchangeVersion(company, `mail.${domain}`, exchangeVersion)
}, (err) => {
  console.log(err)
})
