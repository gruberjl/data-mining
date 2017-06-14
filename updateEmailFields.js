const { join } = require('path');
const hubspot = require(join(__dirname, 'HubSpot.js'))
var os = require('os');
var request = require('request-promise');
const key = process.env.HUBSPOT_KEY

const update = (company, provider, filter) => request({
    method: 'PUT',
    uri: `https://api.hubapi.com/companies/v2/companies/${company.companyId}?hapikey=${key}`,
    body: {
        "properties": [
            {
                "name": "email_provider",
                "value": provider
            },
            {
                "name": "spam_filter_service",
                "value": filter
            }
        ]
    },
    json: true
})

hubspot.getCompanies(["website", "email_provider", "spam_filter_service", "mx_records"]).then((companies) => {
    const companiesWithMx = companies.filter((company) => Boolean(company.properties.mx_records))

    companiesWithMx.forEach((company, idx) => {
        const mx = company.properties.mx_records.value.split(os.EOL)[0].toLowerCase()
        if (mx) {
            hubspot.getEmailProvider(mx).then((provider) => {
                hubspot.getSPAMFilter(mx).then((filter) => {
                    setTimeout(() => {
                        update(company, provider, filter)
                    }, idx * 500)
                })
            })
        }
    })
})