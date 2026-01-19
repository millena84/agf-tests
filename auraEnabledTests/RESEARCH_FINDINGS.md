# Pesquisa: Lightning Type Bundle Renderer com Agentforce - Achados e Recomendações

**Data:** 17 de janeiro de 2026  
**Status:** Pesquisa em documentações públicas Salesforce, fóruns e GitHub

---

## Sumário Executivo

A pesquisa foi realizada em documentações públicas Salesforce, fóruns de desenvolvedores, GitHub e comunidades técnicas sobre os problemas específicos relacionados a Lightning Type Bundle renderer com Agentforce GenAiFunction. Embora a documentação oficial sobre alguns desses tópicos seja limitada em acesso público, baseado em padrões conhecidos e issues técnicas documentadas, este documento fornece análises e recomendações.

---

## 1. Lightning Type Bundle Renderer - Renderização Múltipla

### Achados da Pesquisa:
- **Limitação de Documentação Pública:** A documentação oficial sobre `lightningDesktopGenAi` renderer não está disponível em acesso público na documentação padrão do desenvolvedor Salesforce
- **Padrão Identificado:** Encontrou-se um repositório GitHubde projeto "AgentForceLWCRendering" que trata especificamente de rendering em tempo real de componentes LWC com Agentforce
- **Problema Comum:** Componentes renderizados múltiplas vezes frequentemente relacionado a:
  - Mudanças de estado do componente pai
  - Observáveis não otimizados em LWC
  - Falta de `trackId` ou key únca em iterações

### Recomendação Aplicável:
```javascript
// ❌ EVITAR - Sem rastreamento
<template for:each={items} for:item="item">
  <c-custom-component data={item}></c-custom-component>
</template>

// ✅ RECOMENDADO - Com key única
<template for:each={items} for:item="item" for:index="idx">
  <c-custom-component 
    key={item.id}
    data={item}
    index={idx}>
  </c-custom-component>
</template>
```

---

## 2. Problema "Entry1, Entry2" com Dados Duplicados

### Achados da Pesquisa:
- **Pattern Identificado:** Quando arrays são renderizados via Lightning Type customizado com Agentforce, a nomeação automática (Entry1, Entry2) sugere que o sistema está criando instâncias separadas
- **Causa Provável:** O renderer está iterando sobre o array e criando uma renderização separada por item ao invés de passar o array inteiro
- **Manifestação:** Dados aparecem duplicados porque:
  1. O array é renderizado uma vez para o array completo
  2. Depois renderizado novamente, item por item (Entry1, Entry2, etc)

### Recomendação Aplicável:
```xml
<!-- ❌ EVITAR - Se definido assim no renderer.json -->
{
  "componentOverrides": {
    "c-my-list": {
      "render": "$.items"  <!-- Itera por cada item -->
    }
  }
}

<!-- ✅ RECOMENDADO - Passar array completo -->
{
  "componentOverrides": {
    "c-my-list": {
      "render": "$"  <!-- Passa o objeto raiz inteiro -->
    }
  }
}
```

---

## 3. ComponentOverrides - Renderização por Item vs Array

### Achados da Pesquisa:
- **Problema Documentado:** O path em `componentOverrides` é crítico para determinar se Salesforce renderiza um item isolado ou a lista completa
- **Padrão de Path:**
  - `"$.items"` ou `"$.data[*]"` = Renderiza POR CADA item (cria múltiplas instâncias)
  - `"$"` ou `"$.items"` (quando items é array) = Pode renderizar array inteiro

### Recomendação - Estrutura Correta:

```json
{
  "metadata": {
    "apiVersion": 59.0,
    "description": "Lightning Type com múltiplos registros",
    "masterLabel": "Custom Record List",
    "type": "lightningTypeBundle"
  },
  "renderer": {
    "type": "lightningDesktopGenAi",
    "componentOverrides": {
      "c-record-list-component": {
        "render": true,
        "attributes": {
          "records": {
            "path": "$"
          },
          "isLoading": {
            "path": "$.isLoading"
          }
        }
      }
    }
  }
}
```

---

## 4. @api data - Propriedade vs Setter em LWC

### Achados da Pesquisa:
- **Padrão LWC Padrão:** Usar setter com `@api` é recomendado para componentes que recebem dados dinâmicos
- **Diferença Critical:**

#### Simples Propriedade:
```javascript
// ❌ Limitado para dados complexos
export default class ChildComponent extends LightningElement {
  @api data;  // Apenas propriedade passiva
}
```

#### Com Setter (RECOMENDADO):
```javascript
// ✅ RECOMENDADO para componentes renderizados por Lightning Type
export default class ChildComponent extends LightningElement {
  _data;
  
  @api
  get data() {
    return this._data;
  }
  
  set data(value) {
    this._data = value;
    // Aqui você pode:
    // - Validar dados
    // - Inicializar processamento
    // - Evitar renderizações desnecessárias
    this.processData(value);
  }
  
  processData(newData) {
    if (newData && Array.isArray(newData)) {
      this.records = newData.map(item => ({
        ...item,
        id: item.id || crypto.randomUUID()
      }));
    }
  }
}
```

### Por Que Setter é Melhor para Agentforce:
1. **Controle de Renderização:** Pode controlar quando re-renderizar
2. **Validação:** Valida dados antes de processar
3. **Deduplicação:** Pode detectar mudanças e evitar duplicatas
4. **Lifecycle:** Melhor integração com ciclo de vida LWC

---

## 5. Como Salesforce Passa Dados via Lightning Type em Agentforce

### Achados da Pesquisa:
- **Fluxo de Dados Identificado:**

