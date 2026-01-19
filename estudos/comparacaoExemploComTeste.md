# 🔍 ANÁLISE: Exemplo Oficial Salesforce vs Sua Solução

## 🎯 Encontrado no Developer Guide
https://developer.salesforce.com/docs/ai/agentforce/guide/lightning-types-example-collection-renderer.html

---

## 📊 COMPARAÇÃO ESTRUTURAL

### EXEMPLO OFICIAL (HotelReservation)

#### ✅ 1. Apex Class - `@InvocableMethod` (NÃO @AuraEnabled)
```java
@JsonAccess(serializable='always' deserializable='always')
global class HotelReservation {
    @InvocableMethod(label='Find hotels' description='Find Available Hotels')
    global static List<HotelResponse> findHotels(List<HotelRequest> req) {
        // ...
        return hotelResponseList;
    }
}
```

**Características**:
- ✅ `@InvocableMethod` (não @AuraEnabled)
- ✅ Retorna `List<HotelResponse>` (classe com @InvocableVariable)
- ✅ Usa `@JsonAccess(serializable='always' deserializable='always')`

#### ✅ 2. Response Class com @InvocableVariable
```java
@JsonAccess(serializable='always' deserializable='always')
global class HotelResponse {
    @InvocableVariable
    global List<Hotel> hotels;  // ← LISTA como propriedade da classe

    global HotelResponse(List<Hotel> hotels) {
        this.hotels = hotels;
    }
}
```

**Características**:
- ✅ Encapsula a lista (não retorna List<Hotel> diretamente)
- ✅ Propriedade `hotels` é uma lista

#### ✅ 3. Schema.json da Lightning Type
```json
{
  "title": "Hotel Reservation",
  "description": "Hotel Reservation",
  "lightning:type": "@apexClassType/c__Hotel"
}
```

**Características**:
- ✅ Referencia `@apexClassType/c__Hotel` (a classe inner que será renderizada)

#### ✅ 4. Renderer.json
```json
{
  "collection": {
    "renderer": {
      "componentOverrides": {
        "$": {
          "definition": "c/hotelDetails"
        }
      }
    }
  }
}
```

**Características**:
- ✅ Usa `"$"` para referencia root level
- ✅ Definition aponta para LWC: `c/hotelDetails`

#### ✅ 5. LWC Meta.xml
```xml
<LightningComponentBundle xmlns="http://soap.sforce.com/2006/04/metadata">
    <apiVersion>64.0</apiVersion>
    <isExposed>true</isExposed>
    <masterLabel>HotelDetails</masterLabel>
    <targets>
        <target>lightning__AgentforceOutput</target>
    </targets>
    <targetConfigs>
        <targetConfig targets="lightning__AgentforceOutput">
            <sourceType name="lightning__listType" itemTypeName="c__hotelResponse"/>
        </targetConfig>
    </targetConfigs>
</LightningComponentBundle>
```

**Características**:
- ✅ `lightning__AgentforceOutput` target
- ✅ `sourceType name="lightning__listType"` ← PADRÃO ESPECÍFICO
- ✅ `itemTypeName="c__hotelResponse"` (referencia a custom Lightning Type)

#### ✅ 6. LWC JavaScript
```javascript
import { LightningElement, api } from "lwc";

export default class HotelDetails extends LightningElement {
  @api value;  // ← Recebe ARRAY COMPLETO (não dados individuais)
}
```

**Características**:
- ✅ `@api value` recebe **o array inteiro**
- ✅ Simples, sem lógica complexa

#### ✅ 7. LWC HTML
```html
<template>
  <lightning-card title="Available Hotels">
      <template if:true={value}>
          <template for:each={value} for:item="hotel">
              <div key={hotel.name} class="hotel-card">
                  <!-- renderiza cada item -->
              </div>
          </template>
      </template>
  </lightning-card>
</template>
```

**Características**:
- ✅ Itera sobre `{value}` com `for:each`
- ✅ Renderiza lista como cards

---

### SUA SOLUÇÃO (QueryTstCm)

