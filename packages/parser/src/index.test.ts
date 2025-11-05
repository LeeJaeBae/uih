import { describe, it, expect } from "vitest";
import { parse } from "./index.js";

describe("UIH Parser", () => {
  describe("Meta Block", () => {
    it("should parse basic meta block", () => {
      const input = `
meta {
  route: "/test";
  theme: "dark";
}
`;
      const ast = parse(input);
      expect(ast).toMatchSnapshot();
    });
  });

  describe("Style Block", () => {
    it("should parse style tokens", () => {
      const input = `
style {
  color.primary: "#0E5EF7";
  radius.card: "16px";
  spacing.base: "8px";
}
`;
      const ast = parse(input);
      expect(ast).toMatchSnapshot();
    });
  });

  describe("Layout Block", () => {
    it("should parse layout with elements", () => {
      const input = `
layout "centered" {
  Card(id:"demo") { "Hello World" }
  Input(id:"name", placeholder:"Enter name")
  Button(variant:"primary"){ "Submit" }
}
`;
      const ast = parse(input);
      expect(ast).toMatchSnapshot();
    });

    it("should parse layout without label", () => {
      const input = `
layout {
  Text { "Simple text" }
}
`;
      const ast = parse(input);
      expect(ast).toMatchSnapshot();
    });
  });

  describe("Motion Block", () => {
    it.skip("should parse motion rules", () => {
      const input = `
motion {
  on hover(#button) {
    scale: 1.05;
    duration: "200ms";
  }
}
`;
      const ast = parse(input);
      expect(ast).toMatchSnapshot();
    });
  });

  describe("Logic Block", () => {
    it.skip("should parse logic events", () => {
      const input = `
logic {
  on submit {
    navigate: "/success";
  }
  on cancel {
    toast: "Cancelled";
  }
}
`;
      const ast = parse(input);
      expect(ast).toMatchSnapshot();
    });
  });

  describe("I18n Block", () => {
    it("should parse i18n entries", () => {
      const input = `
i18n {
  greeting.en: "Hello";
  greeting.ko: "안녕하세요";
  farewell.en: "Goodbye";
  farewell.ko: "안녕히 가세요";
}
`;
      const ast = parse(input);
      expect(ast).toMatchSnapshot();
    });
  });

  describe("Bind Block", () => {
    it("should parse bind mappings", () => {
      const input = `
bind {
  #name -> user.name;
  #email -> user.email;
}
`;
      const ast = parse(input);
      expect(ast).toMatchSnapshot();
    });
  });

  describe("Complete UIH File", () => {
    it("should parse complete booking example", () => {
      const input = `
meta {
  route: "/booking";
  theme: "light";
}

style {
  color.primary: "#0E5EF7";
  radius.card: "16px";
}

layout "centered" {
  Card(id:"booking-card") { "울릉도 여행 예약" }
  Input(id:"name", placeholder:"이름 입력")
  Input(id:"phone", placeholder:"전화번호")
  Button(variant:"primary"){ "예약하기" }
}

logic {
  on submit {
    navigate: "/complete";
  }
}
`;
      const ast = parse(input);
      expect(ast).toMatchSnapshot();
      expect(ast.blocks).toHaveLength(4);
      expect(ast.blocks[0].type).toBe("Meta");
      expect(ast.blocks[1].type).toBe("Style");
      expect(ast.blocks[2].type).toBe("Layout");
      expect(ast.blocks[3].type).toBe("Logic");
    });
  });
});
