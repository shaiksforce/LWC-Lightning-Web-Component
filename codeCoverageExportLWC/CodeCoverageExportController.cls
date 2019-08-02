public inherited sharing class CodeCoverageExportController {

    @AuraEnabled
    public static CoverageWrap exportClassCoverage(String strClassOrTrigger) {
        String strResourceQuery = null;
        String strResponse = null;
        CoverageWrap cw;

        if(String.isNotBlank(strClassOrTrigger)) {
            strResourceQuery = 'tooling/query/?q=Select+id,ApexClassorTrigger.Name,NumLinesCovered,NumLinesUncovered+from+ApexCodeCoverageAggregate+where+ApexClassorTrigger.Name=\''+ strClassOrTrigger +'\'';
        }
        else {
            strResourceQuery = 'tooling/query/?q=Select+id,ApexClassorTrigger.Name,NumLinesCovered,NumLinesUncovered+from+ApexCodeCoverageAggregate';
        }

        if(strResourceQuery != null) {
            // OrgREST Custom Class returns the response as string
            strResponse = OrgREST.retriveResult(strResourceQuery, 'GET', null);
        }

        if(strResponse != null) {
            cw = new CoverageWrap();
            cw  = (CoverageWrap)JSON.deserialize(strResponse, CoverageWrap.class);
            system.debug('cw  '+cw  );
        }

        return cw;
 
    }


    public class Attributes {
       @AuraEnabled public String type;
       @AuraEnabled public String url;
    }

    public class Records {
       @AuraEnabled public Attributes attributes;
       @AuraEnabled public String Id;
       @AuraEnabled public ApexClassOrTrigger ApexClassOrTrigger {get;set;}
       @AuraEnabled public Integer NumLinesCovered {get;set;}
       @AuraEnabled public Integer NumLinesUncovered {get;set;}
    }

    public class ApexClassOrTrigger {
       @AuraEnabled public Attributes attributes;
       @AuraEnabled public String Name{get;set;}
    }
    
    public class CoverageWrap{
      @AuraEnabled public Integer size;
      @AuraEnabled public Integer totalSize;
      @AuraEnabled public Boolean done;
      @AuraEnabled public Object queryLocator;
      @AuraEnabled public String entityTypeName;
      @AuraEnabled  public List<Records> records{get;set;}
    }
}
