import { createDictionary } from "../library/i18n";

export const dict = createDictionary(["en", "ja"] as const, [
  ["Idea", "アイデア"],
  ["is", "は"],
  ["infinity", "無限大"],
]);
