Excelente pergunta!  Vou esclarecer isso com detalhes, porque essa é uma mudança **arquitetural importante** na abordagem. Excelente pergunta!  🎯 Vou explicar em detalhes como combinar a renderização customizada (LWC + Renderer) com o "View More" **standard** do Agentforce.

---

## 🎨 ENTENDENDO O "VIEW MORE" STANDARD

Primeiro, vamos clarificar o que é esse "View More" que você menciona:

```
┌─────────────────────────────────────────────┐
│         AGENTFORCE AGENT CHAT               │
│  (Direita - Conteúdo principal)             │
├─────────────────────────────────────────────┤
│ ✅ Resultado da ação renderizado com LWC   │
│ ✅ DataTable mostrando 10 registros        │
│ ✅ Botão "Ver Mais"                        │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│    SIDEBAR ESQUERDO (PANEL COLAPSÁVEL)     │
│  "View More" Standard Salesforce             │
│                                              │
│ 📄 Lista completa de registros             │
│ 🔍 Busca/filtro integrado                  │
│ ✅ Seleção com checkbox                    │
│ 📋 Renderização padrão (não customizável)  │
└─────────────────────────────────────────────┘
```

---

## ✅ **SIM, É POSSÍVEL COMBINAR! **

A resposta é **SIM**, e funciona assim:

### **ARQUITETURA COMBINADA**

```
┌─────────────────────────────────────────────────────────┐
│         BuscaCms. buscarRegistros()                       │
│         @InvocableMethod                                 │
└──────────────────┬──────────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
┌──────────────────┐   ┌──────────────────┐
│ Output Rendering │   │ Metadata Output  │
│   (Lightning     │   │   (View More)    │
│    Type + LWC)   │   │   Standard)      │
└──────────────────┘   └──────────────────┘
        │                     │
        ▼                     ▼
┌──────────────────┐   ┌──────────────────┐
│ buscaCmsResponse │   │ Sidebar Panel    │
│   DataTable      │   │ Com lista todos  │
│  Customizado ✨  │   │  registros       │
└──────────────────┘   └──────────────────┘
```

---

## 🔧 **COMO IMPLEMENTAR**

### **1️⃣ MANTER A RESPONSE APEX IGUAL**

```apex
// ✅ Continua assim mesmo
global class BuscaCmsResponse {
    @InvocableVariable(label='Registros')
    global List<TstCmRecord> records;
    
    @InvocableVariable(label='Total de Registros')
    global Integer totalCount;
    
    @InvocableVariable(label='Tem Mais Registros')
    global Boolean hasMore;
}
```

---

### **2️⃣ ADICIONAR DOIS OUTPUTS NA ACTION (Studio)**

**No Agentforce Studio**, em vez de ter **UM** output (`Registros`), você terá **DOIS**:

```
OUTPUT 1: "Resultados" (Array - com Lightning Type)
├── Type: lightning__listType
├── Output Rendering: c__tstCmRecordType  ← LWC CUSTOMIZADO renderiza aqui
└── Maps to: BuscaCmsResponse.records
   
OUTPUT 2: "Todos os Registros" (Array - SEM Lightning Type)
├── Type: lightning__listType
├── Output Rendering: (deixar VAZIO/default)  ← Usa sidebar padrão
└── Maps to: BuscaCmsResponse.records  (mesma lista!)
```

---

### **3️⃣ CONFIGURAÇÃO NA GenAiFunction (output/schema.json)**

```json
{
  "properties": {
    // ✨ OUTPUT 1: Renderização customizada (direita)
    "resultadosPersonalizados": {
      "title": "Resultados (Vista Customizada)",
      "lightning:type": "lightning__listType",
      "items": {
        "lightning:type": "c__tstCmRecordType"  ← Com Lightning Type
      },
      "copilotAction:isDisplayable":  true
    },
    
    // ✨ OUTPUT 2: View More standard (sidebar)
    "todosRegistros": {
      "title": "Todos os Registros",
      "lightning:type": "lightning__listType",
      "items": {
        "lightning:type": "c__tstCmRecord"  ← Classe Apex, sem type override
      },
      "copilotAction:isDisplayable": true
      // ⚠️ NÃO adiciona Lightning Type de renderização
    }
  }
}
```

