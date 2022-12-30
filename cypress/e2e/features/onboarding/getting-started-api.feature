Feature: Getting-started api test
User should be able to hit getting started api and check the response
  Scenario: user should be able to get the connect facebook api response
    Given I connect to the facebook with a profile
    Then  I get the response properly
  Scenario: user should be able to fetch the user profile
    Given I sync all the friends through api
    Then  I get the data and response properly
    