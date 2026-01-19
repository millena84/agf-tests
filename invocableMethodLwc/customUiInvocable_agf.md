# 🎯 NOVA ABORDAGEM: @InvocableMethod + Lightning Type + LWC para Agentforce

**Status**: ✅ **FUNCIONANDO COM SUCESSO**

**Data**: 18-01-2026  
**Org**: millena.ferreira393@agentforce.com  
**Padrão**: @InvocableMethod (não @AuraEnabled)  
**Resultado**: DataTable renderizado corretamente no Agentforce com dados estruturados

---

## 📌 TL;DR - O que mudou?

| Aspecto | Tentativa Anterior ❌ | Nova Abordagem ✅ |
|---------|----------------------|------------------|
| Anotação Apex | `@AuraEnabled` | `@InvocableMethod` |
| Estrutura | Inner classes | Classes globais separadas |
| Lightning Type | Referenciava classe de serviço | Referencia classe de dados global |
| Resultado | Não renderizava LWC | ✅ DataTable renderizado com sucesso |

---

## 🏗️ ARQUITETURA FINAL

```
┌─────────────────────────────────────────────────────────────┐
│                    Agentforce Agent                          │
│            (Studio action configuration)                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│         BuscaCms.buscarRegistros() @InvocableMethod          │
│              (Input: List<BuscaCmsRequest>)                  │
│              (Output: List<BuscaCmsResponse>)                │
└────────────────┬─────────────────────────────────────────────┘
                 │
                 ▼
        ┌────────────────────┐
        │ Query TST_CM__c    │
        │ (Bank records)     │
        └────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│           BuscaCmsResponse (with List<TstCmRecord>)          │
│              (encapsulates the data)                         │
└────────────────┬──────────────────────────────────────────┬──┘
                 │                                          │
                 ▼                                          ▼
        ┌─────────────────┐                     ┌──────────────────────┐
        │ Lightning Type   │                     │ LWC Component        │
        │ tstCmRecordType  │◄──references───────►│ buscaCmsResponse     │
        │ (@apexClassType/ │                     │ (@api value)         │
        │  c__TstCmRecord) │                     │ (renders DataTable)  │
        └─────────────────┘                     └──────────────────────┘
                                                          │
                                                          ▼
                                          ┌─────────────────────────┐
                                          │  Agentforce Agent Chat  │
                                          │  ✅ DataTable Rendered  │
                                          │  ✅ 2 records shown     │
                                          │  ✅ Interactive         │
                                          └─────────────────────────┘
```

---

## 📋 COMPONENTES CRIADOS

### 1. **BuscaCms.cls** (Classe de Serviço)

**Localização**: `force-app/main/default/classes/BuscaCms.cls`

```apex
global class BuscaCms {
    
    @InvocableMethod(label='Buscar Registros TST_CM' description='Busca registros TST_CM por IDs e retorna com dados estruturados')
    global static List<BuscaCmsResponse> buscarRegistros(List<BuscaCmsRequest> requests) {
        if (requests == null || requests.isEmpty()) {
            return new List<BuscaCmsResponse>();
        }
        
        BuscaCmsRequest request = requests[0];
        List<String> recordIds = request.recordIds;
        
        // Busca os registros no banco
        List<TST_CM__c> records = [
            SELECT Id, Name, CreatedDate, LastModifiedDate, OwnerId 
            FROM TST_CM__c 
            WHERE Id IN :recordIds
        ];
        
        // Converte para TstCmRecord
        List<TstCmRecord> tstCmRecords = new List<TstCmRecord>();
        for (TST_CM__c rec : records) {
            tstCmRecords.add(new TstCmRecord(
                rec.Id,
                rec.Name,
                rec.CreatedDate,
                rec.LastModifiedDate,
                rec.OwnerId
            ));
        }
        
        // Encapsula em Response
        BuscaCmsResponse response = new BuscaCmsResponse(tstCmRecords);
        return new List<BuscaCmsResponse> { response };
    }
    
    // ===== REQUEST CLASS =====
    global class BuscaCmsRequest {
        
        @InvocableVariable(required=true label='Record IDs' description='IDs dos registros TST_CM para buscar')
        global List<String> recordIds;
        
        global BuscaCmsRequest() {
            this.recordIds = new List<String>();
        }
        
        global BuscaCmsRequest(List<String> recordIds) {
            this.recordIds = recordIds;
        }
    }
    
    // ===== RESPONSE CLASS =====
    global class BuscaCmsResponse {
        
        @InvocableVariable(label='Registros' description='Lista de registros TST_CM encontrados')
        global List<TstCmRecord> records;
        
        global BuscaCmsResponse() {
            this.records = new List<TstCmRecord>();
        }
        
        global BuscaCmsResponse(List<TstCmRecord> records) {
            this.records = records;
        }
    }
}
```

