export async function getData() {
  try {
    const data = await fetch("./data.json");
    return await data.json();
  } catch (error) {
    throw error;
  }
}

export function createItem(texts) {
  const lastIndex = texts.length - 1;
  const li = document.createElement("li");
  const div = texts.reduce((el, text, index) => {
    const joiner = index < lastIndex ? "," : ".";
    const textNode = document.createTextNode(text);
    const joinerNode = document.createTextNode(`${joiner} `);
    if (/^red/i.test(text)) {
      const mark = document.createElement("mark");
      mark.appendChild(textNode);
      el.appendChild(mark);
    } else {
      el.appendChild(textNode);
    }
    el.appendChild(joinerNode);
    return el;
  }, document.createElement("div"));
  div.classList.add("text");
  li.classList.add("item");
  li.appendChild(div);
  return li;
}

export function createChildren(data) {
  return data.reduce(reducer, document.createDocumentFragment());

  function reducer(fragment, texts) {
    const item = createItem(texts);
    fragment.appendChild(item);
    return fragment;
  }
}
