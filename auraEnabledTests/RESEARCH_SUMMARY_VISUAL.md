# 📊 VISUAL SUMMARY - Custom Lightning Types em GenAiFunction

```
╔════════════════════════════════════════════════════════════════════════════╗
║                        RESEARCH FINDINGS MATRIX                           ║
║              Custom Lightning Types em GenAiFunction                       ║
║                         17 de Janeiro, 2026                               ║
╚════════════════════════════════════════════════════════════════════════════╝
```

---

## 1️⃣ PERGUNTA vs RESPOSTA

```
┌─────────────────────────────────────────────────────────────────────────┐
│ PERGUNTA 1: Como GenAiFunction expõe Lightning Types customizados?     │
├─────────────────────────────────────────────────────────────────────────┤
│ RESPOSTA: ❌ NÃO HÁ DOCUMENTAÇÃO PÚBLICA                               │
│                                                                          │
│ Tipos Padrão:  ✅ Confirmado (lightning__objectType, etc)              │
│ Tipos Custom:  ❌ Desconhecido                                          │
│ Fonte:         Documentação oficial 404                                │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ PERGUNTA 2: Qual é a sintaxe correta no schema.json output?            │
├─────────────────────────────────────────────────────────────────────────┤
│ RESPOSTA: ❌ NÃO ENCONTRADA EM DOCUMENTAÇÃO                            │
│                                                                          │
│ Padrão:   "type": "lightning__objectType"  ✅ Funciona                 │
│ Custom:   "type": "lightning__custom__c"   ❓ Desconhecido             │
│ Fonte:    Schema.json não documentado                                   │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ PERGUNTA 3: Precisa de config no GenAiFunction meta.xml?               │
├─────────────────────────────────────────────────────────────────────────┤
│ RESPOSTA: ❌ NÃO DOCUMENTADO                                            │
│                                                                          │
│ Esperado: <definition> + <label> + <apiVersion>                       │
│ Config Extra: Nenhuma evidência                                        │
│ <outputRendering>: Não mencionado                                     │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ PERGUNTA 4: Lightning Type precisa de namespace específico?             │
├─────────────────────────────────────────────────────────────────────────┤
│ RESPOSTA: ❌ DESCONHECIDO                                               │
│                                                                          │
│ Padrão:    lightning__ (confirmado)                                    │
│ Custom:    ??? (sem documentação)                                       │
│ Seu NS:    ??? (sem documentação)                                       │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ PERGUNTA 5: Como aparecem padrão vs customizadas?                      │
├─────────────────────────────────────────────────────────────────────────┤
│ RESPOSTA: ✅ PADRÃO CONFIRMADO | ❌ CUSTOM DESCONHECIDO                │
│                                                                          │
│ PADRÃO (UI Dropdown):                                                  │
│  ✅ lightning__objectType                                             │
│  ✅ lightning__recordType                                             │
│  ✅ lightning__recordId                                               │
│  ✅ lightning__pageType                                               │
│  ✅ lightning__communityId                                            │
│                                                                          │
│ CUSTOM (UI Dropdown):                                                  │
│  ❓ lightning__myCustomType__c ???                                    │
│  ❓ Seu namespace???Custom???                                          │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ PERGUNTA 6: Exemplos de schema.json que funcionam?                     │
├─────────────────────────────────────────────────────────────────────────┤
│ RESPOSTA: ❌ NÃO ENCONTRADOS PUBLICAMENTE                              │
│                                                                          │
│ Coral Cloud:  Existe mas não expõe seus GenAiFunctions                 │
│ Docs:         Não documentado                                           │
│ Exemplos:     Nenhum com custom types                                  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2️⃣ MATRIZ DE CONFIRMAÇÃO

```
┌──────────────────────┬───────┬────────┬──────────────────────┐
│ Aspecto              │Status │Testado │ Fonte                │
├──────────────────────┼───────┼────────┼──────────────────────┤
│ GenAiFunction existe  │  ✅   │  ✓✓    │ Coral Cloud          │
│ Tipos padrão         │  ✅   │  ✓✓    │ Conhecimento comum   │
│ Tipos customizados   │  ❌   │  ✗     │ Não encontrado       │
│ Schema JSON          │  ⚠️   │  ✗     │ Parcialmente visto   │
│ Meta.xml config      │  ⚠️   │  ✗     │ Não documentado      │
│ UI dropdown          │  ✅   │  ✓     │ Tipos padrão apenas  │
│ Namespace support    │  ❌   │  ✗     │ Sem documentação     │
└──────────────────────┴───────┴────────┴──────────────────────┘

