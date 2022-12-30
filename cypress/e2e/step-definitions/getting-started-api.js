import { Given, When, Then, } from "@badeball/cypress-cucumber-preprocessor"
Given("I connect to the facebook with a profile", () => {
  cy.readFile('cypress/config/config.json').then((func) => {
    cy.request({
      method: 'POST',
      url: func.gettingstarted + Cypress.env('api') + '/store-user-profile',
      headers: {
        'Authorization': func.token,
        'Content-Type': 'application/json'
      },
      body: {
        "name": "Bikram Biswas QA",
        "profilePicture": "https://scontent.fccu4-2.fna.fbcdn.net/v/t39.30808-1/281663091_101950535866164_5522594804002278663_n.jpg?stp=cp0_dst-jpg_e15_p50x50_q65&_nc_cat=110&ccb=1-7&_nc_sid=0c64ff&efg=eyJpIjoidCJ9&_nc_ohc=UlysrbWEBsUAX9jZ5g9&_nc_ht=scontent.fccu4-2.fna&oh=00_AfDaxHCP8araThH67iHpbM-AEL0kEpsZSVpNQlW6NCNKGQ&oe=63B1B8D0",
        "profileUrl": "https://www.facebook.com/profile.php?eav=AfaopHI17h5LK4x1uf9MqMd15OhyuPlYAuNfpSZjXygAlV8Yah6ANPpU8s5V8EMrITs",
        "userId": "100081536522237"
      }
    }).then((res) => {
      cy.fixture('login-api').then((payload) => {
        cy.log(JSON.stringify(res));
        expect(res.status).to.eq(payload.status)
        expect(res.body).to.eq("User profile data update succesfully.");
    })
    })
  })
})

Then("I get the response properly", () => {
  cy.log("api is hitting and response coming properly")
})
Given("I sync all the friends through api", () => {
  cy.readFile('cypress/config/config.json').then((func) => {
    cy.request({
      method: 'GET',
      url: func.fetchUserProfile + Cypress.env('api') + '/fetch-user-profiles',
      headers: {
        'Authorization': func.token,
        'Content-Type': 'application/json'
      },
    }).then((xhr) => {
      cy.log(xhr.status);
      cy.log(xhr.body);
      expect(xhr.body.message).to.eq("User profile data fetch succesfully.")
    })
  })
})
Then("I get the data and response properly", () => {
  cy.log("api is hitting and response coming properly")
})
