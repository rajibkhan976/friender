class forgetpwd {
  constructor() {
    this.email = "input[type=email]";
    this.continuebtn = ".btn-primary";
  }
  get_forgetpwdpage() {
    return cy.visit("/forget-password");
  }
  get_emailfield() {
    return cy.get(this.email);
  }
  get_continuebuttonclick() {
    return cy.get(this.continuebtn);
  }
}
module.exports = new forgetpwd();
