// MX lookup

const dns = require('dns');
const fs = require('fs');
var os = require('os');

const getMxIp_CSV = () => {
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

getMxIp_CSV()

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