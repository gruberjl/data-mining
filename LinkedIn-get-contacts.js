const email = process.env.LINKEDIN_EMAIL
const password = process.env.LINKEDIN_PASSWORD

var casper = require('casper').create();
casper.start('https://www.linkedin.com/');

casper.then(function () {
    this.echo('First Page: ' + this.getTitle());
});

casper.thenOpen('http://phantomjs.org', function () {
    this.echo('Second Page: ' + this.getTitle());
});

casper.run();



const horseman = new Horseman()
    .userAgent('Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0')
    .open('')
    .type('#login-email', email)
    .type('#login-password', password)
    .wait(3000)
    .click('#login-submit')
    .waitForNextPage({ timeout: 15000 })
    .log('Logged in')
    .do(function (done) {
        horseman
            .log('hello')
            .openTab("https://www.linkedin.com/company-beta/775544/")
            .title()
            .log()
            .closeTab(1)
            .then(() => {
                done()
            })
    })
    .close()
    .catch(function (error) { console.log(error) })