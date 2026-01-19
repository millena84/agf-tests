Vou analisar o repositório para entender a solução atual e avaliar a viabilidade de incluir uma dinâmica "view more" similar ao padrão Salesforce. Agora vou buscar informações sobre a solução no seu repositório para entender a estrutura atual: Perfeito! Consegui localizar a solução.  Agora vou examinar os arquivos principais em detalhes para fazer uma avaliação precisa sobre a implementação do "view more". Perfeito! Agora tenho uma visão completa da solução. Deixe-me fazer uma análise detalhada de como implementar a dinâmica "view more" (paginação/lazy loading) na consulta de registros TST_CM__c.

## 🎯 ANÁLISE DETALHADA:  Implementar "View More" na Solução

Baseado na arquitetura atual (@InvocableMethod + Lightning Type + LWC), aqui está o que **precisaria mudar** para suportar a dinâmica "view more":

---

### 📊 **ESTADO ATUAL DA SOLUÇÃO**

A solução atual: 
- ✅ Retorna **TODOS os registros** de uma só vez
- ✅ Usa Lightning DataTable para renderizar
- ❌ Sem paginação ou limite de registros
- ❌ Sem controle de scroll/lazy loading

---

### 🔄 **MUDANÇAS NECESSÁRIAS**

#### **1️⃣ CLASS APEX:  `BuscaCms. cls` e `TstCmRecord.cls`**

**O QUE MUDAR:**

```apex
// ❌ ATUAL:  Retorna tudo
List<TST_CM__c> records = [
    SELECT Id, Name, CreatedDate, LastModifiedDate, OwnerId 
    FROM TST_CM__c 
    WHERE Id IN :recordIds
];

// ✅ NOVO: Retorna com limite e offset
global class BuscaCmsRequest {
    @InvocableVariable(required=true label='Record IDs')
    global List<String> recordIds;
    
    @InvocableVariable(required=false label='Limit' description='Quantos registros retornar por página (default: 10)')
    global Integer pageSize;  // ✨ NOVO
    
    @InvocableVariable(required=false label='Offset' description='Quantos registros pular (default:  0)')
    global Integer offset;    // ✨ NOVO
}

// ✅ QUERY COM LIMIT E OFFSET
List<TST_CM__c> records = [
    SELECT Id, Name, CreatedDate, LastModifiedDate, OwnerId 
    FROM TST_CM__c 
    WHERE Id IN :recordIds
    LIMIT :pageSize
    OFFSET :offset
];

// ✅ NOVA RESPONSE COM METADADOS
global class BuscaCmsResponse {
    @InvocableVariable(label='Registros')
    global List<TstCmRecord> records;
    
    @InvocableVariable(label='Total de Registros')
    global Integer totalCount;        // ✨ NOVO - Total encontrado
    
    @InvocableVariable(label='Offset Atual')
    global Integer currentOffset;     // ✨ NOVO - Para rastrear página
    
    @InvocableVariable(label='Tem Mais Registros')
    global Boolean hasMore;           // ✨ NOVO - Flag para mostrar "View More"
}
```

---

#### **2️⃣ LWC:  `buscaCmsResponse.js`**

**O QUE MUDAR:**

```javascript
// ❌ ATUAL:  Apenas renderiza o que recebe
export default class BuscaCmsResponse extends LightningElement {
    @api value;  // Array de records
    // ... só renderiza
}

// ✅ NOVO: Gerencia paginação
export default class BuscaCmsResponse extends LightningElement {
    @api value;                    // Array inicial de records
    @api totalCount;               // ✨ NOVO - Total de registros
    @api currentOffset;            // ✨ NOVO - Offset atual
    @api hasMore;                  // ✨ NOVO - Se há mais para carregar
    @api pageSize = 10;            // ✨ NOVO - Tamanho da página
    
    @track allRecords = [];         // ✨ NOVO - Acumula registros
    @track isLoadingMore = false;   // ✨ NOVO - Estado de carregamento
    
    connectedCallback() {
        // ✨ NOVO:  Ao receber dados, inicializa allRecords
        if (this.value && Array.isArray(this.value)) {
            this.allRecords = [... this.value];
        }
    }
    
    // ✨ NOVO: Método para carregar próxima página
    handleViewMore() {
        this.isLoadingMore = true;
        
        // Dispara evento para o Agentforce chamar BuscaCms novamente
        // com offset = currentOffset + pageSize
        this. dispatchEvent(
            new CustomEvent('loadmore', {
                detail: {
                    offset: this.currentOffset + this.pageSize,
                    pageSize: this.pageSize
                },
                bubbles: true,
                composed: true
            })
        );
    }
    
    // ✨ NOVO: Quando novos dados chegam, acumula
    connectedCallback() {
        if (this.value) {
            this.allRecords = [...(this.allRecords || []), ...this.value];
        }
        this.isLoadingMore = false;
    }
}
```

