# Pesquisa: Custom Lightning Types como Output Rendering em GenAiFunction

## Status da Pesquisa
**Data**: Janeiro 17, 2026  
**Conclusão**: A documentação oficial de GenAiFunction e Custom Lightning Types é **limitada e recente** no Salesforce. A feature está em evolução ativa.

---

## Achados Principais

### 1. Repositórios Referência
Os exemplos mais atualizados de GenAiFunction estão em:
- **coral-cloud** (trailheadapps/coral-cloud): Aplicação oficial que showcasa Agentforce, Data Cloud e Prompts
- **agent-script-recipes**: Collection de exemplos de Agent Scripts
- Ambos estão em GitHub: https://github.com/trailheadapps/

### 2. Status da Documentação Oficial

| Recurso | Status | URL | Observação |
|---------|--------|-----|-----------|
| GenAiFunction Docs | 404 | developer.salesforce.com/docs/platform/genai | Não disponível |
| Agentforce Guide | 404 | developer.salesforce.com/docs/platform/agentforce | Não disponível |
| Lightning Type Guide | 404 | developer.salesforce.com/docs/platform/lightning-type | Não disponível |
| Schema Definition | Não encontrado | N/A | Documentação interna |
| Coral Cloud Repo | ✅ Disponível | github.com/trailheadapps/coral-cloud | Exemplo funcional |

**Conclusão**: A documentação pública é **escassa**. O Salesforce ainda está documentando essas features.

---

## Informações sobre Lightning Types Customizados

### Tipos de Lightning Padrão (Conhecidos)
```
lightning__objectType
lightning__recordType
lightning__recordId
lightning__pageType
lightning__communityId
```

### Limitações Identificadas

1. **Custom Lightning Types**: Parecem **não ser suportados** como tipos definidos pelo usuário
2. **Output Rendering**: Limitado aos tipos padrão do Salesforce
3. **Namespace**: Tipos padrão não usam namespaces customizados
4. **Schema Definition**: O suporte para tipos customizados **não está documentado**

---

## O que Funcionaria (Baseado em Padrões Salesforce)

### Estrutura Esperada de GenAiFunction

```xml
<?xml version="1.0" encoding="UTF-8"?>
<GenAiFunction xmlns="http://soap.sforce.com/2006/04/metadata">
    <definition>
        {
            "inputs": [
                {
                    "name": "input1",
                    "type": "string"
                }
            ],
            "outputs": [
                {
                    "name": "output1",
                    "type": "lightning__objectType"
                }
            ]
        }
    </definition>
    <description>Exemplo GenAiFunction</description>
    <label>Meu GenAiFunction</label>
    <apiVersion>65.0</apiVersion>
</GenAiFunction>
```

### Para Lightning Types Customizados (Não Confirmado)

Teoricamente seria:
```json
{
    "outputs": [
        {
            "name": "customOutput",
            "type": "MyNamespace__CustomLightningType__c"
        }
    ]
}
```

**Status**: ⚠️ **NÃO TESTADO E PROVAVELMENTE NÃO SUPORTADO**

---

## Problemas de Integração Identificados

### 1. **Falta de Tipos Customizáveis**
- GenAiFunction parecem limitados aos tipos padrão do Salesforce
- Não há mecanismo claro para definir tipos customizados

### 2. **Schema.json e Output Types**
- A sintaxe correta para referencia output types não está documentada
- Não está claro se tipos customizados são interpolados em schema.json

### 3. **Configuração no Meta.xml**
- Não há evidência de configuração adicional necessária no GenAiFunction.meta.xml
- Tipos padrão parecem ser suportados out-of-the-box

### 4. **Namespace e Custom Types**
- Tipos customizados no seu próprio namespace **não estão documentados**
- Possibilidade: tipos customizados podem precisar estar no namespace `lightning__`

---

## Recursos Encontrados

### Documentação (Limitada)
- Salesforce Developers Blog: Artigos recentes sobre Agentforce (mas não específico para Custom Lightning Types)
- Trailhead: Módulos sobre Agentforce (não público ainda ou em beta)

### Código de Exemplo (Disponível)
- **coral-cloud**: Estrutura de projeto real com Agentforce
- **agent-script-recipes**: Exemplos de Agent Scripts

### Comunidade
- Reddit r/salesforce: Discussões ativas sobre Agentforce
- Salesforce StackExchange: Pouco conteúdo sobre GenAiFunction
- GitHub Discussions: Nenhum tópico específico

---

## Recomendações para Investigação Adicional

### 1. **Contactar Salesforce Diretamente**
- Suporte Salesforce: Para confirmação de suporte a Custom Lightning Types
- Força-tarefa de Agentforce

### 2. **Explorar Coral Cloud**
```bash
# Clone o repositório
git clone https://github.com/trailheadapps/coral-cloud
cd coral-cloud

# Procure por GenAiFunction
find . -name "*.meta.xml" | xargs grep -l "GenAiFunction"
find . -name "*.json" | xargs grep -l "GenAiFunction"
```

### 3. **Procurar em Metadata Org**
- Use Salesforce CLI para listar GenAiFunctions existentes:
```bash
sf force mdapi deploy --version 65.0
```

### 4. **Testar Empiricamente**
- Criar um GenAiFunction customizado
- Tentar diferentes tipos em outputs
- Documentar o que funciona

---

## Limitações Conhecidas

### 1. **Documentação Escassa**
- URLs de documentação retornam 404
- Conteúdo em Trailhead pode estar em beta/restrito

### 2. **Feature Ainda em Evolução**
- GenAiFunction é parte de Agentforce, que é novo
- APIs e schemas podem mudar

### 3. **Acesso Limitado**
- Requer licenses específicas: Data Cloud, Agents, Prompt Builder
- Nem todos os orgs têm acesso

### 4. **Comunidade Pequena**
- Poucos exemplos públicos
- Discussões limitadas em fóruns

---

## Conclusão

### Achado Principal
**Custom Lightning Types como Output Rendering em GenAiFunction não tem documentação pública confirmando suporte.**

### Status Atual
1. ✅ **Confirmado**: GenAiFunction existe e está sendo usado (Coral Cloud)
2. ✅ **Confirmado**: Lightning Types padrão (lightning__objectType, etc.) existem
3. ❌ **Não Confirmado**: Custom Lightning Types no output rendering
4. ❌ **Não Documentado**: Sintaxe exata para schema.json com tipos customizados

### Próximos Passos
1. **Verificar diretamente com Salesforce Support**
2. **Examinar metadata do coral-cloud**
3. **Testar empiricamente** em ambiente de desenvolvimento

---

## Links Relevantes

- **Coral Cloud Sample**: https://github.com/trailheadapps/coral-cloud
- **Agent Script Recipes**: https://github.com/trailheadapps/agent-script-recipes
- **Salesforce Developers**: https://developer.salesforce.com/
- **Trailhead**: https://trailhead.salesforce.com/

---

## Notas Adicionais

- A feature está em desenvolvimento ativo
- Documentação pode estar disponível apenas via Trailhead (acesso restrito)
- Sugestão: Verificar release notes de Winter 26 e Spring 26 para atualizações

