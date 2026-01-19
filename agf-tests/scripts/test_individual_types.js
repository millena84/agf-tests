#!/usr/bin/env node
/**
 * Test individual metadata types in package_6_agf.xml to find which one(s) cause UNKNOWN_EXCEPTION
 * 
 * Funcionalidades:
 * 1. Testa cada tipo isoladamente
 * 2. Comenta linhas que falham no XML original
 * 3. Salva saída completa em arquivo: validacao_retrieve_{manifest_name}_{timestamp}.txt
 * 
 * Usage:
 *   node scripts/test_individual_types.js --manifest manifest/package_6_agf.xml --org agf-tests --output manifest/test_results.json
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function parseArgs() {
  const args = process.argv.slice(2);
  const out = { 
    manifest: 'manifest/package.xml', 
    org: 'agf-tests', 
    output: 'manifest/test_results.json',
    sfCmd: 'sf'
  };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--manifest' && args[i+1]) { out.manifest = args[++i]; }
    else if (a === '--org' && args[i+1]) { out.org = args[++i]; }
    else if (a === '--output' && args[i+1]) { out.output = args[++i]; }
    else if (a === '--sf-cmd' && args[i+1]) { out.sfCmd = args[++i]; }
  }
  return out;
}

function extractTypes(xmlPath) {
  const content = fs.readFileSync(xmlPath, 'utf8');
  const typeMatches = content.match(/<name>([^<]+)<\/name>/g) || [];
  const version = content.match(/<version>([^<]+)<\/version>/)?.[1] || '65.0';
  
  const types = typeMatches
    .map(m => m.replace(/<\/?name>/g, ''))
    .filter((t, idx, arr) => arr.indexOf(t) === idx); // dedupe
  
  return { types, version };
}

function createTestManifest(typeName, version) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<Package xmlns="http://soap.sforce.com/2006/04/metadata">
  <types><members>*</members><name>${typeName}</name></types>
  <version>${version}</version>
</Package>
`;
}

function testType(sfCmd, typeName, version, org, tmpDir) {
  const manifest = createTestManifest(typeName, version);
  const tmpPath = path.join(tmpDir, `test_${typeName}.xml`);
  fs.writeFileSync(tmpPath, manifest, 'utf8');
  
  try {
    const result = execSync(
      `"${sfCmd}" project retrieve start --manifest "${tmpPath}" --target-org "${org}" --json`,
      { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }
    );
    const parsed = JSON.parse(result);
    
    const success = parsed?.result?.success === true;
    const error = parsed?.result?.errorMessage || parsed?.result?.status || 'OK';
    
    return {
      typeName,
      success,
      error: success ? null : error,
      fullResponse: parsed
    };
  } catch (e) {
    return {
      typeName,
      success: false,
      error: e.message,
      fullResponse: null
    };
  }
}

// Função para comentar a linha do XML que falhou
function commentTypeInXml(xmlPath, typeName) {
  let content = fs.readFileSync(xmlPath, 'utf8');
  
  // Procura a linha exata: <types><members>*</members><name>TypeName</name></types>
  const lineRegex = new RegExp(`(\\s*)<types><members>\\*<\\/members><name>${typeName}<\\/name><\\/types>`, 'g');
  const replacement = `$1<!-- [ERRO ao retrieve] <types><members>*</members><name>${typeName}</name></types> -->`;
  
  const newContent = content.replace(lineRegex, replacement);
  
  if (newContent !== content) {
    fs.writeFileSync(xmlPath, newContent, 'utf8');
    return true;
  }
  return false;
}

// Função para gerar timestamp em formato amigável
function getTimestamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const mins = String(now.getMinutes()).padStart(2, '0');
  const secs = String(now.getSeconds()).padStart(2, '0');
  return `${year}${month}${day}_${hours}${mins}${secs}`;
}

// Classe para capturar output
class OutputCapture {
  constructor(logFile) {
    this.logFile = logFile;
    this.buffer = [];
    this.originalLog = console.log;
    this.originalWarn = console.warn;
    this.originalError = console.error;
    this.start();
  }

  start() {
    console.log = (...args) => {
      const msg = args.map(a => typeof a === 'string' ? a : JSON.stringify(a)).join(' ');
      this.buffer.push(msg);
      this.originalLog(...args);
    };
    console.warn = (...args) => {
      const msg = args.map(a => typeof a === 'string' ? a : JSON.stringify(a)).join(' ');
      this.buffer.push(`[WARN] ${msg}`);
      this.originalWarn(...args);
    };
    console.error = (...args) => {
      const msg = args.map(a => typeof a === 'string' ? a : JSON.stringify(a)).join(' ');
      this.buffer.push(`[ERROR] ${msg}`);
      this.originalError(...args);
    };
  }

  save() {
    const content = this.buffer.join('\n');
    fs.writeFileSync(this.logFile, content, 'utf8');
  }

  restore() {
    console.log = this.originalLog;
    console.warn = this.originalWarn;
    console.error = this.originalError;
  }
}

(async function main() {
  const args = parseArgs();
  
  if (!fs.existsSync(args.manifest)) {
    console.error(`Manifest not found: ${args.manifest}`);
    process.exit(1);
  }
  
  // Gerar nome do arquivo de log: validacao_retrieve_{manifest_name}_{timestamp}.txt
  const manifestFileName = path.basename(args.manifest, path.extname(args.manifest));
  const timestamp = getTimestamp();
  const logsDir = path.join(path.dirname(args.manifest), 'logs');
  fs.mkdirSync(logsDir, { recursive: true });
  const logFile = path.join(logsDir, `validacao_retrieve_${manifestFileName}_${timestamp}.txt`);
  
  // Iniciar captura de output
  const capture = new OutputCapture(logFile);
  
  const { types, version } = extractTypes(args.manifest);
  const tmpDir = path.dirname(args.output);
  fs.mkdirSync(tmpDir, { recursive: true });
  
  console.log(`╔════════════════════════════════════════════════════════╗`);
  console.log(`║ TESTE DE RETRIEVE - TIPOS DE METADADOS INDIVIDUAIS     ║`);
  console.log(`╚════════════════════════════════════════════════════════╝`);
  console.log(`Manifest: ${args.manifest}`);
  console.log(`Organização: ${args.org}`);
  console.log(`Versão da API: ${version}`);
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log(`Arquivo de log: ${logFile}`);
  console.log('');
  console.log(`Encontrados ${types.length} tipos. Testando individualmente...`);
  console.log('');
  
  const results = [];
  for (const type of types) {
    process.stdout.write(`Testing ${type}... `);
    const result = testType(args.sfCmd, type, version, args.org, tmpDir);
    results.push(result);
    
    if (result.success) {
      console.log('✓ OK');
    } else {
      console.log(`✗ FALHOU`);
      // Comentar a linha no XML original
      console.log(`  → Comentando linha no XML: ${args.manifest}`);
      const commented = commentTypeInXml(args.manifest, type);
      if (commented) {
        console.log(`  → Linha comentada com sucesso!`);
      } else {
        console.log(`  ⚠ Não foi possível comentar a linha (padrão não encontrado)`);
      }
      console.log(`  → Erro: ${result.error.substring(0, 80)}`);
    }
  }
  
  console.log('');
  console.log('═'.repeat(80));
  console.log('RESUMO FINAL');
  console.log('═'.repeat(80));
  
  const passing = results.filter(r => r.success);
  const failing = results.filter(r => !r.success);
  
  if (passing.length > 0) {
    console.log(`\n✓ TIPOS COM SUCESSO (${passing.length}):`);
    passing.forEach(r => console.log(`  - ${r.typeName}`));
  }
  
  if (failing.length > 0) {
    console.log(`\n✗ TIPOS COM ERRO (${failing.length}):`);
    failing.forEach(r => {
      console.log(`  - ${r.typeName}`);
      console.log(`    Erro: ${r.error.substring(0, 100)}`);
    });
  }
  
  console.log('');
  console.log(`✓ Manifest atualizado: ${args.manifest}`);
  console.log(`✓ Resultados JSON: ${args.output}`);
  console.log(`✓ Log completo: ${logFile}`);
  
  // Save results JSON
  fs.writeFileSync(args.output, JSON.stringify({ 
    timestamp: new Date().toISOString(),
    manifest: args.manifest,
    org: args.org,
    total: types.length,
    passed: passing.length,
    failed: failing.length,
    results,
    passingTypes: passing.map(r => r.typeName),
    failingTypes: failing.map(r => r.typeName)
  }, null, 2), 'utf8');
  
  // Restaurar console e salvar log
  capture.restore();
  capture.save();
  console.log(`\n📝 Saída completa salva em: ${logFile}`);
  
  process.exit(failing.length > 0 ? 1 : 0);
})();
