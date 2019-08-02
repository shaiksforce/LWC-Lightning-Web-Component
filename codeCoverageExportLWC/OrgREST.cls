 /*
purpose: This Class gives response based on resource name you entered.
Author: Shaik Nagajani
Date: 15/June/2019
*/

public inherited sharing class OrgREST {
    
    public static String retriveResult(String strResourceName, String strMethod, String strBody) {
        String response;
         String strEndPonitURL = URL.getSalesforceBaseUrl().toExternalForm() + '/services/data/v46.0/' + strResourceName;
        if(String.isNotBlank(strResourceName)) {
            HttpRequest httpRequest = new HttpRequest();  
            httpRequest.setEndpoint(strEndPonitURL);

            httpRequest.setMethod(strMethod);   
            httpRequest.setHeader('Authorization', 'OAuth ' + getSessionId());        
            httpRequest.setHeader('Authorization', 'Bearer ' + getSessionId()); 
            
            if(String.isNotBlank(strBody)) {
                httpRequest.setBody(strBody);
                httpRequest.setHeader('Content-Type', 'application/json');
            	httpRequest.setHeader('Accept', 'application/json');
            }
            
            try {  
                Http http = new Http();   
                HttpResponse httpResponse = http.send(httpRequest);  

                while(httpResponse.getStatusCode() == 302) {
                    httpRequest.setEndpoint(httpResponse.getHeader('Location'));
                    httpResponse = new Http().send(httpRequest);
                }

                if (httpResponse.getStatusCode() == 200 ) {  
                    response = httpResponse.getBody();  
                } 
                else {  
                    throw new CalloutException(httpResponse.getBody());  
                }   
            } 
            catch(Exception ex) {  
                throw ex;  
            }  
        } 
        return response;
    }

    public static String getSessionId() {
        return Page.GenerateSessionIdForLWC.getContent().toString();
    }
}
