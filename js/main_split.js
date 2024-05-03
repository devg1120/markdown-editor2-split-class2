import { MarkDownEditor }  from  "./MarkDownEditor.js";

document.addEventListener("DOMContentLoaded", () => {

 var open_button = document.querySelector('#openfile');
 var saveAs_button = document.querySelector('#saveAsfile');
 var save_button = document.querySelector('#savefile');
 var filename_label = document.querySelector('#filename');
 var schemeToggl_button = document.querySelector('#schemeToggle');
 var keybindChange_button = document.querySelector('#keybindChange');
 var swap_button = document.querySelector('#swap');

 var filepath = null;
 var fileHandle = null
 var localFileSaveContent = "";

open_button.addEventListener("click", function(ev){
      openFile();
}, false);

save_button.addEventListener("click", function(ev){
      saveFile();
}, false);

saveAs_button.addEventListener("click", function(ev){
      saveAsFile();
}, false);

schemeToggl_button.addEventListener("click", function(ev){
      schemeChange();
}, false);

keybindChange_button.addEventListener("click", function(ev){
      keybindChange();
}, false);

swap_button.addEventListener("click", function(ev){
      swap();
}, false);

function swap() {
        var a = document.querySelector("#edit");
        var b = document.querySelector("#preview");
	swap_panel(a, b);

        var a2 = document.querySelector("#edit2");
        var b2 = document.querySelector("#preview2");
	swap_panel(a2, b2);

}

function swap_panel(a, b) {
	var p1 = a.parentNode,
		p2 = b.parentNode,
		i1,
		i2;

	if (!p1 || !p2 || p1.isEqualNode(b) || p2.isEqualNode(a)) return;

	for (var i = 0; i < p1.children.length; i++) {
		if (p1.children[i].isEqualNode(a)) {
			i1 = i;
		}
	}
	for (var i = 0; i < p2.children.length; i++) {
		if (p2.children[i].isEqualNode(b)) {
			i2 = i;
		}
	}

	if (p1.isEqualNode(p2) && i1 < i2) {
		i2++;
	}
	p1.insertBefore(b, p1.children[i1]);
	p2.insertBefore(a, p2.children[i2]);
}


function keybindChange(e) {
	if (keybindChange_button.textContent == "none") {
             keybindChange_button.textContent = "vim";
	     editor.setKeyboardHandler("ace/keyboard/vim");  
	     editor2.setKeyboardHandler("ace/keyboard/vim");  
	} else if (keybindChange_button.textContent == "vim") {
             keybindChange_button.textContent = "none";
	     editor.setKeyboardHandler("");  
	     editor2.setKeyboardHandler("");  
	}
}
function schemeChange(e) {

	console.log(schemeToggl_button.textContent);  
	if (schemeToggl_button.textContent == "Dark") {
     	  schemeToggl_button.textContent = "Light";

          var output = document.querySelector('#output');
          output.classList.remove("dark");
          output.classList.add("light");

          var preview = document.querySelector('#preview-wrapper');
          preview.classList.remove("dark");
          preview.classList.add("light");

          editor.setTheme('ace/theme/chrome');

          var output2 = document.querySelector('#output2');
          output2.classList.remove("dark");
          output2.classList.add("light");

          var preview2 = document.querySelector('#preview-wrapper2');
          preview2.classList.remove("dark");
          preview2.classList.add("light");

          editor2.setTheme('ace/theme/chrome');

	} else if (schemeToggl_button.textContent == "Light") {
     	  schemeToggl_button.textContent = "Dark";

          var output = document.querySelector('#output');
          output.classList.remove("light");
          output.classList.add("dark");

          var preview = document.querySelector('#preview-wrapper');
          preview.classList.remove("light");
          preview.classList.add("dark");

          editor.setTheme('ace/theme/one_dark');

          var output2 = document.querySelector('#output2');
          output2.classList.remove("light");
          output2.classList.add("dark");

          var preview2 = document.querySelector('#preview-wrapper2');
          preview2.classList.remove("light");
          preview2.classList.add("dark");

          editor2.setTheme('ace/theme/one_dark');

	}



}

//    editor.setFontSize(14);
//
const pickerOpts = {
  types: [
    {
      description: "Markdown",
      accept: {
        "text/markdown": [".md"],
      },
    },
  ],
  excludeAcceptAllOption: true,
  multiple: false,
};


async function openFile() {
  //const [fileHandle] = await window.showOpenFilePicker(pickerOpts);
  [fileHandle] = await window.showOpenFilePicker(pickerOpts);

   filepath = await fileHandle.getFile();

   console.log(filepath.name);
   filename_label.innerText = " [ " + filepath.name + " ] ";

    var reader = new FileReader();
    console.dir(filepath);
    reader.readAsText(filepath); 

    reader.onload = function(e){
        let input = reader.result;
        //presetValue(input);
        presetValue(editor, input);
        document.querySelectorAll('.column').forEach((element) => {
            element.scrollTo({top: 0});
        });
        localFileSaveContent = input;
        diff_ck_localFileSaveContent(input);
    }
}


const saveFileOptions = {
  types: [
    {
      description: "Markdown",
      accept: {
        "text/markdown": [".md"],
      },
    },
  ],
};

async function saveAsFile() {

    let value = editor.getValue();
  const newHandle = await window.showSaveFilePicker(saveFileOptions);

  const writableStream = await newHandle.createWritable();
  
  await writableStream.write(value);

  await writableStream.close();

  localFileSaveContent = value;
  diff_ck_localFileSaveContent(value);
   /********************************************/
   filepath = await newHandle.getFile();

   console.log(filepath.name);
   filename_label.innerText = " [ " + filepath.name + " ] ";
   fileHandle = newHandle;


}

async function saveFile() {

  if (filepath == null) {
       alert("filepath null!!!");
	  return;

  }
    let value = editor.getValue();
  //const newHandle = await window.showSaveFilePicker(saveFileOptions);

  const writableStream = await fileHandle.createWritable();

  await writableStream.write(value);

  await writableStream.close();
  localFileSaveContent = value;
  diff_ck_localFileSaveContent(value);

}

    let hasEdited = false;
    let scrollBarSync = false;
    let hasEdited2 = false;
    let scrollBarSync2 = false;

    const localStorageNamespace = 'com.markdownlivepreview';
    const localStorageKey = 'last_state';
    const localStorageScrollBarKey = 'scroll_bar_settings';
    const confirmationMessage = 'Are you sure you want to reset? Your changes will be lost.';

    // default template
    const defaultInput = `# Markdown syntax guide

## Headers

# This is a Heading h1
## This is a Heading h2
###### This is a Heading h6

## Emphasis

*This text will be italic*  
_This will also be italic_

**This text will be bold**  
__This will also be bold__

_You **can** combine them_

## Lists

### Unordered

* Item 1
* Item 2
* Item 2a
* Item 2b

### Ordered

1. Item 1
2. Item 2
3. Item 3
    1. Item 3a
    2. Item 3b

## Images

![This is an alt text.](/image/sample.webp "This is a sample image.")

## Links

You may be using [Markdown Live Preview](https://markdownlivepreview.com/).

## Blockquotes

> Markdown is a lightweight markup language with plain-text-formatting syntax, created in 2004 by John Gruber with Aaron Swartz.
>
>> Markdown is often used to format readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.

## Tables

| Left columns  | Right columns |
| ------------- |:-------------:|
| left foo      | right foo     |
| left bar      | right bar     |
| left baz      | right baz     |

## Blocks of code

${"`"}${"`"}${"`"}
let message = 'Hello world';
alert(message);
${"`"}${"`"}${"`"}

## Inline code

This web site is using ${"`"}markedjs/marked${"`"}.
`;

    let setupEditor = (editor_id, preview_id) => {
        let editor = ace.edit(editor_id);
        editor.preview_id = preview_id;
        editor.getSession().setUseWrapMode(true);
        editor.setOptions({
            maxLines: Infinity,
            indentedSoftWrap: false,
            fontSize: 18,
            autoScrollEditorIntoView: true,
		// https://ace.c9.io/build/kitchen-sink.html
		// https://gist.github.com/RyanNutt/cb8d60997d97905f0b2aea6c3b5c8ee0
            //theme: 'ace/theme/chrome',
            //theme: 'ace/theme/monokai',
            //theme: 'ace/theme/cobalt',
            theme: 'ace/theme/one_dark',
        });

        var MarkdownMode = ace.require("ace/mode/markdown").Mode;
        editor.session.setMode(new MarkdownMode());

        //editor.setKeyboardHandler("ace/keyboard/vim");
        editor.setShowPrintMargin(false);

        editor.on('change', () => {
            let changed = editor.getValue() != defaultInput;
            if (changed) {
                hasEdited = true;
            }
            let value = editor.getValue();
            convert(preview_id, value);
            diff_ck_localFileSaveContent(value);
            saveLastContent(value);
        });

        return editor;
    };

    let sessionSync = (editor, editor2) => {
          editor2.setSession(editor.getSession());
          let value = editor2.getValue();
          convert(editor2.preview_id, value);
    }

    // Render markdown text as html
    let convert = (id, markdown) => {
        let options = {
            headerIds: false,
            mangle: false
        };
        let html = marked.parse(markdown, options);
        let sanitized = DOMPurify.sanitize(html);
        //document.querySelector('#output').innerHTML = sanitized;
        document.querySelector("#" + id).innerHTML = sanitized;
    };

    // Reset input text
    let reset = () => {
        let changed = editor.getValue() != defaultInput;
        if (hasEdited || changed) {
            var confirmed = window.confirm(confirmationMessage);
            if (!confirmed) {
                return;
            }
        }
        //presetValue(defaultInput);
        presetValue(editor, defaultInput);
        document.querySelectorAll('.column').forEach((element) => {
            element.scrollTo({top: 0});
        });
    };

    //let presetValue = (value) => {
    let presetValue = (editor, value) => {
        editor.setValue(value);
        editor.moveCursorTo(0, 0);
        editor.focus();
        editor.navigateLineEnd();
        hasEdited = false;
    };

    // ----- sync scroll position -----

    let initScrollBarSync = (settings) => {
        let checkbox = document.querySelector('#sync-scroll-checkbox');
        checkbox.checked = settings;
        scrollBarSync = settings;

        checkbox.addEventListener('change', (event) => {
            let checked = event.currentTarget.checked;
            scrollBarSync = checked;
            saveScrollBarSettings(checked);
        });

        document.querySelector('#edit').addEventListener('scroll', (event) => {
            if (!scrollBarSync) {
                return;
            }
            let editorElement = event.currentTarget;
            let ratio = editorElement.scrollTop / (editorElement.scrollHeight - editorElement.clientHeight);

            let previewElement = document.querySelector('#preview');
            let targetY = (previewElement.scrollHeight - previewElement.clientHeight) * ratio;
            previewElement.scrollTo(0, targetY);
        });
    };

    let enableScrollBarSync = () => {
        scrollBarSync = true;
    };

    let disableScrollBarSync = () => {
        scrollBarSync = false;
    };

    // ----- sync scroll position 2-----
//
    let initScrollBarSync2 = (settings) => {
        let checkbox = document.querySelector('#sync-scroll-checkbox2');
        checkbox.checked = settings;
        scrollBarSync2 = settings;

        checkbox.addEventListener('change', (event) => {
            let checked = event.currentTarget.checked;
            scrollBarSync2 = checked;
            saveScrollBarSettings(checked);
        });

        document.querySelector('#edit2').addEventListener('scroll', (event) => {
            if (!scrollBarSync2) {
                return;
            }
            let editorElement = event.currentTarget;
            let ratio = editorElement.scrollTop / (editorElement.scrollHeight - editorElement.clientHeight);

            let previewElement = document.querySelector('#preview2');
            let targetY = (previewElement.scrollHeight - previewElement.clientHeight) * ratio;
            previewElement.scrollTo(0, targetY);
        });
    };

    let enableScrollBarSync2 = () => {
        scrollBarSync2 = true;
    };

    let disableScrollBarSync2 = () => {
        scrollBarSync2 = false;
    };

    // ----- clipboard utils -----

    let copyToClipboard = (text, successHandler, errorHandler) => {
        navigator.clipboard.writeText(text).then(
            () => {
                successHandler();
            },

            () => {
                errorHandler();
            }
        );
    };

    let notifyCopied = () => {
        let labelElement = document.querySelector("#copy-button a");
        labelElement.innerHTML = "Copied!";
        setTimeout(() => {
            labelElement.innerHTML = "Copy";
        }, 1000)
    };

    // ----- setup -----

    // setup navigation actions
    let setupResetButton = () => {
        document.querySelector("#reset-button").addEventListener('click', (event) => {
            event.preventDefault();
            reset();
        });
    };

    let setupCopyButton = (editor) => {
        document.querySelector("#copy-button").addEventListener('click', (event) => {
            event.preventDefault();
            let value = editor.getValue();
            copyToClipboard(value, () => {
                notifyCopied();
            },
            () => {
                // nothing to do
            });
        });
    };

    // ----- local file save check -----
    let diff_ck_localFileSaveContent = (content) => {
	 if (localFileSaveContent != content ) {
              if (save_button.classList.contains("diff")) {

	      } else {
                 save_button.classList.add("diff") ;
	      }

	 } else {
              if (save_button.classList.contains("diff")) {
                 save_button.classList.remove("diff") ;

	      } else {
	      }

	 }
    };
    // ----- local state -----

    let loadLastContent = () => {
        let lastContent = Storehouse.getItem(localStorageNamespace, localStorageKey);
        return lastContent;
    };

    let saveLastContent = (content) => {
        let expiredAt = new Date(2099, 1, 1);
        Storehouse.setItem(localStorageNamespace, localStorageKey, content, expiredAt);
    };

    let loadScrollBarSettings = () => {
        let lastContent = Storehouse.getItem(localStorageNamespace, localStorageScrollBarKey);
        return lastContent;
    };

    let saveScrollBarSettings = (settings) => {
        let expiredAt = new Date(2099, 1, 1);
        Storehouse.setItem(localStorageNamespace, localStorageScrollBarKey, settings, expiredAt);
    };


    // ----- entry point -----
/*
    let lastContent = loadLastContent();
    let editor = setupEditor();
    if (lastContent) {
        presetValue(lastContent);
    } else {
        presetValue(defaultInput);
    }
*/

    let update_sync = (value) => {
              console.log("update_sync");
              diff_ck_localFileSaveContent(value);
              saveLastContent(value);
    };


    //let editor = new MarkDownEditor(update_sync, 1);
    let editor1 = new MarkDownEditor(update_sync, 1, "editor1", "output1");
    editor1.presetValue(defaultInput);
    let scrollBarSettings = loadScrollBarSettings() || false;
    editor1.initScrollBarSync(scrollBarSettings);

    let editor2 = new MarkDownEditor(update_sync, 2, "editor2", "output2");
    editor2.initScrollBarSync(scrollBarSettings);

    sessionSync( editor1.editor, editor2.editor);

    let editor3 = new MarkDownEditor(update_sync, 3, "editor3", "output3");
    editor3.initScrollBarSync(scrollBarSettings);

    sessionSync( editor1.editor, editor3.editor);


/*
    let editor = setupEditor("editor", "output");
    presetValue(editor,defaultInput);

    setupResetButton();
    setupCopyButton(editor);

    let scrollBarSettings = loadScrollBarSettings() || false;
    initScrollBarSync(scrollBarSettings);
    initScrollBarSync2(scrollBarSettings);

    let editor2 = setupEditor("editor2", "output2");

    sessionSync( editor, editor2);
*/
});