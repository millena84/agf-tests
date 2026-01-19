# 📊 OPÇÕES DE RENDERIZAÇÃO DE DADOS NO AGENTFORCE

## Status Atual
- ✅ Dados chegam corretamente via @AuraEnabled
- ✅ GenAiFunction executa sem erros
- ❌ Lightning Type customizado NOT renderizando
- ❌ Flow Screen não funciona em agents
- ⚠️ Aparecem em texto corrido (fallback)

---

## 🎯 OPÇÕES DISPONÍVEIS

### **1. ✅ LIGHTNING TYPE COM RENDERER CUSTOMIZADO (OBJETIVO ORIGINAL)**
**Status**: Parcialmente funcional (dados chegam, renderização falha)

**Como funciona**:
- GenAiFunction output → aponta pra Lightning Type
- Lightning Type tem renderer.json → aponta pro LWC
- Agentforce renderiza LWC customizado

**Vantagens**:
- ✅ Padrão oficial Salesforce
- ✅ Totalmente customizável
- ✅ Funciona com qualquer estrutura de dados

**Desvantagens**:
- ❌ Custom Lightning Types não aparecem no Output Rendering dropdown
- ❌ Sintaxe de referência ainda não clara (sourceType? lightning:type?)
- ❌ Padrão pode estar em beta/incompleto

**Próximos passos**:
1. Contactar Salesforce Support
2. Verificar se há flag de feature a habilitar
3. Testar em org diferente

---

### **2. 📋 RICH TEXT / FORMATTED OUTPUT**
**Status**: Disponível, mas limitado

**Como funciona**:
- Retornar JSON formatado como texto rico
- Agentforce renderiza como markdown/HTML

**Implementação**:
```json
"200": {
  "type": "string",
  "format": "html",
  "copilotAction:isDisplayable": true
}
```

**Vantagens**:
- ✅ Simples de implementar
- ✅ Funciona sem configuração extra
- ✅ Suporta HTML/Markdown básico

**Desvantagens**:
- ❌ Limitado a formatação visual
- ❌ Sem interatividade
- ❌ Sem componentes Lightning

**Exemplo de saída**:
```html
<table>
  <tr><th>ID</th><th>Name</th></tr>
  <tr><td>a0BgL...</td><td>Financiamento...</td></tr>
</table>
```

---

### **3. 🔗 AGENTFORCE PLANNERTYPE (Se usar GenAiPlanner)**
**Status**: Disponível se o org tem GenAiPlanner

**Como funciona**:
- Definir tipos customizados em GenAiPlanner
- GenAiFunction retorna dados tipados
- Agent renderiza baseado no tipo

**Configuração**:
```json
"200": {
  "type": "array",
  "items": {
    "copilotAction:plannerType": "c__CustomFinancialRecord"
  }
}
```

**Vantagens**:
- ✅ Totalmente customizável
- ✅ Renderização nativa do Agentforce
- ✅ Suporta ações customizadas

**Desvantagens**:
- ❌ Requer GenAiPlanner habilitado
- ❌ Sintaxe pode estar em beta
- ❌ Documentação limitada

---

### **4. 🎭 APEX DYNAMIC CONTENT (Generar HTML no Apex)**
**Status**: Funcional, workaround

**Como funciona**:
- Apex gera HTML/CSS inline
- Retorna como string
- Agentforce renderiza diretamente

**Implementação**:
```apex
global class QueryTstCm {
    @AuraEnabled(cacheable=false)
    public static String getRecordsHtml(List<String> recordIds) {
        List<TST_CM__c> records = [SELECT Id, Name, CreatedDate FROM TST_CM__c WHERE Id IN :recordIds];
        
        String html = '<div class="data-table" style="border: 1px solid #ccc;">';
        html += '<table style="width:100%">';
        html += '<tr><th>ID</th><th>Name</th><th>Created</th></tr>';
        
        for(TST_CM__c rec : records) {
            html += '<tr>';
            html += '<td>' + rec.Id + '</td>';
            html += '<td>' + rec.Name + '</td>';
            html += '<td>' + rec.CreatedDate + '</td>';
            html += '</tr>';
        }
        html += '</table></div>';
        
        return html;
    }
}
```

**Vantagens**:
- ✅ Funciona garantido
- ✅ Total controle de renderização
- ✅ Sem dependências externas

**Desvantagens**:
- ❌ Sem interatividade (não clickável)
- ❌ Código inline cresça rapidamente
- ❌ Difícil manutenção

---

### **5. 🤖 FOLLOW-UP ACTION (Multi-step)**
**Status**: Disponível e funcional

**Como funciona**:
1. GenAiFunction retorna dados (texto corrido)
2. Agent oferece ações follow-up
3. Usuário seleciona ação → renderiza em nova etapa

**Implementação**:
```json
"200": {
  "type": "string",
  "copilotAction:isDisplayable": true,
  "description": "Found 2 records. Use button below to view details."
}
```

**Ações Follow-up**:
- "View in Table" → chama outra GenAiFunction
- "View in DataTable" → chama LWC via Flow (não funciona)
- "Export" → gera CSV/PDF

**Vantagens**:
- ✅ Funciona sem workarounds
- ✅ UX intuitiva
- ✅ Escalável para múltiplas visualizações

**Desvantagens**:
- ❌ Requer múltiplas ações
- ❌ Não é renderização direta
- ⚠️ Aumenta complexidade

---

### **6. 📱 EXTERNAL RENDERING (Custom UI fora do Agent)**
**Status**: Fora do escopo Agentforce

**Como funciona**:
- GenAiFunction retorna URL/ID
- Agent direciona para LWC em Community/App
- Usuário vê dados em interface separada

