
var NameParse = require('./parse-names').NameParse;
module.exports = new NameParse();

/* example
const parser = (people) => {
  var humanname = require('./name-parser');

  people.forEach((person) => {
    console.log(humanname.parse(person.name))
  })
}
*/
