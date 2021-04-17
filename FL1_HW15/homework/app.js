/*global books*/
//testing console
console.log(books)

//i had no more time =((( SRRRRRRRYYYYYYYY

//make easier Rika's HW ;D
function get(x) {
    return document.getElementById(x)
}
function create(x) {
    return document.createElement(x)
}

const root = get('root');

//atombomb
function holyhandgrenade() {
    root.innerHTML = ''
    //page left side

    let leftSide = create('div');
    leftSide.className = 'staticPage';
    leftSide.id = 'leftSide'
    root.appendChild(leftSide);

    //page right side

    let rightSide = create('div');
    rightSide.className = 'dynamicPage';
    let appStuff = create('div');
    appStuff.id = 'appStuff'
    appStuff.className = 'stuff';
    rightSide.appendChild(appStuff);
    root.appendChild(rightSide);
    createBookList()
    addBookButton()
    console.log(window.history)
}

//url stuff thingy
window.onload = function () {
    holyhandgrenade()
    let urlS = new URL(window.location)
    let strippedURL = urlS.href.split('index.html')[0]
    strippedURL = strippedURL + 'index.html'
    console.log(urlS.search, urlS.hash)
    if (urlS.hash === '#preview') {
        let id = urlS.search.split('=')[1]
        if (books[id]) {
            showPreview(id)
        } else {
            urlS.href = strippedURL
            urlS.hash = ''
            urlS.search = ''
            history.pushState({}, '', urlS);
        }
    }
    if (urlS.hash === '#edit') {
        let id = urlS.search.split('=')[1]
        if (books[id]) {
            showEdit(id)
        } else {
            urlS.href = strippedURL
            urlS.hash = ''
            urlS.search = ''
            history.pushState({}, '', urlS);
        }
    }
    if (urlS.hash === '#add') {
        showAdd()
    }
}

const pushUrl = (href) => {

    holyhandgrenade()
    let urlS = new URL(window.location)
    let strippedURL = urlS.href.split('index.html')[0]
    strippedURL = strippedURL + 'index.html'
    if (urlS.hash === '#preview') {
        let id = urlS.search.split('=')[1]
        if (books[id]) {
            showPreview(id)
        } else {
            urlS.href = strippedURL
            urlS.hash = ''
            urlS.search = ''
            history.pushState({}, '', urlS);
        }
    }
    if (urlS.hash === '#edit') {
        let id = urlS.search.split('=')[1]
        if (books[id]) {
            showEdit(id)
        } else {
            urlS.href = strippedURL
            urlS.hash = ''
            urlS.search = ''
            history.pushState({}, '', urlS);
        }
    }
    if (urlS.hash === '#add') {
        showAdd()
    }
    history.pushState({}, '', href);
};

window.addEventListener('popstate', pushUrl);

function setIdInURL(id, url) {
    url.searchParams.set('id', id)
    return url
}
function setHashInURL(hash, url) {
    url.hash = hash
    return url
}

//input fields

function createInput(name) {
    let div = create('div');
    let label = create('label');
    label.setAttribute('for', name);
    label.textContent = name;
    let input = create('input');
    input.type = 'text';
    input.id = name;
    input.name = name;
    div.appendChild(label);
    div.appendChild(input);
    return div;
}

function createForm(id) {
    let div = create('div')
    let form = create('form');
    form.id = id;
    let author = createInput('author');
    let title = createInput('title');
    let img = createInput('img');
    img.value = 'https://www.linkpicture.com/q/174254886_299518451623086_2877173947558125715_n.jpg'
    let plot = createInput('plot');
    form.appendChild(author);
    form.appendChild(title);
    form.appendChild(img);
    form.appendChild(plot);
    div.appendChild(form);
    return div;
}

//create elements
function createSimpleElement(from, name) {
    let elem = create('div');
    elem.className = name;
    elem.innerHTML = from[name];
    return elem;
}

function createImgElement(from, name) {
    let elem = create('img');
    elem.className = name;
    elem.src = from[name];
    return elem;
}

//books preview
function showPreview(currentBook) {

    holyhandgrenade()

    let url = new URL(window.location);
    url = setIdInURL(currentBook, url)
    url = setHashInURL('preview', url)
    window.history.pushState({}, '', url);

    let previewBook = create('div');
    previewBook.className = 'previewBook';
    let author = createSimpleElement(books[currentBook], 'author');
    previewBook.appendChild(author);
    let title = createSimpleElement(books[currentBook], 'title');
    previewBook.appendChild(title);
    let img = createImgElement(books[currentBook], 'img');
    previewBook.appendChild(img);
    let plot = createSimpleElement(books[currentBook], 'plot');
    previewBook.appendChild(plot);
    let appStuff = get('appStuff')
    appStuff.appendChild(previewBook);
}

