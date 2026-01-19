import { LightningElement, wire, track, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'; 
import getRecords from '@salesforce/apex/QueryTstCm.getRecords';
import getRecordsByIds from '@salesforce/apex/QueryTstCm.getRecordsByIds';
import getRecord from '@salesforce/apex/QueryTstCm.getRecord';

export default class QueryTstCm extends LightningElement {
    @api recordIds; // IDs dos registros para filtrar (recebido da action anterior)
    @api singleRecordId; // ID de um registro único (opcional)
    @api 
    get data() {
        return this._data;
    }
    set data(value) {
        this._data = value;
        console.log('DEBUG: data setter chamado com valor:', value);
        if (value && Array.isArray(value)) {
            this.comunicacoes = this.cleanApexFields(value);
            console.log('DEBUG: comunicacoes após setter:', this.comunicacoes);
        }
    }

    _data;
    @track comunicacoes = [];
    @track selectedRecord = null;
    @track selectedRows = [];
    @track error;
    @track isLoading = false;
    @track hasError = false;
    @track errorMessage = '';
    @track sortedBy = 'name';
    @track sortDirection = 'asc';

    columns = [
        { label: 'ID', fieldName: 'id', type: 'text', sortable: true },
        { label: 'Nome', fieldName: 'name', type: 'text', sortable: true },
        { label: 'Data de Criação', fieldName: 'createdDate', type: 'date', sortable: true },
        { label: 'Última Modificação', fieldName: 'lastModifiedDate', type: 'date', sortable: true }
    ];

    get hasSelectedRecord() {
        return this.selectedRecord !== null;
    }

    connectedCallback() {
        // Se dados vêm da GenAiFunction/Lightning Type, já estão populados via setter
        // Se for chamado de outra forma (Flow/Record Page), carrega dados
        if (!this.comunicacoes || this.comunicacoes.length === 0) {
            this.loadRecords();
        }
    }

    loadRecords() {
        this.isLoading = true;
        this.hasError = false;
        this.errorMessage = '';

        if (this.recordIds && this.recordIds.length > 0) {
            const ids = Array.isArray(this.recordIds) ? this.recordIds : this.recordIds.split(',');
            getRecordsByIds({ recordIds: ids })
                .then((result) => {
                    this.comunicacoes = this.cleanApexFields(result);
                    this.isLoading = false;
                })
                .catch((error) => {
                    this.handleError(error);
                });
        } else {
            getRecords()
                .then((result) => {
                    this.comunicacoes = this.cleanApexFields(result);
                    this.isLoading = false;
                })
                .catch((error) => {
                    this.handleError(error);
                });
        }
    }

    cleanApexFields(records) {
        if (!Array.isArray(records)) {
            return records;
        }
        return records.map(record => {
            const cleanedRecord = {};
            Object.keys(record).forEach(key => {
                // Remove campos *_set que Apex adiciona automaticamente
                if (!key.endsWith('_set')) {
                    cleanedRecord[key] = record[key];
                }
            });
            return cleanedRecord;
        });
    }

    handleRowSelection(event) {
        const selectedRows = event.detail.selectedRows;

        if (selectedRows.length > 0) {
            const selectedRecord = selectedRows[0];
            this.selectedRecord = selectedRecord;
            this.selectedRows = [selectedRecord.id];

            // Dispara evento customizado com o registro selecionado
            this.dispatchEvent(
                new CustomEvent('recordselected', {
                    detail: {
                        recordId: selectedRecord.id,
                        record: selectedRecord
                    },
                    bubbles: true,
                    composed: true
                })
            );
        } else {
            this.selectedRecord = null;
            this.selectedRows = [];
        }
    }

    handleSort(event) {
        const { fieldName, sortDirection } = event.detail;
        this.sortedBy = fieldName;
        this.sortDirection = sortDirection;

        this.comunicacoes = this.sortData(fieldName, sortDirection, this.comunicacoes);
    }

    sortData(fieldName, sortDirection, data) {
        const parseData = JSON.parse(JSON.stringify(data));

        return parseData.sort((a, b) => {
            if (a[fieldName] === b[fieldName]) {
                return 0;
            }

            let aValue = a[fieldName];
            let bValue = b[fieldName];

            if (!aValue) aValue = '';
            if (!bValue) bValue = '';

            const comparison = aValue > bValue ? 1 : -1;
            return sortDirection === 'asc' ? comparison : comparison * -1;
        });
    }

    handleConfirmSelection() {
        if (!this.selectedRecord) {
            this.showToast('Aviso', 'Selecione um registro', 'warning');
            return;
        }

        this.showToast('Sucesso', `Registro ${this.selectedRecord.name} selecionado com sucesso`, 'success');
    }

    handleClearSelection() {
        this.selectedRecord = null;
        this.selectedRows = [];
        this.showToast('Informação', 'Seleção limpa', 'info');
    }

    handleError(error) {
        this.isLoading = false;
        this.hasError = true;
        this.errorMessage = error.body?.message || 'Erro ao carregar registros';
        console.error('Erro:', error);
    }

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

    @api
    filterByIds(ids) {
        this.recordIds = ids;
        this.loadRecords();
    }

    @api
    getSelectedRecord() {
        return this.selectedRecord;
    }

    @api
    resetComponent() {
        this.selectedRecord = null;
        this.selectedRows = [];
        this.comunicacoes = [];
        this.loadRecords();
    }
}