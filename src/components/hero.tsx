import {
  onMount,
  type Component,
  createSignal,
  useContext,
  createEffect,
} from "solid-js";
import * as monaco from "monaco-editor";
import Styles from "./hero.module.css";
import { I18nContext } from "../library/i18n-solid";

const CODE =
  'function accessRandomly(array){const index=Math.floor(Math.random()*array.length);return array[index]} const join=(first,last,separator)=>{return first+separator+last};let pangram="The quick brown fox jumps over the lazy dog";pangram=pangram.replaceAll(/\\s/g,"");const decode=(array,indexes)=>{let result="";for(const i of indexes){result+=array[i]} return result};const firstName=decode(pangram,[11,29,9,31,4]);let lastName=decode(pangram,[31,12,32]);const domain=join(decode(pangram,[34,18,29,5,28]),decode(pangram,[6,10,18]),".");const[a,b,c,d]=[2,3,5,7];let numbers=(a**5*b**5*c**5*d**2+a**12*b**4*c**3+a*b**3*c**3*d**3+a**8*b**2*c*d).toString();numbers=numbers.split("");return{accessRandomly,github:join(firstName,lastName,"-"),x:join(firstName,lastName,"_"),zenn:firstName,mail:`${decode(numbers, [9,3,1,4])}.${firstName}.${decode(numbers, [9,8,1,0])}@${domain}`}';

const COPY_FIRST = [
  "Idea",
  "Future",
  "Truth",
  "World",
  "Sky",
  "Sun",
  "Cat",
  "Ball",
  "Mistake",
  "Pen",
  "Story",
  "Impossible",
  "Life",
  "Love",
  "Chance",
  "Mochi",
  "Good",
  "Nature",
];

const COPY_SECOND = [
  "infinity",
  "variable",
  "only one",
  "large",
  "blue",
  "warm",
  "cute",
  "friend",
  "to success",
  "mightier than swords",
  "starting",
  "mine",
  "nothing",
  "not waiting",
  "immortal",
  "coming",
  "quickly",
  "Mochi shop",
  "fickle",
];

const Account: Component<{ src: string; name: string; link: string }> = (
  props
) => {
  return (
    <a href={props.link} style={{ "text-decoration": "none" }}>
      <div class={Styles.account}>
        <img src={props.src} alt={props.src} />
        <span>{props.name}</span>
      </div>
    </a>
  );
};

