import { Given, When, Then, } from "@badeball/cypress-cucumber-preprocessor"
import friendlist from "../../pages/friendlist.spec"

Given("I landed into Friender portal with particular email and password", () => {
  cy.loginwithfacebookdata()
  cy.login()
});

When("I am in Friendlist Tab", () => {
  Cypress.on('uncaught:exception', (err, runnable) => {
    return false
  })
  cy.wait(5000)
  friendlist.getfriendlisttab()
});

Then("I select pagesize as 30 I can see 30 friends in a single page", () => {
  friendlist.getpagesize()
});

Then("I can selectall button from the friendlist", () => {
  friendlist.get_selectall()
});

Then("I can search a person name which contain {string}", (name1) => {
  cy.writeFile('cypress/fixtures/friendlistdata.json', { "name1": name1 })
  friendlist.get_friend()
  friendlist.apply()
});

Then("I can search a person name which contain {string} and {string}", (name1, name2) => {
  cy.writeFile('cypress/fixtures/friendlist2data.json', { "name1": name1, "name2": name2 })
  friendlist.get_friend()
  friendlist.get_anotherfriend()
  friendlist.apply()
});

Then("I can search a person name which contain {string} or {string}", (name1, name2) => {
  cy.writeFile('cypress/fixtures/friendlistdata.json', { "name1": name1, "name2": name2 })
  friendlist.get_friend()
  friendlist.get_orbutton()
  friendlist.get_anotherfriend()
  friendlist.apply()
});

Then("I can sort name column with descending order", () => {
  friendlist.namecolumnsortwithdescending()
})
Then("I can sort name column with ascending order", () => {
  friendlist.namecolumnsortwithascending()
})

Then("I can sort status column with ascending order", () => {
  friendlist.statuscolumnsortwithascending()
})

Then("I can sort status column with descending order", () => {
  friendlist.statuscolumnsortwithdescending()
})

Then("I can sort Sync & Added Date &  Time  column with descending order", () => {
  friendlist.syncandaddeddateandtimecolumnsortwithdescending()
})

Then("I can sort Total Reaction column with descending order", () => {
  friendlist.totalreactioncolumnsortwithdescending()
})

Then("I can sort Total Reaction column with ascending order", () => {
  friendlist.totalreactioncolumnsortwithascending()
})

Then("I can sort Message Count column with ascending order", () => {
  friendlist.messagecountcolumnsortwithascending()
})

Then("I can sort Message Count column with descending order", () => {
  friendlist.messagecountcolumnsortwithdescending()
})

Then("I can sort Total Comment column with ascending order", () => {
  friendlist.totalcommentcolumnsortwithascending()
})

Then("I can sort Total Comment column with descending order", () => {
  friendlist.totalcommentcolumnsortwitdescending()
})

Then("I can filter the list only with male", () => {
  friendlist.filterwithmale()
})

Then("I can filter the list only with female", () => {
  friendlist.filterwithfemale()
  friendlist.apply()
})
Then("I can filter the list only with Deactivate", () => {
  friendlist.status_deactivate()
  friendlist.apply()
})

Then("I can reset it back and get the previous list", () => {
  friendlist.reset()
})
