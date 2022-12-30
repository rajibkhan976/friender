// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
import './logincommands.js'
import './signupcommands.js'
import './forgetpassword'
import './gettingstarted.js'
import 'cypress-ag-grid';



//import 'cypress-mochawesome-reporter/register'

// Alternatively you can use CommonJS syntax:
// require('./commands')
let identity
Cypress.Commands.add('postToken', () => {
cy.request({
    method: 'POST',
    url: func.login + Cypress.env('api') + '/login',
    headers: {
     // 'Authorization': 'Bearer' + payload.token,
      'Content-Type': 'application/json'
    },
    body: {
      "email": "sss@gmail.com",
      "password": "Sangeeta@321"
    }
  })   .its('body')
  .then((response) => {
      identity = response
      window.localStorage.setItem('identity', JSON.stringify(identity))
      cy.log(identity.token)
  })
})