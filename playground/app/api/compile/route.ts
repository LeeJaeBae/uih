import { NextRequest, NextResponse } from "next/server";
import { parse } from "uih-parser";
import { pluginRegistry } from "uih-codegen-react";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { source, target } = body;

    if (!source || !target) {
      return NextResponse.json(
        { error: "Missing required fields: source, target" },
        { status: 400 }
      );
    }

    if (!["react", "vue", "svelte"].includes(target)) {
      return NextResponse.json(
        { error: "Invalid target. Must be: react, vue, or svelte" },
        { status: 400 }
      );
    }

    // UIH 코드 파싱
    const ast = parse(source);

    // 타겟 프레임워크에 맞는 플러그인 가져오기
    const plugin = pluginRegistry.get(target);
    if (!plugin) {
      return NextResponse.json(
        { error: `Plugin not found for target: ${target}` },
        { status: 500 }
      );
    }

    // 코드 생성
    const code = await plugin.generate(ast);

    return NextResponse.json({ code });
  } catch (error) {
    console.error("Compilation error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Compilation failed",
      },
      { status: 500 }
    );
  }
}
