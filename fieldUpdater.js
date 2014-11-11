var titleFieldUpdater = Class.create();

titleFieldUpdater.prototype = {
    initialize: function (titleEl, updateClass, updateTitleFl) {
        this.titleEl = $(titleEl);
        this.updateClass = '.' + updateClass;
        this.elemsToUpdate = $$(this.updateClass);
        this.defaultValue = '';
        this.prepareTitleUpdater(updateTitleFl);
        Event.observe(this.titleEl, 'keyup', this.updateElems.bind(this));
        Event.observe(this.titleEl, 'blur', this.updateElems.bind(this));
        this.defaultValue = $$('h3.icon-head > ' + this.updateClass)[0].innerHTML;
        this.updateTitle();
    },
    updateElems: function () {
        var title = (this.titleEl.value) ? this.titleEl.value : this.defaultValue;
        this.elemsToUpdate.each(function (el) {
            $(el).update(title);
        });
        this.updateTitle();
    },
    updateTitle: function () {
        if (this.canUpdateTitle) {
            this.sourceForTitle.each(function (el) {
                document.title = el.innerHTML.strip().stripTags().replace(/\\n/g, '').replace(/\\s{2}/g, '');
                return;
            });
        }
    },
    prepareTitleUpdater: function (updateTitleFl) {
        if (typeof(updateTitleFl) == "undefined") {
            this.canUpdateTitle = true;
        } else {
            this.canUpdateTitle = updateTitleFl;
        }
        if (this.canUpdateTitle) {
            this.sourceForTitle = $$('h3.icon-head');
        }
    }
};

var fieldTransliterator = Class.create();

fieldTransliterator.prototype = {
    initialize: function (sourceField, targetField1) {
        this.sourceField = $(sourceField);
        this.targetFields = [];
        for (var i = 1; i<= arguments.length - 1; i++) {
            this.targetFields[i - 1] = $(arguments[i]);
        }

        Event.observe(this.sourceField, 'keyup', this.transliterateField.bind(this));
        Event.observe(this.sourceField, 'blur', this.transliterateField.bind(this));
    },
    transliterateField: function() {
        var transliteratedValue = transliterate(this.sourceField.value).toLowerCase();
        for (var i = 0; i<= this.targetFields.length; i++) {
            var elem = this.targetFields[i];
            elem.value = transliteratedValue;
        }
    }
};