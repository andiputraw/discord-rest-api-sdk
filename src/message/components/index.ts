/**
 * this module contains functions for building message components
 *
 * ```ts
 * import { ActionRow, Button, StringSelect, SelectOption } from "./components";
 *
 * ActionRow(
 *   StringSelect(
 *     "selection",
 *     {},
 *     SelectOption("Mage", "1"),
 *     SelectOption("Warrior", "2")
 *   ),
 *   Button("Button", 1, { url: "foo" }),
 *   Button("Button", 1)
 * );
 * ```
 *
 * @module
 */

export * from "./Actions";
export * from "./Button";
export * from "./StringSelect";
export * from "./Component";
