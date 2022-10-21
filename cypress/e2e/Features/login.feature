Feature: login

    User should login successfully


    Scenario: user should be logged in successfully

        Given I enters to the web portal
        When  I entered my valid Email-id and my default password sent by friender team
        Then  I click on continue
        Then  I should see the login confirmation message
    Scenario: user should not be logged in successfully if he enters the wrong email

        Given I enter to the portal
        When  I entered a wrong emeil id and default password sent by friender team
        Then  I clicked on continue
        Then  I should see the validation message please enter the correct emmail id
    Scenario: user should not be logged in successfully if he enters the wrong password

        Given I click to the web portal
        When  I entered the email id emeil id and wrong password 
        Then  I  continue
        Then  I should see the validation message invalid password

    