---

### **4️⃣ NO LWC:  DOIS SLOTS DE RENDERIZAÇÃO**

```javascript
// buscaCmsResponse.js
export default class BuscaCmsResponse extends LightningElement {
    @api value;           // Dados do "Resultados Personalizados"
    @api allRecords;      // Dados do "Todos os Registros"
    @api totalCount;
    @api hasMore;
    
    // ...  renderiza only value (primeiros 10)
}
```

```html
<!-- buscaCmsResponse. html -->
<template>
    <!-- ✨ Renderização CUSTOMIZADA (mostra apenas "Resultados") -->
    <lightning-card title="Registros Encontrados">
        <lightning-datatable
            key-field="id"
            data={value}              <!-- Apenas primeiros N -->
            columns={columns}
        ></lightning-datatable>
        
        <template if: true={hasMore}>
            <button onclick={handleViewMore}>
                Ver Mais ({value.length} / {totalCount})
            </button>
        </template>
    </lightning-card>
</template>
```

---

## 📊 **VISUALIZAÇÃO PRÁTICA**

### **Tela do Agentforce**

```
┌─────────────────────────────────────────────────────────────────┐
│  AGENT:  Buscar registros TST_CM                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────┐  ┌──────────────────────────┐ │
│  │  CHAT (Centro)               │  │  SIDEBAR (Esquerda)      │ │
│  │                              │  │  "View More" Standard    │ │
│  │  Ação: Buscar TST_CM         │  │                          │ │
│  │                              │  │ 📄 Todos (500 regs)      │ │
│  │  ✅ Resultado:                │  │  ☑ ID001  Nome01         │ │
│  │                              │  │  ☑ ID002  Nome02         │ │
│  │  ┌──────────────────────┐    │  │  ☑ ID003  Nome03         │ │
│  │  │ CUSTOMIZADO (LWC)    │    │  │  ☑ ID004  Nome04         │ │
│  │  │ ┌──────────────────┐ │    │  │  [scrollbar] ...         │ │
│  │  │ │ID │Nome│Data│Mod │ │    │  │                          │ │
│  │  │ ├──────────────────┤ │    │  │ 🔍 Search...              │ │
│  │  │ │1  │ABC │1/1 │1/1 │ │    │  │                          │ │
│  │  │ │2  │DEF │1/1 │1/1 │ │    │  │ [Selecionados:  0]        │ │
│  │  │ │3  │GHI │1/1 │1/1 │ │    │  │                          │ │
│  │  │ │... │...  │... │... │ │    │  │                          │ │
│  │  │ │10 │XYZ │1/1 │1/1 │ │    │  │                          │ │
│  │  │ └──────────────────┘ │    │  │                          │ │
│  │  │ 📄 Ver Mais (10/500) │    │  │                          │ │
│  │  └──────────────────────┘    │  │                          │ │
│  │                              │  │                          │ │
│  └──────────────────────────────┘  └──────────────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔑 **DIFERENÇAS ENTRE AS DUAS RENDERIZAÇÕES**

| Aspecto | View More Standard (Sidebar) | LWC Customizado (Chat) |
|---------|------------------------------|----------------------|
| **Localização** | Sidebar esquerdo | Chat principal (direita) |
| **Renderização** | Padrão Salesforce (lista simples) | Customizado (DataTable) |
| **Interação** | Checkbox, busca, filtro | Seleção, ações customizadas |
| **Dados** | TODOS os registros | Primeiros N (paginados) |
| **Overflow** | Scrollbar nativo | Com botão "Ver Mais" |
| **Controle** | Auto (Salesforce) | Você controla (LWC) |

---

## ⚙️ **MUDANÇAS NO CÓDIGO**

### **BuscaCms.cls (Uma única response, dois usos)**

```apex
global class BuscaCms {
    
    @InvocableMethod(label='Buscar Registros TST_CM')
    global static List<BuscaCmsResponse> buscarRegistros(List<BuscaCmsRequest> requests) {
        if (requests == null || requests.isEmpty()) {
            return new List<BuscaCmsResponse>();
        }
        
        BuscaCmsRequest request = requests[0];
        List<String> recordIds = request.recordIds;
        Integer pageSize = request.pageSize != null ? request.pageSize : 10;
        Integer offset = request.offset != null ? request.offset : 0;
        
        // Query total (para sidebar)
        Integer totalRecords = [SELECT COUNT() FROM TST_CM__c WHERE Id IN :recordIds];
        
        // Query com paginação (para LWC)
        List<TST_CM__c> records = [
            SELECT Id, Name, CreatedDate, LastModifiedDate, OwnerId 
            FROM TST_CM__c 
            WHERE Id IN : recordIds
            LIMIT :pageSize
            OFFSET :offset
        ];
        
        List<TstCmRecord> tstCmRecords = new List<TstCmRecord>();
        for (TST_CM__c rec : records) {
            tstCmRecords.add(new TstCmRecord(
                rec.Id,
                rec.Name,
                rec.CreatedDate,
                rec.LastModifiedDate,
                rec. OwnerId
            ));
        }
        
        BuscaCmsResponse response = new BuscaCmsResponse(tstCmRecords);
        response.totalCount = totalRecords;
        response.currentOffset = offset;
        response.hasMore = (offset + pageSize) < totalRecords;
        
        return new List<BuscaCmsResponse> { response };
    }
    
    // ...  Request e Response classes
}
```

### **Configuração Studio (2 outputs)**

```
ACTION OUTPUT MAP: 

