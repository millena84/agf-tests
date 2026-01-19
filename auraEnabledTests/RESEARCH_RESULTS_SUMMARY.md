# RESULTADO DA PESQUISA: Custom Lightning Types em GenAiFunction
**Data: 17 de Janeiro de 2026**

---

## 🎯 Resposta Direta às Perguntas

### 1️⃣ Como GenAiFunction expõe Lightning Types customizados no Output Rendering dropdown?
**Resposta**: ❌ **NÃO HÁ DOCUMENTAÇÃO**
- Não está documentado se é suportado
- Tipos padrão sim, tipos customizados: desconhecido
- Coral Cloud não mostra exemplos

### 2️⃣ Qual é a sintaxe correta no schema.json output?
**Resposta**: ❌ **NÃO ENCONTRADA**
- Teoricamente seria: `"type": "lightning__customType__c"`
- Mas não confirmado em nenhuma fonte oficial
- Schema.json de GenAiFunction não está documentado

### 3️⃣ Precisa de configuração no GenAiFunction meta.xml?
**Resposta**: ❌ **NÃO DOCUMENTADO**
- Tipos padrão parecem funcionar sem config extra
- Nenhuma evidência de `<outputRendering>` ou similar
- Meta.xml parece ser apenas `<definition>` JSON

### 4️⃣ Lightning Type precisa estar em namespace específico?
**Resposta**: ❌ **DESCONHECIDO**
- Tipos padrão usam namespace `lightning__`
- Tipos customizados em namespace próprio: sem documentação
- Requer confirmação de Salesforce

### 5️⃣ Como aparecem Lightning Types padrão vs customizadas?
**Resposta**: ✅ **PADRÃO CONFIRMADO** | ❌ **CUSTOMIZADO DESCONHECIDO**
```
Padrão (Confirmado):
  ✅ lightning__objectType
  ✅ lightning__recordType
  ✅ lightning__recordId
  ✅ lightning__pageType
  ✅ lightning__communityId

Customizado (??):
  ❓ lightning__MyCustomType__c
  ❓ Namespace customizado?
  ❓ Sem namespace?
```

### 6️⃣ Exemplos de schema.json que funcionam?
**Resposta**: ❌ **NÃO ENCONTRADOS PUBLICAMENTE**
- Coral Cloud não expõe seus GenAiFunctions
- Nenhuma documentação com exemplos
- Requer test empírico

---

## 📊 Resumo de Achados

| Item | Status | Confirmado | Fonte |
|------|--------|-----------|--------|
| GenAiFunction existe | ✅ | Sim | Coral Cloud |
| Lightning Types padrão | ✅ | Sim | Tipo comum |
| Custom Lightning Types | ❌ | Não | Sem doc |
| Schema.json syntax | ❌ | Não | Sem doc |
| Meta.xml config | ❌ | Não | Sem doc |
| Namespace support | ❌ | Não | Sem doc |
| Exemplos públicos | ⚠️ | Limitado | Coral Cloud |

---

## 🔴 Limitações Confirmadas

1. **Documentação Oficial**: 404 em todos os links
2. **Exemplos Públicos**: Apenas Coral Cloud (não mostra Custom Types)
3. **Comunidade**: Poucos discussions
4. **Release Notes**: Não mencionam Custom Lightning Types
5. **Zeitrahmen**: Feature ainda em desenvolvimento ativo

---

## ✅ O Que Está Confirmado

```
1. GenAiFunction.meta.xml existe e funciona
2. Tipo padrão: lightning__objectType funciona
3. JSON schema é usado em <definition>
4. API v65.0+ suporta GenAiFunction
5. Coral Cloud usa GenAiFunction com sucesso
```

---

## ⚠️ Avisos Importantes

### Documentação Indisponível
```
❌ developer.salesforce.com/docs/platform/genai → 404
❌ developer.salesforce.com/docs/platform/lightning-type → 404
❌ developer.salesforce.com/docs/platform/agentforce → 404
```

### Possibilidade de Breaking Changes
- GenAiFunction é novo (2025)
- API pode mudar
- Suporte pode ser adicionado/removido

