//utility.js
export class Utility {

    getBaseUrl() {
        let env1 = Cypress.env('ENV'); //Get the value of evnironment variable i.e ENV
        if (env1 == 'dev') //Check the value
            return "http://localhost:3000/"; //return desired url
        else if (env1 == 'prod')
            return "";
    }
}