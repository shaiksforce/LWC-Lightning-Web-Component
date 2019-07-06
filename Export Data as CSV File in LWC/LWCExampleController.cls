public inherited sharing class LWCExampleController {
    
    @AuraEnabled(Cacheable = true)
    public static List<Account> getAccounts(){
      return [SELECT Id, Name,Industry, Type, Phone, Rating, AccountNumber FROM Account ORDER BY Name LIMIT 10];
    }
}
