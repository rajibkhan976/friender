//utility.js
export class Utility {
    getBaseUrl() {
        let env1 = Cypress.env('ENV'); //Get the value of evnironment variable i.e ENV
        if (env1 == 'dev') //Check the value
            return "https://dev.friender.io"; //return desired url
        else if (env1 == 'local')
            return "http://localhost:3000";
    }
    getemail() {
        var chars = 'abcdefghijklmnopqrstuvwxyz';
        return chars[Math.floor(Math.random() * 26)] + Math.random().toString(36).substring(2, 11) + '@domain.com';
    }
}