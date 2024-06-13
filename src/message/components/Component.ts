import { Err, ErrImpl, Ok, Result } from "ts-results-es";
import type { Components } from "../../interfaces";
import type { ActionRows } from "./Actions";
import { ComponentType } from "discord-api-types/v10";
import type {
  ButtonComponent,
  OptionButtonComponentWithCustomId,
} from "./Button";
import type { StringSelectComponent } from "./StringSelect";

type ComponentError = {
  custom_id: string;
  reason: string;
};

const error = (id: string, reason: string) =>
  Err({
    custom_id: id,
    reason,
  });

export const CreateComponent = (
  ...ActionRow: ActionRows[]
): Result<ActionRows[], ComponentError> => {
  if (ActionRow.length > 5) return error("", "Too many row, maks 5");
  const custom_id_table: Record<string, number> = {};
  for (const row of ActionRow) {
    for (const component of row.components) {
      if (component.type === ComponentType.Button) {
        const button = component as ButtonComponent;
        if ((button as any).custom_id) {
          custom_id_table[
            (button as unknown as OptionButtonComponentWithCustomId).custom_id
          ] =
            (custom_id_table[
              (button as unknown as OptionButtonComponentWithCustomId).custom_id
            ] ?? 0) + 1;
        }
      }

      if (component.type === ComponentType.StringSelect) {
        const select = component as StringSelectComponent;
        if (select.options.length > 25) {
          return error(select.custom_id, "Too many options, maks 25");
        }
        if ((select.min_value || 1) < 0 || (select.min_value || 1) > 25) {
          return error(
            select.custom_id,
            "Invalid min value, valid min value is between 0-25"
          );
        }
        if ((select.max_value || 1) > 25) {
          return error(
            select.custom_id,
            "Invalid max value, valid max value should between 1 and 25"
          );
        }

        custom_id_table[select.custom_id] =
          (custom_id_table[select.custom_id] ?? 0) + 1;
      }
    }
  }
  if (Object.values(custom_id_table).some((x) => x > 1))
    return error("", "Duplicate custom id");
  return Ok(ActionRow);
};