┌─────────────────────────────────────────────┐
│ Apex Output:  BuscaCmsResponse               │
│                                             │
│ Output 1: resultadosPersonalizados         │
│   └─> BuscaCmsResponse. records             │
│   └─> Rendering: c__tstCmRecordType        │
│                                             │
│ Output 2: todosRegistros                   │
│   └─> BuscaCmsResponse.records (mesmo!)    │
│   └─> Rendering:  NENHUM (default sidebar) │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 🎯 **BENEFÍCIOS DESSA ABORDAGEM**

✅ **LWC Customizado**: Controle total sobre visualização (DataTable, cores, ações)  
✅ **Sidebar Standard**: Lista completa de registros, busca integrada, seleção com checkbox  
✅ **Mesma Data**: Ambos usam a mesma response do Apex  
✅ **Sem Duplicação**: Um único @InvocableMethod retorna tudo  
✅ **UX Melhorada**: Usuário vê resumo customizado + opção de explorar lista completa  

---

## ⚠️ **CONSIDERAÇÕES TÉCNICAS**

1. **Dois Renderers no Studio**: Você configura DOIS outputs que mapeiam para o MESMO array
2. **Sem Conflito**: Um usa Lightning Type (LWC), outro deixa vazio (sidebar padrão)
3. **Performance**: Query única retorna a mesma lista para ambos
4. **Paginação**: Controlada no LWC (botão "Ver Mais"), sidebar mostra tudo com scroll

---

## 📝 **RESUMO DO PASSO A PASSO COMBINADO**

| Etapa | O que muda |
|-------|-----------|
| 1️⃣ Apex | ✅ Mesmo (retorna tudo) |
| 2️⃣ LWC | ✅ Mesmo (renderiza N primeiros com "Ver Mais") |
| 3️⃣ Lightning Type | ✅ Mesmo (tstCmRecordType) |
| 4️⃣ **Studio** | 🔴 **MUDA**:  Adiciona 2 outputs instead of 1 |
| 5️⃣ **GenAiFunction Schema** | 🔴 **MUDA**: Define 2 propriedades com tipos diferentes |

---

**Quer que eu crie um exemplo completo do `output/schema.json` com os dois outputs configurados corretamente?** 🚀
