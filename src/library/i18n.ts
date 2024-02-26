export type LanguageDictionary<T extends readonly string[]> = {
  [key: string]: { [K in T[number]]: string };
};

const a = {
  Hello: {
    ja: "こんにちは",
    en: "Hello",
  },
} as LanguageDictionary<["ja", "en"]>;

const b = createI18n(a, "ja");

export type GetLanguages<T> = T extends LanguageDictionary<infer U> ? U : never;

export function createI18n<T extends LanguageDictionary<string[]>>(
  data: T,
  language: GetLanguages<T>[number]
): (literals: TemplateStringsArray, ...placeholders: any[]) => string {
  return (literals: TemplateStringsArray, ...placeholders: any[]) => {
    // let rawString = "";
    // literals.forEach((value, index) => {
    //   rawString += value;
    //   if (placeholders[index]) {
    //     rawString += "{{}}";
    //   }
    // });
    const rawString = rawTemplate(literals, placeholders);
    let sentence = data[rawString]?.[language];
    if (!sentence)
      console.error(
        `\`${rawString}\` does not exist in the language dictionary`
      );

    // placeholders.forEach((value, index) => {
    //   sentence = sentence.replaceAll(`{{${index}}}`, value);
    // });
    sentence = parseTemplate(sentence, placeholders);

    return sentence;
  };
}

export function rawTemplate(
  literals: TemplateStringsArray,
  placeholders: any[]
): string {
  let rawString = "";
  literals.forEach((value, index) => {
    rawString += value;
    if (placeholders[index]) {
      rawString += "{{}}";
    }
  });
  return rawString;
}

export function parseTemplate(sentence: string, placeholders: any[]): string {
  placeholders.forEach((value, index) => {
    sentence = sentence.replaceAll(`{{${index}}}`, value);
  });
  return sentence;
}

const c = createDictionary(["en", "ja", "cn"] as const, [
  ["Hello", "こんにちは", "你好"],
]);

const test: ArrayAsLongAs<["a", "b", "c"], string> = ["ww", "www", ""];

export type ArrayAsLongAs<N extends readonly any[], T> = {
  readonly 0: any;
  length: N["length"];
} & ReadonlyArray<T>;

export function createDictionary<T extends readonly string[]>(
  language: T,
  data: ArrayAsLongAs<T, string>[]
): LanguageDictionary<T> {
  const dict = {} as LanguageDictionary<T>;

  const removePlaceholderRe = /{{.*?}}/gm;
  const getPlaceholdersNameRe = /{{(.*?)}}/gm;

  for (const i of data) {
    const entry = {} as { [K in T[number]]: string };

    const newTranslation: string[] = [];
    const names = [...i[0].matchAll(getPlaceholdersNameRe)].map(
      (value) => value[1]
    );
    i.forEach((item, index) => {
      let result = item;
      names.forEach((key, value) => {
        result = result.replaceAll(`{{${key}}}`, `{{${value}}}`);
      });
      newTranslation[index] = result;
    });
    language.forEach((item, index) => {
      entry[item as T[number]] = newTranslation[index];
    });
    dict[i[0].replaceAll(removePlaceholderRe, "{{}}")] = entry;
  }

  return dict;
}
