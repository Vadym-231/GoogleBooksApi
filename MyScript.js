let doc, container, text, filter, filterSelect = null,
    maxResults = null,
    orderBy = null,
    langRestrict = null,
    arr = [];
window.onload = function() {
    doc = document;
    container = doc.getElementById('container');
    filter = doc.getElementById('fillter');
    text = doc.getElementById('textArea');
    menu = doc.getElementById('dropMenu');
    menu.addEventListener('mouseover', event => {
        filter.style.display = 'block';

    })
    menu.addEventListener('mouseout', event => {
        filter.style.display = 'none';
        //filter.style.opacity='1'

    })
    filter.addEventListener('mouseout', event_ => {
        event_.preventDefault()
        filter.style.display = 'none';

    })
    filter.addEventListener('mouseover', event => {
        event.preventDefault();
        filter.style.display = 'block';
    })

    text.addEventListener('keydown', (e) => {
        if (e.keyCode === 13) {
            checkData();
        }
    })
}

function checkData() {
    if (text.value.length > 0) {
        if (container.childNodes.length > 0) {
            cleanAll();
        }
        fetchData(text.value)
    }
}

function fetchData(str) {
    fetch(ready()(str)).then(data => {
        if (data.ok) {
            return data.json()
        }
    }).then(data => {
        console.log(data)
        if (typeof data.items !== 'undefined') {
            printStrSearch(data.items.length, str);
            data.items.map(data => {
                printAllBlock(data.volumeInfo.title, data.volumeInfo.authors, data.volumeInfo.publisher, data.volumeInfo.infoLink, data.volumeInfo.language, data.volumeInfo.imageLinks.thumbnail, data.volumeInfo.publishedDate, data.volumeInfo.description, data.volumeInfo.publishedDate);
            })
        } else {
            printStrSearch(0, str);
        }
    }).catch(err => {
        console.log(err);
    })
}

function printStrSearch(length_, str) {
    let strFilterInfo = 'Filter By('
    if (arr.length > 0) {
        arr.map(data => {
            strFilterInfo += data.type + '=' + data.value + ';';
        })
        strFilterInfo += ');'
    } else {
        strFilterInfo += 'default)'
    }
    let strSearch = doc.createElement('p');
    strSearch.appendChild(doc.createTextNode('Have found ' + length_ + ' result(s) for "' + str + '"' + ' ' + strFilterInfo));
    strSearch.className = 'block searchStr newStyle';
    container.appendChild(strSearch)
}

function printAllBlock(title, author, publised, infoUrl, language, imgSrc, date, content, str, lenghtArray) {
    let url = doc.createElement('a');
    url.href = infoUrl;
    url.style.width = '100%';
    let figura = doc.createElement('figure');
    figura.onmouseout = () => {
        figura.style.opacity = '0.8';
    }
    figura.onmouseover = () => {
        figura.style.opacity = '1';
    }
    figura.className = "block searchStr imgCreator";
    let img = doc.createElement('img');
    img.src = imgSrc;
    img.className = 'imgClass';
    figura.appendChild(img);
    let figuraCaption = doc.createElement('figcaption');
    createTextBlock(figuraCaption, '', title, ['titleBlock nameMain', 'titleText'])
    createTextBlock(figuraCaption, 'author: ', author)
    createTextBlock(figuraCaption, 'published: ', publised)
    createTextBlock(figuraCaption, 'lang: ', language)
    createTextBlock(figuraCaption, ' content: ', content)
    createTextBlock(figuraCaption, 'date: ', date, ['dateBlock', 'textBlock'])
    figura.appendChild(figuraCaption);
    url.appendChild(figura);
    container.appendChild(url);
}

function createTextBlock(el, str, _text, _Class = []) {
    if ((typeof _text) === 'undefined') {
        _text = 'Havn`t info.';
    }
    if ((typeof _text) === 'object') {
        let buff = '';
        console.log(buff);
        _text.map(data => {
            buff += data + ' ';
        })
        _text = buff;
    }

    let p = doc.createElement('p');
    p.className = "contentBlock";
    let TextTitle = doc.createTextNode(str.toUpperCase());
    let TextContent = doc.createTextNode(_text.toUpperCase())
    let title = doc.createElement('span');
    title.className = "nameMain";
    title.appendChild(TextTitle);
    let content = doc.createElement('span');
    content.className = 'textStyle';
    if (_Class.length === 2) {
        p.className = _Class[0];
        title.className = '';
        content.className = _Class[1];

    }
    content.appendChild(TextContent);
    p.appendChild(title);
    p.appendChild(content);
    let br = doc.createElement('br');
    p.appendChild(br);
    el.appendChild(p);
}

function cleanAll() {
    let fc = container.firstChild;
    while (fc) {
        container.removeChild(fc);
        fc = container.firstChild;
    }
}

function dropFilter(el) {
    console.log(filter.style.display !== 'block')
    if (filter.style.display === 'block') {
        //  filter.className = 'dropClose';
        filter.style.display = "none"
        doc.getElementById('filterIco').className = "down"
    } else {
        //filter.className = 'dropOpen';
        filter.style.display = "block"
        console.log('aa')
        doc.getElementById('filterIco').className = "up"
    }
}

function checkChenge(el) {
    if (el.name === 'filter' && el.value !== '' && !el.disabled) {
        filterSelect = { type: el.name, value: el.value }
    }
    if (el.name === 'langRestrict' && el.value !== '' && !el.disabled) {
        langRestrict = { type: el.name, value: el.value }
    }
    if (el.name === 'maxResults' && el.value !== '' && !el.disabled) {

        maxResults = { type: el.name, value: el.value }

    }
    if (el.name === 'orderBy' && el.value !== '' && !el.disabled) {
        orderBy = { type: el.name, value: el.value }
    }

}

function ready() {
    let checkButton = doc.getElementById('checkBox'),
        buff = [];
    console.log(!checkButton.checked);
    if (!checkButton.checked) {
        checkBoxChange(null, 'checkFillter')
        if (maxResults !== null) {
            buff.push(maxResults);
            maxResults = null
        }
        if (langRestrict !== null) {
            buff.push(langRestrict);
            langRestrict = null;
        }
        if (orderBy !== null) {
            buff.push(orderBy);
            orderBy = null
        }
        if (filterSelect !== null) {
            buff.push(filterSelect);
            filterSelect = null
        }
    }
    arr = buff;
    return printA = (str) => {
        let str_ = 'https://www.googleapis.com/books/v1/volumes?q=search+intitle=' + str;
        for (let i = 0; i < buff.length; i++) {
            str_ += '&' + buff[i].type + '=' + buff[i].value;
        }
        return str_;
    }
}

function checkBoxChange(el, type = 'chengeCheckBox') {
    console.log(filter)
    for (let i = 0; i < filter.childNodes.length; i++) {
        if ((filter.childNodes[i].tagName === 'INPUT' || filter.childNodes[i].tagName === 'SELECT')) {
            if (type === 'chengeCheckBox') {
                if (el.checked) {
                    filter.childNodes[i].readOnly = true;
                    filter.childNodes[i].style.textDecoration = 'line-through'
                } else {
                    filter.childNodes[i].readOnly = false;
                    filter.childNodes[i].style.textDecoration = 'none';
                }
            } else {

                checkChenge(filter.childNodes[i])
            }

        }
    }

}