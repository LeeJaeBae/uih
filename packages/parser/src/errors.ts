/**
 * Base error class for UIH compilation errors
 */
export class UIHCompileError extends Error {
  constructor(
    message: string,
    public code: string,
    public line?: number,
    public column?: number,
    public context?: string
  ) {
    super(message);
    this.name = "UIHCompileError";

    // Maintain proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UIHCompileError);
    }
  }

  /**
   * Format error message with location information
   */
  public format(): string {
    let msg = `${this.name} [${this.code}]: ${this.message}`;

    if (this.line !== undefined && this.column !== undefined) {
      msg += `\n  at line ${this.line}, column ${this.column}`;
    }

    if (this.context) {
      msg += `\n  Context: ${this.context}`;
    }

    return msg;
  }
}

/**
 * Syntax error in UIH source code
 */
export class UIHSyntaxError extends UIHCompileError {
  constructor(
    message: string,
    line?: number,
    column?: number,
    context?: string
  ) {
    super(message, "SYNTAX_ERROR", line, column, context);
    this.name = "UIHSyntaxError";
  }
}

/**
 * Missing required block error
 */
export class UIHMissingBlockError extends UIHCompileError {
  constructor(
    blockType: string,
    context?: string
  ) {
    super(
      `Required block '${blockType}' is missing`,
      "MISSING_BLOCK",
      undefined,
      undefined,
      context
    );
    this.name = "UIHMissingBlockError";
  }
}

/**
 * Invalid component error
 */
export class UIHInvalidComponentError extends UIHCompileError {
  constructor(
    componentName: string,
    line?: number,
    column?: number,
    context?: string
  ) {
    super(
      `Unknown component '${componentName}'`,
      "INVALID_COMPONENT",
      line,
      column,
      context
    );
    this.name = "UIHInvalidComponentError";
  }
}

/**
 * Invalid prop error
 */
export class UIHInvalidPropError extends UIHCompileError {
  constructor(
    propName: string,
    componentName: string,
    line?: number,
    column?: number,
    context?: string
  ) {
    super(
      `Invalid prop '${propName}' for component '${componentName}'`,
      "INVALID_PROP",
      line,
      column,
      context
    );
    this.name = "UIHInvalidPropError";
  }
}
