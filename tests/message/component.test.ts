import {
  ActionRow,
  Button,
  StringSelectComponent,
  SelectOption,
} from "../../src/message/components";
import { expect, describe, test } from "bun:test";

describe("test component", () => {
  const components = ActionRow(
    StringSelect(
      "selection",
      {},
      SelectOption("Mage", "1", {
        default: true,
        description: "Mage is the best!",
      }),
      SelectOption("Warrior", "2", { description: "Warrior is the best!" })
    ),
    Button("Button", 1, { url: "foo" }),
    Button("Button", 1)
  );
  console.log(JSON.stringify(components, null, 2));
});
