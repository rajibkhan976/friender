Feature: Friendlist

    User should be able to view all the friends from Facebook in Friender 

    Scenario: user should be able to check pagesize according to number of friends

        Given I landed into Friender portal with particular email and password
        When  I am in Friendlist Tab
        Then  I select pagesize as 30 I can see 30 friends in a single page

    Scenario: user should be able to select all the user in friendlist

        Given I landed into Friender portal with particular email and password
        When  I am in Friendlist Tab
        Then  I can selectall button from the friendlist

     Scenario: user should be able to filter name column according to requirement

        Given I landed into Friender portal with particular email and password
        When  I am in Friendlist Tab
        Then  I can search a person name which contain 'Asmita' 

    Scenario: user should be able to filter name column according to requiremen with and operator

        Given I landed into Friender portal with particular email and password
        When  I am in Friendlist Tab
        Then  I can search a person name which contain 'Asmita' and 'Debasmita'

    Scenario: user should be able to filter name column according to requiremen with or operator

        Given I landed into Friender portal with particular email and password
        When  I am in Friendlist Tab
        Then  I can search a person name which contain 'Asmita' or 'Debasmita'

    Scenario: user should be able to filter name column should be sort descending order

        Given I landed into Friender portal with particular email and password
        When  I am in Friendlist Tab
        Then  I can sort name column with descending order

    Scenario: user should be able to filter name column should be sort ascending order

        Given I landed into Friender portal with particular email and password
        When  I am in Friendlist Tab
        Then  I can sort name column with ascending order

    Scenario: user should be able to filter status column should be sort ascending order

        Given I landed into Friender portal with particular email and password
        When  I am in Friendlist Tab
        Then  I can sort status column with ascending order

    Scenario: user should be able to filter status column should be sort descending order

        Given I landed into Friender portal with particular email and password
        When  I am in Friendlist Tab
        Then  I can sort status column with descending order

    # Scenario: user should be able to filter sync Sync & Added Date &  Time  column should be sort descending order

    #     Given I landed into Friender portal with particular email and password
    #     When  I am in Friendlist Tab
    #     Then  I can sort Sync & Added Date &  Time  column with descending order

    Scenario: user should be able to filter Total Reaction should be sort ascending order

        Given I landed into Friender portal with particular email and password
        When  I am in Friendlist Tab
        Then  I can sort Total Reaction column with ascending order
        
    Scenario: user should be able to filter Total Reaction should be sort descending order

        Given I landed into Friender portal with particular email and password
        When  I am in Friendlist Tab
        Then  I can sort Total Reaction column with descending order
    
    Scenario: user should be able to filter Message Count should be sort ascending order

        Given I landed into Friender portal with particular email and password
        When  I am in Friendlist Tab
        Then  I can sort Message Count column with ascending order

    Scenario: user should be able to filter Message Count should be sort descending order

        Given I landed into Friender portal with particular email and password
        When  I am in Friendlist Tab
        Then  I can sort Message Count column with descending order

    Scenario: user should be able to filter Total Comment should be sort ascending order

        Given I landed into Friender portal with particular email and password
        When  I am in Friendlist Tab
        Then  I can sort Total Comment column with ascending order   

   Scenario: user should be able to filter Total Comment should be sort descending order

        Given I landed into Friender portal with particular email and password
        When  I am in Friendlist Tab
        Then  I can sort Total Comment column with descending order   

    Scenario: user should be able to filter Gender column should be filter if he/she wants to sort filter with Female

        Given I landed into Friender portal with particular email and password
        When  I am in Friendlist Tab
        Then  I can filter the list only with female

     Scenario: user should be able to filter Status column should be filter with Deactivate 

        Given I landed into Friender portal with particular email and password
        When  I am in Friendlist Tab
        Then  I can filter the list only with Deactivate
    
    Scenario: user should be able to reset Status column should after filtering 

        Given I landed into Friender portal with particular email and password
        When  I am in Friendlist Tab
        Then  I can filter the list only with Deactivate
        Then  I can reset it back and get the previous list
