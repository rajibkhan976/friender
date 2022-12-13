class forgetpwd {
  constructor() {
    this.email = "input[type=email]";
    this.continuebtn = ".btn-primary";
  }
  get_forgetpwdpage() {
    return cy.get('span.forget-wraper.float-right').click();
  }
  get_emailfield() {
    return cy.get(this.email);
  }
  get_continuebuttonclick() {
    return cy.get(this.continuebtn);
  }
}
module.exports = new forgetpwd();
