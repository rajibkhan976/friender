Feature: login and logout

    User should login and logout  successfully

    Scenario: user should be logged in successfully for the very first time 
        
        Given User created via Kyubi
        When  I can login with the user created via Kyubi and default password of Kyubi
        Then  I should see landed up into password reset page


    Scenario: user should not be redirected to the dashboard page if he enters the wrong email or password
        
        Given I enter to the portal
        When  I entered a wrong Email-id and default password sent by friender team or vice versa
        Then  I clicked on continue
        Then  I should not see the welcome dashboard message