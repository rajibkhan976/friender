class register {
  constructor() {
    this.emailfield = "input[type=email]";
    this.fullname = "input[type=text]";
    this.termsandcondition = ".checkmark";
    this.signupbuttonclick = "button.btn-primary";
    this.errormsg = ".error-mesage";
  }
  get_signuppage() {
    return cy.visit("/signup");
  }
  get_emailfield() {
    return cy.get(this.emailfield);
  }
  get_fullname() {
    return cy.get(this.fullname);
  }
  get_termsandcondition() {
    return cy.get(this.termsandcondition);
  }
  get_signupbuttonclick() {
    return cy.get(this.signupbuttonclick);
  }
  get_errormsg() {
    return cy.get(this.errormsg);
  }
  get_backtologin(){
    return cy.get(this.signupbuttonclick+".d-block")
  }
}
module.exports = new register();
