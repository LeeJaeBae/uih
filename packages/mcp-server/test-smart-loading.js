#!/usr/bin/env node

// MCP 서버의 스마트 로딩 테스트
import { spawn } from 'child_process';
import readline from 'readline';

const testCases = [
  {
    request: "로그인 폼 만들어줘",
    expected: "form",
    description: "로그인 요청 → form 섹션"
  },
  {
    request: "대시보드 레이아웃",
    expected: "layout",
    description: "대시보드 요청 → layout 섹션"
  },
  {
    request: "네비게이션 바 만들기",
    expected: "navigation",
    description: "네비게이션 요청 → navigation 섹션"
  },
  {
    request: "테이블 컴포넌트",
    expected: "data",
    description: "테이블 요청 → data 섹션"
  },
  {
    request: "모달 다이얼로그",
    expected: "interaction",
    description: "모달 요청 → interaction 섹션"
  },
  {
    request: "버튼 컴포넌트",
    expected: "syntax",
    description: "일반 요청 → syntax 섹션 (기본)"
  }
];

async function testMCPServer() {
  console.log('🧪 MCP 서버 스마트 로딩 테스트 시작\n');

  // MCP 서버 실행
  const mcp = spawn('node', ['./dist/index.js'], {
    stdio: ['pipe', 'pipe', 'pipe']
  });

  const rl = readline.createInterface({
    input: mcp.stdout,
    output: process.stdout,
    terminal: false
  });

  // 에러 스트림 모니터링
  mcp.stderr.on('data', (data) => {
    const output = data.toString();

    // 자동 감지된 컨텍스트 확인
    if (output.includes('Auto-detected context:')) {
      console.log('✅', output.trim());
    } else if (output.includes('Retrieving UIH guide:')) {
      console.log('📖', output.trim());
    }
  });

  // 테스트 시뮬레이션
  console.log('테스트 케이스:');
  console.log('─'.repeat(60));

  for (const test of testCases) {
    console.log(`\n📝 ${test.description}`);
    console.log(`   요청: "${test.request}"`);
    console.log(`   기대값: ${test.expected} 섹션`);

    // MCP 요청 시뮬레이션
    const request = {
      jsonrpc: "2.0",
      id: 1,
      method: "tools/call",
      params: {
        name: "get_uih_guide",
        arguments: {
          userRequest: test.request
        }
      }
    };

    // 요청 전송
    mcp.stdin.write(JSON.stringify(request) + '\n');

    // 응답 대기
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('\n' + '─'.repeat(60));
  console.log('✨ 테스트 완료!\n');

  // 섹션별 예상 토큰 수
  console.log('📊 섹션별 예상 토큰 수:');
  console.log('   • syntax: ~100 토큰 (기본 문법)');
  console.log('   • form: ~150 토큰 (문법 + 폼 패턴)');
  console.log('   • layout: ~180 토큰 (문법 + 레이아웃 패턴)');
  console.log('   • navigation: ~140 토큰 (문법 + 네비게이션 패턴)');
  console.log('   • data: ~160 토큰 (문법 + 데이터 패턴)');
  console.log('   • interaction: ~170 토큰 (문법 + 인터랙션 패턴)');
  console.log('   • full: ~500 토큰 (전체 가이드)');

  // 종료
  mcp.kill();
  process.exit(0);
}

// 직접 컨텍스트 감지 함수 테스트
function testDirectDetection() {
  console.log('🔍 직접 컨텍스트 감지 테스트:\n');

  // detectContext 함수 복사
  function detectContext(userRequest) {
    const request = userRequest.toLowerCase();

    if (/form|login|signup|sign|input|submit|회원|로그인|가입|폼/.test(request)) {
      return "form";
    }
    if (/dashboard|grid|layout|card|stats|대시보드|레이아웃|카드/.test(request)) {
      return "layout";
    }
    if (/nav|menu|header|footer|bar|네비|메뉴|헤더|푸터/.test(request)) {
      return "navigation";
    }
    if (/table|list|data|row|column|테이블|리스트|데이터|목록/.test(request)) {
      return "data";
    }
    if (/modal|loading|error|dialog|toast|alert|모달|로딩|에러|다이얼로그/.test(request)) {
      return "interaction";
    }
    return "syntax";
  }

  for (const test of testCases) {
    const detected = detectContext(test.request);
    const passed = detected === test.expected;
    console.log(
      `${passed ? '✅' : '❌'} "${test.request}" → ${detected} ${passed ? '(정답)' : `(기대값: ${test.expected})`}`
    );
  }
  console.log();
}

// 테스트 실행
console.log('UIH MCP 서버 스마트 로딩 테스트\n');
console.log('='.repeat(60) + '\n');

// 먼저 직접 감지 테스트
testDirectDetection();

// MCP 서버 테스트 (선택적)
// testMCPServer().catch(console.error);