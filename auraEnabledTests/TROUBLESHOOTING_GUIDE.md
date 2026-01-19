# Troubleshooting Guide - Lightning Type Renderer Issues

## Problema 1: Componente Renderizado Múltiplas Vezes

### Sintomas:
- ✗ Dados aparecem 2x ou mais vezes
- ✗ Console mostra "connectedCallback" chamado múltiplas vezes
- ✗ Nomes automáticos "Entry1, Entry2, Entry3" aparecem

### Diagnóstico Passo a Passo:

**Passo 1: Verificar renderer.json**
```json
// ❌ CULPADO #1
{
  "componentOverrides": {
    "c-my-component": {
      "render": "$.items"  // Renderiza para CADA item
    }
  }
}

// ✅ CORRETO
{
  "componentOverrides": {
    "c-my-component": {
      "render": true,
      "attributes": {
        "records": { "path": "$.items" }
      }
    }
  }
}
```

**Passo 2: Verificar Template**
```html
<!-- ❌ CULPADO #2 - Iteração dupla -->
<template for:each={records} for:item="record">
  <!-- Se componentOverrides também iterava, duplica! -->
</template>

<!-- ✅ CORRETO - Uma iteração apenas -->
<template for:each={records} for:item="record">
  <!-- OK -->
</template>
```

**Passo 3: Adicionar Logging**
```javascript
export default class MyComponent extends LightningElement {
  connectedCallback() {
    console.log('🔴 connectedCallback called');
    console.trace('Stack trace');
  }
  
  @api
  set records(value) {
    console.log('🔵 Records setter called with:', value);
    console.log('  Count:', Array.isArray(value) ? value.length : 'N/A');
  }
}
```

### Solução Aplicada:
1. Remover `render: "$.items"` de renderer.json
2. Adicionar `attributes` com path binding
3. Remover iteração adicional se houver

**Impacto:** Renderização única ✓

---

## Problema 2: Dados Duplicados na Tela

### Sintomas:
- ✗ Mesmo registro aparece 2x
- ✗ Dados "Entry1" e "Entry2" com valores idênticos
- ✗ Total de registros duplicado

### Diagnóstico:

**Causa Mais Comum: Path Binding Incorreto**

```javascript
// GenAiFunction retorna:
{
  "items": [
    { "id": "1", "name": "Test" }
  ]
}

// ❌ renderer.json - Passa item, não array
{
  "attributes": {
    "records": { "path": "$.items[0]" }  // Apenas primeiro item
  }
}

// Resultado: Se renderizar por item, cria múltiplas instâncias
```

**Debug: Adicionar Logging no Getter**
```javascript
get records() {
  console.log('📊 Records getter called:');
  console.log('  Value:', this._records);
  console.log('  Type:', Array.isArray(this._records) ? 'Array' : typeof this._records);
  console.log('  Length:', Array.isArray(this._records) ? this._records.length : 'N/A');
  return this._records;
}
```

**Verificação na Template:**
```html
<div>Total records: {records.length}</div>
<template for:each={records} for:item="record">
  <div key={record.id}>
    {record.name} - Debug ID: {record.id}
  </div>
</template>
```

### Solução:

1. **Validar estrutura de dados retornada**
```apex
// Apex test
Map<String, Object> result = TstCmGenAiFunction.getRecordData('123');
System.debug('Result: ' + result);
System.debug('Items count: ' + ((List<Object>)result.get('items')).size());
```

2. **Atualizar path binding**
```json
{
  "attributes": {
    "records": { "path": "$.items" }  // Array completo, não item
  }
}
```

3. **Validar no LWC com setter**
```javascript
@api
set records(value) {
  if (Array.isArray(value)) {
    this._records = value;
  } else {
    // Log warning e normalizar
    console.warn('Expected array, got:', typeof value);
    this._records = Array.isArray(value) ? value : [];
  }
}
```

**Impacto:** Dados exibidos uma vez ✓

---

## Problema 3: ComponentOverrides Não Funciona

### Sintomas:
- ✗ Componente não renderiza
- ✗ Dados não aparecem
- ✗ Sem erro visível

### Diagnóstico:

**Verificar Meta XML:**
```xml
<!-- ❌ Arquivo pode estar errado -->
<?xml version="1.0" encoding="UTF-8"?>
<LightningTypeBundle xmlns="...">
  <renderer>
    <type>lightningDesktopGenAi</type>
    <!-- ComponentOverrides aqui deve existir -->
  </renderer>
</LightningTypeBundle>
```

**Verificar Namespace do Componente:**
```json
{
  "componentOverrides": {
    "c-my-component": {  // ← Namespace 'c' correto?
      "render": true
    }
  }
}

// Se componente está em namespace diferente:
{
  "componentOverrides": {
    "myNamespace-my-component": {
      "render": true
    }
  }
}
```

**Verificar se Renderer Type é Correto:**
```xml
<!-- ❌ Pode estar errado -->
<renderer>
  <type>lightningDesktop</type>
</renderer>

<!-- ✅ Correto para Agentforce -->
<renderer>
  <type>lightningDesktopGenAi</type>
</renderer>
```

### Solução:

1. **Validar que componente LWC existe**
```bash
ls force-app/main/default/lwc/tstCmRecordList/
```

2. **Verificar namespace correto**
```javascript
// tstCmRecordList.js
import { LightningElement } from 'lwc';
export default class TstCmRecordList extends LightningElement {}
// Namespace será 'c' por padrão
```

3. **Atualizar renderer.json com namespace correto**
```json
{
  "componentOverrides": {
    "c-tst-cm-record-list": {  // ← kebab-case, namespace-component
      "render": true
    }
  }
}
```

4. **Deploiar e limpar cache**
```bash
sf project deploy start
# Limpar cache no browser: Ctrl+Shift+Del
```

**Impacto:** ComponentOverrides funciona ✓

---

## Problema 4: isDisplayable Não Funciona

### Sintomas:
- ✗ Componente renderiza mesmo quando isDisplayable = false
- ✗ Propriedade não muda de estado
- ✗ Sempre visível

### Diagnóstico:

**Verificar Binding**
```json
{
  "attributes": {
    "isDisplayable": { "path": "$.isDisplayable" }
  }
}
```

**Verificar que o caminho existe nos dados**
```apex
Map<String, Object> response = new Map<String, Object>{
  'items' => records,
  'isDisplayable' => true  // ← Deve existir
};
```

**Verificar Lógica no Template**
```html
<!-- ❌ Não verifica isDisplayable -->
<template if:true={records}>
  <!-- Renderiza independente de isDisplayable -->
</template>

<!-- ✅ Verifica ambos -->
<template if:true={shouldDisplay}>
  <!-- Renderiza só se isDisplayable E há registros -->
</template>
```

### Solução:

```javascript
export default class MyComponent extends LightningElement {
  @api isDisplayable = true;
  @api records = [];
  
  // Getter que verifica ambos
  get shouldDisplay() {
    return this.isDisplayable && this.records.length > 0;
  }
}
```

```html
<template if:true={shouldDisplay}>
  <!-- Conteúdo -->
</template>

<template if:false={shouldDisplay}>
  <div>Not displayable or no records</div>
</template>
```

**Impacto:** isDisplayable respeitado ✓

---

## Problema 5: Dados Nulos ou Vazios Causam Erro

### Sintomas:
- ✗ Erro: "Cannot read property 'length' of undefined"
- ✗ Componente quebra quando dados são nulos
- ✗ Sem fallback para estado vazio

### Diagnóstico:

```javascript
// ❌ Código frágil
get recordCount() {
  return this.records.length;  // Falha se records é null/undefined
}
```

### Solução Completa:

```javascript
export default class MyComponent extends LightningElement {
  _records = [];
  
  @api
  set records(value) {
    // Validação robusta
    if (!value) {
      this._records = [];
    } else if (Array.isArray(value)) {
      this._records = value;
    } else if (typeof value === 'object') {
      this._records = [value];
    } else {
      this._records = [];
    }
  }
  
  get records() {
    return this._records || [];
  }
  
  get isEmpty() {
    return !this.records || this.records.length === 0;
  }
  
  get recordCount() {
    return this.records.length;  // Agora seguro
  }
}
```

**Template**
```html
<template if:true={isEmpty}>
  <div class="empty-state">
    <p>No records available</p>
  </div>
</template>

<template if:false={isEmpty}>
  <div>Found {recordCount} records</div>
  <!-- Renderizar registros -->
</template>
```