**Exemplo**:
```apex
return new Map<String, Object>{
    'recordIds' => recordIds,
    'viewUrl' => '/lightning/r/TST_CM__c/' + recordIds[0] + '/view'
};
```

**Vantagens**:
- ✅ Sem limitações de renderização
- ✅ Full LWC capabilities
- ✅ Totalmente customizável

**Desvantagens**:
- ❌ Quebra contexto do agent
- ❌ Requer navegação extra
- ❌ Não é renderização inline

---

### **7. 🎨 STANDARD LIGHTNING TYPES (Fallback)**
**Status**: Funcional (padrão Salesforce)

**Como funciona**:
- Usar tipos padrão: `lightning__objectType`, `lightning__listType`
- Agentforce renderiza com visual padrão

**Tipos disponíveis**:
- `lightning__objectType` → Single record view
- `lightning__listType` → Array/List view
- `lightning__textType` → Text/String
- `lightning__integerType` → Numbers
- `lightning__datetimeType` → Dates

**Vantagens**:
- ✅ Funciona garantido
- ✅ Visual consistente
- ✅ Sem configuração extra

**Desvantagens**:
- ❌ Não customizável
- ❌ Visual genérico
- ❌ Sem LWC customizado

**Exemplo**:
```json
"200": {
  "type": "array",
  "lightning:type": "lightning__listType",
  "items": { "type": "object" }
}
```

---

### **8. 🔄 AGENT RESPONSE POST-PROCESSING (Flow fora do agent)**
**Status**: Funcional, indireto

**Como funciona**:
1. GenAiFunction retorna JSON raw
2. Post-processing Flow estrutura dados
3. Outro sistema renderiza resultado

**Onde fazer**:
- Middleware/API externo
- Flow automático (não em agent)
- LWC chamado por agent command

**Vantagens**:
- ✅ Separação de responsabilidades
- ✅ Reutilizável em múltiplos contextos
- ✅ Lógica complexa possível

**Desvantagens**:
- ❌ Fora do escopo do agent
- ❌ Latência adicional
- ❌ Complexo de debugar

---

## 📊 COMPARAÇÃO RESUMIDA

| Opção | Status | Customização | Interatividade | Facilidade | Recomendação |
|-------|--------|--------------|---------------|-----------|----|
| 1. Lightning Type | ⚠️ Incompleto | 🟢 Alta | 🟢 Alta | 🔴 Média | ⏳ Aguardando suporte |
| 2. Rich Text HTML | ✅ Funciona | 🟡 Média | 🔴 Nenhuma | 🟢 Fácil | ✅ Quick Win |
| 3. GenAiPlanner | ⚠️ Beta | 🟢 Alta | 🟢 Alta | 🟡 Média | ⏳ Se plannerType existir |
| 4. HTML Apex | ✅ Funciona | 🟡 Média | 🔴 Nenhuma | 🟡 Média | ✅ Fallback rápido |
| 5. Follow-up Actions | ✅ Funciona | 🟢 Alta | 🟢 Alta | 🟡 Média | ✅ Escalável |
| 6. External URL | ✅ Funciona | 🟢 Alta | 🟢 Alta | 🟢 Fácil | ✅ Se deixar contexto OK |
| 7. Standard Types | ✅ Funciona | 🔴 Nenhuma | 🟡 Média | 🟢 Fácil | 🟡 Último recurso |
| 8. Post-processing | ✅ Funciona | 🟢 Alta | 🟢 Alta | 🔴 Difícil | 🟡 Muito complexo |

---

## 🚀 RECOMENDAÇÕES POR CENÁRIO

### **Se quer renderização IMEDIATA**
1. **Melhor**: Opção 2 (Rich Text HTML) - implemente em 30min
2. **Alternativa**: Opção 4 (HTML Apex) - implemente em 1h

### **Se quer MÁXIMA CUSTOMIZAÇÃO**
1. **Ideal**: Opção 1 (Lightning Type) - aguarde Salesforce Support
2. **Alternativa**: Opção 5 (Follow-up Actions) - implemente em 2h

### **Se quer ESCALABILIDADE**
1. **Melhor**: Opção 5 (Follow-up Actions)
2. **Alternativa**: Opção 3 (GenAiPlanner) - se tiver acesso

### **Se quer SIMPLICIDADE**
1. **Melhor**: Opção 7 (Standard Types)
2. **Alternativa**: Opção 2 (Rich Text HTML)

---

## 📋 PRÓXIMAS AÇÕES

### Curto Prazo (Hoje):
- [ ] Implementar **Opção 2** (Rich Text HTML) como POC
- [ ] Remover debug verde do LWC
- [ ] Testar visualização em texto formatado

### Médio Prazo (Esta semana):
- [ ] Contactar **Salesforce Support** sobre Lightning Type custom
- [ ] Testar **Opção 5** (Follow-up Actions) como alternativa
- [ ] Documentar limitações atuais

### Longo Prazo (Este mês):
- [ ] Aguardar resposta Salesforce
- [ ] Decidir entre opções com base em feedback
- [ ] Implementar solução final

---

## 📞 CONTATOS PARA SUPORTE

**Salesforce Support** - Pergunta específica:
> "Custom Lightning Types in GenAiFunction - how to reference in output schema for rendering? Is sourceType/lightning:type the correct syntax? Any known limitations in @AuraEnabled beta?"

**Community Resources**:
- Salesforce Developer Community: agentforce tag
- GitHub Issues: salesforce/agentforce
- Trailhead: GenAiFunction module

---

**Documento atualizado**: 2026-01-17
**Status**: Análise completa em andamento
**Próxima atualização**: Após Salesforce Support response
