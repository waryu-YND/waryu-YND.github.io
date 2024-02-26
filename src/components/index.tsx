import type { Component } from "solid-js";
import { I18nProvider } from "../library/i18n-solid";
import { dict } from "./dictionary";
import Hero from "./hero";

const Main: Component = () => {
  return (
    <>
      <Hero />
    </>
  );
};

const App: Component = () => {
  const searchParams = new URLSearchParams(window.location.search);
  let lang: "ja" | "en" = "ja";
  if (searchParams.has("$RpQUqko7G")) {
    lang = "ja";
  } else if (searchParams.has("$RpIUqko7G")) {
    lang = "en";
  }
  return (
    <I18nProvider data={dict} language={lang}>
      <Main />
    </I18nProvider>
  );
};
export default App;
