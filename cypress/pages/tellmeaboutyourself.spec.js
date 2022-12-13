class tellmeaboutyourself {
  constructor() {
    this.skipbutton = ".skip-wraper"
    this.question = "div.selectbox-wraper"
    this.nextbutton = "button.btn-primary"
  }

  getskipbutton() {
    cy.get(this.skipbutton).click()
  }
  giveanswertoquestionfirst() {
    cy.get(this.question+':nth-child(1) > .select-wrapers > .selector_box').select('Marketing automation')
  }
  giveanswertoquestionsecond() {
    cy.get(this.question + ':nth-child(2) > .select-wrapers > .selector_box').select('Marketer')
  }
  giveanswertoquestionthree() {
    cy.get(this.question + ':nth-child(3) > .select-wrapers > .selector_box').select('FB automation')
  }
  getnextpage() {
    cy.get(this.nextbutton).contains("Next").click()
  }
  gettellusaboutyourselfpage() {
    cy.contains("Tell us about yourself").should('be.visible')
  }
}

module.exports = new tellmeaboutyourself()
