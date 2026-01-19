# Guia Prático: Como Testar Custom Lightning Types em GenAiFunction

## Objetivo
Validar empiricamente se Custom Lightning Types funcionam como Output Rendering em GenAiFunction

---

## Pré-requisitos

### Licenses Necessárias
- ✅ Agentforce
- ✅ Data Cloud (provisioning completo)
- ✅ Einstein (ativado)
- ✅ Prompt Builder

### Ferramentas
- Salesforce CLI (v2.56.7+)
- VS Code com Salesforce Extension Pack
- Org de teste (scratch org recomendado)

---

## Passo 1: Preparar Org de Teste

```bash
# 1. Criar scratch org
sf org create scratch -f config/project-scratch-def.json -a test-genai

# 2. Abrir org
sf org open -o test-genai

# 3. Ativar features no setup (via UI)
# Setup > Einstein Setup > Turn on Einstein
# Setup > Agentforce Agents > Toggle on Agentforce
```

---

## Passo 2: Criar Lightning Type Customizado (Teórico)

```bash
# Nota: Lightning Types customizados podem não ser suportados via XML
# Criar via UI se possível:
# Setup > Lightning Types > New Lightning Type
```

**Estrutura esperada** (se suportado):
```
Name: MyCustomType
Namespace: lightning__ (ou seu namespace)
Fields:
  - id (String)
  - name (String)
  - value (Number)
```

---

## Passo 3: Criar GenAiFunction

### Estrutura de arquivos
```
force-app/main/default/genaiFunction/
├── myTestFunction.genaifunction-meta.xml
└── myTestFunction.js (opcional, se necessário)
```

### Arquivo: myTestFunction.genaifunction-meta.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<GenAiFunction xmlns="http://soap.sforce.com/2006/04/metadata">
    <definition>{
        "inputs": [
            {
                "name": "input1",
                "type": "string",
                "required": true
            }
        ],
        "outputs": [
            {
                "name": "standardOutput",
                "type": "lightning__objectType",
                "description": "Test com tipo padrão"
            },
            {
                "name": "customOutput",
                "type": "lightning__myCustomType__c",
                "description": "Test com tipo customizado (vai provavelmente falhar)"
            }
        ]
    }</definition>
    <description>Teste de Custom Lightning Types</description>
    <label>Custom Type Test Function</label>
    <apiVersion>65.0</apiVersion>
</GenAiFunction>
```

---

## Passo 4: Deploy e Teste

```bash
# 1. Deploy
sf project deploy start --source-dir force-app/main/default/genaiFunction/

# Possível resultado:
# ✅ SUCCESS - Tipos customizados são suportados
# ❌ ERROR: "Unsupported output type" - Não são suportados
# ❌ ERROR: Invalid metadata - Schema está incorreto
```

### Cenários Esperados

#### Cenário 1: Suporte Completo ✅
```
Deploy Status: Success
→ Confirma que tipos customizados funcionam
→ Procurar tipo no Output Rendering dropdown
```

#### Cenário 2: Sem Suporte ❌
```
Error: Unsupported output type 'lightning__myCustomType__c'
→ Confirma que tipos customizados NÃO funcionam
→ Só tipos padrão são permitidos
```

#### Cenário 3: Schema Inválido ❌
```
Error: Invalid metadata format
→ Indica que sintaxe no schema.json está errada
```

---

## Passo 5: Verificar UI

Se deploy for bem-sucedido:

1. Ir para Setup > Agentforce > GenAi Functions
2. Abrir a função criada
3. Procurar por "Output Rendering" dropdown
4. Verificar se tipo customizado aparece

```
Expected Options:
- lightning__objectType
- lightning__recordType
- lightning__recordId
- lightning__myCustomType__c (se suportado)
```

---

## Passo 6: Validação via Tooling API

```bash
# Consultar GenAiFunction via CLI
sf data query --query "SELECT Id, DeveloperName, Definition FROM GenAiFunction WHERE DeveloperName='myTestFunction'" --target-org test-genai

# Analisar JSON de Definition
# Procurar por tipos nos outputs
```

---

## Passo 7: Documentar Resultados

### Template de Teste

```markdown
# Teste: Custom Lightning Types em GenAiFunction

**Data**: [DATA]
**Org**: [ORG_ID]
**Salesforce Version**: [VERSION]

## Resultado
- [ ] Deploy bem-sucedido
- [ ] Tipo customizado aparece no dropdown
- [ ] Tipo customizado funciona runtime

## Erros Encontrados
[COPIAR STACK TRACE]

## Conclusão
[CONFIRMADO] ou [NÃO CONFIRMADO]
```

---

## Alternativas se Não Funcionar

### 1. Usar Tipos Padrão Apenas
```xml
<definition>{
    "outputs": [
        {
            "name": "result",
            "type": "lightning__objectType"
        }
    ]
}</definition>
```

### 2. Usar Custom Objects
```xml
<definition>{
    "outputs": [
        {
            "name": "result",
            "type": "MyCustomObject__c"
        }
    ]
}</definition>
```

### 3. Usar JSON Genérico
```xml
<definition>{
    "outputs": [
        {
            "name": "result",
            "type": "object"
        }
    ]
}</definition>
```

---

## Troubleshooting

### Erro: "Invalid metadata type GenAiFunction"
- Verificar API version (deve ser 65.0+)
- Verificar se feature está ativada no org

### Erro: "Missing required field 'label'"
- Adicionar `<label>` no meta.xml

### Erro: "Malformed JSON in definition"
- Validar JSON: https://jsonlint.com/
- Verificar aspas e vírgulas

### GenAiFunction não aparece em Setup
- Verificar org é scratch org
- Aguardar propagação (5-10 minutos)
- Hard refresh do navegador

---

## Próximos Passos

1. **Se confirmado**: Documentar sintaxe e compartilhar com comunidade
2. **Se não confirmado**: Abrir case com Salesforce Support
3. **De qualquer forma**: Atualizar documentação internal

---

## Recursos Úteis

- Salesforce CLI Docs: https://developer.salesforce.com/tools/salesforcecli
- GenAiFunction Metadata: (buscar em Metadata Coverage)
- Coral Cloud: https://github.com/trailheadapps/coral-cloud