**Pontos-chave**:
- ✅ `@InvocableMethod` (não @AuraEnabled)
- ✅ Retorna `List<BuscaCmsResponse>` (padrão de Flow/Agentforce)
- ✅ Request e Response classes com `@InvocableVariable`
- ✅ Request encapsula input (lista de IDs)
- ✅ Response encapsula output (lista de TstCmRecord)

---

### 2. **TstCmRecord.cls** (Classe de Dados - GLOBAL)

**Localização**: `force-app/main/default/classes/TstCmRecord.cls`

```apex
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
```

**Pontos-chave**:
- ✅ **CLASSE GLOBAL** (não inner class!)
- ✅ Cada propriedade com `@InvocableVariable`
- ✅ Construtor parametrizado para facilitar conversão de dados
- ✅ Conversão de Datetime para String (Agentforce não suporta Datetime nativamente)

---

### 3. **buscaCmsResponse LWC** (Renderização)

#### **buscaCmsResponse.js**

**Localização**: `force-app/main/default/lwc/buscaCmsResponse/buscaCmsResponse.js`

```javascript
import { LightningElement, api } from 'lwc';

export default class BuscaCmsResponse extends LightningElement {
    @api value;

    columns = [
        { label: 'ID', fieldName: 'id', type: 'text', sortable: true },
        { label: 'Nome', fieldName: 'name', type: 'text', sortable: true },
        { label: 'Data de Criação', fieldName: 'createdDate', type: 'date', sortable: true },
        { label: 'Última Modificação', fieldName: 'lastModifiedDate', type: 'date', sortable: true },
        { label: 'Owner ID', fieldName: 'ownerId', type: 'text' }
    ];
}
```

**Pontos-chave**:
- ✅ `@api value` recebe o **array completo** (não individual records)
- ✅ Simples e funcional
- ✅ Columns já formatadas para lightning-datatable

#### **buscaCmsResponse.html**

**Localização**: `force-app/main/default/lwc/buscaCmsResponse/buscaCmsResponse.html`

```html
<template>
    <lightning-card title="Registros TST_CM" icon-name="standard:search">
        <template if:true={value}>
            <div class="slds-p-around_medium">
                <div style="background: #4CAF50; color: white; padding: 15px; margin-bottom: 15px; border-radius: 4px; font-weight: bold;">
                    ✅ LWC buscaCmsResponse RENDERIZADO!
                    <br/>
                    <small>{value.length} registros encontrados</small>
                </div>

                <lightning-datatable
                    key-field="id"
                    data={value}
                    columns={columns}
                    max-row-selection="1"
                ></lightning-datatable>
            </div>
        </template>
        <template if:false={value}>
            <div class="slds-p-around_medium">
                <p class="slds-text-color_weak">Nenhum registro encontrado.</p>
            </div>
        </template>
    </lightning-card>
</template>
```

**Pontos-chave**:
- ✅ Lightning-datatable renderiza array direto
- ✅ Verde de sucesso indica LWC foi invocado
- ✅ Suporta zero registros com fallback

#### **buscaCmsResponse.js-meta.xml**

**Localização**: `force-app/main/default/lwc/buscaCmsResponse/buscaCmsResponse.js-meta.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<LightningComponentBundle xmlns="http://soap.sforce.com/2006/04/metadata">
    <apiVersion>65.0</apiVersion>
    <isExposed>true</isExposed>
    <masterLabel>Busca CMS Response</masterLabel>
    <targets>
        <target>lightning__AgentforceOutput</target>
    </targets>
    <targetConfigs>
        <targetConfig targets="lightning__AgentforceOutput">
            <sourceType name="lightning__listType" itemTypeName="c__tstCmRecordType"/>
        </targetConfig>
    </targetConfigs>
</LightningComponentBundle>
```

**Pontos-chave**:
- ✅ Target: `lightning__AgentforceOutput`
- ✅ `sourceType name="lightning__listType"` (padrão para renderizar arrays)
- ✅ `itemTypeName="c__tstCmRecordType"` (referencia Lightning Type)

---

### 4. **Lightning Type: tstCmRecordType**

**Localização**: `force-app/main/default/lightningTypes/tstCmRecordType/`

#### **schema.json**

```json
{
  "title": "TST CM Record",
  "description": "Individual TST_CM record data",
  "lightning:type": "@apexClassType/c__TstCmRecord"
}
```

**Pontos-chave**:
- ✅ Aponta para classe **GLOBAL** `c__TstCmRecord`
- ✅ Simples e direto
- ✅ Define tipo que será usado no Studio

#### **renderer.json**

```json
{
  "collection": {
    "renderer": {
      "componentOverrides": {
        "$": {
          "definition": "c/buscaCmsResponse"
        }
      }
    }
  }
}
```

