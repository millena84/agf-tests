# QUICK REFERENCE: Custom Lightning Types em GenAiFunction

## TL;DR (Very Short Version)

**P: Podem Custom Lightning Types aparecer como Output Rendering em GenAiFunction?**

**R: ❌ DESCONHECIDO - Sem documentação oficial**

---

## Checklist Rápido

### O que SIM funciona:
- ✅ GenAiFunction existe
- ✅ Tipos padrão (lightning__objectType, etc)
- ✅ Deploy via SFDX

### O que NÃO funciona/está documentado:
- ❌ Custom Lightning Types
- ❌ Sintaxe para schema.json
- ❌ Documentação oficial

---

## Código Que Provavelmente NÃO Vai Funcionar

```xml
<?xml version="1.0" encoding="UTF-8"?>
<GenAiFunction xmlns="http://soap.sforce.com/2006/04/metadata">
    <definition>{
        "outputs": [
            {
                "name": "custom",
                "type": "lightning__myCustomType__c"  <!-- ❌ Provavelmente não funciona -->
            }
        ]
    }</definition>
    <label>Test</label>
    <apiVersion>65.0</apiVersion>
</GenAiFunction>
```

---

## Código Que Funciona

```xml
<?xml version="1.0" encoding="UTF-8"?>
<GenAiFunction xmlns="http://soap.sforce.com/2006/04/metadata">
    <definition>{
        "outputs": [
            {
                "name": "standard",
                "type": "lightning__objectType"  <!-- ✅ Funciona -->
            }
        ]
    }</definition>
    <label>Test</label>
    <apiVersion>65.0</apiVersion>
</GenAiFunction>
```

---

## Action Items

| Priority | Task | Status |
|----------|------|--------|
| 1 | Contact Salesforce Support | 📋 TODO |
| 2 | Test empirically | 📋 TODO |
| 3 | Explore Coral Cloud | 📋 TODO |
| 4 | Update docs | 📋 TODO |

---

## Key Documents

| File | Purpose |
|------|---------|
| [RESEARCH_GENAI_FUNCTION_LIGHTNING_TYPES.md](RESEARCH_GENAI_FUNCTION_LIGHTNING_TYPES.md) | Detailed research |
| [RESEARCH_FINDINGS_SUMMARY.md](RESEARCH_FINDINGS_SUMMARY.md) | Executive summary |
| [TESTING_GUIDE_CUSTOM_LIGHTNING_TYPES.md](TESTING_GUIDE_CUSTOM_LIGHTNING_TYPES.md) | How to test |
| [RESEARCH_RESULTS_SUMMARY.md](RESEARCH_RESULTS_SUMMARY.md) | Complete findings |

---

## Bottom Line

If you need Custom Lightning Types in GenAiFunction output:

1. **Don't assume it works** - No documentation
2. **Test first** - Use scratch org
3. **Contact support** - Get official confirmation
4. **Document findings** - Share with team

---

## Resources

- Coral Cloud: https://github.com/trailheadapps/coral-cloud
- Agent Scripts: https://github.com/trailheadapps/agent-script-recipes
- Salesforce Dev: https://developer.salesforce.com/

