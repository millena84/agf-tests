# 📦 INVENTORY DE COMPONENTES - AGENTFORCE RENDERING

## 🔴 COMPONENTES CRIADOS (OPÇÃO 1 - @AuraEnabled com Lightning Type)

### Apex Classes
```
force-app/main/default/classes/
├── QueryTstCm.cls ✅
│   └── Methods: getRecords(), getRecordsByIds(List<String>), getRecord(String)
│   └── Inner class: TstCmRecord
└── QueryTstCm.cls-meta.xml ✅
```

### External Service (Auto-gerado)
```
force-app/main/default/externalServiceRegistrations/
└── QueryTstCm.externalServiceRegistration-meta.xml ✅
    └── OpenAPI wrapper para Apex class
```

### GenAiFunction
```
force-app/main/default/genAiFunctions/
└── TESTE_Aura_GetRecByIds_QueryTstCm/
    ├── TESTE_Aura_GetRecByIds_QueryTstCm.genAiFunction-meta.xml ✅
    │   └── invocationTarget: ExternalService QueryTstCm
    ├── input/
    │   └── schema.json ✅
    │       └── Defines: recordIds (array of strings)
    └── output/
        └── schema.json ✅
            └── Defines: 200 (array), responseCode, defaultExc
            └── References: sourceType=c__tstCmRecordListType
```

### Lightning Type Bundle
```
force-app/main/default/lightningTypes/
├── queryTstCmType/ (NÃO USADO - pode deletar)
│   ├── queryTstCmType.lightningType-meta.xml
│   └── schema.json
└── tstCmRecordListType/ ✅ (ATUAL)
    ├── tstCmRecordListType-meta.xml ✅
    │   └── Resources: schema.json, renderer.json, renderer.css
    ├── schema.json ✅
    │   └── lightning:type: "@apexClassType/c__QueryTstCm"
    ├── lightningDesktopGenAi/
    │   ├── renderer.json ✅
    │   │   └── collection wrapper → c/queryTstCm
    │   └── renderer.css ✅
    │       └── Minimal styles
```

### Lightning Web Component (LWC)
```
force-app/main/default/lwc/
├── queryTstCm/ ✅
│   ├── queryTstCm.js ✅
│   │   └── @api data setter, cleanApexFields(), DataTable logic
│   ├── queryTstCm.html ✅
│   │   └── DataTable + selection details + debug verde
│   ├── queryTstCm.css (NÃO TEM - usar default SLDS)
│   └── queryTstCm.js-meta.xml ✅
│       └── Targets: lightning__AgentforceOutput
└── tstCmTableSelector/ (DESCONTINUADO - deletar)
    └── (Tinha erro de sintaxe)
```

### Status Atual
- ✅ Componentes criados: 11 arquivos ativos
- ⚠️ Componentes descontinuados: 2 (queryTstCmType/, tstCmTableSelector/)
- ❌ Renderização: Não funciona (Lightning Type não aparece no dropdown)
- ⚠️ Dados: Chegam corretamente (texto corrido)

---

## 📋 COMPONENTES POR OPÇÃO

### **OPÇÃO 1: Lightning Type com Renderer Customizado**

**Status**: ⚠️ Incompleto (Lightning Type não renderiza)

**Componentes necessários**:
```
□ Apex Class com @AuraEnabled
  └── QueryTstCm.cls

□ ExternalService
  └── QueryTstCm.externalServiceRegistration-meta.xml

□ GenAiFunction
  ├── .genAiFunction-meta.xml (invocationTarget: ExternalService)
  ├── input/schema.json
  └── output/schema.json (references Lightning Type)

□ Lightning Type Bundle
  ├── .lightningType-meta.xml
  ├── schema.json (lightning:type: @apexClassType/...)
  ├── renderer.json (collection wrapper)
  └── lightningDesktopGenAi/renderer.css

□ LWC Customizado
  ├── .js (@api data setter)
  ├── .html (DataTable template)
  └── .js-meta.xml (lightning__AgentforceOutput)
```

**Total de arquivos**: 13
**Criação**: 8-10 horas
**Complexidade**: 🔴 Alta

---

### **OPÇÃO 2: Rich Text HTML (Markdown)**

**Status**: ❓ Desconhecido (não confirmado se renderiza)

