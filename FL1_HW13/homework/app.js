const data = [
  {
    'folder': true,
    'title': 'Grow',
    'children': [
      {
        'title': 'logo.png'
      },
      {
        'folder': true,
        'title': 'English',
        'children': [
          {
            'title': 'Present_Perfect.txt'
          }
        ]
      }
    ]
  },
  {
    'folder': true,
    'title': 'Soft',
    'children': [
      {
        'folder': true,
        'title': 'NVIDIA',
        'children': null
      },
      {
        'title': 'nvm-setup.exe'
      },
      {
        'title': 'node.exe'
      }
    ]
  },
  {
    'folder': true,
    'title': 'Doc',
    'children': [
      {
        'title': 'project_info.txt'
      }
    ]
  },
  {
    'title': 'credentials.txt'
  }
];

const rootNode = document.getElementById('root');

let expCharacter = /[.]/;

function create(x) {
  return document.createElement(x);
}

function createFile(span, item, currentChild) {
  let p = create('p');
  p.appendChild(span);
  p.appendChild(document.createTextNode(currentChild.title));
  span.innerHTML = 'insert_drive_file';
  span.classList.add('colorfile');
  span.classList.add('material-icons');
  p.classList.add('byebye');
  item.appendChild(p);
}

function createFolder(span, item, currentChild) {
  let p = create('p');
  p.appendChild(span);
  p.appendChild(document.createTextNode(currentChild.title));
  span.innerHTML = 'folder';
  p.classList.add('folder');
  span.classList.add('colorfolder');
  span.classList.add('material-icons');
  p.classList.add('byebye');
  item.appendChild(p);
}

function createNode(currentChild) {
  let item = create('li');
  let span = create('span');
  if (expCharacter.test(currentChild.title)) {
    createFile(span, item, currentChild);
  } else {
    createFolder(span, item, currentChild);
  }
  return item;
}

function addEmptyToList() {
  let empty = create('li');
  let i = create('i');
  i.innerText = 'Folder is empty';
  empty.append(i);
  return empty;
}

function recursion(arrayItem, parentNode) {
  let list = create('ul');
  list.style.display = 'none';
  list.classList.add('tree');
  if (arrayItem.folder && arrayItem.children) {
    for (let j = 0; j < arrayItem.children.length; j++) {
      let currentChild = arrayItem.children[j];
      let item = createNode(currentChild);
      recursion(currentChild, item);
      list.appendChild(item);
    }
  } else if (arrayItem.folder && arrayItem.children === null) {
    let empty = addEmptyToList();
    list.appendChild(empty);
  }
  parentNode.appendChild(list);
  return parentNode;
}

function makeRikaList(array) {
  let ul = create('ul')
  ul.classList.add('main')
  for (let i = 0; i < array.length; i++) {
    const currentItem = array[i];
    let mainItem = createNode(currentItem);
    ul.appendChild(mainItem);
    let childOfChildren = recursion(currentItem, mainItem);
    ul.appendChild(childOfChildren)
    rootNode.append(ul);
  }
}

makeRikaList(data);

function removeFocus() {
  let focusedElements = document.getElementsByClassName('focus');
  if (focusedElements.length > 0) {
    for (let i = 0; i < focusedElements.length; i++) {
      focusedElements[i].classList.remove('focus');
    }
  }
}

function removeContextMenu() {
  let isAlreadyThere = document.getElementsByClassName('context-menu');
  for (let f = 0; f < isAlreadyThere.length; f++) {
    isAlreadyThere[f].remove();
  }
  removeFocus();
}

rootNode.onclick = function () {
  removeContextMenu();
};

const TWO = 2

function getLastOccurrence(text, string) {
  console.log(text, string);
  if (text.indexOf('.') > ONE) {
    let textSplit = text.split('.');
    let newtext = '';
    for (let i = 0; i < textSplit.length - 1; i++) {
      newtext = newtext + textSplit[i];
      if (i !== textSplit.length - TWO) {
        newtext = newtext + '.';
      }
    }
    return newtext.length;
  } else {
    return text.length;
  }
}

