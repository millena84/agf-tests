# 📌 SOLUÇÃO @AURAENABLED COM AGENTFORCE - RECAPITULAÇÃO

## 🎯 Objetivo

Criar uma **ação GenAiFunction no Agentforce** que:
1. Busca registros em uma tabela customizada (no meu teste, `TST_CM__c`) via @AuraEnabled Apex method (com lwc)
2. Retorna array de registros com dados estruturados
3. Renderiza em um **LWC customizado com DataTable** (não em texto corrido)
4. Permite seleção única de registro

A ideia aqui é o teste independente do agente ou do tópico. Como a estrutura descrita abaixo está mostrando os dados corretamente, não serão detalhados esses compoentes.

--- 

## :ideia PROPOSTA ARQUITETURAL

1. Classe **Apex** AuraEnabled
2. **LWC**
3. **GenAiPlugin**
    - simples, chamando a action da classe apex AuraEnabled
4. **GenAiFunction**
    - action criada a partir de uma clase apex com anotação AuraEnabled
    - só aparece como disponível para criação após o passo a passo no vscode:
        - criação e compilação da classe
            - deploy
        - botão direito na classe / Create openAPI document for this class
            - gera alguns componentes na pasta **externalServiceRegistration**
            - deploy
                - SETUP: API Catalog



---

## ✅ O QUE FUNCIONA

### 1. Apex Class com @AuraEnabled
```java
// force-app/main/default/classes/QueryTstCm.cls
global class QueryTstCm {
    @AuraEnabled(cacheable=false)
    public static List<TstCmRecord> getRecordsByIds(List<String> recordIds) {
        List<TST_CM__c> records = [SELECT Id, Name, CreatedDate, LastModifiedDate, OwnerId 
                                   FROM TST_CM__c WHERE Id IN :recordIds];
        return convertToTstCmRecords(records);
    }
    
    global class TstCmRecord {
        @AuraEnabled public String id;
        @AuraEnabled public String name;
        @AuraEnabled public String createdDate;
        @AuraEnabled public String lastModifiedDate;
        @AuraEnabled public String ownerId;
    }
}
```

**Status**: ✅ Funcionando corretamente
- Compila sem erros
- Retorna dados estruturados
- @AuraEnabled funciona em beta (sem renderizar dados em formato datatable)

---

### 2. ExternalService (Auto-gerado [botão direito na classe / Create OpenAPI Document for this class])
```xml
<!-- force-app/main/default/externalServiceRegistrations/QueryTstCm.externalServiceRegistration-meta.xml -->
```

**Status**: ✅ Criado automaticamente
- Gerado a partir da classe Apex
- OpenAPI 3.0.1 com método getRecordsByIds

---

### 3. GenAiFunction
```xml
<!-- force-app/main/default/genAiFunctions/TESTE_Aura_GetRecByIds_QueryTstCm/TESTE_Aura_GetRecByIds_QueryTstCm.genAiFunction-meta.xml -->
<GenAiFunction xmlns="http://soap.sforce.com/2006/04/metadata">
    <invocationTarget>QueryTstCm</invocationTarget>
    <invocationTargetType>externalService</invocationTargetType>
    <masterLabel>TESTE Aura GetRecByIds QueryTstCm</masterLabel>
</GenAiFunction>
```

**Status**: ✅ Funcionando
- Invoca ExternalService corretamente
- Recebe e retorna dados
- Dados chegam na action

---

### 4. GenAiFunction Output Schema
```json
{
  "unevaluatedProperties": false,
  "properties": {
    "200": {
      "title": "200",
      "description": "Status Code 200",
      "type": "array",
      "sourceType": "c__tstCmRecordListType",
      "items": { "type": "object" },
      "lightning:isPII": false,
      "copilotAction:isDisplayable": true,
      "copilotAction:isUsedByPlanner": true,
      "copilotAction:useHydratedPrompt": false
    },
    "responseCode": { ... },
    "defaultExc": { ... }
  }
}
```

**Status**: ✅ Criado
- Array type correto
- sourceType referencia Lightning Type
- isDisplayable=true para renderização

---

### 5. Dados sendo Retornados
```
Quando agente chama: "pesquise 'a0BgL00000PLtW9UAL;a0BgL00000PLu0nUAD'"

Retorna corretamente:
✅ Record ID: a0BgL00000PLu0nUAD
✅ Name: Financiamento Crédito Imobiliário
✅ Owner ID: 005gL000004ANU5QAO
✅ Created Date: 2025-12-21 21:13:12
✅ Last Modified Date: 2025-12-21 21:15:50
```

**Status**: ✅ Dados chegam corretamente ao agent

---

## ❌ O QUE NÃO FUNCIONA

### 1. Lightning Type NOT Aparecendo no Output Rendering Dropdown

**Esperado**: Quando abro a action TESTE_Aura_GetRecByIds_QueryTstCm no Agentforce Studio:
- Na seção "Output Rendering" deve aparecer opção "tstCmRecordListType"
- Permito selecionar ele