**Componentes necessários**:
```
□ Apex Class com @AuraEnabled
  └── QueryTstCm.cls (REUTILIZAR - apenas adicionar método)
    └── Novo método: getRecordsAsMarkdown()

□ GenAiFunction (NOVO)
  ├── nome: TESTE_HTML_Markdown
  ├── .genAiFunction-meta.xml
  ├── input/schema.json
  └── output/schema.json
    └── type: "string"
    └── format: "markdown"
```

**Arquivos novos**: 3
**Modificações**: 1 arquivo (QueryTstCm.cls)
**Criação**: 1-2 horas
**Complexidade**: 🟢 Baixa

---

### **OPÇÃO 3: GenAiPlanner Type**

**Status**: ⚠️ Beta (se org tem GenAiPlanner)

**Componentes necessários**:
```
□ Apex Class com @AuraEnabled
  └── QueryTstCm.cls (REUTILIZAR)

□ GenAiFunction (MODIFICADO)
  └── output/schema.json
    └── items.copilotAction:plannerType: "c__CustomFinancialRecord"

□ GenAiPlanner Custom Type (NOVO)
  ├── Tipo: GenAiPlanner object (via UI)
  └── Propriedades: id, name, createdDate, etc

□ LWC ou Renderer para Planner (OPCIONAL)
```

**Arquivos novos**: 2
**Modificações**: 1 arquivo
**Criação**: 2-3 horas
**Complexidade**: 🟡 Média

---

### **OPÇÃO 4: HTML Gerado no Apex**

**Status**: ✅ Funcional

**Componentes necessários**:
```
□ Apex Class com @AuraEnabled (MODIFICADO)
  └── QueryTstCm.cls
    └── getRecordsAsHtml(): retorna HTML string

□ GenAiFunction (NOVO ou MODIFICADO)
  └── output/schema.json
    └── type: "string"
    └── lightning:type: "lightning__textType"
```

**Arquivos novos**: 2
**Modificações**: 1 arquivo
**Criação**: 1-2 horas
**Complexidade**: 🟢 Baixa

---

### **OPÇÃO 5: Follow-up Actions**

**Status**: ✅ Funcional (confirmado padrão Salesforce)

**Componentes necessários**:
```
□ Apex Classes com @AuraEnabled (MÚLTIPLOS)
  ├── QueryTstCm_Search.cls (busca inicial)
  ├── QueryTstCm_Format.cls (formata resultados)
  └── QueryTstCm_Export.cls (export opções)

□ GenAiFunction Principal (NOVO)
  ├── TESTE_Search_Records.genAiFunction-meta.xml
  └── output: texto com mensagem de sucesso

□ GenAiFunctions Follow-up (NOVO - 2 a 3)
  ├── TESTE_View_DataTable.genAiFunction-meta.xml
  ├── TESTE_Export_PDF.genAiFunction-meta.xml
  └── TESTE_View_Details.genAiFunction-meta.xml

□ LWC para DataTable (REUTILIZAR)
  └── queryTstCm.js/html (com modo "view-only")
```

**Arquivos novos**: 7-10
**Modificações**: 2-3 arquivos
**Criação**: 4-6 horas
**Complexidade**: 🟡 Média

---

### **OPÇÃO 6: External URL / Redirect**

**Status**: ✅ Funcional

**Componentes necessários**:
```
□ Apex Class com @AuraEnabled
  └── QueryTstCm.cls (REUTILIZAR)
    └── getRecordsWithUrl(): adiciona viewUrl

□ GenAiFunction (MODIFICADO)
  └── output/schema.json
    └── properties:
      ├── recordIds (array)
      └── viewUrl (string)

□ LWC (FORA DO AGENTFORCE)
  └── queryTstCm (renderizado em Community/App)
```

**Arquivos novos**: 2
**Modificações**: 1 arquivo
**Criação**: 1-2 horas
**Complexidade**: 🟢 Baixa

---

### **OPÇÃO 7: Standard Lightning Types**

**Status**: ✅ Funcional (padrão Salesforce)

**Componentes necessários**:
```
□ Apex Class com @AuraEnabled
  └── QueryTstCm.cls (REUTILIZAR)

□ GenAiFunction (MODIFICADO)
  └── output/schema.json
    └── type: "array"
    └── lightning:type: "lightning__listType"
    └── items: { properties: id, name, createdDate }

□ Sem LWC customizado
□ Sem Lightning Type Bundle
```

**Arquivos novos**: 1
**Modificações**: 1 arquivo
**Criação**: 30 min
**Complexidade**: 🟢 Baixa

