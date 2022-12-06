Feature: Sync With Kyubi

    User should be able to login with user created via Kyubi

    Scenario: user should be able to login with Kyubi user credentials

        Given User created via Kyubi
        When  I will be in friender platform 
        Then  I should see landed up into password reset page
   