**Pontos-chave**:
- ✅ `collection` wrapper para renderizar array
- ✅ `$` = root level (todo o array)
- ✅ `definition: "c/buscaCmsResponse"` = aponta para LWC

#### **tstCmRecordType-meta.xml**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<LightningTypeBundle xmlns="http://soap.sforce.com/2006/04/metadata">
    <apiVersion>65.0</apiVersion>
    <isExposed>true</isExposed>
    <masterLabel>TST CM Record Type</masterLabel>
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

## ⚠️ ERROS QUE OCORRERAM E COMO RESOLVER

### Erro #1: `@JsonAccess` com sintaxe errada

**Mensagem**: `Expecting ')' but was: ',' (1:34)`

**Causa**: Sintaxe incorreta da anotação

```apex
❌ @JsonAccess(serializable='always' deserializable='always')
✅ Remover a anotação completamente
```

**Solução**: Remover `@JsonAccess` das classes. Não é necessária para Flows/Agentforce.

---

### Erro #2: Lightning Type referenciava inner class

**Mensagem**: `We couldn't find the Apex class you entered`

**Causa**: Inner classes não são reconhecidas por Lightning Types

```apex
❌ TstCmRecord como inner class de BuscaCms
✅ TstCmRecord como classe global separada
```

**Solução**: Extrair `TstCmRecord` como classe global em arquivo separado.

---

### Erro #3: Não conseguia deletar Lightning Type (circular reference)

**Mensagem**: `This lightning type is referenced elsewhere in Salesforce. Remove the usage and try again.`

**Causa**: LWC meta.xml tinha referência à Lightning Type

**Solução**: 
1. Remover `<targetConfigs>` do LWC meta.xml
2. Deploy do LWC
3. Deletar Lightning Type no Setup
4. Recriar Lightning Type
5. Adicionar `<targetConfigs>` de volta no LWC
6. Deploy final

---

### Erro #4: Output rendering não aparecia no dropdown

**Causa**: Lightning Type referenciava classe de serviço (BuscaCms) em vez de classe de dados (TstCmRecord)

**Solução**: Atualizar schema.json para:
```json
"lightning:type": "@apexClassType/c__TstCmRecord"
```

---

## ✅ CHECKLIST DE REPRODUÇÃO

### Fase 1: Criar Classes Apex

- [ ] Criar `BuscaCms.cls` com:
  - [ ] `@InvocableMethod` (não @AuraEnabled)
  - [ ] `BuscaCmsRequest` com `@InvocableVariable`
  - [ ] `BuscaCmsResponse` encapsulando dados
  - [ ] Remover `@JsonAccess`
- [ ] Criar `TstCmRecord.cls` como classe GLOBAL com:
  - [ ] Cada propriedade com `@InvocableVariable`
  - [ ] Construtor parametrizado
  - [ ] Conversão Datetime → String
- [ ] Deploy: `sf project deploy start --source-dir force-app/main/default/classes/BuscaCms.cls force-app/main/default/classes/TstCmRecord.cls --target-org <ORG>`

### Fase 2: Criar Lightning Web Component

- [ ] Criar pasta: `force-app/main/default/lwc/buscaCmsResponse/`
- [ ] Criar `buscaCmsResponse.js` com `@api value`
- [ ] Criar `buscaCmsResponse.html` com `<lightning-datatable>`
- [ ] Criar `buscaCmsResponse.js-meta.xml` com:
  - [ ] Target: `lightning__AgentforceOutput`
  - [ ] `sourceType name="lightning__listType"`
  - [ ] `itemTypeName="c__tstCmRecordType"`
- [ ] Deploy: `sf project deploy start --source-dir force-app/main/default/lwc/buscaCmsResponse --target-org <ORG>`

### Fase 3: Criar Lightning Type

- [ ] Criar pasta: `force-app/main/default/lightningTypes/tstCmRecordType/lightningDesktopGenAi/`
- [ ] Criar `schema.json`:
  ```json
  {
    "title": "TST CM Record",
    "description": "Individual TST_CM record data",
    "lightning:type": "@apexClassType/c__TstCmRecord"
  }
  ```
- [ ] Criar `renderer.json`:
  ```json
  {
    "collection": {
      "renderer": {
        "componentOverrides": {
          "$": { "definition": "c/buscaCmsResponse" }
        }
      }
    }
  }
  ```
- [ ] Criar `renderer.css`: `:host { display: block; }`
- [ ] Criar `tstCmRecordType-meta.xml` com recursos
- [ ] Deploy: `sf project deploy start --source-dir force-app/main/default/lightningTypes/tstCmRecordType --target-org <ORG>`

### Fase 4: Configurar no Agentforce Studio

- [ ] Abrir **Agentforce Studio**
- [ ] Criar novo **Action**
- [ ] Tipo: **Apex Class**
- [ ] Classe: **BuscaCms**
- [ ] Método: **buscarRegistros**
- [ ] Input:
  - [ ] Name: `Record IDs`
  - [ ] Type: `lightning__listType`
  - [ ] Required: `true`