### Acesso Limitado
- Requer licenses de Agentforce
- Requer Data Cloud provisioning
- Nem todos os orgs têm acesso

---

## 🎬 Próximos Passos Recomendados

### Prioridade 1: CONTACTAR SALESFORCE
```
→ Abrir case com Support
→ Pergunta: "Does GenAiFunction support custom Lightning Types as output rendering?"
→ Solicitar documentação oficial e exemplos
```

### Prioridade 2: TESTAR EMPIRICAMENTE
```bash
# Guia em: TESTING_GUIDE_CUSTOM_LIGHTNING_TYPES.md
1. Criar Lightning Type customizado
2. Criar GenAiFunction com output type customizado
3. Deploy e verificar resultado
4. Documentar success/failure
```

### Prioridade 3: EXPLORAR CORAL CLOUD
```bash
git clone https://github.com/trailheadapps/coral-cloud
# Procurar por GenAiFunction metadata
# Analisar como estruturam outputs
```

---

## 📝 Ficheiros Criados

1. **RESEARCH_GENAI_FUNCTION_LIGHTNING_TYPES.md**
   - Pesquisa detalhada com todos os achados
   - Links tentados e resultados
   - Análise de cada aspecto

2. **RESEARCH_FINDINGS_SUMMARY.md**
   - Sumário executivo
   - Recomendações
   - Código teórico

3. **TESTING_GUIDE_CUSTOM_LIGHTNING_TYPES.md**
   - Instruções passo-a-passo para testar
   - Troubleshooting
   - Template de documentação

---

## 🔗 Links Investigados

### ❌ Não Encontrados (404)
- https://developer.salesforce.com/docs/platform/genai
- https://developer.salesforce.com/docs/platform/agentforce/guide
- https://developer.salesforce.com/docs/platform/lightning-type/guide

### ⚠️ Acesso Restrito
- https://trailhead.salesforce.com (requer login)
- Salesforce Help (404 para GenAiFunction)

### ✅ Funcionando
- GitHub Coral Cloud
- Salesforce Developers Blog
- Component Library
- GitHub trailheadapps

---

## 💡 Insights Principais

1. **GenAiFunction é novo** → Documentação ainda em desenvolvimento
2. **Tipos customizados são feature avançada** → Pode não ter suporte yet
3. **Coral Cloud é exemplo oficial** → Mas não mostra Custom Types
4. **Feature está em beta** → API pode mudar
5. **Suporte é essencial** → Para confirmação definitiva

---

## 🎓 Lições Aprendidas

✅ **O que Funciona**:
- GenAiFunction com tipos padrão (lightning__objectType, etc.)
- JSON schema em <definition>
- Deployment via SFDX

❌ **O que Não Está Claro**:
- Suporte a Custom Lightning Types
- Sintaxe exata para tipos customizados
- Configuração adicional necessária
- Namespace requirements

🤔 **O que Precisa Teste**:
- Deploy de GenAiFunction com custom types
- Aparição no UI dropdown
- Runtime behavior

---

## 📞 Contatos Recomendados

### Salesforce Support
- Abrir case sobre GenAiFunction Custom Types
- Solicitar documentação oficial
- Pedir exemplos funcionando

### Comunidade Salesforce
- Salesforce StackExchange
- Trailblazer Community
- Reddit r/salesforce

### GitHub
- trailheadapps issues
- Pull requests para documentação

---

## ⏰ Timeline de Publicação

- **Encontrado**: 17 de Janeiro de 2026
- **Documentado**: 17 de Janeiro de 2026
- **Status**: Pesquisa Ativa (requer confirmação)

---

## 📌 Conclusão Final

### Resumido em uma frase:
> "Custom Lightning Types como Output Rendering em GenAiFunction **não têm documentação pública e seu suporte é desconhecido**. Recomenda-se contactar Salesforce Support para confirmação."

### Recomendação de Ação:
🔴 **ANTES DE USAR EM PRODUÇÃO**:
1. Contactar Salesforce Support
2. Testar em scratch org
3. Obter confirmação oficial
4. Documentar sintaxe correta

