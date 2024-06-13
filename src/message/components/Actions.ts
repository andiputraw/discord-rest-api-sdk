import {
  ComponentType,
  type APIActionRowComponent,
  type APIMessageActionRowComponent,
} from "discord-api-types/v10";
import type { BaseComponent, Components } from "../../interfaces";
import type { ButtonComponent } from "./Button";
import type { StringSelectComponent } from "./StringSelect";

type Component = ButtonComponent | StringSelectComponent;

export interface ActionRows extends BaseComponent {
  type: ComponentType.ActionRow;
  components: Component[];
}

export const ActionRow = (...component: Component[]): ActionRows => {
  return { type: ComponentType.ActionRow, components: [...component] };
};
