import forgetpwd from "../pages/forgot-password.spec"
let values;
beforeEach(() => {
	cy.fixture("devcred").then((data) => {
		values = data;
	})
})
Cypress.Commands.add('forgetpwdvalid', () => {
	forgetpwd.get_forgetpwdpage();
	forgetpwd.get_emailfield().type(values.email);
	forgetpwd.get_continuebuttonclick().click();
});
Cypress.Commands.add('forgetpwdinvalid', () => {
	forgetpwd.get_forgetpwdpage();
	forgetpwd.get_emailfield().type(values.invalidEmail);
	cy.wait(5000)
	//forgetpwd.get_continuebuttonclick().click();
});