import { LightningElement, wire, track, api } from 'lwc';
import getTstCmRecords from '@salesforce/apex/TstCmQueryService.getTstCmRecords';
import getTstCmRecordsByIds from '@salesforce/apex/TstCmQueryService.getTstCmRecordsByIds';
import getSelectedRecord from '@salesforce/apex/TstCmQueryService.getSelectedRecord';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class TstCmTableSelector extends LightningElement {
    // Propriedades
    @api recordIds; // IDs dos registros para filtrar (opcional)
    @api singleRecordId; // ID de um registro único para seleção (opcional)

    @track records = [];
    @track selectedRecord = null;
    @track isLoading = false;
    @track errorMessage = '';
    @track hasError = false;
    @track selectedRows = [];
    @track sortedBy = 'Name';
    @track sortDirection = 'asc';

    // Colunas da DataTable
    columns = [
        { label: 'ID', fieldName: 'Id', type: 'text', sortable: true },
        { label: 'Nome', fieldName: 'Name', type: 'text', sortable: true },
        { label: 'Data de Criação', fieldName: 'CreatedDate', type: 'date', typeAttributes: { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }, sortable: true },
        { label: 'Última Modificação', fieldName: 'LastModifiedDate', type: 'date', typeAttributes: { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }, sortable: true },
    ];

    /**
     * Getter para verificar se há registro selecionado
     */
    get hasSelectedRecord() {
        return this.selectedRecord !== null;
    }

    /**
     * Getter para data de criação formatada
     */
    get formattedCreatedDate() {
        if (!this.selectedRecord || !this.selectedRecord.CreatedDate) {
            return '-';
        }
        return new Date(this.selectedRecord.CreatedDate).toLocaleString('pt-BR');
    }

    /**
     * Getter para data de modificação formatada
     */
    get formattedModifiedDate() {
        if (!this.selectedRecord || !this.selectedRecord.LastModifiedDate) {
            return '-';
        }
        return new Date(this.selectedRecord.LastModifiedDate).toLocaleString('pt-BR');
    }

    /**
     * Lifecycle - Quando o componente é inserido no DOM
     */
    connectedCallback() {
        this.loadRecords();
    }

    /**
     * Carrega os registros da apex
     */
    loadRecords() {
        this.isLoading = true;
        this.hasError = false;
        this.errorMessage = '';

        // Se recordIds foram fornecidos, usar para filtrar
        if (this.recordIds && this.recordIds.length > 0) {
            const ids = Array.isArray(this.recordIds) ? this.recordIds : this.recordIds.split(',');
            getTstCmRecordsByIds({ recordIds: ids })
                .then((result) => {
                    this.records = result;
                    this.isLoading = false;

                    // Se um único registro foi fornecido, selecioná-lo automaticamente
                    if (this.singleRecordId && result.length === 1) {
                        this.selectedRecord = result[0];
                        this.selectedRows = [result[0].Id];
                    }
                })
                .catch((error) => {
                    this.handleError(error);
                });
        } else {
            // Carregar todos os registros
            getTstCmRecords()
                .then((result) => {
                    this.records = result;
                    this.isLoading = false;
                })
                .catch((error) => {
                    this.handleError(error);
                });
        }
    }

    /**
     * Manipula a seleção de linha na DataTable
     */
    handleRowSelection(event) {
        const selectedRows = event.detail.selectedRows;

        if (selectedRows.length > 0) {
            const selectedId = selectedRows[0].Id;
            this.selectedRecord = selectedRows[0];
            this.selectedRows = [selectedId];
        } else {
            this.selectedRecord = null;
            this.selectedRows = [];
        }
    }

    /**
     * Manipula a ordenação da DataTable
     */
    handleSort(event) {
        const { fieldName, sortDirection } = event.detail;
        this.sortedBy = fieldName;
        this.sortDirection = sortDirection;

        this.records = this.sortData(fieldName, sortDirection, this.records);
    }

    /**
     * Ordena os dados
     */
    sortData(fieldName, sortDirection, data) {
        const parseData = JSON.parse(JSON.stringify(data));

        return parseData.sort((a, b) => {
            if (a[fieldName] === b[fieldName]) {
                return 0;
            }

            let aValue = a[fieldName];
            let bValue = b[fieldName];

            // Tratar valores nulos
            if (!aValue) aValue = '';
            if (!bValue) bValue = '';

            // Comparação
            const comparison = aValue > bValue ? 1 : -1;
            return sortDirection === 'asc' ? comparison : comparison * -1;
        });
    }

    /**
     * Confirma a seleção do registro
     */
    handleConfirmSelection() {
        if (!this.selectedRecord) {
            this.showToast('Aviso', 'Selecione um registro', 'warning');
            return;
        }

        // Disparar evento customizado com o registro selecionado
        this.dispatchEvent(
            new CustomEvent('recordselected', {
                detail: {
                    recordId: this.selectedRecord.Id,
                    record: this.selectedRecord
                },
                bubbles: true,
                composed: true
            })
        );

        this.showToast('Sucesso', `Registro ${this.selectedRecord.Name} selecionado com sucesso`, 'success');
    }

    /**
     * Limpa a seleção
     */
    handleClearSelection() {
        this.selectedRecord = null;
        this.selectedRows = [];
        this.showToast('Informação', 'Seleção limpa', 'info');
    }

    /**
     * Manipula erros da Apex
     */
    handleError(error) {
        this.isLoading = false;
        this.hasError = true;
        this.errorMessage = error.body?.message || 'Erro ao carregar registros';
        console.error('Erro:', error);
    }

    /**
     * Exibe um Toast
     */
    showToast(title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: title,
                message: message,
                variant: variant,
                duration: 3000
            })
        );
    }

    /**
     * Método exposto para filtrar por IDs externamente
     */
    @api
    filterByIds(ids) {
        this.recordIds = ids;
        this.loadRecords();
    }

    /**
     * Método exposto para obter o registro selecionado
     */
    @api
    getSelectedRecord() {
        return this.selectedRecord;
    }

    /**
     * Método exposto para limpar tudo
     */
    @api
    resetComponent() {
        this.selectedRecord = null;
        this.selectedRows = [];
        this.records = [];
        this.loadRecords();
    }
}
