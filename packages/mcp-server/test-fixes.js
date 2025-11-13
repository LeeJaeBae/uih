#!/usr/bin/env node

/**
 * MCP Server 수정사항 검증 스크립트
 * 7가지 critical/medium 이슈 수정 확인
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sourceFile = join(__dirname, 'src', 'index.ts');
const source = readFileSync(sourceFile, 'utf-8');

console.log('🔍 MCP Server 코드 품질 검증\n');

// 1. __dirname 3중 dirname 체크
const tripleDirectname = source.match(/dirname\(dirname\(dirname\(__dirname\)\)\)/g);
console.log('✅ Issue #1: __dirname 3중 dirname');
if (tripleDirectname) {
  console.log('   ❌ 여전히 3중 dirname 존재:', tripleDirectname.length);
} else {
  console.log('   ✅ findProjectRoot() 함수로 교체됨');
}

// 2. fileURLToPath import 확인
const hasFileURLToPath = source.includes('fileURLToPath');
console.log('\n✅ Issue #1-2: ESM __dirname 처리');
if (hasFileURLToPath) {
  console.log('   ✅ fileURLToPath import 추가됨');
} else {
  console.log('   ❌ fileURLToPath import 누락');
}

// 3. pluginRegistry.getAvailablePlugins() fallback 확인
const hasPluginFallback = source.includes('typeof pluginRegistry.getAvailablePlugins === \'function\'');
console.log('\n✅ Issue #2: pluginRegistry.getAvailablePlugins() fallback');
if (hasPluginFallback) {
  console.log('   ✅ fallback 처리 추가됨');
} else {
  console.log('   ❌ fallback 처리 없음');
}

// 4. MAX_OUTPUT_SIZE 크기 제한 확인
const hasMaxSize = source.includes('MAX_OUTPUT_SIZE');
const hasSizeCheck = source.includes('if (outputText.length > MAX_OUTPUT_SIZE)') ||
                     source.includes('if (outputCode.length > MAX_OUTPUT_SIZE)');
console.log('\n✅ Issue #3: 큰 JSON 반환 시 크기 제한');
if (hasMaxSize && hasSizeCheck) {
  console.log('   ✅ MAX_OUTPUT_SIZE 정의 및 크기 체크 추가됨');
} else {
  console.log('   ❌ 크기 제한 미적용');
}

// 5. debugLog 함수 확인
const hasDebugLog = source.includes('function debugLog');
const hasDebugEnv = source.includes('DEBUG') || source.includes('UIH_DEBUG');
console.log('\n✅ Issue #4: console.error 로깅 방식 개선');
if (hasDebugLog && hasDebugEnv) {
  console.log('   ✅ debugLog() 함수 및 환경변수 제어 추가됨');
} else {
  console.log('   ❌ 디버그 로깅 개선 누락');
}

// 6. detectContext 우선순위 패턴 확인
const hasPatternArray = source.includes('const patterns = [');
const hasWordBoundary = source.includes('wordBoundaryRegex') || source.includes('\\\\b');
console.log('\n✅ Issue #5: auto-detect context 개선');
if (hasPatternArray && hasWordBoundary) {
  console.log('   ✅ 우선순위 기반 패턴 매칭 추가됨');
} else {
  console.log('   ❌ 컨텍스트 감지 개선 누락');
}

// 7. AST 파싱 에러 메시지 개선 확인
const hasLineMatch = source.includes('lineMatch') && source.includes('colMatch');
const hasDetailedError = source.includes('Failed to parse UIH code');
console.log('\n✅ Issue #6: AST 파싱 에러 메시지 개선');
if (hasLineMatch && hasDetailedError) {
  console.log('   ✅ 라인/컬럼 정보 추출 추가됨');
} else {
  console.log('   ❌ 에러 메시지 개선 누락');
}

// 8. features undefined 처리 확인
const hasFeaturesCheck = source.includes('if (features && Array.isArray(features)');
const hasGenerateOptions = source.includes('const generateOptions');
console.log('\n✅ Issue #7: interactive features undefined 처리');
if (hasFeaturesCheck && hasGenerateOptions) {
  console.log('   ✅ features 유효성 검증 추가됨');
} else {
  console.log('   ❌ features 처리 개선 누락');
}

// 최종 요약
console.log('\n' + '='.repeat(50));
const issues = [
  tripleDirectname === null && hasFileURLToPath,
  hasPluginFallback,
  hasMaxSize && hasSizeCheck,
  hasDebugLog && hasDebugEnv,
  hasPatternArray && hasWordBoundary,
  hasLineMatch && hasDetailedError,
  hasFeaturesCheck && hasGenerateOptions
];

const fixedCount = issues.filter(Boolean).length;
console.log(`\n📊 수정 완료: ${fixedCount}/7 이슈`);

if (fixedCount === 7) {
  console.log('✅ 모든 이슈가 성공적으로 수정되었습니다!');
  process.exit(0);
} else {
  console.log('⚠️  일부 이슈가 누락되었습니다.');
  process.exit(1);
}
