export { ButtonStyle } from "discord-api-types/v10";
import type { BaseComponent } from "../../interfaces";

import { ButtonStyle, ComponentType } from "discord-api-types/v10";

/**
 * Optional properties for ButtonComponent
 */
export interface OptionalButtonComponent {
  label?: string;
  disabled?: boolean;
}
/**
 * Optional properties for ButtonComponent with custom id
 */
export interface OptionButtonComponentWithCustomId
  extends OptionalButtonComponent {
  custom_id: string;
  url?: never;
}
/**
 * Optional properties for ButtonComponent with url
 */
export interface OptionButtonComponentWithUrl extends OptionalButtonComponent {
  url: string;
}
/**
 * Optional properties for ButtonComponent
 */
export type ButtonComponentOption =
  | OptionButtonComponentWithCustomId
  | OptionButtonComponentWithUrl;

/**
 * Button component
 */
export interface ButtonComponent
  extends BaseComponent,
    OptionalButtonComponent {
  type: ComponentType.Button;
  style: ButtonStyle;
}

export const Button = (
  label: string,
  style: ButtonStyle,
  option?: ButtonComponentOption
): ButtonComponent => {
  return { type: ComponentType.Button, style, label, ...option };
};
