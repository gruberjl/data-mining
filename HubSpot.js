const key = process.env.HUBSPOT_KEY
var request = require('request-promise');

exports.getCompanies = (properties = [], limit = 250) => request(`https://api.hubapi.com/companies/v2/companies/paged?hapikey=${key}&properties=${properties.join("&properties=")}&limit=${limit}`).then((results) => {
    const result = JSON.parse(results)
    return result.companies
})

exports.getSPAMFilter = (mx) => new Promise((res, rej) => {
    if (mx.indexOf('mimecast.com') >= 0) {
        res('mimecast')
    } else if (mx.indexOf('barracudanetworks.com') >= 0) {
        res('barracuda')
    } else if (mx.indexOf('ctmail.com') >= 0) {
        res('cyren')
    } else if (mx.indexOf('trendmicro.com') >= 0) {
        res('trend_micro')
    } else {
        res('')
    }
})

exports.getEmailProvider = (mx) => new Promise((res, rej) => {
    if (mx.indexOf('outlook.com') >= 0) {
        res('office365')
    } else if (mx.indexOf('ppe-hosted.com') >= 0) {
        res('proofpoint')
    } else if (mx.indexOf('pphosted.com') >= 0) {
        res('proofpoint')
    } else if (mx.indexOf('google.com') >= 0) {
        res('gsuite')
    } else if (mx.indexOf('secureserver.net') >= 0) {
        res('godaddy')
    } else if (mx.indexOf('arsmtp.com') >= 0) {
        res('appriver')
    } else if (mx.indexOf('emailsrvr.com') >= 0) {
        res('rackspace')
    } else if (mx.indexOf('serverdata.net') >= 0) {
        res('intermedia')
    } else if (mx.indexOf('appriver.com') >= 0) {
        res('appriver')
    } else if (mx.indexOf('mycloudmailbox.com') >= 0) {
        res('mycloudmailbox')
    } else if (mx.indexOf('1and1.com') >= 0) {
        res('1and1')
    } else if (mx.indexOf('ihostexchange.net') >= 0) {
        res('ihostexchange')
    } else if (mx.indexOf('domainlocalhost.com') >= 0) {
        res('domainlocalhost')
    } else if (mx.indexOf('lawyers-mail.com') >= 0) {
        res('LexisNexis')
    } else {
        res('')
    }
})
