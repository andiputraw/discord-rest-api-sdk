import type {
  APIMessageComponentEmoji,
  APIPartialEmoji,
} from "discord-api-types/v10";
import type { BaseComponent } from "../../interfaces";

import { ComponentType } from "discord-api-types/v10";
interface OptionalSelectOption {
  description?: string;
  emoji?: APIMessageComponentEmoji;
  default?: boolean;
}
export interface SelectOptionT extends OptionalSelectOption {
  label: string;
  value: string;
}

export interface OptionalStringSelect {
  min_value?: number;
  max_value?: number;
  disabled?: boolean;
  placeholder?: string;
}

export interface StringSelectComponent
  extends BaseComponent,
    OptionalStringSelect {
  type: ComponentType.StringSelect;
  custom_id: string;
  options: SelectOptionT[];
}

export const SelectOption = (
  label: string,
  value: string,
  option?: OptionalSelectOption
): SelectOptionT => ({ label, value, ...option });

export const StringSelect = (
  id: string,
  option: OptionalStringSelect,
  ...selection: SelectOptionT[]
): StringSelectComponent => {
  return {
    type: ComponentType.StringSelect,
    custom_id: id,
    options: [...selection],
    ...option,
  };
};
