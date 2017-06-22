const linkedin = require('./linkedin.js')
const hubspot = require('./HubSpot.js')
var webdriver = require('selenium-webdriver')
const {By, until} = webdriver

linkedin.login().then((results) => {
  linkedin.getCompany('https://www.linkedin.com/company/hoagland-longo-moran-dunst-&-doukas').then((companyInfo) => {
    
  })
})

const getCompanies = () => {
  linkedin.login().then((results) => {
    hubspot.getCompanies(['name', 'website', 'linkedin_company_page']).then((companies) => {
      return companies
        .filter((company) => Boolean(company.properties.linkedin_company_page))
        .map((company) => ({
            name: company.properties.name.value,
            website: company.properties.website.value,
            linkedin_company_page: company.properties.linkedin_company_page.value
        }))
    }).then((companies) => {
      companies.forEach((company) => {
        linkedin.getCompany(company.linkedin_company_page).then((results) => {
          console.log(`${results.status}: ${company.linkedin_company_page}`)
        })
      })
      linkedin.quit();
    })
  })
}
