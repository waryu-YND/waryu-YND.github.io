import {
  createSignal,
  type Accessor,
  type Setter,
  type Component,
  type ParentComponent,
  type ParentProps,
  createContext,
  type Context,
} from "solid-js";
import {
  rawTemplate,
  type GetLanguages,
  type LanguageDictionary,
  parseTemplate,
} from "./i18n";

export type I18n<T extends LanguageDictionary<string[]>> = {
  t: (
    key?: string
  ) => (literals: TemplateStringsArray, ...placeholders: any[]) => string;
  lang: Accessor<GetLanguages<T>[number]>;
  setLang: Setter<GetLanguages<T>[number]>;
};

export function createI18n<T extends LanguageDictionary<string[]>>(
  data: T,
  language: GetLanguages<T>[number]
): [
  (
    key?: string
  ) => (literals: TemplateStringsArray, ...placeholders: any[]) => string,
  Accessor<GetLanguages<T>[number]>,
  Setter<GetLanguages<T>[number]>
] {
  const [currentLanguage, setCurrentLanguage] = createSignal(language);

  return [
    (key?: string) => {
      return (literals: TemplateStringsArray, ...placeholders: any[]) => {
        let sentence;
        let rawString;
        if (key) {
          sentence = data[key]?.[currentLanguage()];
          rawString = key;
        } else {
          rawString = rawTemplate(literals, placeholders);
          sentence = data[rawString]?.[currentLanguage()];
        }
        if (!sentence)
          console.error(
            `\`${rawString}\` does not exist in the language dictionary`
          );

        sentence = parseTemplate(sentence, placeholders);

        return sentence;
      };
    },
    currentLanguage,
    setCurrentLanguage,
  ];
}

export const I18nContext = createContext<I18n<LanguageDictionary<string[]>>>({
  // t: (literals: TemplateStringsArray, ...placeholders: any[]) => {},
  // lang: () => {},
  // setLang: (...any) => {},
} as I18n<LanguageDictionary<string[]>>);

export function I18nProvider<T extends LanguageDictionary<string[]>>(
  props: ParentProps<{
    data: T;
    language: GetLanguages<T>[number];
  }>
) {
  const [t, lang, setLang] = createI18n(props.data, props.language);

  return (
    <I18nContext.Provider value={{ t: t, lang, setLang }}>
      {props.children}
    </I18nContext.Provider>
  );
}
