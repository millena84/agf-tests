# Exemplos Práticos - Solução para Problemas de Lightning Type Renderer

## Exemplo 1: Componente LWC Correto com Setter

### ✅ Componente: `tstCmRecordList.js`

```javascript
import { LightningElement, api } from 'lwc';

export default class TstCmRecordList extends LightningElement {
  _records = [];
  _isLoading = false;
  _isDisplayable = true;
  
  /**
   * Records - Lista de registros a renderizar
   * Usa setter para validação e processamento
   */
  @api
  set records(value) {
    console.log('[TstCmRecordList] Setting records:', value);
    
    if (!value) {
      this._records = [];
      return;
    }
    
    if (Array.isArray(value)) {
      this._records = this._processRecords(value);
    } else if (typeof value === 'object') {
      // Se for single object, converter para array
      this._records = [this._processRecords([value])[0]];
    } else {
      this._records = [];
    }
    
    console.log('[TstCmRecordList] Records processed:', this._records);
  }
  
  get records() {
    return this._records;
  }
  
  /**
   * IsLoading - Estado de carregamento
   */
  @api
  set isLoading(value) {
    this._isLoading = !!value;
  }
  
  get isLoading() {
    return this._isLoading;
  }
  
  /**
   * IsDisplayable - Determina se componente deve ser visível
   */
  @api
  set isDisplayable(value) {
    this._isDisplayable = !!value;
  }
  
  get isDisplayable() {
    return this._isDisplayable;
  }
  
  /**
   * Processa records para adicionar ID único se não existir
   * Evita problemas de duplicação
   */
  _processRecords(records) {
    return records.map((record, index) => {
      // Garantir que cada record tem ID único
      if (!record.id) {
        record.id = `entry_${index}_${Date.now()}`;
      }
      return {
        ...record,
        _index: index
      };
    });
  }
  
  /**
   * Decide se componente deve renderizar
   */
  get shouldRender() {
    return this._isDisplayable && this._records.length > 0;
  }
  
  /**
   * Lifecycle hook para debugging
   */
  connectedCallback() {
    console.log('[TstCmRecordList] Component connected');
    console.log('Initial records:', this._records);
    console.log('Is displayable:', this._isDisplayable);
  }
  
  /**
   * Handle para eventos do template
   */
  handleRecordClick(event) {
    const recordId = event.currentTarget.dataset.id;
    const record = this._records.find(r => r.id === recordId);
    
    if (record) {
      this.dispatchEvent(
        new CustomEvent('recordselected', {
          detail: { record },
          bubbles: true,
          composed: true
        })
      );
    }
  }
}
```

### ✅ Template: `tstCmRecordList.html`

```html
<template>
  <!-- Renderizar apenas se isDisplayable é true e há registros -->
  <template if:true={shouldRender}>
    <!-- Loading State -->
    <template if:true={isLoading}>
      <div class="loading-spinner">
        <lightning-spinner></lightning-spinner>
        Loading records...
      </div>
    </template>
    
    <!-- Records List - RENDERIZAR APENAS UMA VEZ -->
    <template if:false={isLoading}>
      <div class="record-list-container">
        <h2>Records ({records.length})</h2>
        
        <!-- Iterator com key único - CRÍTICO PARA EVITAR DUPLICAÇÃO -->
        <template for:each={records} for:item="record" for:index="idx">
          <div 
            key={record.id}
            class="record-item" 
            data-id={record.id}
            onclick={handleRecordClick}
          >
            <div class="record-header">
              <span class="record-id">{record.id}</span>
              <span class="record-index">#{idx}</span>
            </div>
            
            <!-- Renderizar propriedades do registro -->
            <template for:each={record} for:item="field" for:index="fieldIdx">
              <template if:true={field}>
                <div key={fieldIdx} class="field-row">
                  <span class="field-label">{field.label}</span>
                  <span class="field-value">{field.value}</span>
                </div>
              </template>
            </template>
          </div>
        </template>
      </div>
    </template>
  </template>
  
  <!-- Estado vazio -->
  <template if:false={shouldRender}>
    <div class="empty-state">
      <p>No records to display</p>
    </div>
  </template>
</template>
```

### ✅ Estilos: `tstCmRecordList.css`

