global class BuscaCms {
    
    @InvocableMethod(label='Buscar Registros TST_CM' description='Busca registros TST_CM por IDs e retorna com dados estruturados')
    global static List<BuscaCmsResponse> buscarRegistros(List<BuscaCmsRequest> requests) {
        if (requests == null || requests.isEmpty()) {
            return new List<BuscaCmsResponse>();
        }
        
        BuscaCmsRequest request = requests[0];
        List<String> recordIds = request.recordIds;
        
        // Busca os registros no banco
        List<TST_CM__c> records = [
            SELECT Id, Name, CreatedDate, LastModifiedDate, OwnerId 
            FROM TST_CM__c 
            WHERE Id IN :recordIds
        ];
        
        // Converte para TstCmRecord
        List<TstCmRecord> tstCmRecords = new List<TstCmRecord>();
        for (TST_CM__c rec : records) {
            tstCmRecords.add(new TstCmRecord(
                rec.Id,
                rec.Name,
                rec.CreatedDate,
                rec.LastModifiedDate,
                rec.OwnerId
            ));
        }
        
        // Encapsula em Response
        BuscaCmsResponse response = new BuscaCmsResponse(tstCmRecords);
        return new List<BuscaCmsResponse> { response };
    }
    
    // ===== REQUEST CLASS =====
    global class BuscaCmsRequest {
        
        @InvocableVariable(required=true label='Record IDs' description='IDs dos registros TST_CM para buscar')
        global List<String> recordIds;
        
        global BuscaCmsRequest() {
            this.recordIds = new List<String>();
        }
        
        global BuscaCmsRequest(List<String> recordIds) {
            this.recordIds = recordIds;
        }
    }
    
    // ===== RESPONSE CLASS =====
    global class BuscaCmsResponse {
        
        @InvocableVariable(label='Registros' description='Lista de registros TST_CM encontrados')
        global List<TstCmRecord> records;
        
        global BuscaCmsResponse() {
            this.records = new List<TstCmRecord>();
        }
        
        global BuscaCmsResponse(List<TstCmRecord> records) {
            this.records = records;
        }
    }
}