---

#### **3️⃣ TEMPLATE HTML: `buscaCmsResponse.html`**

**O QUE MUDAR:**

```html
<!-- ❌ ATUAL -->
<lightning-datatable
    key-field="id"
    data={value}
    columns={columns}
    max-row-selection="1"
    onrowselection={handleRowSelection}
></lightning-datatable>

<!-- ✅ NOVO:  DataTable com "View More" -->
<lightning-datatable
    key-field="id"
    data={allRecords}                    <!-- Usa array acumulado -->
    columns={columns}
    max-row-selection="1"
    onrowselection={handleRowSelection}
></lightning-datatable>

<!-- ✨ NOVO: Botão "View More" condicional -->
<template if: true={hasMore}>
    <div class="slds-m-top_medium slds-text-align_center">
        <button 
            class="slds-button slds-button_neutral"
            onclick={handleViewMore}
            disabled={isLoadingMore}
        >
            <template if:true={isLoadingMore}>
                <lightning-spinner size="small"></lightning-spinner>
                Carregando... 
            </template>
            <template if:false={isLoadingMore}>
                📄 Ver Mais ({currentOffset + pageSize} / {totalCount})
            </template>
        </button>
    </div>
</template>
```

---

#### **4️⃣ CONFIGURAÇÃO NO AGENTFORCE STUDIO**

**O QUE MUDAR:**

Atualmente a action retorna simples:
```
Entrada: recordIds: ["ID1", "ID2", ...]
Saída: Renderiza LWC
```

**Novo fluxo (com loop):**
```
┌─────────────────────────────────────────┐
│ 1️⃣ Ação:  BuscaCms                       │
│    Input: recordIds, pageSize=10, offset=0│
│    Output: records, totalCount, hasMore │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ 2️⃣ LWC renderiza e mostra "View More"  │
│    Se hasMore=true → Botão habilitado   │
└──────────────┬──────────────────────────┘
               │ (User clica "View More")
               ▼
┌───────────────────��─────────────────────┐
│ 3️⃣ Ação: BuscaCms (novamente)          │
│    Input: recordIds, pageSize, offset=10│
│    Acumula no allRecords[]              │
└──────────────┬──────────────────────────┘
               │
               ▼
        [Loop volta ao 2️⃣]
```

---

### 🔑 **PONTOS CRÍTICOS DE MUDANÇA**

| Aspecto | Atual | Novo | Complexidade |
|---------|-------|------|--------------|
| **Apex Query** | Sem LIMIT/OFFSET | Com LIMIT/OFFSET | ⭐ Baixa |
| **Response** | 3 campos | +2 campos (totalCount, hasMore) | ⭐ Baixa |
| **LWC State** | Simples (@api value) | @track allRecords + offset tracking | ⭐⭐ Média |
| **Agentforce Flow** | 1 action | 1 action + loop condicional | ⭐⭐⭐ Alta |
| **Event Handling** | Sem eventos | Custom event 'loadmore' | ⭐⭐ Média |

---

### 🚀 **ORDEM DE IMPLEMENTAÇÃO RECOMENDADA**

1. **Semana 1**: Modificar `BuscaCms. cls` para aceitar `pageSize` e `offset`
2. **Semana 1**: Atualizar `BuscaCmsResponse` com metadados
3. **Semana 2**: Refatorar `buscaCmsResponse.js` para gerenciar `allRecords[]`
4. **Semana 2**: Adicionar botão "View More" no template HTML
5. **Semana 3**: Configurar loop no Agentforce Studio
6. **Semana 3**: Testes e otimizações (índices SOQL, etc)

---

### ⚠️ **DESAFIOS E CONSIDERAÇÕES**

1. **Limite SOQL**: Salesforce permite até 50. 000 registros.  Com offset, cada chamada é nova query.
2. **Performance**: Se houver muitos registros (100k+), considere índices em TST_CM__c
3. **Agentforce UI**: Precisa testar se a LWC pode fazer dispatch de custom events e se o Studio permite chamar ações em loop
4. **Memory**:  O `allRecords[]` acumula na memória do LWC - considere limite máximo

---

### 📝 **CÓDIGO COMPLETO (EXEMPLO)**

Quer que eu gere os arquivos completos com a implementação? Posso criar:

- ✅ `BuscaCms.cls` - Com paginação
- ✅ `buscaCmsResponse.js` - Com gerenciamento de offset
- ✅ `buscaCmsResponse.html` - Com botão "View More"
- ✅ Documentação de fluxo no Agentforce Studio

Qual das etapas você gostaria de detalhar mais? 