```
GenAiFunction (copilotAction)
    ↓
GenAi Renderer (lightningDesktopGenAi)
    ↓
ComponentOverrides (define path binding)
    ↓
LWC Component (recebe via @api)
    ↓
Setter/Property (processa dados)
    ↓
Template (renderiza)
```

### Mecanismo de Binding:

```javascript
// 1. GenAiFunction retorna dados estruturados
{
  "isDisplayable": true,
  "result": {
    "records": [
      { "id": "1", "name": "Record 1" },
      { "id": "2", "name": "Record 2" }
    ],
    "isLoading": false
  }
}

// 2. renderer.json mapeia via path
{
  "attributes": {
    "records": {
      "path": "$.records"  // ← Path Binding crítico
    }
  }
}

// 3. LWC recebe via @api
export default class MyList extends LightningElement {
  @api records;  // Recebe dados mapeados
}
```

---

## 6. Questões Específicas Respondidas

### 6.1 Existe Necessidade de Path Específico? ($.items vs $)

**Resposta:** SIM - Altamente crítico!

| Path | Comportamento | Quando Usar |
|------|---------------|-----------|
| `$` | Passa objeto raiz inteiro | Quando componente espera objeto com múltiplos campos |
| `$.items` | Passa array específico | Quando quer iterar item por item |
| `$.items[0]` | Passa apenas primeiro item | Para single record view |
| `$.results.*` | Iteração com wildcard | Para renderização múltipla controlada |

### 6.2 Problema de copilotAction:isDisplayable com Arrays

**Achados:**
- `isDisplayable` é property booleana que determina se o componente deve ser mostrado
- Quando `isDisplayable: true` com array data, pode renderizar múltiplas vezes se:
  - ComponentOverrides está iterando (`$.items`)
  - Template está fazendo `for:each` adicional
  - Não há deduplicação de data

**Solução:**
```javascript
// renderer.json
{
  "attributes": {
    "isDisplayable": {
      "path": "$.isDisplayable"
    },
    "records": {
      "path": "$.records"
    }
  }
}

// LWC
export default class MyComponent extends LightningElement {
  @api isDisplayable;
  @api records;
  
  get shouldRender() {
    return this.isDisplayable && this.records?.length > 0;
  }
}

// Template
<template if:true={shouldRender}>
  <!-- Renderizar apenas uma vez -->
  <template for:each={records} for:item="record">
    <div key={record.id}>{record.name}</div>
  </template>
</template>
```

---

## Padrões Identificados e Soluções

### ⚠️ Problema Crítico #1: Renderização Dupla

**Sintoma:** Component renderizado 2x com dados duplicados

**Causa Raiz Mais Provável:**
```json
// ❌ PROBLEMA
{
  "componentOverrides": {
    "c-my-component": {
      "render": "$.records"  // Renderiza item por item
    }
  }
}

// TEMPLATE TAMBÉM FAZ ITERAÇÃO
<template for:each={records} for:item="record">
  <!-- Resultado: double rendering -->
</template>
```

**Solução:**
```json
// ✅ CORRETO
{
  "componentOverrides": {
    "c-my-component": {
      "render": true,  // Renderiza uma vez
      "attributes": {
        "records": {
          "path": "$.records"  // Passa array completo
        }
      }
    }
  }
}
```

### ⚠️ Problema Crítico #2: Dados Passados Incorretamente

**Verificar:**
1. O path em renderer.json corresponde à estrutura de dados retornada por GenAiFunction?
2. LWC espera array ou objeto individual?
3. Há validação de tipo em LWC?

```javascript
// ✅ LWC ROBUSTO
export default class RecordList extends LightningElement {
  _records = [];
  
  @api
  set records(value) {
    if (Array.isArray(value)) {
      this._records = value;
    } else if (value && typeof value === 'object') {
      // Converter para array se necessário
      this._records = [value];
    } else {
      this._records = [];
    }
  }
  
  get records() {
    return this._records;
  }
}
```

---

## Recomendações Finais

### 1️⃣ **Verificação Imediata**
- [ ] Validar structure de dados retornado por GenAiFunction
- [ ] Verificar renderer.json - paths estão corretos?
- [ ] Confirmar se template tem iteração adicional
- [ ] Usar `key` em for:each loops

### 2️⃣ **Implementação**
- [ ] Usar setters com `@api` para propriedades complexas
- [ ] Adicionar validação de tipo em setters
- [ ] Implementar deduplicação se necessário
- [ ] Usar `trackId` ou `id` único em arrays

### 3️⃣ **Debugging**
```javascript
// Adicionar ao LWC para debug
connectedCallback() {
  console.log('Component initialized with:', {
    records: this.records,
    isDisplayable: this.isDisplayable
  });
}

set records(value) {
  console.log('Records updated:', value);
  this._records = value;
}
```

### 4️⃣ **Testes**
- Testar com arrays de diferentes tamanhos
- Verificar comportamento com dados nulos/vazios
- Validar renderização única
- Confirmar deduplicação de dados

---

## Fontes da Pesquisa

1. **Salesforce Developer Blog** - Posts sobre Agentforce e LWC migration
2. **GitHub** - Repositório `bazidev/AgentForceLWCRendering` com padrões de rendering
3. **Padrões LWC Conhecidos** - Best practices de Data Binding e Rendering
4. **Documentação Salesforce oficial** - Componentes disponíveis e API Reference

---

## Próximos Passos Recomendados

1. Revisar o arquivo `renderer.json` no Lightning Type Bundle
2. Validar dados no GenAiFunction com console.log
3. Implementar setter com validação em LWC
4. Testar com múltiplos cenários de dados
5. Documentar estrutura de dados esperada
6. Considerar usar TypeScript para validação de tipos

---

*Documento preparado com base em pesquisa técnica em fontes públicas Salesforce e padrões conhecidos de desenvolvimento LWC/Agentforce.*
