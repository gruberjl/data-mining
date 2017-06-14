// MX lookup

const dns = require('dns');
const fs = require('fs');
var os = require('os');

const getRecords = () => {
    const data = fs.readFileSync("barracuda-mx-records.csv", "utf8");
    const rows = data.split(os.EOL)
    let idx = 0
    const records = []
    const errors = []

    const isDone = () => {
        idx++
        if (idx == rows.length) {
            console.log('finished getting records.')
            fs.writeFileSync("MxIpMap.csv", records, "utf8")
            fs.writeFileSync("MxIpMapErrors.csv", errors, "utf8")
        } else {
            console.log(`${idx} of ${rows.length}`)
        }
    }

    rows.forEach((row, lines) => {
        const mxSplit = row.split(',')
        let domain = mxSplit[0]
        let mx = mxSplit[1]

        if (mx) {
            domain = domain.trim()
            mx = mx.trim()
            setTimeout(() => {
                dns.lookup(mx, (err, address) => {
                    if (err) {
                        errors.push(`${domain},${mx},IP ERROR: ${err}${os.EOL}`)
                        isDone()
                    } else {
                        records.push(`${domain},${mx},${address}${os.EOL}`)
                        isDone()
                    }
                })
            }, lines * 250)
        } else {
            isDone()
        }
    })
}

getRecords()

//const a = "additionalpersonnel-com.mail.protection.outlook.com"
//dns.lookup(a, (err, address) => {
//    console.log(err)
//    console.log(address)
//})

const getMxRecords = () => {
    const data = fs.readFileSync("barracuda-mx-records.csv", "utf8");
    const record = data.split(os.EOL)
    
    const records = []
    const errors = []
    let idx = 0

    const isDone = () => {
        idx++
        if (idx == domains.length) {
            console.log('finished getting records.')
            fs.writeFileSync("records.csv", records, "utf8")
            fs.writeFileSync("errors.csv", errors, "utf8")
        }
    }

    domains.forEach((domain) => {
        dns.resolveMx(domain, (err, mxResults) => {
            if (err) {
                errors.push(`${domain}, ${err}${os.EOL}`)
                isDone()
            } else if (mxResults.length == 0) {
                errors.push(`${domain}, No mx records found.${os.EOL}`)
                isDone()
            } else {
                const addr = mxResults.map((val) => val.exchange)
                dns.resolve4(addr[0], (ipErr, ipAddresses) => {
                    if (ipErr) {
                        errors.push(`${domain}, IP ERROR: ${ipErr}${os.EOL}`)
                        isDone()
                    } else if (ipAddresses.length == 0) {
                        errors.push(`${domain}, No IPs resolved.${os.EOL}`)
                        isDone()
                    } else {
                        records.push(`${domain}, ${ipAddresses.join(',')}, ${addr.join(',')}${os.EOL}`)
                        isDone()
                    }
                })

            }
        })
    })
}

//getMxIp_CSV()

const getMX_CSV = () => {
    const data = fs.readFileSync("mx-lookup.csv", "utf8");
    const domains = data.split(os.EOL)
    const records = []
    const errors = []
    let idx = 0

    const isDone = () => {
        idx++
        if (idx == domains.length) {
            console.log('finished getting records.')
            fs.writeFileSync("records.csv", records, "utf8")
            fs.writeFileSync("errors.csv", errors, "utf8")
        }
    }

    domains.forEach((domain) => {
        dns.resolveMx(domain, (err, results) => {
            if (err) {
                errors.push(`${domain}, ${err}${os.EOL}`)
            } else if (results.length == 0) {
                errors.push(`${domain}, No mx records found.${os.EOL}`)
            } else {
                const addr = results.map((val) => val.exchange)
                records.push(`${domain}, ${addr.join(',')}${os.EOL}`)
            }

            isDone()
        })
    })
}