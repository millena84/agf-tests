# Recursos Encontrados na Pesquisa

## Fontes Consultadas

### ❌ Documentação Oficial (Indisponível)
1. https://developer.salesforce.com/docs/platform/genai/ → **404**
2. https://developer.salesforce.com/docs/atlas.en-us.genai.meta/genai/ → **404**
3. https://developer.salesforce.com/docs/platform/agentforce/guide/ → **404**
4. https://developer.salesforce.com/docs/platform/agentforce/guide/create-gen-ai-functions.html → **404**
5. https://developer.salesforce.com/docs/platform/lightning-type/guide/ → **404**
6. https://help.salesforce.com/s/search/All/GenAiFunction → **404**
7. https://trailhead.salesforce.com/content/learn/modules/extend-your-gen-ai-actions → **Failed to extract**
8. https://developer.salesforce.com/docs/component-library/documentation/lwc/ → **Found but no GenAiFunction info**

### ⚠️ Fóruns e Comunidades
1. **Salesforce StackExchange**: Poucos posts sobre GenAiFunction
2. **Reddit r/salesforce**: Discussões gerais, sem Custom Lightning Types
3. **Stack Overflow**: 0 resultados para salesforce-genai tag
4. **Salesforce Trailblazer Community**: Acesso restrito

### ✅ Repositórios GitHub (Encontrados)
1. **trailheadapps/coral-cloud** 
   - Status: ✅ Disponível
   - URL: https://github.com/trailheadapps/coral-cloud
   - Relevância: Exemplo oficial de Agentforce
   - Conteúdo: Usa Agentforce, Data Cloud, Prompts
   - ⚠️ Nota: Não mostra Custom Lightning Types

2. **trailheadapps/agent-script-recipes**
   - Status: ✅ Disponível
   - URL: https://github.com/trailheadapps/agent-script-recipes
   - Relevância: Exemplos de Agent Scripts
   - Conteúdo: Agent Script recipes
   - ⚠️ Nota: Não menciona GenAiFunction

3. **trailheadapps (organização)**
   - Status: ✅ Disponível
   - URL: https://github.com/trailheadapps
   - Repositórios: 27+ samples
   - Relevância: Exemplos oficiais de Salesforce

### 🔗 GitHub Topics
1. **salesforce-genai-function** → Sem repositórios públicos
2. **salesforce-genai** → Sem repositórios públicos
3. **agentforce** → Alguns repositórios

### 📰 Blogs e Artigos
1. **Salesforce Developers Blog** (developer.salesforce.com/blogs/)
   - Artigos: Agentforce, LWC, OmniStudio
   - ⚠️ Nenhum sobre Custom Lightning Types
   - ⚠️ Nenhum sobre GenAiFunction schema

2. **Salesforce Blog** (salesforce.com/blog/)
   - Artigos: AI, Agentforce strategy
   - ⚠️ Alto nível, não técnico

---

## Sintaxe Encontrada

### Lightning Types Padrão (Confirmados)
```
lightning__objectType
lightning__recordType
lightning__recordId
lightning__pageType
lightning__communityId
```

### Estrutura de GenAiFunction (Teórico)
```xml
<?xml version="1.0" encoding="UTF-8"?>
<GenAiFunction xmlns="http://soap.sforce.com/2006/04/metadata">
    <definition>{ "inputs": [...], "outputs": [...] }</definition>
    <label>...</label>
    <apiVersion>65.0</apiVersion>
</GenAiFunction>
```

---

## Informações Técnicas Encontradas

### API Versions
- Coral Cloud: API v65.0

### Org Requirements (de Coral Cloud)
- Data Cloud (licença + provisioning)
- Agentforce (licença + ativação)
- Prompt Builder
- Einstein (ativado)

### Salesforce CLI Version
- Mínimo: v2.56.7
- Recomendado: Última versão

---

## Exemplos de Código

### Projeto Structure (Coral Cloud)
```
coral-cloud/
├── cc-base-app/main/default/
├── cc-employee-app/main/default/
├── cc-service-app/main/default/
├── cc-site/main/default/
├── apex-scripts/
├── data/
└── config/
```

