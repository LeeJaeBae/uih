export type TargetFramework = "react" | "vue" | "svelte";

export async function compileUIH(source: string, target: TargetFramework): Promise<string> {
  try {
    const response = await fetch("/api/compile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ source, target }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Compilation failed");
    }

    const { code } = await response.json();
    return code;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Compilation failed: ${error.message}`);
    }
    throw new Error("Compilation failed: Unknown error");
  }
}
