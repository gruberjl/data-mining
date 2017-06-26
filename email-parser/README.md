## Find

find accepts a domain, first name, and last name and attempts to guess what the email address is. Running the variables through multiple formulas to create a list of guesses. Then Find will take the guesses and validate them against the email server. If an email address is validated, the results are returned.

### Examples

```JavaScript
find("gitbit.org", {firstName: "john", lastName:"gruber"}).then((result) => {
  console.log(result)
  result == { found: true, emailAddress: 'john.gruber@gitbit.org' }
})
```
