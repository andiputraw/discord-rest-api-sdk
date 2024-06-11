/**
 * At least one of the properties is required
 */
export interface SendMessageParams {
  /**
   * Maximum 2000 character
   */
  content: string;
}

export interface SendMessageConfig {
  tts: boolean;
  nonce: boolean;
}
