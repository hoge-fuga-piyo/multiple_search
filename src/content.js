console.log("content script start");

const ignoreTags = {
  'SCRIPT': true,
  'NOSCRIPT': true
};

function searchBox() {
  let dom = document.createElement('div');
  dom.innerHTML = '<input type="text" class="multipleSearchBox" name=searchBox>';
  return dom;
}

function updateSearchWord(e) {
  console.log(e.target.value);
  //const body = document.getElementsByTagName('body')[0];
  //const body = document.querySelector('body');
  //const nodes = document.getElementsByTagName('body')[0].childNodes;
  const nodes = document.querySelector('body').childNodes;
  console.log(nodes);
  highlight(e.target.value, nodes);
}

function highlight(word, nodes) {
  //console.log(nodes);

  const nodes_arr = Array.from(nodes);
  for (const node of nodes_arr) {
    if (ignoreTags[node.nodeName.toUpperCase()]) {
      continue;
    }
    let children = node.childNodes;

    if (node.hasChildNodes()) {
      highlight(word, children);
    } else {
      if (hasTargetWord(word, node)) {
        addColor(word, node);
      }
    }
  }
}

function hasTargetWord(word, node) {
  if (node.nodeType !== Node.TEXT_NODE) {
    return false;
  }

  if (node.wholeText.indexOf(word) > -1) {
    return true;
  }

  return false;
}

function addColor(word, node) {
  const offset = node.wholeText.indexOf(word);
  if (offset < 0) {
    return;
  }

  console.log(node);
  console.log("search: "+word);
  console.log("text: "+node.wholeText);
  console.log("offset: "+offset);

  const after_node = node.splitText(offset);
  after_node.nodeValue = after_node.wholeText.substring(offset + word.length);
  console.log("after");
  console.log(after_node);
  console.log(node);

  const insertObj = document.createElement('span');
  insertObj.appendChild(document.createTextNode(word));

  const parent = node.parentNode;
  parent.insertBefore(insertObj, after_node);

  addColor(word, after_node);
}

function insertSearchBox() {
  let body = document.getElementsByTagName('body');
  body[0].insertBefore(searchBox(), body[0].firstChild);

  body[0].addEventListener('input', updateSearchWord);
}


insertSearchBox();