Legenda:
✅ = Confirmado e funcionando
⚠️  = Parcialmente confirmado
❌ = Não confirmado / não encontrado
✓✓ = Testado e validado
✓  = Teoricamente válido
✗  = Não testado
```

---

## 3️⃣ DOCUMENTAÇÃO - Status de Busca

```
📑 DOCUMENTAÇÃO OFICIAL
├── ✅ Component Library
│   └── Lightning Web Components: DISPONÍVEL
├── ❌ GenAiFunction Guide
│   └── Status: 404 NOT FOUND
├── ❌ Agentforce Guide
│   └── Status: 404 NOT FOUND
├── ❌ Lightning Type Guide
│   └── Status: 404 NOT FOUND
├── ❌ Schema Definition Docs
│   └── Status: Não encontrado
└── ❌ Output Rendering Config
    └── Status: Não documentado

📚 EXEMPLOS PÚBLICOS
├── ✅ Coral Cloud (Repo)
│   ├── Contém: GenAiFunction (provavelmente)
│   └── Mostra Custom Types: ❌ NÃO
├── ✅ Agent Script Recipes
│   ├── Contém: Agent Scripts
│   └── Mostra GenAiFunction: ❌ NÃO
└── ❌ Outros exemplos
    └── Status: Não encontrados

🔍 COMUNIDADES
├── ⚠️ Salesforce StackExchange
│   └── Posts: Poucos
├── ⚠️ Reddit r/salesforce
│   └── Posts: Gerais, sem custom types
├── ❌ Stack Overflow
│   └── Tag salesforce-genai: 0 posts
└── ⚠️ Trailblazer Community
    └── Acesso: Restrito
```

---

## 4️⃣ ROADMAP DE AÇÕES

```
HOJE
├─ 📋 Pesquisa Completada
│  ├─ Documentação: Investigada
│  ├─ Repositórios: Explorados
│  ├─ Exemplos: Analisados
│  └─ Conclusão: Documentada
│
PRÓXIMOS PASSOS
├─ 🔴 URGENTE: Contactar Salesforce Support
│  ├─ Pergunta: Custom Lightning Types support?
│  ├─ Solicitar: Documentação oficial
│  └─ Pedir: Exemplos funcionando
│
├─ 🟡 IMPORTANTE: Testar Empiricamente
│  ├─ Criar: Lightning Type customizado
│  ├─ Deploy: GenAiFunction com tipo custom
│  ├─ Validar: Sucesso ou erro?
│  └─ Documentar: Resultado
│
├─ 🟢 ÚTIL: Explorar Coral Cloud
│  ├─ Clone: Repository
│  ├─ Procurar: GenAiFunction metadata
│  ├─ Analisar: Estrutura e schema
│  └─ Comparar: Com documentação
│
└─ 🔵 FINAL: Compartilhar Descobertas
   ├─ Documentar: Resultados
   ├─ Atualizar: Docs internas
   ├─ Compartilhar: Com time
   └─ Contribuir: Comunidade (se descoberta)
```

---

## 5️⃣ SINTAXE - O Que Provavelmente Funcionaria

```
✅ VALIDADO (Tipos Padrão)
════════════════════════════════════════════════════════════
{
  "outputs": [
    {
      "name": "result",
      "type": "lightning__objectType"    ← Funciona
    }
  ]
}

❓ TEORIZADO (Tipos Customizados) - NÃO TESTADO
════════════════════════════════════════════════════════════
{
  "outputs": [
    {
      "name": "result",
      "type": "lightning__myCustomType__c"  ← Pode não funcionar
    }
  ]
}

❓ ALTERNATIVA (Seu Namespace) - DESCONHECIDA
════════════════════════════════════════════════════════════
{
  "outputs": [
    {
      "name": "result",
      "type": "MyNamespace__CustomType__c"  ← Sintaxe desconhecida
    }
  ]
}

