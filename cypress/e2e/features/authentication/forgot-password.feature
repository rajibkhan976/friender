Feature: Forget password

    User should change password if we forget password

    Scenario: user should be able to renew the password

        Given I entered to the web portal
        Given I have Forget password api 
        When  I entered my valid Email-id and click on continue button
        Then  I should see the email sent confirmation message and request response in API

    Scenario: user should not be able to renew the password with invalid email

        Given I entered to the web portal
        When  I entered my invalid Email-id and click on continue button
        Then  I should see the email is invalid confirmation message

    Scenario: user should be able to check forget password api

        Given I have Forget password api 
        When  I want to check Forget password api is working or not
