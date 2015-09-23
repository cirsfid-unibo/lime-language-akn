
var Translator = {
    start: start,
    setTranslations: setTranslations,
    getTranslations: getTranslations,
    focus: focus,
    focusedFragment: undefined,
    originalDom: undefined,
    translatedDom: undefined,
    contextMenuCallback: undefined,
    focusCallback: undefined
};

function start (xml, translations) {
    cloneDocs(xml);
    setupTranslator();
    setTranslations(translations)
}

function setTranslations (translations) {
    $(Translator.translatedDom).find('.fragment').each(function () {
        var id = this.dataset.id,
            status = (translations[id] && translations[id].status) || 'todo';
        if (status == 'translated') {
            this.dataset.status = 'translated';
            this.textContent = translations[id].value;
        } else if (status == 'pending') {
            this.dataset.status = 'pending';
            if (translations[id].value)
                this.textContent = translations[id].value;
        } else {
            this.dataset.status = 'todo';
        }
    });
}

function getTranslations () {
    var translations = {};
    $(Translator.translatedDom).find('.fragment').each(function () {
        var id = this.dataset.id;
        translations[id] = {
            status: this.dataset.status,
            value: this.textContent
        }
    });
    return translations;
}

function cloneDocs (xml) {
    Translator.originalDom = $('.document.original')[0];
    Translator.translatedDom = $('.document.translated')[0];

    var parser = new DOMParser();
    var dom = parser.parseFromString(xml, "text/xml");
    transform(dom, Translator.originalDom);
    Translator.translatedDom.appendChild(
        Translator.originalDom.querySelector('.akomaNtoso').cloneNode(true)
    );
}

var counter = 0;

// Transform the input XML DOM in HTML and copy it to output. 
// Split text nodes in fragments.
function transform (input, output) {
    // Don't split in fragments inside the following tags
    var noSplitTags = ['num', 'heading', 'subheading'];

    switch (input.nodeType) {
    case 3: // Text
        var text = input.wholeText.trim();
        if(text) {
            var canSplit = noSplitTags.indexOf(input.parentNode.nodeName) == -1,
            fragments = canSplit ? splitFragments(text) : [text];
            fragments.forEach(function (fragment) {
                var el = document.createElement('span');
                el.className = 'fragment';
                el.appendChild(document.createTextNode(fragment));
                el.dataset.id = counter++;
                output.appendChild(el);
            });
        }
        break;

    case 9: // Document
    case 1: // Element
        var el = document.createElement('div');
        output.appendChild(el);
        el.className = input.nodeName;
        var children = input.childNodes;
        for (var i = 0; i < children.length; i++)
            transform(children[i], el);
        break;

    default:
        console.log('Unknown node type:', input.nodeType);
    }
};


function splitFragments (text) {
    var SEPARATOR = '.',
        fragments = [],
        last = 0;
    for (var i = 0; i < text.length; i++) {
        if ((text[i] == SEPARATOR) || (i == text.length-1)) {
            if (i+1<text.length && text[i+1] == ' ') i++;
            fragments.push(text.substring(last, i+1));
            last = i+1;
        }
    }
    return fragments;
}

function setupTranslator () {
    $(Translator.translatedDom).find('.fragment').each(function () {
        var id = this.dataset.id;
        this.setAttribute("contentEditable", true);

        $(this).on('input', function() {
            this.dataset.status = 'pending';
        });

        $(this).focus(function (e) {
            focus(id);
            if (Translator.focusCallback) {
                e.preventDefault();
                Translator.focusCallback(parseInt(id));
            }
        });
        
        $(this).contextmenu(function(e) {
            if (Translator.contextMenuCallback) {
                e.preventDefault();
                Translator.contextMenuCallback(id, e.clientX, e.clientY);
            }
        });
    });
}

function focus (id) {
    var node = Translator.translatedDom.querySelector('.fragment[data-id="' + id + '"]');
    if (Translator.focusedFragment != id) {
        Translator.focusedFragment = id;
        $('.document .fragment.highlight').removeClass('highlight');
        $('.document .fragment[data-id="'+id+'"]').addClass('highlight');
        
        selectElementContents(node);
        scrollToNode(node);
    }
}

function selectElementContents(node) {
    var range = document.createRange();
    range.selectNodeContents(node);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
}

function scrollToNode (node) {
    var offset = $(node).offset().top,
        wOffset = $(window).scrollTop(),
        wHeight = window.innerHeight;
    if(offset < wOffset || offset > wOffset + wHeight)
        $(window).scrollTop($(node).offset().top);
}

window.Translator = Translator;

$(document).ready(function () {
    function inIframe () {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    }
    if (!inIframe())
        $.get('./example.xml', undefined, function (value) {
            Translator.start(value, {
                0: {status:'todo'},
                1: {status:'pending'},
                2: {status:'translated', value: 'Titolo 3'}
            }, {});
        }, 'text');
});