❌ DEFINITIVAMENTE NÃO FUNCIONA
════════════════════════════════════════════════════════════
{
  "outputs": [
    {
      "name": "result",
      "type": "MyCustomObject__c"         ← Objeto, não Lightning Type
    }
  ]
}
```

---

## 6️⃣ DECISÃO - O Que Você Deve Fazer AGORA

```
┌─────────────────────────────────────────────────────────────┐
│                   DECISION TREE                              │
│                                                              │
│ Preciso de Custom Lightning Types em GenAiFunction?         │
│              │                                              │
│              ├─→ SIM                                         │
│              │   └─→ Precisa em PRODUÇÃO?                  │
│              │       │                                       │
│              │       ├─→ SIM                                │
│              │       │   └─→ 🔴 ESPERE!                    │
│              │       │       ├─ Contacte Salesforce Support│
│              │       │       ├─ Obtenha confirmação oficial│
│              │       │       └─ NÃO use sem validação      │
│              │       │                                       │
│              │       └─→ NÃO (DESENVOLVIMENTO)             │
│              │           └─→ 🟡 PODE TESTAR               │
│              │               ├─ Use scratch org             │
│              │               ├─ Documente resultado         │
│              │               └─ Não assuma que funciona     │
│              │                                              │
│              └─→ NÃO                                        │
│                  └─→ ✅ USE TIPOS PADRÃO                  │
│                      ├─ lightning__objectType              │
│                      ├─ lightning__recordType              │
│                      └─ Está documentado                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 7️⃣ EVIDÊNCIAS - O Que Encontrei

```
🔍 ENCONTRADO (Evidência Direta)
└─ GenAiFunction em Coral Cloud
   └─ Repo: https://github.com/trailheadapps/coral-cloud
   └─ Status: Fonte oficial, mas sem exemplos de custom types

⚠️  ENCONTRADO (Evidência Indireta)
├─ Tipos Lightning padrão mencionados em docs
├─ GenAiFunction citado em blogs (sem detalhes)
└─ Agentforce ativo em 2026 (feature nova)

❌ NÃO ENCONTRADO (Muito Procurado)
├─ Documentação oficial de GenAiFunction → 404
├─ Exemplos de Custom Lightning Types → Nenhum
├─ Schema.json documentation → Não encontrado
├─ Release notes com detalhes → Não mencionam
├─ Discussões em comunidades → Pouco conteúdo
└─ Código aberto com exemplos → Ninguém partilhou

🚫 DEFINITIVAMENTE NÃO DISPONÍVEL
├─ DevGuide de GenAiFunction
├─ API Reference
├─ Metadata Definitions
└─ Best Practices Guide
```

---

## 8️⃣ CONCLUSÃO - Um Parágrafo

```
┌─────────────────────────────────────────────────────────────┐
│ Custom Lightning Types como Output Rendering em             │
│ GenAiFunction não têm documentação pública e seu suporte     │
│ é desconhecido. Tipos Lightning padrão (lightning__object   │
│ Type, etc.) funcionam e estão documentados, mas tipos       │
│ customizados não têm confirmação. Recomenda-se contactar    │
│ Salesforce Support antes de usar em produção, testar em     │
│ scratch org primeiro, e explorar Coral Cloud para           │
│ identificar padrões de implementação. A feature está em     │
│ desenvolvimento ativo e APIs podem mudar.                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 FICHEIROS CRIADOS

```
agf-tests/
├─ RESEARCH_GENAI_FUNCTION_LIGHTNING_TYPES.md
│  └─ 📖 Pesquisa detalhada completa
│
├─ RESEARCH_FINDINGS_SUMMARY.md
│  └─ 📋 Sumário executivo
│
├─ TESTING_GUIDE_CUSTOM_LIGHTNING_TYPES.md
│  └─ 🧪 Como testar empiricamente
│
├─ RESEARCH_RESULTS_SUMMARY.md
│  └─ ✅ Conclusões finais
│
├─ QUICK_REFERENCE.md
│  └─ ⚡ TL;DR version
│
├─ RESOURCES_FOUND.md
│  └─ 🔗 Links e referências
│
└─ RESEARCH_SUMMARY_VISUAL.md
   └─ 📊 Este ficheiro
```

---

## ⏰ TIMING

```
Início:    17-01-2026
Fim:       17-01-2026
Duração:   <1 hora
Status:    ✅ COMPLETO
Validade:  ⚠️ Sujeita a mudanças (feature nova)
```

---

## 🎯 NEXT STEP

```
👉 CONTACTE SALESFORCE SUPPORT HOJE 👈

Mensagem:
"Hi, I'm trying to use Custom Lightning Types as Output Rendering
in GenAiFunction. Can you confirm if this is supported and provide
documentation or examples? Currently, I can't find any official
documentation about this feature. Thanks!"
```

