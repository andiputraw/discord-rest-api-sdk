import type { ComponentType } from "discord-api-types/v10";
import type { ActionRows } from "../message/components";

export interface BaseComponent {
  type: ComponentType;
}

export interface Components {
  components?: ActionRows[];
}