---

### **OPÇÃO 8: Post-processing (Flow fora do Agent)**

**Status**: ✅ Funcional (complexo)

**Componentes necessários**:
```
□ Apex Class com @AuraEnabled
  └── QueryTstCm.cls (REUTILIZAR)

□ GenAiFunction Inicial (NOVO)
  └── output: recordIds apenas (minimal)

□ Salesforce Flow (NOVO)
  ├── Tipo: Autolaunched / Scheduled
  ├── Invoca: Apex action QueryTstCm
  ├── Post-processing: estrutura dados
  └── Output: envia para webhook/API

□ Middleware / API Externa (NOVO)
  └── Recebe dados
  └── Renderiza LWC
  └── Retorna link

□ LWC Customizado (FORA DO AGENTFORCE)
  └── queryTstCm ou similar
```

**Arquivos novos**: 4-6
**Modificações**: 1 arquivo
**Criação**: 6-8 horas
**Complexidade**: 🔴 Alta

---

## 📊 TABELA RESUMIDA

| Opção | Apex | GenAiFunction | Lightning Type | LWC | Flow | Arquivos Novos | Tempo | Complexidade |
|-------|------|---------------|---------------|----|------|----------------|-------|---|
| 1. Lightning Type | ✅ | ✅ | ✅ | ✅ | ❌ | 13 | 8-10h | 🔴 Alta |
| 2. Markdown HTML | ✅ | ✅ | ❌ | ❌ | ❌ | 3 | 1-2h | 🟢 Baixa |
| 3. GenAiPlanner | ✅ | ✅ | ❌ | ⚠️ | ❌ | 2 | 2-3h | 🟡 Média |
| 4. HTML Apex | ✅ | ✅ | ❌ | ❌ | ❌ | 2 | 1-2h | 🟢 Baixa |
| 5. Follow-up Actions | ✅ | ✅ | ❌ | ✅ | ❌ | 7-10 | 4-6h | 🟡 Média |
| 6. External URL | ✅ | ✅ | ❌ | ✅ | ❌ | 2 | 1-2h | 🟢 Baixa |
| 7. Standard Types | ✅ | ✅ | ❌ | ❌ | ❌ | 1 | 0.5h | 🟢 Baixa |
| 8. Post-processing | ✅ | ✅ | ❌ | ✅ | ✅ | 4-6 | 6-8h | 🔴 Alta |

---

## 🗑️ COMPONENTES DESCONTINUADOS (DO PROJETO ATUAL)

```
force-app/main/default/
├── lightningTypes/queryTstCmType/ 🗑️
│   ├── queryTstCmType.lightningType-meta.xml
│   └── schema.json
│   └── Razão: Substituído por tstCmRecordListType

├── lwc/tstCmTableSelector/ 🗑️
│   ├── tstCmTableSelector.js
│   ├── tstCmTableSelector.html
│   ├── tstCmTableSelector.js-meta.xml
│   └── Razão: Erro de sintaxe, substituído por queryTstCm

└── genAiFunctions/TESTE2_Aura_GetRecByIds_QueryTstCm/ 🗑️
    └── Razão: Deploy repetido falhando, descontinuado
```

**Total de arquivos descontinuados**: 6

---

## 📈 RECOMENDAÇÃO PARA PRÓXIMOS PASSOS

**Para testar cada opção rapidamente**:

1. **Criar branch/folder separado para cada opção**
   ```
   force-app/main/default/
   ├── genAiFunctions/
   │   ├── TESTE_Option1_Lightning/
   │   ├── TESTE_Option2_Markdown/
   │   ├── TESTE_Option3_Planner/
   │   └── ... (7 total)
   ```

2. **Reutilizar Apex base** (QueryTstCm.cls)
   - Adicionar método específico por opção se necessário

3. **Testar ordem recomendada**:
   - **Hoje**: Opção 7 (Standard Types) - 30 min, validar base
   - **Amanhã**: Opção 4 (HTML Apex) - 2h, ver se HTML renderiza
   - **Semana**: Opção 5 (Follow-up Actions) - 6h, padrão scalable

4. **Manter Opção 1 viva**
   - Aguardar Salesforce Support
   - Se funcionar, migrar solução pra Opção 1

---

**Documento criado**: 2026-01-17
**Última atualização**: Estado do projeto @AuraEnabled beta test
**Próxima ação**: Selecionar qual opção testar primeiro
