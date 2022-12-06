import login from "../pages/login.spec"
var RandExp = require('randexp');
let values
class resetpwd {
  constructor() {
    this.password = "div[class=element-wraper]";
    this.button = ".btn-primary"
  }

  get_newpassword() {
    return cy.get(this.password)
      .get("input[placeholder='Set new Password']")

  }

  confirm_newpassword() {
    return cy.get(this.password)
      .get("input[placeholder='Confirm new Password']")
  }

  get_buttonnext() {
    return cy.get(this.button).contains("Next")
  }

  get_buttonpwdisnotmatched() {
    return cy.get(this.button).contains("Passwords did not matched")
  }

  loginforfirst() {
    cy.fixture("signeddata.json").then((data) => {
      values = data;
      cy.visit("/")
      login.get_emailfield().type(values.email);
      login.get_password().type(values.defaultPass,{log:false});

    })

  }

  generatepwd() {
    var str = new RandExp(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])([a-zA-Z0-9@$!%*?&]{8,})$/).gen();
    return str
  }

  getpassword() {
    let newpassword = this.generatepwd()
    cy.fixture("signeddata.json").then((data) => {
      values = data
      let email = values.email
      cy.writeFile("cypress/fixtures/logindata.json", { email, newpassword })
    })
  }
  get_resetpasswordpage()
  {
    cy.contains("Welcome to Friender").should('be.visible')
  }
}

module.exports = new resetpwd();