### Deploy Commands (Coral Cloud)
```bash
sf org login web -s -a coral-cloud
sf project deploy start -d cc-base-app
sf data tree import -p ./data/data-plan.json
sf package install -p 04tHr000000ku4k -w 10
```

---

## Possíveis Tipos Customizados (Teorizado)

### Nomenclatura Esperada
```
lightning__MyCustomType__c
lightning__namespace__CustomType__c
MyNamespace__CustomLightningType__c
```

### Status: NÃO CONFIRMADO ⚠️

---

## Arquivos Metadata Investigados

| Tipo | Arquivo | Status |
|------|---------|--------|
| GenAiFunction | `.genaifunction-meta.xml` | Teorizado |
| Lightning Type | `.lightningtype-meta.xml` | Não encontrado |
| Definition | `schema.json` | Não documentado |

---

## Release Notes Investigados

- **Winter '26**: Não menciona Custom Lightning Types
- **Spring '26**: Ainda não disponíveis (data futura)
- **Summer '25**: Anterior ao desenvolvimento

**Conclusão**: Nenhuma menção em release notes públicas

---

## Documentação Relacionada Encontrada

### ✅ Disponível
- Lightning Web Components: https://developer.salesforce.com/docs/component-library/
- Apex Documentation: https://developer.salesforce.com/docs/apis
- SFDX CLI Docs: https://developer.salesforce.com/tools/salesforcecli

### ❌ Indisponível
- GenAiFunction Metadata: **Não encontrado**
- Custom Lightning Type Schema: **Não encontrado**
- Output Rendering Configuration: **Não encontrado**

---

## Comunidade e Expertise

### Possíveis Contatos
1. **Philippe Ozil** (Salesforce): https://github.com/pozil
   - Trabalhou em coral-cloud
   - Possível conhecimento de GenAiFunction

2. **Salesforce Support**: support.salesforce.com
   - Fonte oficial para confirmação

3. **Trailblazer Community**: trailhead.salesforce.com/trailblazer-community
   - Comunidade de developers

---

## Ferramentas e Recursos Úteis

### JSONLint (para validar schema)
- https://jsonlint.com/

### VS Code Extensions
- Salesforce Extension Pack
- Prettier (Apex)
- ESLint

### Salesforce CLI
- Instalação: npm install --global @salesforce/cli
- Docs: https://developer.salesforce.com/tools/salesforcecli

---

## Status da Pesquisa por Tópico

| Tópico | Documentação | Exemplos | Comunidade | Status |
|--------|--------------|----------|-----------|--------|
| GenAiFunction | ❌ | ✅ (Coral) | ⚠️ | Parcial |
| Lightning Types Std | ✅ | ✅ | ✅ | Completo |
| Lightning Types Custom | ❌ | ❌ | ❌ | **Não encontrado** |
| Schema.json | ❌ | ❌ | ❌ | **Não encontrado** |
| Meta.xml Config | ⚠️ | ⚠️ | ❌ | Incompleto |
| Output Rendering | ❌ | ❌ | ❌ | **Não encontrado** |

---

## Próximas Fontes a Investigar

1. **Salesforce IdeaExchange**: Procurar por feature requests
2. **Salesforce Success Community**: Acesso com credenciais
3. **YouTube Salesforce Channel**: Possíveis tutorials
4. **Salesforce Developer Slack**: Se tem canal
5. **Einstein Setup Documentation**: Informações sobre GenAi

---

## Data de Coleta

- **Data da Pesquisa**: 17 de Janeiro de 2026
- **Última Atualização**: 17 de Janeiro de 2026
- **Valididade**: ⚠️ Sujeita a mudanças rápidas em features novas

---

## Notas Importantes

1. ⚠️ **GenAiFunction é feature nova** (2025)
2. ⚠️ **Documentação ainda em desenvolvimento**
3. ⚠️ **APIs podem mudar sem aviso**
4. ⚠️ **Requer licenses e provisioning complexo**
5. ⚠️ **Acesso limitado a Trailhead/Documentation**

---

## Recomendação Final

**Para informação definitiva, contactar:**
```
Salesforce Support
→ Ask: "GenAiFunction custom Lightning Type support?"
→ Request: Official docs and working examples
```