const Hero: Component = () => {
  let editor: HTMLDivElement | undefined;
  let over: HTMLDivElement | undefined;
  let circle: SVGCircleElement | undefined;
  let firstTitleRef: HTMLSpanElement | undefined;
  let secondTitleRef: HTMLSpanElement | undefined;
  const [code, setCode] = createSignal(CODE, { equals: false });
  const [firstTitle, setFirstTitle] = createSignal("Idea");
  const [secondTitle, setSecondTitle] = createSignal("infinity");
  const [github, setGithub] = createSignal("waryu-ynd");
  const [twitter, setTwitter] = createSignal("waryu_ynd");
  const [zenn, setZenn] = createSignal("waryu");
  const [mail, setMail] = createSignal("0425.waryu.0921@gmail.com");
  let isMousedown = false;

  onMount(() => {
    let size;
    if (matchMedia("(max-width: 480px)").matches) {
      size = 27;
    } else {
      size = 40;
    }

    const instance = monaco.editor.create(editor!, {
      value: code(),
      language: "javascript",
      fontSize: size,
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
      changeTitle();
    });
  });

  createEffect(() => {
    const result = new Function(code())() as any;
    if (result.hasOwnProperty("github")) {
      setGithub(result.github);
    }
    if (result.hasOwnProperty("x")) {
      setTwitter(result.x);
    }
    if (result.hasOwnProperty("zenn")) {
      setZenn(result.zenn);
    }
    if (result.hasOwnProperty("mail")) {
      setMail(result.mail);
    }
  });

  const changeTitle = () => {
    const result = new Function(code())() as any;
    if (result.hasOwnProperty("accessRandomly")) {
      const first = result.accessRandomly(COPY_FIRST);
      const second = result.accessRandomly(COPY_SECOND);

      setFirstTitle(first);
      setSecondTitle(second);
      resizeTitle(firstTitleRef!);
      resizeTitle(secondTitleRef!);
    }
  };

  const download = (name: string, body: string) => {
    const blob = new Blob([body], { type: "text/plain" });
    const tag = document.createElement("a");
    tag.href = URL.createObjectURL(blob);
    tag.target = "_blank";
    tag.download = name;
    tag.click();
    URL.revokeObjectURL(tag.href);
  };

  const incrementGauge = () => {
    if (!circle) return;
    if (isMousedown) {
      const now = parseFloat(circle.style.strokeDashoffset);

      if (now - 1 < 0) {
        console.log("DO");
        return;
      }

      circle.style.strokeDashoffset = (now - 1).toString();
      setTimeout(incrementGauge, 10);
    }
  };

  const resetGauge = () => {
    if (!circle) return;
    circle.style.strokeDashoffset = "125.66";
  };

  const hasBreakLine = (element: HTMLElement) => {
    let range = new Range();
    range.selectNode(element);
    console.log(range.getClientRects());
    return range.getClientRects().length > 2;
  };

  const resizeTitle = (title: HTMLSpanElement) => {
    if (matchMedia("(max-width: 480px)").matches) {
      title.style.fontSize = "4rem";
    } else {
      title.style.fontSize = "6rem";
    }
    let isResized = false;
    while (hasBreakLine(title)) {
      isResized = true;
      const now = parseFloat(getComputedStyle(title).fontSize);
      console.log(now);
      title.style.fontSize = now - 1 + "px";
    }
    const now = parseFloat(getComputedStyle(title).fontSize);
    console.log(now);
    if (matchMedia("(max-width: 480px)").matches) {
      title.style.fontSize = now - 7 + "px";
    } else {
      title.style.fontSize = now - 14 + "px";
    }
  };

  const { t, lang, setLang } = useContext(I18nContext);

  return (
    <div class={Styles.hero}>
      <div ref={editor} class={Styles.editor}></div>
      <div class={Styles.filter}></div>
      <div class={Styles.over} ref={over}>
        <svg class={Styles.svg}>
          <circle
            r="20"
            cx="24"
            cy="24"
            fill="transparent"
            stroke="white"
            stroke-width="4"
            stroke-dasharray="125.66"
            style={{ "stroke-dashoffset": "125.66" }}
            ref={circle}
          />
        </svg>
      </div>
      <div
        class={Styles.content}
        // onMouseDown={(e) => {
        //   if (!over) return;

        //   over.style.top = e.pageY.toString() + "px";
        //   over.style.left = e.pageX.toString() + "px";

        //   isMousedown = true;
        //   incrementGauge();
        // }}
        // onMouseUp={() => {
        //   isMousedown = false;
        //   resetGauge();
        // }}
      >
        <h1 class={Styles.title}>
          <span
            class={`${Styles.word} ${Styles.dashed}`}
            ref={firstTitleRef}
          >{t(firstTitle())``}</span>
          <span class={Styles.medium}>{t()`is`}</span>
          <br></br>
          <span
            class={`${Styles.word} ${Styles.dashed}`}
            ref={secondTitleRef}
          >{t(secondTitle())``}</span>
          <img
            src="saikoro.svg"
            alt="Dice"
            class={Styles.dice}
            onClick={() => {
              changeTitle();
            }}
            ontouchstart={() => {}}
          />
        </h1>
        <div class={Styles.action}>
          <div class={Styles.links}>
            <Account
              src="github-logo.svg"
              name={"@" + github()}
              link="https://github.com/waryu-YND"
            />
            <Account
              src="zenn-logo.svg"
              name={"@" + zenn()}
              link="https://zenn.dev/waryu"
            />
            <Account
              src="x-logo.svg"
              name={"@" + twitter()}
              link="https://twitter.com/waryu_ynd"
            />
            <Account src="reader.png" name="etc" link="" />
          </div>
          <div class={Styles.mail}>
            <img src="mail.png" alt="mail" />
            <span>{mail()}</span>
          </div>
          <div class={Styles.buttons}>
            <button>{t()`Get started`}</button>
            <button>{t()`Learn about me`}</button>
            <button
              onClick={() => {
                download(
                  "ABOUTME.txt",
                  `\
${t(firstTitle())``} ${t()`is`} ${t(secondTitle())``}

GitHub: ${"@" + github()}
Zenn: ${"@" + zenn()}
X: ${"@" + twitter()}
Mail: ${mail()}

${t()`Nice to meet you!`}
`
                );
              }}
            >{t()`Install`}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
