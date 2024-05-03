

export class MarkDownEditor{


    constructor(base, no, editor_id, preview_id) {

       this.update_sync = base;
        this.hasEdited = false;
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
            //let changed = editor.getValue() != defaultInput;
            //if (changed) {
            //    hasEdited = true;
            //}
            this.hasEdited = true;
            let value = editor.getValue();
            this.convert(preview_id, value);
            this.update_sync(value);
            //diff_ck_localFileSaveContent(value);
            //saveLastContent(value);
        });
        //return editor;
        this.editor = editor;
    };

    sessionSync (editor2)  {
          editor2.setSession(this.editor.getSession());
          let value = editor2.getValue();
          convert(editor2.preview_id, value);
    }

    convert(id, markdown) {
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
    reset () {
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
    presetValue (value) {
        this.editor.setValue(value);
        this.editor.moveCursorTo(0, 0);
        this.editor.focus();
        this.editor.navigateLineEnd();
        this.hasEdited = false;
    };

    // ----- sync scroll position -----

    initScrollBarSync (settings)  {
        let checkbox = document.querySelector('#sync-scroll-checkbox');
        checkbox.checked = settings;
        this.scrollBarSync = settings;

        checkbox.addEventListener('change', (event) => {
            let checked = event.currentTarget.checked;
            this.scrollBarSync = checked;
            //saveScrollBarSettings(checked);
        });

        document.querySelector('#edit').addEventListener('scroll', (event) => {
            if (!this.scrollBarSync) {
                return;
            }
            let editorElement = event.currentTarget;
            let ratio = editorElement.scrollTop / (editorElement.scrollHeight - editorElement.clientHeight);

            let previewElement = document.querySelector('#preview');
            let targetY = (previewElement.scrollHeight - previewElement.clientHeight) * ratio;
            previewElement.scrollTo(0, targetY);
        });
    };
    enableScrollBarSync () {
        scrollBarSync = true;
    };

    disableScrollBarSync ()  {
        scrollBarSync = false;
    };



}