#### ❌ 1. Apex Class - `@AuraEnabled` (NÃO @InvocableMethod)
```java
global class QueryTstCm {
    @AuraEnabled(cacheable=false)
    public static List<TstCmRecord> getRecordsByIds(List<String> recordIds) {
        List<TST_CM__c> records = [SELECT ...];
        return convertToTstCmRecords(records);
    }
    
    global class TstCmRecord {
        @AuraEnabled public String id;
        // ...
    }
}
```

**Problemas**:
- ❌ `@AuraEnabled` (não @InvocableMethod)
- ✅ Retorna `List<TstCmRecord>` (correto)
- ❌ Não usa `@JsonAccess`
- ❌ TstCmRecord não tem `@InvocableVariable`

#### ❌ 2. Schema.json da Lightning Type
```json
{
  "title": "TST_CM Record List",
  "lightning:type": "@apexClassType/c__QueryTstCm",
  "type": "array"
}
```

**Problemas**:
- ❌ Referencia a classe de serviço (`c__QueryTstCm`) em vez da classe de dados
- ❌ Adiciona `"type": "array"` (exemplo não tem)

#### ❌ 3. LWC Meta.xml
```xml
<targets>
    <target>lightning__RecordPage</target>
    <target>lightning__AppPage</target>
    <target>lightning__HomePage</target>
    <target>lightning__FlowScreen</target>
    <target>lightning__AgentforceOutput</target>
</targets>
<!-- SEM <targetConfigs> -->
```

**Problemas**:
- ❌ Faltam `<targetConfigs>`
- ❌ Não especifica `sourceType` e `itemTypeName`
- ❌ Múltiplos targets (exemplo só tem AgentforceOutput)

---

## 🚨 DIFERENÇAS CRÍTICAS ENCONTRADAS

| Aspecto | Exemplo Oficial | Sua Solução |
|---------|-----------------|-------------|
| Anotação Apex | `@InvocableMethod` ✅ | `@AuraEnabled` ❌ |
| Retorno Direto | `List<HotelResponse>` | `List<TstCmRecord>` |
| Response Class | Encapsula lista com `@InvocableVariable` | Retorna diretamente |
| Schema Type | Referencia classe de dados | Referencia classe de serviço |
| sourceType | `lightning__listType` | `c__tstCmRecordListType` |
| targetConfigs | Presente com sourceType | Faltando |
| @JsonAccess | Tem `@JsonAccess` | Não tem |
| Api Receiver | `@api value` (array) | `@api data` (setter) |

---

## 🎯 CORREÇÕES SUGERIDAS

### 1️⃣ MUDAR ANOTAÇÃO: `@AuraEnabled` → `@InvocableMethod`

```java
@JsonAccess(serializable='always' deserializable='always')
global class QueryTstCm {
    @InvocableMethod(label='Get TST_CM Records' description='Search TST_CM records by IDs')
    global static List<TstCmResponse> getRecordsByIds(List<TstCmRequest> requests) {
        if (requests.isEmpty()) return new List<TstCmResponse>();
        
        List<String> recordIds = requests[0].recordIds;
        List<TST_CM__c> records = [SELECT Id, Name, CreatedDate, LastModifiedDate, OwnerId 
                                   FROM TST_CM__c WHERE Id IN :recordIds];
        
        List<TstCmRecord> tstCmRecords = new List<TstCmRecord>();
        for (TST_CM__c rec : records) {
            tstCmRecords.add(new TstCmRecord(rec.Id, rec.Name, rec.CreatedDate, rec.LastModifiedDate, rec.OwnerId));
        }
        
        TstCmResponse response = new TstCmResponse(tstCmRecords);
        return new List<TstCmResponse> { response };
    }

    @JsonAccess(serializable='always' deserializable='always')
    global class TstCmRequest {
        @InvocableVariable(required=true)
        global List<String> recordIds;
    }

    @JsonAccess(serializable='always' deserializable='always')
    global class TstCmResponse {
        @InvocableVariable
        global List<TstCmRecord> records;  // ← Encapsula lista

        global TstCmResponse(List<TstCmRecord> records) {
            this.records = records;
        }
    }

    @JsonAccess(serializable='always' deserializable='always')
    global class TstCmRecord {
        @InvocableVariable public String id;
        @InvocableVariable public String name;
        @InvocableVariable public String createdDate;
        @InvocableVariable public String lastModifiedDate;
        @InvocableVariable public String ownerId;

        global TstCmRecord(String id, String name, Object createdDate, Object lastModifiedDate, String ownerId) {
            this.id = id;
            this.name = name;
            this.createdDate = String.valueOf(createdDate);
            this.lastModifiedDate = String.valueOf(lastModifiedDate);
            this.ownerId = ownerId;
        }
    }
}
```