```css
.record-list-container {
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.record-item {
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: box-shadow 0.2s ease;
}

.record-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.record-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
}

.record-id {
  font-weight: bold;
  color: #003366;
}

.record-index {
  color: #666;
  font-size: 0.9rem;
}

.field-row {
  display: flex;
  justify-content: space-between;
  padding: 0.25rem 0;
  font-size: 0.9rem;
}

.field-label {
  font-weight: 500;
  color: #333;
  min-width: 150px;
}

.field-value {
  color: #666;
  text-align: right;
  flex-grow: 1;
}

.loading-spinner {
  text-align: center;
  padding: 2rem;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #999;
}
```

---

## Exemplo 2: renderer.json Correto

### ❌ PROBLEMA - Renderização múltipla

```json
{
  "metadata": {
    "apiVersion": 59.0,
    "description": "Record List Type",
    "masterLabel": "TstCm Record List Type",
    "type": "lightningTypeBundle"
  },
  "renderer": {
    "type": "lightningDesktopGenAi",
    "componentOverrides": {
      "c-tst-cm-record-list": {
        "render": "$.items"  // ❌ PROBLEMA: Renderiza cada item separadamente
      }
    }
  }
}
```

### ✅ SOLUÇÃO - Renderização única

```json
{
  "metadata": {
    "apiVersion": 59.0,
    "description": "Record List Type",
    "masterLabel": "TstCm Record List Type",
    "type": "lightningTypeBundle"
  },
  "renderer": {
    "type": "lightningDesktopGenAi",
    "componentOverrides": {
      "c-tst-cm-record-list": {
        "render": true,
        "attributes": {
          "records": {
            "path": "$.items"  // ✅ CORRETO: Passa array inteiro como propriedade
          },
          "isLoading": {
            "path": "$.isLoading"
          },
          "isDisplayable": {
            "path": "$.isDisplayable"
          }
        }
      }
    }
  }
}
```

---

## Exemplo 3: GenAiFunction Retornando Dados Estruturados

### ✅ Apex Class: `TstCmGenAiFunction.cls`

```apex
global class TstCmGenAiFunction {
  
  /**
   * Método invocado por copilotAction
   * Retorna dados estruturados que serão passados ao Lightning Type
   */
  @AuraEnabled(cacheable=false)
  public static Map<String, Object> getRecordData(String recordId) {
    try {
      Map<String, Object> response = new Map<String, Object>();
      
      // Simular busca de dados
      List<Map<String, Object>> records = new List<Map<String, Object>>();
      
      for (Integer i = 1; i <= 5; i++) {
        records.add(new Map<String, Object>{
          'id' => 'record_' + i,
          'name' => 'Record Name ' + i,
          'status' => i % 2 == 0 ? 'Active' : 'Inactive',
          'createdDate' => System.now().addDays(-i)
        });
      }
      
      response.put('items', records);
      response.put('isLoading', false);
      response.put('isDisplayable', true);
      response.put('totalCount', records.size());
      
      return response;
      
    } catch (Exception e) {
      System.debug(LoggingLevel.ERROR, 'Error: ' + e.getMessage());
      return new Map<String, Object>{
        'items' => new List<Map<String, Object>>(),
        'isLoading' => false,
        'isDisplayable' => false,
        'error' => e.getMessage()
      };
    }
  }
}
```

### ✅ copilotAction Definition

```xml
<?xml version="1.0" encoding="UTF-8"?>
<GenAiFunction xmlns="http://soap.sforce.com/2006/04/metadata">
    <description>Retrieves record list data</description>
    <developerName>TstCmRecordFunction</developerName>
    <isActive>true</isActive>
    <masterLabel>TstCm Record Function</masterLabel>
    <outputType>lightningTypeBundle</outputType>
    <outputTypeBundle>TstCmRecordListType</outputTypeBundle>
    <type>function</type>
</GenAiFunction>
```

---

## Exemplo 4: Test Class com Validações

### ✅ JavaScript Test: `tstCmRecordList.test.js`