//edit books
function showEdit(currentBook) {

    holyhandgrenade()

    let url = new URL(window.location);
    url = setIdInURL(currentBook, url)
    url = setHashInURL('edit', url)
    window.history.pushState({}, '', url);

    let editBook = create('div');
    editBook.className = 'editBook';
    let form = createForm('editBook');
    editBook.appendChild(form);
    let appStuff = get('appStuff')
    appStuff.appendChild(editBook)

    let author = get('author')
    let title = get('title')
    let img = get('img')
    let plot = get('plot')
    author.value = books[currentBook].author
    title.value = books[currentBook].title
    img.value = books[currentBook].img
    plot.value = books[currentBook].plot

    //cancel button
    let cancelBtn = create('button');
    cancelBtn.textContent = 'Cancel';
    editBook.appendChild(cancelBtn);

    cancelBtn.onclick = function () {

        //modal window
        let modalWindow = create('div')
        modalWindow.className = 'modal'
        modalWindow.id = 'modal';

        let modalDiv = create('div');
        modalDiv.className = 'modalbox';
        modalDiv.innerHTML = `<p>Discard changes?<p>`;

        let modalButtonS = create('button');
        modalButtonS.id = 'sure';
        modalButtonS.textContent = 'Sure!';

        let modalButtonC = create('button');
        modalButtonC.id = 'cancel';
        modalButtonC.textContent = 'Cancel';

        //moral events
        modalButtonC.onclick = function () {
            holyhandgrenade()
        }

        modalButtonS.onclick = function () {
            modalWindow.style.display = 'none';
        }

        modalDiv.appendChild(modalButtonC);
        modalDiv.appendChild(modalButtonS);
        modalWindow.appendChild(modalDiv);
        root.appendChild(modalWindow);
    }

    //save button
    let saveBtn = create('button')
    saveBtn.id = currentBook
    saveBtn.textContent = 'Save';
    editBook.appendChild(saveBtn);


    saveBtn.onclick = function () {

        let author = get('author').value;
        let title = get('title').value;
        let img = get('img').value;
        let plot = get('plot').value;
        books[currentBook] = { author, title, img, plot }
        holyhandgrenade()

        //wait for it ;D
        let modalWindow = create('div')
        modalWindow.className = 'modal'
        modalWindow.id = 'modal';

        let modalDiv = create('div');
        modalDiv.className = 'modalbox';
        modalDiv.innerHTML = `<p>Book successfully updated<p>`;

        modalWindow.appendChild(modalDiv);
        root.appendChild(modalWindow);
        const TIME = 200
        setTimeout(function () {
            modalWindow.remove();
        }, TIME)
    };

    appStuff.appendChild(editBook);
}

//add books
function showAdd() {

    holyhandgrenade()

    let url = new URL(window.location);
    url = setHashInURL('add', url)

    window.history.pushState({}, '', url);
    let form = createForm('addBook');
    let appStuff = get('appStuff')
    appStuff.appendChild(form);
    let submit = create('button');
    submit.textContent = 'Submit';
    form.appendChild(submit);
    submit.onclick = function () {

        let author = get('author').value;
        let title = get('title').value;
        let img = get('img').value;
        let plot = get('plot').value;

        books.push({ author, title, img, plot });

        holyhandgrenade();
    };
}

//booklist
function createBookList() {
    let booklist = create('div');
    booklist.id = 'booklist';
    let leftSide = get('leftSide')
    leftSide.appendChild(booklist);


    for (let i = 0; i < books.length; i++) {
        //booklist
        let book = create('div');
        book.className = 'book';
        let author = createSimpleElement(books[i], 'author');
        book.appendChild(author);
        let title = createSimpleElement(books[i], 'title');
        book.appendChild(title);
        booklist.appendChild(book);


        let bookLinkBtn = create('button');
        bookLinkBtn.textContent = 'Preview';
        //bookLink.appendChild(bookLinkBtn);
        book.appendChild(bookLinkBtn);

        bookLinkBtn.onclick = function () {
            showPreview(i)
        }

        let editLinkBtn = create('button');
        editLinkBtn.textContent = 'Edit';
        editLinkBtn.id = i;
        book.appendChild(editLinkBtn);

        editLinkBtn.onclick = function (event) {
            showEdit(event.target.id)
        }
    }
}

//add button
function addBookButton() {
    let addBook = create('div');
    addBook.className = 'book';
    let addBookBtn = create('button');
    addBookBtn.textContent = 'Add book';
    addBook.appendChild(addBookBtn);
    let booklist = get('booklist')
    booklist.appendChild(addBook)
    addBookBtn.onclick = function () {
        showAdd()
    }
}
