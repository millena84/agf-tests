# Resumo Executivo: Custom Lightning Types em GenAiFunction

## ❌ CONCLUSÃO PRINCIPAL
**Custom Lightning Types como Output Rendering em GenAiFunction NÃO têm documentação oficial confirmando suporte.**

---

## O Que Encontrei

### Documentação Oficial: ❌ INDISPONÍVEL
- URLs oficiais retornam 404
- GenAiFunction.definition docs não existem publicamente
- Custom Lightning Type schema não está documentado

### Exemplos Funcionales: ✅ EXISTEM
- **Repositório**: trailheadapps/coral-cloud (GitHub)
- Usa Agentforce com Data Cloud e Prompts
- Mas **NÃO mostra exemplos de Custom Lightning Types**

### Suporte a Lightning Types Padrão: ✅ CONFIRMADO
```
- lightning__objectType
- lightning__recordType
- lightning__recordId
- lightning__pageType
- lightning__communityId
```

### Suporte a Custom Lightning Types: ❓ NÃO TESTADO
- Sem documentação
- Sem exemplos
- Sem confirmação de Salesforce

---

## Sintaxe Teorizada (Não Confirmada)

### Se funcionasse, seria assim:

**GenAiFunction.meta.xml**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<GenAiFunction xmlns="http://soap.sforce.com/2006/04/metadata">
    <definition>{
        "outputs": [
            {
                "name": "myCustomOutput",
                "type": "lightning__MyCustomType__c"
            }
        ]
    }</definition>
    <apiVersion>65.0</apiVersion>
</GenAiFunction>
```

**⚠️ Aviso**: Isso é **teoria**, não está testado nem documentado

---

## Limitações Confirmadas

| Aspecto | Status | Observação |
|---------|--------|-----------|
| Docs Oficiais | 404 | Não encontradas |
| Exemplos Públicos | Escassos | Só Coral Cloud |
| Custom Types | Não claro | Sem confirmação |
| Namespace Support | Desconhecido | Não documentado |
| Schema.json | Não documentado | Estrutura desconhecida |
| Meta.xml Config | Provavelmente none | Não mencionado |

---

## Recomendações

### 1️⃣ CONTACTAR SALESFORCE
```
- Abrir case com Support
- Perguntar sobre suporte a Custom Lightning Types
- Solicitar documentação ou exemplos
```

### 2️⃣ EXPLORAR CORAL CLOUD
```bash
git clone https://github.com/trailheadapps/coral-cloud
find . -type f -name "*.meta.xml" | grep -i genai
find . -type f -name "*.json" | xargs grep -i "lightning__"
```

### 3️⃣ TESTAR EMPIRICAMENTE
- Criar GenAiFunction com tipos customizados
- Tentar deploy
- Documentar resultado

### 4️⃣ VERIFICAR RELEASE NOTES
- Winter '26
- Spring '26
- Procurar por "Custom Lightning Type" e "GenAiFunction"

---

## Código de Exemplo (Tentativa)

### Seria assim (teórico):

**Force-app/main/default/genaiFunction/MyCustomFunction.genaifunction-meta.xml**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<GenAiFunction xmlns="http://soap.sforce.com/2006/04/metadata">
    <definition>{
        "inputs": [
            {
                "name": "accountId",
                "type": "Id",
                "required": true
            }
        ],
        "outputs": [
            {
                "name": "result",
                "type": "lightning__customAccount__c"
            }
        ]
    }</definition>
    <description>Função que retorna tipo customizado</description>
    <label>My Custom Function</label>
    <apiVersion>65.0</apiVersion>
</GenAiFunction>
```

**⚠️ Resultado Esperado**: Provavelmente vai dar erro de "unsupported type"

---

## Ficheiros Criados para Referência

- `RESEARCH_GENAI_FUNCTION_LIGHTNING_TYPES.md` - Pesquisa detalhada
- `RESEARCH_FINDINGS_SUMMARY.md` - Este arquivo (sumário)

---

## Status Final

### Consegui Confirmar:
✅ GenAiFunction existe  
✅ Lightning Types padrão funcionam  
✅ Exemplos em coral-cloud existem  

### NÃO Consegui Encontrar:
❌ Documentação de Custom Lightning Types  
❌ Exemplos de tipos customizados  
❌ Sintaxe correta no schema.json  
❌ Necessidade de configuração especial  
❌ Suporte oficial confirmado  

### Recomendação:
🔴 **Contactar Salesforce Support** para confirmação