**Impacto:** Tratamento robusto de dados nulos ✓

---

## Problema 6: Performance - Renderização Lenta

### Sintomas:
- ✗ UI congelada com muitos registros
- ✗ Scroll lento
- ✗ Browser usa muita memória

### Diagnóstico:

**Verificar Tamanho de Lista**
```javascript
connectedCallback() {
  console.log('Records count:', this.records?.length || 0);
}
```

### Solução - Paginação:

```javascript
export default class MyComponent extends LightningElement {
  @api pageSize = 10;
  _records = [];
  _currentPage = 1;
  
  @api
  set records(value) {
    this._records = Array.isArray(value) ? value : [];
    this._currentPage = 1;
  }
  
  get records() {
    const start = (this._currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this._records.slice(start, end);
  }
  
  get totalPages() {
    return Math.ceil(this._records.length / this.pageSize);
  }
  
  get hasNextPage() {
    return this._currentPage < this.totalPages;
  }
  
  handleNextPage() {
    if (this.hasNextPage) {
      this._currentPage++;
    }
  }
  
  handlePreviousPage() {
    if (this._currentPage > 1) {
      this._currentPage--;
    }
  }
}
```

**Template com Paginação**
```html
<template if:false={isEmpty}>
  <div class="pagination">
    <button 
      onclick={handlePreviousPage} 
      disabled={_currentPage == 1}
    >
      Previous
    </button>
    <span>Page {_currentPage} of {totalPages}</span>
    <button 
      onclick={handleNextPage} 
      disabled={!hasNextPage}
    >
      Next
    </button>
  </div>
  
  <!-- Renderizar apenas página atual -->
  <template for:each={records} for:item="record">
    <div key={record.id}>{record.name}</div>
  </template>
</template>
```

**Impacto:** Rendering otimizado para listas grandes ✓

---

## Problema 7: Keys Duplicadas em for:each

### Sintomas:
- ✗ Aviso no console: "Duplicate key in list"
- ✗ Componentes não atualizam corretamente
- ✗ Animações estranhas

### Diagnóstico:

```html
<!-- ❌ Keys duplicadas -->
<template for:each={records} for:item="record">
  <div key={record.status}>  <!-- Se múltiplos com status='Active' -->
    {record.name}
  </div>
</template>

<!-- ✅ Keys únicas -->
<template for:each={records} for:item="record">
  <div key={record.id}>  <!-- ID deve ser único -->
    {record.name}
  </div>
</template>
```

### Solução:

```javascript
_processRecords(records) {
  return records.map((record, index) => {
    return {
      ...record,
      // Garantir ID único
      id: record.id || `${record.name}_${index}_${Date.now()}`
    };
  });
}
```

**Impacto:** Keys únicas, sem warnings ✓

---

## Checklist de Troubleshooting

| Problema | Verificação | Solução |
|----------|------------|---------|
| Renderização dupla | Verificar renderer.json | Remover iterate path |
| Dados duplicados | Console log do setter | Validar path binding |
| ComponentOverrides não funciona | Meta XML | Verificar namespace |
| isDisplayable ignorado | Template | Usar shouldDisplay getter |
| Dados nulos erro | Try/catch | Adicionar validação |
| Lento com muitos itens | Performance | Implementar paginação |
| Keys duplicadas | Warning console | Usar ID único |

---

## Debug Command Line

```bash
# Ver estrutura do Lightning Type
cat force-app/main/default/lightningTypes/tstCmRecordListType/tstCmRecordListType-meta.xml

# Ver renderer.json
cat force-app/main/default/lightningTypes/tstCmRecordListType/renderer.json

# Deployar e ver erros
sf project deploy start --source-dir force-app/main/default/lightningTypes/tstCmRecordListType/

# Ver logs de Apex
sf apex log tail

# Verificar componente LWC
sf search --sobject LWC -w c_tst_cm_record_list
```

---

## Recursos Adicionais

- [Salesforce LWC Documentation](https://developer.salesforce.com/docs/component-library/bundle/lightning-element/documentation)
- [LWC Best Practices](https://developer.salesforce.com/docs/platform/lwc/guide/lwc-best-practices)
- [Agentforce Documentation](https://developer.salesforce.com/tools/agentforce)
