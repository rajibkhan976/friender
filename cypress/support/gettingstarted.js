import getstarted from '../pages/gettingstarted.spec'
let val;
before(() => {
	cy.fixture("devcred").then((data) => {
		val = data;
	})
})
Cypress.Commands.add('gettingstartedpagelanding', () => {
	cy.contains("Getting Started").should("be.visible");
});
Cypress.Commands.add('stepstocompletegettingstarted', () => {
	cy.contains("Steps to make quality friends and track engagements").should("be.visible");
});
Cypress.Commands.add('firststepInstallingFriender', () => {
	cy.contains("Install Friender Extension").should("be.visible");
});
Cypress.Commands.add('clickingInstallnow', () => {
	getstarted.get_installfriender().contains("Install now").click();
});
Cypress.Commands.add('installed', () => {
	getstarted.get_installed().contains("Installed").should("be.visible");
});
// Cypress.Commands.add('Success-Installation-page', () => {
//     cy.contains("").should("be.visible");
// });
Cypress.Commands.add('gotsecondstepconnectingfacebook', () => {
	cy.contains("Let us connect to your facebook account").should("be.visible");
});
Cypress.Commands.add('clickingconnectnow', () => {
	getstarted.get_connectfacebook().click({force: true});
});
Cypress.Commands.add('noaccountislogedin', () => {
	cy.contains("Coudnot found any facebook account!").should("be.visible");
});
Cypress.Commands.add('facebookaccountbannerOpen', () => {
	if (cy.contains(val.username)) {

		cy.log("correct facebook account");
	}
});
Cypress.Commands.add('clickingconnect', () => {
	getstarted.get_connectfacebookprofile().click({force: true});
});
Cypress.Commands.add('clickingonlogintoyourfacebookaccount', () => {
	getstarted.get_gotoyourfacebook().click();
});
Cypress.Commands.add('clickingonrefreshiconofthebanner', () => {
	getstarted.get_reloadbutton().contains("Refresh").click();
});
Cypress.Commands.add('clickingonrefreshagain', () => {
	getstarted.get_reloadagain().click();
});
Cypress.Commands.add('connected', () => {
	getstarted.get_connected().contains("Connected").should("be.visible");
});
// Cypress.Commands.add('thirdstepsyncfriendlist', () => {
//cy.contains("Sync your friends list and engagement").should("be.visible")
// });
Cypress.Commands.add('logoutsuddenly', () => {
	cy.contains("Something went wrong! Make sure in your browser you have logged into your facebook account. try again, click on the Refresh button.").should("be.visible")
});
Cypress.Commands.add('clickingsyncnow', () => {
	getstarted.get_syncnowbutton().contains("Sync now").click();
});
Cypress.Commands.add('totalcountoffriendsandsyncedfriends', () => {
	if (cy.contains(val.facebookfriends) == cy.contains(val.connectedfriends)) {
		cy.log("all the facebook friends are synced now");
	}
});
Cypress.Commands.add('Congratulations', () => {
	cy.contains("Congratulations").should("be.visible");
})
Cypress.Commands.add('leftsidefriendsmenuclick', () => {
	getstarted.get_leftsidemenu().click();
});
Cypress.Commands.add('facebook-friendslist-display', () => {
	cy.contains("Friend list").should("be.visible");
});
// Cypress.Commands.add('login-with-facebook-credentials', () => {
//     cy.visit("https://www.facebook.com/");
//     cy.get('.inputtext _55r1 _6luy').clear().type('bikram.biswas@tier5.in');
//     cy.get('.inputtext _55r1 _6luy _9npi').clear().type('Test@1234');
// })
// Cypress.Commands.add('facebookeexistingaccountlogout', () => {
//     cy.visit("https://www.facebook.com/");
//     if (cy.get('#mount_0_0_js > div:nth-child(2) > div:nth-child(1) > div > div.x9f619.x1n2onr6.x1ja2u2z > div > div > div > div.x78zum5.xdt5ytf.x10cihs4.x1t2pt76.x1n2onr6.x1ja2u2z > div.x9f619.x1n2onr6.x1ja2u2z.x78zum5.x2lah0s.xl56j7k.x1qjc9v5.xozqiw3.x1q0g3np.x1t2pt76.x17upfok > div > div.x9f619.x1ja2u2z.xnp8db0.x112wk31.xnjgh8c.xxc7z9f.x1t2pt76.x1u2d2a2.x6ikm8r.x10wlt62.x1xzczws.x7wzq59.xxzkxad.x9e5oc1 > div > div > div.x78zum5.xdt5ytf.x1iyjqo2.x1n2onr6 > div > div > div.x1iyjqo2 > ul > li > div > a > div.x13fuv20.x26u7qi.xu3j5b3.x1q0q8m5.x972fbf.xm0m39n.xcfux6l.x1qhh985.x9f619.x78zum5.x1iyjqo2.xs83m0k.x1qughib.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xeuugli.xexx8yu.x18d9i69.x1n2onr6.x1ja2u2z.x6s0dn4.x1q0g3np.x1sxyh0.xurb0ha.x1gg8mnh > div.x13fuv20.x26u7qi.xu3j5b3.x1q0q8m5.x972fbf.xm0m39n.xcfux6l.x1qhh985.x9f619.x78zum5.x1iyjqo2.xs83m0k.x1qughib.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.x2lwn1j.xeuugli.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1ja2u2z.x6s0dn4.xkh2ocl.x1q0g3np.x1n2onr6 > div > div > div > div > span > span').invoke('text').then((text1) => {
//         expect(text1).to.eq('Bikram Biswas QA')
//     })) {
//         cy.get('.x1rg5ohu x1n2onr6 x3ajldb x1ja2u2z').click();
//         cy.get('.x1qjc9v5 x13fuv20 x26u7qi xu3j5b3 x1q0q8m5 x972fbf xm0m39n xcfux6l x1qhh985 x9f619 x78zum5 xdt5ytf x1iyjqo2 xs83m0k x1qughib xdj266r x11i5rnm xat24cr x1mh8g0r x2lwn1j xeuugli x4uap5 xkhd6sd x1n2onr6 x1ja2u2z x1r8uery xz9dl7a xsag5q8').contains('Log Out').click();
//     }
// });
Cypress.Commands.add('columnNamesCheck', () => {

	cy.contains("Name").should("be.visible");
	cy.contains("Status").should("be.visible");
	cy.contains("Email").should("be.visible");
	cy.contains("Gender").should("be.visible");

})