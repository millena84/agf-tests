global class TstCmRecord {
    
    @InvocableVariable(label='ID' description='ID do registro')
    global String id;
    
    @InvocableVariable(label='Nome' description='Nome do registro')
    global String name;
    
    @InvocableVariable(label='Data de Criação' description='Data de criação do registro')
    global String createdDate;
    
    @InvocableVariable(label='Última Modificação' description='Data da última modificação')
    global String lastModifiedDate;
    
    @InvocableVariable(label='Owner ID' description='ID do proprietário')
    global String ownerId;
    
    global TstCmRecord() {
    }
    
    global TstCmRecord(String id, String name, Datetime createdDate, Datetime lastModifiedDate, String ownerId) {
        this.id = id;
        this.name = name;
        this.createdDate = createdDate != null ? createdDate.format() : '';
        this.lastModifiedDate = lastModifiedDate != null ? lastModifiedDate.format() : '';
        this.ownerId = ownerId;
    }
}