**Real**: 
- Dropdown só mostra "Response Code 200" (o Apex class @apexClassType)
- Custom Lightning Type NÃO aparece como opção
- Fica em fallback (texto corrido)

---

### 2. LWC NOT Sendo Renderizado

**Esperado**: 
- Agentforce renderiza o LWC queryTstCm com DataTable
- Ver componente verde com "✅ LWC queryTstCm RENDERIZADO" (debug)
- Ver tabela com 2 registros

**Real**:
- Não aparece o componente verde (LWC não é invocado)
- Mostra dados em texto corrido em vez de DataTable
- LWC renderer nunca é chamado

---

## 📦 COMPONENTES CRIADOS

### Estrutura de Arquivos
```
force-app/main/default/
├── classes/
│   ├── QueryTstCm.cls
│   └── QueryTstCm.cls-meta.xml

├── externalServiceRegistrations/
│   └── QueryTstCm.externalServiceRegistration-meta.xml

├── genAiFunctions/
│   └── TESTE_Aura_GetRecByIds_QueryTstCm/
│       ├── TESTE_Aura_GetRecByIds_QueryTstCm.genAiFunction-meta.xml
│       ├── input/schema.json
│       └── output/schema.json

├── lightningTypes/
│   └── tstCmRecordListType/
│       ├── tstCmRecordListType-meta.xml
│       ├── schema.json
│       └── lightningDesktopGenAi/
│           ├── renderer.json
│           └── renderer.css

└── lwc/
    └── queryTstCm/
        ├── queryTstCm.js
        ├── queryTstCm.html
        └── queryTstCm.js-meta.xml
```

**Total**: 13 arquivos

---

## 🔍 DETALHAMENTO TÉCNICO

### Lightning Type Bundle (tstCmRecordListType)

**schema.json**:
```json
{
  "title": "TST_CM Record List",
  "description": "List of TST_CM records with selection capability",
  "lightning:type": "@apexClassType/c__QueryTstCm",
  "type": "array"
}
```

**renderer.json**:
```json
{
  "collection": {
    "renderer": {
      "componentOverrides": {
        "$": {
          "definition": "c/queryTstCm"
        }
      }
    }
  }
}
```

**tstCmRecordListType-meta.xml**:
```xml
<LightningTypeBundle xmlns="http://soap.sforce.com/2006/04/metadata">
    <apiVersion>65.0</apiVersion>
    <isExposed>true</isExposed>
    <masterLabel>TST_CM Record List Type</masterLabel>
    <resources>
        <memberName>schema.json</memberName>
        <memberType>resource</memberType>
    </resources>
    <resources>
        <memberName>lightningDesktopGenAi/renderer.json</memberName>
        <memberType>resource</memberType>
    </resources>
    <resources>
        <memberName>lightningDesktopGenAi/renderer.css</memberName>
        <memberType>resource</memberType>
    </resources>
</LightningTypeBundle>
```

---

### LWC Customizado (queryTstCm)

**queryTstCm.js** (trecho relevante):
```javascript
export default class QueryTstCm extends LightningElement {
    @api 
    get data() {
        return this._data;
    }
    set data(value) {
        this._data = value;
        if (value && Array.isArray(value)) {
            this.comunicacoes = this.cleanApexFields(value);
        }
    }

    @track comunicacoes = [];
    
    columns = [
        { label: 'ID', fieldName: 'id', type: 'text', sortable: true },
        { label: 'Nome', fieldName: 'name', type: 'text', sortable: true },
        { label: 'Data de Criação', fieldName: 'createdDate', type: 'date', sortable: true },
        { label: 'Última Modificação', fieldName: 'lastModifiedDate', type: 'date', sortable: true }
    ];

    cleanApexFields(records) {
        return records.map(record => ({
            id: record.id,
            name: record.name,
            createdDate: record.createdDate,
            lastModifiedDate: record.lastModifiedDate,
            ownerId: record.ownerId
        }));
    }
}
```

**queryTstCm.html** (trecho):
```html
<template>
    <div class="slds-m-around_medium">
        <div style="background: #4CAF50; color: white; padding: 15px; margin-bottom: 15px; border-radius: 4px; font-weight: bold;">
            ✅ LWC queryTstCm RENDERIZADO CORRETAMENTE!
            <br>
            <small>Dados recebidos: {comunicacoes.length} registros</small>
        </div>

        <lightning-datatable
            key-field="id"
            data={comunicacoes}
            columns={columns}
            max-row-selection="1"
        ></lightning-datatable>
    </div>
</template>
```

