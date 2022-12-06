Feature: Getting started
    User should get the facebook login option to get all data of their facebook friend list
    Scenario: user should get the getting started page after successfull login
        Given  user on the getting started page
        Then  user sees the steps below to complete the onboarding process
    Scenario: User should get their very first step of installing chrome extension
        Given user alrteady have the extension installed in the background
        When  user can see the status of all the steps
        Then  user should see the congratulation banner is showing along with the total count of friends