### 2️⃣ CRIAR NOVA LIGHTNING TYPE `tstCmRecordResponseType`

**schema.json**:
```json
{
  "title": "TST_CM Record Response",
  "description": "Response containing TST_CM records",
  "lightning:type": "@apexClassType/c__TstCmRecord"
}
```

### 3️⃣ ATUALIZAR LWC meta.xml

```xml
<LightningComponentBundle xmlns="http://soap.sforce.com/2006/04/metadata">
    <apiVersion>65.0</apiVersion>
    <isExposed>true</isExposed>
    <masterLabel>Query TST_CM Selector</masterLabel>
    <targets>
        <target>lightning__AgentforceOutput</target>
    </targets>
    <targetConfigs>
        <targetConfig targets="lightning__AgentforceOutput">
            <sourceType name="lightning__listType" itemTypeName="c__tstCmRecordResponseType"/>
        </targetConfig>
    </targetConfigs>
</LightningComponentBundle>
```

### 4️⃣ SIMPLIFICAR LWC JavaScript

```javascript
import { LightningElement, api } from "lwc";

export default class QueryTstCm extends LightningElement {
    @api value;  // Recebe array completo

    columns = [
        { label: 'ID', fieldName: 'id', type: 'text' },
        { label: 'Nome', fieldName: 'name', type: 'text' },
        { label: 'Data de Criação', fieldName: 'createdDate', type: 'date' },
        { label: 'Última Modificação', fieldName: 'lastModifiedDate', type: 'date' }
    ];
}
```

### 5️⃣ SIMPLIFICAR LWC HTML

```html
<template>
    <div class="slds-m-around_medium">
        <div style="background: #4CAF50; color: white; padding: 15px; margin-bottom: 15px;">
            ✅ LWC queryTstCm RENDERIZADO!
            <small>{value.length} registros</small>
        </div>

        <lightning-datatable
            key-field="id"
            data={value}
            columns={columns}
            max-row-selection="1"
        ></lightning-datatable>
    </div>
</template>
```

---

## 🔑 PONTOS-CHAVE DA DIFERENÇA

| Padrão | Propósito |
|--------|----------|
| `@InvocableMethod` | Padrão oficial para Agentforce/Flows |
| `@AuraEnabled` | Para LWC direto, não para Agentforce Actions |
| `@InvocableVariable` | Marca propriedades que devem ser serializadas |
| `@JsonAccess('always')` | Garante serialização/desserialização |
| `List<Response>` | Padrão - retorna lista de response objects |
| `sourceType: lightning__listType` | Diz "este é um tipo de lista no LWC" |
| `itemTypeName: c__XXX` | Aponta para a Custom Lightning Type |

---

## ⚠️ POSSÍVEL RAZÃO DO NÃO-FUNCIONAMENTO

Você está usando `@AuraEnabled` quando deveria usar `@InvocableMethod`. 

- `@AuraEnabled` é para chamar via LWC direto (Aura/LWC local)
- `@InvocableMethod` é para integração com Flows, Agentforce, e outros orquestradores

O GenAiFunction espera uma action criada com `@InvocableMethod`, não com `@AuraEnabled`.

---

## 🚀 PRÓXIMOS PASSOS

1. Converter classe para `@InvocableMethod`
2. Recriar GenAiFunction (vai reconhecer novo padrão)
3. Adicionar `@JsonAccess` e `@InvocableVariable`
4. Atualizar Lightning Type schema
5. Testar no agent

Esta é provavelmente a razão pela qual o Custom Lightning Type não aparecia no dropdown!

