const dns = require('dns');
const fs = require('fs');
var whois = require('node-whois')
const wj = require('whois-json')
var os = require('os');

const parseWhois = (domain, data) => {
    const rows = data.split(os.EOL)
    const results = {}

    rows.forEach((row) => {
        const split = row.split(':')
        if (split && split.length > 1) {
            switch (split[0]) {
                case "Registrar URL":
                    results.Registrar_URL = `${split[1]}:${split[2]}`
                    break
                case "Registrar":
                    console.log(`reg: ${split}`)
                    results.Registrar = split[1]
                    break
                case "Registry Registrant ID":
                    results.Registrant_ID = split[1]
                    break
                case "Registrant Name":
                    results.Registrant_Name = split[1]
                    break
                case "Registrant Organization":
                    results.Registrant_Organization = split[1]
                    break
                case "Registrant Email":
                    results.Registrant_Email = split[1]
                    break
                case "Admin Name":
                    results.Admin_Name = split[1]
                    break
                case "Admin Organization":
                    results.Admin_Organization = split[1]
                    break
                case "Admin Email":
                    results.Admin_Email = split[1]
                    break
                case "Tech Name":
                    results.Tech_Name = split[1]
                    break
                case "Tech Organization":
                    results.Tech_Organization = split[1]
                    break
                case "Tech Email":
                    results.Tech_Email = split[1]
                    break
            }
        }
    })

    return results
}

const getRecords = () => {
    const data = fs.readFileSync("mx-lookup.csv", "utf8");
    const rows = data.split(os.EOL)
    let idx = 0
    const records = []
    const errors = []

    const isDone = () => {
        idx++
        if (idx == rows.length) {
            console.log('finished getting records.')
            fs.writeFileSync("whois.csv", records, "utf8")
            fs.writeFileSync("whoisErrors.csv", errors, "utf8")
        } else {
            console.log(`${idx} of ${rows.length}`)
        }
    }

    rows.forEach((domain, lines) => {
        if (domain) {
            domain = domain.trim()
            setTimeout(() => {
                whois.lookup(domain, function (err, data) {
                    if (err) {
                        errors.push(`${domain},${err}${os.EOL}`)
                        isDone()
                    } else {
                        const r = parseWhois(domain, data)
                        records.push(`${domain},${r.Registrar_URL},${r.Registrar},${r.Registrant_ID},${r.Registrant_Name},${r.Registrant_Organization},${r.Registrant_Email},${r.Admin_Name},${r.Admin_Organization},${r.Admin_Email},${r.Tech_Name},${r.Tech_Organization},${r.Tech_Email}${os.EOL}`)
                        isDone()
                    }
                })
            }, lines * 250)
        } else {
            isDone()
        }
    })
}

//getRecords()

const domain = "amic.co.uk"

setTimeout(() => {
    wj(domain, function (err, data) {
        if (err) {
            errors.push(`${domain},${err}${os.EOL}`)
        } else {
            console.log(JSON.stringify(data, null, 2))
            //console.log(parseWhois(domain, data))
        }
    })
})