- [ ] Output:
  - [ ] Name: `Registros`
  - [ ] Type: `lightning__listType`
  - [ ] **Output Rendering**: `c__tstCmRecordType` ← **CRÍTICO**
- [ ] Salvar

### Fase 5: Testar

- [ ] Executar action no agent
- [ ] Input exemplo:
  ```json
  {
    "recordIds": ["a0BgL00000PLtW9UAL", "a0BgL00000PLu0nUAD"]
  }
  ```
- [ ] Esperado:
  - [ ] ✅ Verde com "LWC buscaCmsResponse RENDERIZADO!"
  - [ ] ✅ Tabela com dados
  - [ ] ✅ 2 registros encontrados

---

## 🔑 PONTOS DE ATENÇÃO

### 1. **@InvocableMethod vs @AuraEnabled**
- Use `@InvocableMethod` para Flows, Agentforce, automações
- Use `@AuraEnabled` apenas para chamar Apex direto do LWC local
- GenAiFunction + Agentforce espera `@InvocableMethod`

### 2. **Classes Globais, Não Inner Classes**
- Lightning Types precisam de **classes globais separadas**
- Inner classes não funcionam com Lightning Types
- Sempre criar classe de dados em arquivo separado

### 3. **Encapsulação de Dados**
- Response deve encapsular a lista: `List<TstCmRecord> records`
- Não retornar `List<TstCmRecord>` diretamente
- Padrão: `List<Response>` contendo `List<DataClass>`

### 4. **API no LWC**
- `@api value` recebe o **array completo**, não registros individuais
- Use `value` diretamente em `<lightning-datatable data={value}>`
- Não precisa fazer setter com lógica complexa

### 5. **Output Rendering no Studio**
- Crítico: deve apontar para **Lightning Type**, não classe Apex
- Sintaxe: `c__tstCmRecordType` (com prefixo `c__`)
- Se não aparecer no dropdown, verifique:
  - [ ] Lightning Type foi deployado?
  - [ ] schema.json aponta para classe global?
  - [ ] LWC meta.xml tem `itemTypeName` correto?

### 6. **Conversão de Tipos**
- Agentforce não suporta Datetime nativamente
- Converter para String no Apex: `createdDate.format()`
- LWC pode renderizar como `type: 'date'` em datatable

### 7. **Dependências de Deploy**
- Deploy order importa:
  1. Classes Apex primeiro
  2. LWC depois (precisa que Lightning Type exista)
  3. Lightning Type por último
  4. Ou deploy tudo junto

---

## 📊 ESTRUTURA FINAL DE ARQUIVOS

```
force-app/main/default/
├── classes/
│   ├── BuscaCms.cls
│   ├── BuscaCms.cls-meta.xml
│   ├── TstCmRecord.cls
│   └── TstCmRecord.cls-meta.xml
│
├── lwc/
│   └── buscaCmsResponse/
│       ├── buscaCmsResponse.js
│       ├── buscaCmsResponse.html
│       └── buscaCmsResponse.js-meta.xml
│
└── lightningTypes/
    └── tstCmRecordType/
        ├── schema.json
        ├── tstCmRecordType-meta.xml
        └── lightningDesktopGenAi/
            ├── renderer.json
            └── renderer.css
```

---

## 🚀 PRÓXIMAS ITERAÇÕES

### Sugestões de Melhorias:
1. Adicionar paginação na DataTable
2. Adicionar filtros por Name
3. Adicionar ações (Edit, Delete)
4. Adicionar validação de entrada
5. Adicionar error handling melhorado
6. Criar variante para SingleRecord rendering

### Para Reutilizar este Padrão:
1. Duplicar estrutura de pastas
2. Renomear classes (BuscaCms → SuaLogica)
3. Atualizar queries e propriedades
4. Atualizar LWC columns conforme dados
5. Testar no Studio

---

## 📞 TROUBLESHOOTING RÁPIDO

| Sintoma | Causa | Solução |
|---------|-------|---------|
| Output Rendering vazio | Lightning Type não deployada | Deploy Lightning Type primeiro |
| LWC não renderiza | sourceType incorreto no meta.xml | Verificar `itemTypeName` |
| Classe não compila | @JsonAccess com sintaxe errada | Remover @JsonAccess |
| Circular reference ao deletar | LWC referencia Lightning Type | Remover `<targetConfigs>` temporariamente |
| Dados aparecem em texto | Output Rendering aponta classe | Apontar para Lightning Type |
| Inner class não encontrada | Lightning Type referencia inner | Extrair como classe global |

---

**Documento criado**: 18-01-2026  
**Versão**: 1.0 - Solução Funcional  
**Status**: ✅ Testado e validado em produção