function hadleInput(eventTarget, text, span) {
  let newValue = '';
  let input;
  eventTarget.innerHTML = `<input type="text" value="${text}" />`;
  input = document.getElementsByTagName('input')[0];
  input.focus();
  input.setSelectionRange(0, getLastOccurrence(text, expCharacter));
  input.onclick = function (e) {
    newValue = e.target.value;
    eventTarget.appendChild(span);
    eventTarget.appendChild(document.createTextNode(`${newValue}`));
    input.remove();
    renameFromArray(text, newValue, data);
    removeFocus();
  };
}

function renameNode(event) {
  let childNodes = event.target.childNodes;
  let text = '';
  let span;
  for (let i = 0; i < childNodes.length; i++) {
    if (childNodes[i].tagName === 'SPAN') {
      span = childNodes[i];
    }
    if (!childNodes[i].tagName) {
      text = childNodes[i].textContent;
      hadleInput(event.target, text, span);
    }
  }
  removeContextMenu();
}

function renameFromArray(text, toText, array) {
  let indexToRename = array.findIndex((item) => {
    return item.title === text;
  });
  if (indexToRename > ONE) {
    array[indexToRename].title = toText;
  } else {
    for (let i = 0; i < array.length; i++) {
      if (array[i].children) {
        renameFromArray(text, toText, array[i].children);
      }
    }
  }
}

function delNode(event) {
  event.target.remove();
  removeContextMenu();

}

function createHiddenMenu(event) {
  let hiddenMenu = create('div');
  hiddenMenu.classList.add('context-menu');
  hiddenMenu.style.position = 'absolute';
  hiddenMenu.style.left = event.clientX + 'px';
  hiddenMenu.style.top = event.clientY + 'px';
  return hiddenMenu;
}

const ONE = -1;
function rightClickMenu(event) {
  removeContextMenu();
  const targetClasses = event.target.classList;
  for (let i = 0; i < targetClasses.length; i++) {
    if (targetClasses[i].indexOf('byebye') > ONE) {
      event.target.classList.add('focus');
    }
  }
  let actions = create('ul'),
    rename = create('li'),
    del = create('li');
  actions.classList.add('action')
  rename.classList.add('actionLi')
  del.classList.add('actionLi')
  rename.innerHTML = 'Rename';
  del.innerHTML = 'Delete Item';
  let shouldAction = false;
  if (targetClasses.length > 0) {
    for (let i = 0; i < targetClasses.length; i++) {
      if (targetClasses[i].indexOf('byebye') > ONE) {
        shouldAction = true;
      }
    }
  }
  if (shouldAction) {
    rename.onclick = function () {
      renameNode(event);
    };
    del.onclick = function () {
      delNode(event);
    };
  } else {
    actions.classList.add('context-menu-inactive')
    removeContextMenu()
    rename.onclick = function () {
      null
    };
    del.onclick = function () {
      null
    };
  }
  actions.appendChild(del);
  actions.appendChild(rename);
  let hiddenMenu = createHiddenMenu(event);
  hiddenMenu.appendChild(actions);
  rootNode.appendChild(hiddenMenu);
}

rootNode.oncontextmenu = function (event) {
  event.preventDefault();
  rightClickMenu(event);
  return false;
};

function getChildren(n, skipMe) {
  let r = [];
  for (; n; n = n.nextSibling) {
    if (n.nodeType === 1 && n !== skipMe) {
      r.push(n);
    }
  }
  return r;
}

function getSiblings(n) {
  return getChildren(n.parentNode.firstChild, n);
}

function toggleFolder(event) {
  if (event.target.className.indexOf('folder') > ONE) {
    let siblings = getSiblings(event.target),
      children = event.target.childNodes,
      isOpen = event.target.className.indexOf('open') > ONE;
    if (isOpen) {
      event.target.classList.remove('open');
      isOpen = false;
    } else {
      event.target.classList.add('open');
      isOpen = true;
    }
    for (let n = 0; n < siblings.length; n++) {
      const current = siblings[n];
      if (current.className && current.className.indexOf('tree') > ONE) {
        current.style.display = isOpen ? 'block' : 'none';
      }
    }
    for (let n = 0; n < children.length; n++) {
      const current = children[n];
      if (current.tagName === 'SPAN') {
        current.innerHTML = isOpen ? 'folder_open' : 'folder';
      }
    }
  }
}

let folders = document.getElementsByClassName('folder');
for (let f = 0; f < folders.length; f++) {
  folders[f].addEventListener('click', (event) => toggleFolder(event));
}
