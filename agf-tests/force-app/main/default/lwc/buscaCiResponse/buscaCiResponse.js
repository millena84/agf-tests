import { LightningElement, api, track } from 'lwc';

export default class BuscaCiResponse extends LightningElement {
    @api value;
    @track selectedRows = [];
    @track ciRecords = [];
    @track showSummary = false;

    ciColumns = [
        { label: 'ID CI', fieldName: 'id', type: 'text', sortable: true },
        { label: 'Nome CI', fieldName: 'name', type: 'text', sortable: true },
        { label: 'Data de Criação', fieldName: 'createdDate', type: 'date', sortable: true },
        { label: 'Última Modificação', fieldName: 'lastModifiedDate', type: 'date', sortable: true }
    ];

    vincColumns = [
        { label: 'ID VINC', fieldName: 'id', type: 'text', sortable: true },
        { label: 'Nome VINC', fieldName: 'name', type: 'text', sortable: true },
        { label: 'Data de Criação', fieldName: 'createdDate', type: 'date', sortable: true },
        { label: 'Última Modificação', fieldName: 'lastModifiedDate', type: 'date', sortable: true },
        { label: 'CI Relacionado', fieldName: 'lk_ci_id', type: 'text' }
    ];

    /**
     * Lifecycle - Quando o componente recebe dados
     */
    connectedCallback() {
        if (this.value && Array.isArray(this.value) && this.value.length > 0) {
            this.ciRecords = this.value[0].ciRecords || [];
        }
    }

    /**
     * Handler para seleção de linhas CI
     * Permite multi-select dos registros CI
     */
    handleCiRowSelection(event) {
        const selectedCiIds = event.detail.selectedRows.map(row => row.id);
        console.log('CIs selecionados:', selectedCiIds);
        this.updateSelectedRows();
    }

    /**
     * Handler para seleção de linhas VINC
     * Permite multi-select dos registros VINC
     * IMPORTANTE: Cada VINC dentro de cada CI é selecionado independentemente
     */
    handleVincRowSelection(event) {
        const ciId = event.currentTarget.dataset.ciId;
        const selectedVincIds = event.detail.selectedRows.map(row => row.id);
        console.log(`VINCs selecionados para CI ${ciId}:`, selectedVincIds);
        this.updateSelectedRows();
    }

    /**
     * Atualiza a lista consolidada de todos os registros selecionados
     * Coleta seleções de CIs e seus VINCs
     */
    updateSelectedRows() {
        this.selectedRows = [];
        
        // Itera por cada CI e coleta VINCs selecionados
        this.ciRecords.forEach(ci => {
            const ciTable = this.template.querySelector(`[data-ci-table="${ci.id}"]`);
            if (ciTable) {
                const selectedCiRows = ciTable.getSelectedRows();
                
                // Se o CI foi selecionado
                if (selectedCiRows.length > 0) {
                    this.selectedRows.push({
                        type: 'CI',
                        id: ci.id,
                        name: ci.name
                    });
                }
            }

            // Coleta VINCs selecionados deste CI
            const vincTable = this.template.querySelector(`[data-vinc-table="${ci.id}"]`);
            if (vincTable && ci.vincRecords) {
                const selectedVincRows = vincTable.getSelectedRows();
                selectedVincRows.forEach(vinc => {
                    this.selectedRows.push({
                        type: 'VINC',
                        id: vinc.id,
                        name: vinc.name,
                        parentCiId: ci.id
                    });
                });
            }
        });

        this.showSummary = this.selectedRows.length > 0;
        console.log('Registros selecionados (total):', this.selectedRows);
    }

    /**
     * Handler para confirmar seleções
     * Dispara custom event com os IDs selecionados
     */
    handleConfirmSelection() {
        if (this.selectedRows.length > 0) {
            const ciIds = this.selectedRows
                .filter(row => row.type === 'CI')
                .map(row => row.id);
            
            const vincIds = this.selectedRows
                .filter(row => row.type === 'VINC')
                .map(row => row.id);

            this.dispatchEvent(
                new CustomEvent('recordsselected', {
                    detail: {
                        ciIds: ciIds,
                        vincIds: vincIds,
                        totalSelected: this.selectedRows.length
                    },
                    bubbles: true,
                    composed: true
                })
            );

            console.log('Confirmado:', {
                ciSelecionados: ciIds,
                vincSelecionados: vincIds,
                total: this.selectedRows.length
            });
        }
    }

    /**
     * Handler para limpar todas as seleções
     */
    handleClearSelection() {
        this.selectedRows = [];
        this.showSummary = false;
        
        // Limpa seleção em todas as tabelas
        this.template.querySelectorAll('lightning-datatable').forEach(table => {
            table.selectedRows = [];
        });

        console.log('Seleções limpas');
    }

    /**
     * Getter para determinar se há registros selecionados
     */
    get hasSelectedRecords() {
        return this.selectedRows.length > 0;
    }

    /**
     * Getter para resumo de seleção
     */
    get selectionSummary() {
        const ciCount = this.selectedRows.filter(r => r.type === 'CI').length;
        const vincCount = this.selectedRows.filter(r => r.type === 'VINC').length;
        return `${ciCount} CI(s) + ${vincCount} VINC(s) selecionados`;
    }
}