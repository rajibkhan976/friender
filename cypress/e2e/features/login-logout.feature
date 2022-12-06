Feature: login and logout

    User should login and logout  successfully

    Scenario: user should be logged in successfully for the very first time 
        
        Given I signin newly to Friender
        When  I entered my valid Email-id and my default password sent by friender team
        Then  I click on continue
        Then  I should see landed up into password reset page


    Scenario: user should not be redirected to the dashboard page if he enters the wrong email or password
        
        Given I enter to the portal
        When  I entered a wrong Email-id and default password sent by friender team or vice versa
        Then  I clicked on continue
        Then  I should not see the welcome dashboard message