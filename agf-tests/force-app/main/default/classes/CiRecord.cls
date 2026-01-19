/**
 * @description Global data class para representar um registro TST_CI__c
 *              Contém informações do CI + lista de VINC relacionados
 * 
 * Padrão: Global class (obrigatório para Lightning Types reconhecerem)
 * Propriedades: id, name, dates, owner, + vincRecords (aninhado)
 */
global class CiRecord {
    
    @InvocableVariable(label='ID do Registro CI')
    global String id;
    
    @InvocableVariable(label='Nome do Registro CI')
    global String name;
    
    @InvocableVariable(label='Data de Criação')
    global String createdDate;
    
    @InvocableVariable(label='Última Modificação')
    global String lastModifiedDate;
    
    @InvocableVariable(label='Owner ID')
    global String ownerId;
    
    @InvocableVariable(label='ID do TST_CM relacionado')
    global String lk_cm_id;
    
    @InvocableVariable(label='Registros TST_VINC relacionados')
    global List<VincRecord> vincRecords;
    
    
    /**
     * Constructor - Converte TST_CI__c Sobject + lista de VINC para CiRecord
     * 
     * Conversão importante:
     *   - Datetime → String (formato YYYY-MM-DD)
     *   - Sobject → wrapper com dados específicos
     * 
     * @param ci Registro TST_CI__c do banco
     * @param vincRecords Lista de VincRecord relacionados
     */
    global CiRecord(TST_CI__c ci, List<VincRecord> vincRecords) {
        this.id = ci.Id;
        this.name = ci.Name;
        this.createdDate = ci.CreatedDate != null ? 
            ci.CreatedDate.format('yyyy-MM-dd') : '';
        this.lastModifiedDate = ci.LastModifiedDate != null ? 
            ci.LastModifiedDate.format('yyyy-MM-dd') : '';
        this.ownerId = ci.OwnerId;
        this.lk_cm_id = ci.Lk_CM__c;
        this.vincRecords = vincRecords;
    }
}