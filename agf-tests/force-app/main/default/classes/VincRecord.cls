/**
 * @description Global data class para representar um registro TST_VINC__c
 * 
 * Padrão: Global class (obrigatório para Lightning Types reconhecerem)
 * Propriedades: id, name, dates, owner, tst_ci_id (relacionamento)
 * 
 * Nota: Diferente de CiRecord, VincRecord é um "folha" - não tem aninhamento
 */
global class VincRecord {
    
    @InvocableVariable(label='ID do Registro VINC')
    global String id;
    
    @InvocableVariable(label='Nome do Registro VINC')
    global String name;
    
    @InvocableVariable(label='Data de Criação')
    global String createdDate;
    
    @InvocableVariable(label='Última Modificação')
    global String lastModifiedDate;
    
    @InvocableVariable(label='Owner ID')
    global String ownerId;
    
    @InvocableVariable(label='ID do TST_CI relacionado')
    global String lk_ci_id;
    
    
    /**
     * Constructor - Converte TST_VINC__c Sobject para VincRecord
     * 
     * Conversão importante:
     *   - Datetime → String (formato YYYY-MM-DD)
     * 
     * @param vinc Registro TST_VINC__c do banco
     */
    global VincRecord(TST_VINC__c vinc) {
        this.id = vinc.Id;
        this.name = vinc.Name;
        this.createdDate = vinc.CreatedDate != null ? 
            vinc.CreatedDate.format('yyyy-MM-dd') : '';
        this.lastModifiedDate = vinc.LastModifiedDate != null ? 
            vinc.LastModifiedDate.format('yyyy-MM-dd') : '';
        this.ownerId = vinc.OwnerId;
        this.lk_ci_id = vinc.Lk_CI__c;
    }
}