```javascript
import { createElement } from 'lwc';
import TstCmRecordList from 'c/tstCmRecordList';

describe('TstCmRecordList Component', () => {
  
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });
  
  test('Renders with array of records', async () => {
    const element = createElement('c-tst-cm-record-list', {
      is: TstCmRecordList
    });
    
    const mockRecords = [
      { id: '1', name: 'Record 1' },
      { id: '2', name: 'Record 2' }
    ];
    
    element.records = mockRecords;
    element.isDisplayable = true;
    
    document.body.appendChild(element);
    
    await Promise.resolve();
    
    const items = element.shadowRoot.querySelectorAll('.record-item');
    expect(items.length).toBe(2);
  });
  
  test('Does not render when isDisplayable is false', async () => {
    const element = createElement('c-tst-cm-record-list', {
      is: TstCmRecordList
    });
    
    element.records = [{ id: '1', name: 'Record 1' }];
    element.isDisplayable = false;
    
    document.body.appendChild(element);
    
    await Promise.resolve();
    
    const emptyState = element.shadowRoot.querySelector('.empty-state');
    expect(emptyState).toBeTruthy();
  });
  
  test('Adds unique IDs to records without ID', async () => {
    const element = createElement('c-tst-cm-record-list', {
      is: TstCmRecordList
    });
    
    const mockRecords = [
      { name: 'Record 1' },  // Sem ID
      { name: 'Record 2' }   // Sem ID
    ];
    
    element.records = mockRecords;
    element.isDisplayable = true;
    
    document.body.appendChild(element);
    
    await Promise.resolve();
    
    const items = element.shadowRoot.querySelectorAll('[key]');
    expect(items[0].getAttribute('data-id')).toContain('entry_');
    expect(items[1].getAttribute('data-id')).toContain('entry_');
    // IDs devem ser únicos
    expect(items[0].getAttribute('data-id')).not.toBe(items[1].getAttribute('data-id'));
  });
});
```

---

## Exemplo 5: Configuração do Meta XML

### ✅ `tstCmRecordListType-meta.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<LightningTypeBundle xmlns="http://soap.sforce.com/2006/04/metadata">
    <description>Custom Lightning Type for displaying TstCm records</description>
    <isActive>true</isActive>
    <masterLabel>TstCm Record List Type</masterLabel>
    <renderer>
        <type>lightningDesktopGenAi</type>
        <componentOverrides>
            <c-tst-cm-record-list>
                <render>true</render>
                <attributes>
                    <records>
                        <path>$.items</path>
                    </records>
                    <isLoading>
                        <path>$.isLoading</path>
                    </isLoading>
                    <isDisplayable>
                        <path>$.isDisplayable</path>
                    </isDisplayable>
                </attributes>
            </c-tst-cm-record-list>
        </componentOverrides>
    </renderer>
</LightningTypeBundle>
```

---

## Checklist de Implementação

- [ ] **Componente LWC**
  - [ ] Usar setter com `@api` para propriedades
  - [ ] Adicionar validação de tipo em setters
  - [ ] Implementar `get` para retornar valor privado
  - [ ] Adicionar `key` único em `for:each` loops
  - [ ] Usar `if:true/if:false` para renderização condicional

- [ ] **renderer.json**
  - [ ] Usar `"render": true` ao invés de `"render": "$.path"`
  - [ ] Mapear dados via `attributes` com `path`
  - [ ] Verificar que paths correspondem à estrutura de dados
  - [ ] Validar que não há iteração dupla

- [ ] **GenAiFunction**
  - [ ] Retornar estrutura clara com `items`, `isLoading`, `isDisplayable`
  - [ ] Adicionar tratamento de erros
  - [ ] Garantir que `items` é sempre array
  - [ ] Adicionar logs para debugging

- [ ] **Testes**
  - [ ] Testar com arrays vazios
  - [ ] Testar com dados nulos
  - [ ] Testar com arrays grandes
  - [ ] Validar que não há duplicação de items
  - [ ] Testar mudanças de `isDisplayable`

---

## Debugging

### Console Log Recomendado:

```javascript
// No LWC
connectedCallback() {
  console.group('TstCmRecordList Debug');
  console.log('Records:', this.records);
  console.log('isLoading:', this.isLoading);
  console.log('isDisplayable:', this.isDisplayable);
  console.log('Should Render:', this.shouldRender);
  console.groupEnd();
}

set records(value) {
  console.log('=== Records Updated ===');
  console.log('Raw Value:', value);
  console.log('Type:', Array.isArray(value) ? 'Array' : typeof value);
  console.log('Length:', Array.isArray(value) ? value.length : 'N/A');
  this._records = value;
}
```

### Verificar no Browser:
1. DevTools > Console
2. Procurar por logs do componente
3. Verificar se dados estão sendo passados corretamente
4. Confirmar que setter é chamado apenas uma vez

---

## Próximos Passos

1. Implementar as mudanças no componente
2. Atualizar renderer.json conforme exemplos
3. Testar com dados reais
4. Executar Jest tests
5. Validar no Agentforce UI
