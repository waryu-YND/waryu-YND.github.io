import { onMount, type Component, createSignal, useContext } from "solid-js";
import * as monaco from "monaco-editor";
import Styles from "./hero.module.css";
import { I18nContext } from "../library/i18n-solid";

const CODE =
  'function accessRandomly(array){const index=Math.floor(Math.random()*array.length);return array[index]} const join=(first,last,separator)=>{return first+separator+last};let pangram="The quick brown fox jumps over the lazy dog";pangram=pangram.replaceAll(/s/g,"");const decode=(array,indexes)=>{let result="";for(const i of indexes){result+=array[i]} return result};const firstName=decode(pangram,[11,29,9,31,4]);let lastName=decode(pangram,[31,12,32]);const domain=join(decode(pangram,[34,18,29,5,28]),decode(pangram,[6,10,18]),".");const[a,b,c,d]=[2,3,5,7];let numbers=(a**5*b**5*c**5*d**2+a**12*b**4*c**3+a*b**3*c**3*d**3+a**8*b**2*c*d).toString();numbers=numbers.split("");return{accessRandomly,github:join(firstName,lastName,"-"),x:join(firstName,lastName,"_"),zenn:firstName,mail:`${decode(numbers, [9,3,1,4])}.${firstName}.${decode(numbers, [9,8,1,0])}@${domain}`}';

const Hero: Component = () => {
  let editor: HTMLDivElement | undefined;
  const [code, setCode] = createSignal(CODE);
  onMount(() => {
    const instance = monaco.editor.create(editor!, {
      value: code(),
      language: "javascript",
      fontSize: 40,
      wordWrap: "on",
      lineNumbers: "off",
      scrollBeyondLastLine: false,
      theme: "vs-dark",
      wordWrapBreakAfterCharacters: "",
      wordWrapBreakBeforeCharacters: "",
      minimap: {
        enabled: false,
      },
      overviewRulerLanes: 0,
    });

    instance.getModel()?.onDidChangeContent((e) => {
      setCode(instance.getValue());
    });
  });

  const { t, lang, setLang } = useContext(I18nContext);

  return (
    <div class={Styles.hero}>
      <div ref={editor} class={Styles.editor}></div>
      <div class={Styles.filter}></div>
      <div class={Styles.content}>
        <h1 class={Styles.title}>
          <span class={`${Styles.word} ${Styles.dashed}`}>{t()`Idea`}</span>
          <span class={Styles.medium}>{t()`is`}</span>
          <br></br>
          <span class={`${Styles.word} ${Styles.dashed}`}>{t()`infinity`}</span>
        </h1>
      </div>
    </div>
  );
};

export default Hero;
