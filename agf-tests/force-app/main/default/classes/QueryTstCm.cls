global class QueryTstCm {
    
    global class TstCmRecord {
        @AuraEnabled global String id;
        @AuraEnabled global String name;
        @AuraEnabled global String createdDate;
        @AuraEnabled global String lastModifiedDate;
        @AuraEnabled global String ownerId;
        
        global TstCmRecord(String id, String name, String createdDate, String lastModifiedDate, String ownerId) {
            this.id = id;
            this.name = name;
            this.createdDate = createdDate;
            this.lastModifiedDate = lastModifiedDate;
            this.ownerId = ownerId;
        }
    }
    
    @AuraEnabled(cacheable=true)
    global static List<Map<String, String>> getRecords() {
        List<Map<String, String>> results = new List<Map<String, String>>();
        try {
            for (TST_CM__c record : [SELECT Id, Name, CreatedDate, LastModifiedDate, OwnerId FROM TST_CM__c ORDER BY Name ASC LIMIT 10000]) {
                Map<String, String> recordMap = new Map<String, String>();
                recordMap.put('id', record.Id);
                recordMap.put('name', record.Name);
                recordMap.put('createdDate', String.valueOf(record.CreatedDate));
                recordMap.put('lastModifiedDate', String.valueOf(record.LastModifiedDate));
                recordMap.put('ownerId', record.OwnerId);
                results.add(recordMap);
            }
        } catch (Exception e) {
            throw new AuraHandledException('Erro: ' + e.getMessage());
        }
        return results;
    }
    
    @AuraEnabled(cacheable=true)
    global static List<Map<String, String>> getRecordsByIds(List<String> recordIds) {
        List<Map<String, String>> results = new List<Map<String, String>>();
        try {
            if (recordIds == null || recordIds.isEmpty()) {
                return results;
            }
            for (TST_CM__c record : [SELECT Id, Name, CreatedDate, LastModifiedDate, OwnerId FROM TST_CM__c WHERE Id IN :recordIds ORDER BY Name ASC]) {
                Map<String, String> recordMap = new Map<String, String>();
                recordMap.put('id', record.Id);
                recordMap.put('name', record.Name);
                recordMap.put('createdDate', String.valueOf(record.CreatedDate));
                recordMap.put('lastModifiedDate', String.valueOf(record.LastModifiedDate));
                recordMap.put('ownerId', record.OwnerId);
                results.add(recordMap);
            }
        } catch (Exception e) {
            throw new AuraHandledException('Erro: ' + e.getMessage());
        }
        return results;
    }
    
    @AuraEnabled
    global static Map<String, String> getRecord(String recordId) {
        try {
            if (String.isBlank(recordId)) {
                throw new AuraHandledException('ID inválido');
            }
            List<TST_CM__c> records = [SELECT Id, Name, CreatedDate, LastModifiedDate, OwnerId FROM TST_CM__c WHERE Id = :recordId LIMIT 1];
            if (records.isEmpty()) {
                throw new AuraHandledException('Registro não encontrado');
            }
            TST_CM__c r = records[0];
            Map<String, String> recordMap = new Map<String, String>();
            recordMap.put('id', r.Id);
            recordMap.put('name', r.Name);
            recordMap.put('createdDate', String.valueOf(r.CreatedDate));
            recordMap.put('lastModifiedDate', String.valueOf(r.LastModifiedDate));
            recordMap.put('ownerId', r.OwnerId);
            return recordMap;
        } catch (Exception e) {
            throw new AuraHandledException('Erro: ' + e.getMessage());
        }
    }
}