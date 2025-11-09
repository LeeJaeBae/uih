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
    it("should parse motion rules", () => {
      const input = `
motion {
  on hover(#button) {
    scale: "1.05";
    duration: "200ms";
  }
}
`;
      const ast = parse(input);
      expect(ast).toMatchSnapshot();
    });
  });

  describe("Logic Block", () => {
    it("should parse logic events", () => {
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

  describe("State Block", () => {
    it("should parse state declarations", () => {
      const input = `
state {
  count: 0;
  isOpen: false;
  username: "";
}
`;
      const ast = parse(input);
      expect(ast).toMatchSnapshot();
      const stateBlock = ast.blocks.find((b) => b.type === "State");
      expect(stateBlock).toBeDefined();
      expect(stateBlock?.type).toBe("State");
    });

    it("should parse state with different types", () => {
      const input = `
state {
  count: 0;
  message: "Hello";
  isActive: true;
}
`;
      const ast = parse(input);
      expect(ast).toMatchSnapshot();
    });
  });

  describe("Data Block", () => {
    it("should parse data fetching block", () => {
      const input = `
data {
  users: GET "/api/users";
  profile: GET "/api/profile/{id}";
}
`;
      const ast = parse(input);
      expect(ast).toMatchSnapshot();
      const dataBlock = ast.blocks.find((b) => b.type === "Data");
      expect(dataBlock).toBeDefined();
      expect(dataBlock?.type).toBe("Data");
    });

    it("should parse different HTTP methods", () => {
      const input = `
data {
  users: GET "/api/users";
  createUser: POST "/api/users";
  updateUser: PUT "/api/users/{id}";
  deleteUser: DELETE "/api/users/{id}";
}
`;
      const ast = parse(input);
      expect(ast).toMatchSnapshot();
    });
  });

  describe("Import Statements", () => {
    it("should parse single import", () => {
      const input = `
import Button from "./components/Button.uih"

layout {
  Button(variant:"primary") { "Click me" }
}
`;
      const ast = parse(input);
      expect(ast).toMatchSnapshot();
      expect(ast.imports).toBeDefined();
      expect(ast.imports?.length).toBe(1);
      expect(ast.imports?.[0].names).toContain("Button");
      expect(ast.imports?.[0].from).toBe("./components/Button.uih");
    });

    it("should parse multiple imports from same file", () => {
      const input = `
import Button, Input, Card from "./components"

layout {
  Card { "Content" }
}
`;
      const ast = parse(input);
      expect(ast).toMatchSnapshot();
      expect(ast.imports).toBeDefined();
      expect(ast.imports?.length).toBe(1);
      expect(ast.imports?.[0].names).toEqual(["Button", "Input", "Card"]);
    });

    it("should parse multiple import statements", () => {
      const input = `
import Button from "./Button.uih"
import Card from "./Card.uih"

layout {
  Card { "Content" }
}
`;
      const ast = parse(input);
      expect(ast).toMatchSnapshot();
      expect(ast.imports?.length).toBe(2);
    });
  });

  describe("Variable References", () => {
    it("should parse variable references in props", () => {
      const input = `
state {
  count: 0;
}

layout {
  Text { "Count: {count}" }
  Button(id:"{userId}") { "Click" }
}
`;
      const ast = parse(input);
      expect(ast).toMatchSnapshot();
    });

    it("should parse multiple variables in single prop", () => {
      const input = `
layout {
  Text { "Hello {firstName} {lastName}" }
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

    it("should parse complete example with state and data", () => {
      const input = `
import Counter from "./components/Counter.uih"

meta {
  route: "/users";
}

state {
  selectedId: 0;
}

data {
  users: GET "/api/users";
}

layout {
  Text { "User count: {users.length}" }
  Counter
}
`;
      const ast = parse(input);
      expect(ast).toMatchSnapshot();
      expect(ast.imports).toBeDefined();
      expect(ast.blocks.some((b) => b.type === "State")).toBe(true);
      expect(ast.blocks.some((b) => b.type === "Data")).toBe(true);
    });
  });
});
