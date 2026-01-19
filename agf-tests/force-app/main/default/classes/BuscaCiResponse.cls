/**
 * @description Response wrapper para BuscaCi
 * 
 * Encapsula a lista de CiRecord como resposta da action
 * O Lightning Type usará esta classe para gerar o schema
 */
global class BuscaCiResponse {
    
    @InvocableVariable(label='Registros TST_CI com Relacionamentos')
    global List<CiRecord> ciRecords;
    
    
    /**
     * Constructor
     * @param ciRecords Lista de registros CI com VINC aninhados
     */
    global BuscaCiResponse(List<CiRecord> ciRecords) {
        this.ciRecords = ciRecords;
    }
}