**queryTstCm.js-meta.xml**:
```xml
<LightningComponentBundle xmlns="http://soap.sforce.com/2006/04/metadata">
    <apiVersion>65.0</apiVersion>
    <isExposed>true</isExposed>
    <masterLabel>Query TST_CM Selector</masterLabel>
    <targets>
        <target>lightning__RecordPage</target>
        <target>lightning__AppPage</target>
        <target>lightning__HomePage</target>
        <target>lightning__FlowScreen</target>
        <target>lightning__AgentforceOutput</target>
    </targets>
    <targetConfigs>
        <targetConfig targets="lightning__FlowScreen">
            <property name="recordIds" label="Record IDs" type="String" />
            <property name="singleRecordId" label="Single Record ID" type="String" />
        </targetConfig>
    </targetConfigs>
</LightningComponentBundle>
```

---

## 🧪 TESTES REALIZADOS

### Teste 1: Com Lightning Type + renderer.json
```
Resultado: Dados em texto corrido
Problema: LWC não é invocado
```

### Teste 2: Com lightning:type vs sourceType
```
Testado: lightning:type: "@apexClassType/c__QueryTstCm" ❌
Testado: sourceType: "c__tstCmRecordListType" ❌
Resultado: Nenhum faz Lightning Type aparecer no dropdown
```

### Teste 3: Com collection wrapper em renderer.json
```
Testado: com "collection" wrapper ❌
Testado: sem "collection" wrapper ❌
Resultado: Mesmo resultado (texto corrido)
```

### Teste 4: isDisplayable flag
```
Com isDisplayable: true → Dados aparecem (renderização genérica, sem LWC)
Com isDisplayable: false → Dados aparecem em texto (sem renderização visual)
```

### Teste 5: LWC Debug
```
Verde component nunca aparece → LWC não está sendo renderizado
Console.logs do setter nunca executam → dados não chegam via @api
```

---

## 🤔 QUESTÕES PENDENTES

1. **Por que Custom Lightning Type não aparece no Output Rendering dropdown?**
   - Aparecem tipos padrão (lightning__objectType, lightning__listType)
   - Aparecem tipos Apex (@apexClassType)
   - Mas Custom Lightning Type (c__tstCmRecordListType) NÃO aparece

2. **Qual é a sintaxe correta para referenciar Custom Lightning Type?**
   - `lightning:type: "tstCmRecordListType"` ❌
   - `lightning:type: "c__tstCmRecordListType"` ❌
   - `sourceType: "c__tstCmRecordListType"` ❌
   - `sourceType: "tstCmRecordListType"` ❌

3. **O renderer.json está sendo reconhecido?**
   - Arquivo existe e está correto
   - Está referenciado no meta.xml
   - Mas LWC nunca é invocado

4. **@AuraEnabled em GenAiFunction está realmente suportado?**
   - Documentação diz que está em beta
   - ExternalService é auto-gerado com sucesso
   - Mas renderização customizada não funciona

---

## 📋 REPRODUÇÃO

**Para reproduzir o problema**:

1. Deploy de todos os componentes (13 arquivos acima)
2. Abrir Agentforce Studio
3. Ir para ação TESTE_Aura_GetRecByIds_QueryTstCm
4. Seção "Output Rendering":
   - Esperado: dropdown com opção "TST_CM Record List Type (Custom)"
   - Real: só mostra "200 (Array)" e tipos padrão

5. Testar ação no agent:
   - Input: `pesquise 'a0BgL00000PLtW9UAL;a0BgL00000PLu0nUAD'`
   - Esperado: DataTable com 2 registros, verde com "LWC RENDERIZADO"
   - Real: Texto corrido com dados

---

## 🔗 LINKS E VERSÕES

**Org**: millena.ferreira393@agentforce.com
**API Version**: 65.0
**Salesforce CLI**: 2.116.6 → 2.117.7 (update available)
**@AuraEnabled**: Beta feature
**GenAiFunction**: Production-ready (mas com limitações)

---

## 📞 POSSÍVEIS SOLUÇÕES JÁ EXPLORADAS

1. ✅ Remover e recriar Lightning Type Bundle
2. ✅ Testar diferentes sintaxes (lightning:type, sourceType, c__, sem prefixo)
3. ✅ Adicionar collection wrapper em renderer.json
4. ✅ Remover collection wrapper
5. ✅ Testar com isDisplayable true/false
6. ✅ Verificar console do browser pra erros
7. ✅ Deploy com --ignore-conflicts
8. ✅ Adicionar/remover renderer.css
9. ✅ Tentar criar novo Lightning Type com nome diferente
10. ✅ Verificar LWC meta.xml targets

Nenhuma resolveu o problema.

---

## 🎯 PRÓXIMOS PASSOS

Aguardando clareza sobre:
1. Se Custom Lightning Type é suportado em @AuraEnabled GenAiFunction
2. Qual é a sintaxe correta para referências
3. Se há flag de feature pra habilitar
4. Se é limitação conhecida ou bug

**Alternativa**: Usar Opção 5 (Follow-up Actions) ou Opção 7 (Standard Types) como workaround

---

**Documento de referência para comunidade Salesforce**
Data: 18-01-2026
Org: Agentforce Beta Test
