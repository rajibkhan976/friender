Feature: Sync With Kyubi

    User should be able to login with user created via Kyubi

    Scenario: user should be able to login with Kyubi user credentials

        Given User created via Kyubi
        When  I can login with the user created via Kyubi and default password of Kyubi
        Then  I should see landed up into password reset page
   