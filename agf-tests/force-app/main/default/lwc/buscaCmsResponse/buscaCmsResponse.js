import { LightningElement, api, track } from 'lwc';

export default class BuscaCmsResponse extends LightningElement {
    @api value;
    @track selectedRecordId = null;
    @track selectedRecord = null;

    columns = [
        { label: 'ID', fieldName: 'id', type: 'text', sortable: true },
        { label: 'Nome', fieldName: 'name', type: 'text', sortable: true },
        { label: 'Data de Criação', fieldName: 'createdDate', type: 'date', sortable: true },
        { label: 'Última Modificação', fieldName: 'lastModifiedDate', type: 'date', sortable: true },
        { label: 'Owner ID', fieldName: 'ownerId', type: 'text' }
    ];

    /**
     * Handler para evento de seleção de linha
     * Captura o recordId do registro selecionado
     */
    handleRowSelection(event) {
        const selectedRows = event.detail.selectedRows;
        if (selectedRows && selectedRows.length > 0) {
            this.selectedRecordId = selectedRows[0].id;
            this.selectedRecord = selectedRows[0];
            console.log('Registro selecionado:', this.selectedRecord);
        } else {
            this.selectedRecordId = null;
            this.selectedRecord = null;
        }
    }

    /**
     * Handler para confirmar seleção
     * Pode ser expandido para executar ações no Agentforce
     */
    handleConfirmSelection() {
        if (this.selectedRecordId) {
            // Dispatch um custom event para notificar Agentforce
            this.dispatchEvent(
                new CustomEvent('recordselected', {
                    detail: {
                        recordId: this.selectedRecordId,
                        record: this.selectedRecord
                    },
                    bubbles: true,
                    composed: true
                })
            );
            console.log('Confirmado: Registro selecionado com ID:', this.selectedRecordId);
        }
    }

    /**
     * Getter para determinar se deve mostrar o botão de confirmação
     */
    get hasSelectedRecord() {
        return this.selectedRecordId !== null;
    }
}