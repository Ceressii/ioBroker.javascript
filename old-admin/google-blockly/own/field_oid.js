/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2012 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Text input field.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.FieldOID');

goog.require('Blockly.Field');
goog.require('Blockly.Msg');
goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.userAgent');


/**
 * Class for an editable text field.
 * @param {string} text The initial content of the field.
 * @param {Function=} opt_validator An optional function that is called
 *     to validate any constraints on what the user entered.  Takes the new
 *     text as an argument and returns either the accepted text, a replacement
 *     text, or null to abort the change.
 * @extends {Blockly.Field}
 * @constructor
 */
Blockly.FieldOID = function(text, oid_dialog, objects) {
    Blockly.FieldOID.superClass_.constructor.call(this, text, oid_dialog);
    this.oid_dialog = oid_dialog;
    this.objects    = objects;
};
goog.inherits(Blockly.FieldOID, Blockly.Field);

/**
 * Point size of text.  Should match blocklyText's font-size in CSS.
 */
Blockly.FieldOID.FONTSIZE = 11;

/**
 * Mouse cursor style when over the hotspot that initiates the editor.
 */
Blockly.FieldOID.prototype.CURSOR = 'pointer';

/**
 * Allow browser to spellcheck this field.
 * @private
 */
Blockly.FieldOID.prototype.spellcheck_ = false;

/**
 * Close the input widget if this input is being deleted.
 */
Blockly.FieldOID.prototype.dispose = function() {
    Blockly.WidgetDiv.hideIfOwner(this);
    Blockly.FieldOID.superClass_.dispose.call(this);
};

/**
 * Set the text in this field.
 * @param {?string} text New text.
 * @override
 */
Blockly.FieldOID.prototype.setValue = function(text) {
    if (text === null) {
        return;  // No change if null.
    }
    
    Blockly.Field.prototype.setValue.call(this, text);
};

/**
 * Show the inline free-text editor on top of the text.
 * @param {boolean=} opt_quietInput True if editor should be created without
 *     focus.  Defaults to false.
 * @private
 */
Blockly.FieldOID.prototype.showEditor_ = function(opt_quietInput) {
    this.workspace_ = this.sourceBlock_.workspace;
    var that = this;
    this.oid_dialog.selectId('show', that.getValue(), function (newId) {
        that.setValue(newId);
    });
};

/**
 * Handle key down to the editor.
 * @param {!Event} e Keyboard event.
 * @private
 */
/*Blockly.FieldOID.prototype.onHtmlInputKeyDown_ = function(e) {
    var htmlInput = Blockly.FieldOID.htmlInput_;
    var tabKey = 9, enterKey = 13, escKey = 27;
    if (e.keyCode == enterKey) {
        Blockly.WidgetDiv.hide();
    } else if (e.keyCode == escKey) {
        htmlInput.value = htmlInput.defaultValue;
        Blockly.WidgetDiv.hide();
    } else if (e.keyCode == tabKey) {
        Blockly.WidgetDiv.hide();
        this.sourceBlock_.tab(this, !e.shiftKey);
        e.preventDefault();
    }
};*/

/**
 * Handle a change to the editor.
 * @param {!Event} e Keyboard event.
 * @private
 */
Blockly.FieldOID.prototype.onHtmlInputChange_ = function(e) {
    var htmlInput = Blockly.FieldOID.htmlInput_;
    // Update source block.
    var text = htmlInput.value;
    if (text !== htmlInput.oldValue_) {
        htmlInput.oldValue_ = text;
        this.setValue(text);
        this.validate_();
    } else if (goog.userAgent.WEBKIT) {
        // Cursor key.  Render the source block to show the caret moving.
        // Chrome only (version 26, OS X).
        this.sourceBlock_.render();
    }
    this.resizeEditor_();
    Blockly.svgResize(this.sourceBlock_.workspace);
};

/**
 * Update the text node of this field to display the current text.
 * @private
 */
Blockly.FieldOID.prototype.updateTextNode_ = function() {
    if (!this.textElement_) {
        // Not rendered yet.
        return;
    }
    var text = this.objects && this.objects[this.text_] && this.objects[this.text_].common && this.objects[this.text_].common.name ? this.objects[this.text_].common.name : this.text_;
    if (text.length > this.maxDisplayLength) {
        // Truncate displayed string and add an ellipsis ('...').
        text = text.substring(0, this.maxDisplayLength - 2) + '\u2026';
    }
    // Empty the text element.
    goog.dom.removeChildren(/** @type {!Element} */ (this.textElement_));
    // Replace whitespace with non-breaking spaces so the text doesn't collapse.
    text = text.replace(/\s/g, Blockly.Field.NBSP);
    if (this.sourceBlock_.RTL && text) {
        // The SVG is LTR, force text to be RTL.
        text += '\u200F';
    }
    if (!text) {
        // Prevent the field from disappearing if empty.
        text = Blockly.Field.NBSP;
    }
    var textNode = document.createTextNode(text);
    this.textElement_.appendChild(textNode);

    // Cached width is obsolete.  Clear it.
    this.size_.width = 0;
};

/**
 * Check to see if the contents of the editor validates.
 * Style the editor accordingly.
 * @private
 */
Blockly.FieldOID.prototype.validate_ = function() {
    var valid = true;

    goog.asserts.assertObject(Blockly.FieldOID.htmlInput_);

    var htmlInput = Blockly.FieldOID.htmlInput_;

    if (htmlInput.value) {
        Blockly.addClass_(htmlInput, 'blocklyInvalidInput');
    } else {
        Blockly.removeClass_(htmlInput, 'blocklyInvalidInput');
    }
};

/**
 * Resize the editor and the underlying block to fit the text.
 * @private
 */
Blockly.FieldOID.prototype.resizeEditor_ = function() {
    var div = Blockly.WidgetDiv.DIV;
    var bBox = this.fieldGroup_.getBBox();
    div.style.width = bBox.width * this.workspace_.scale + 'px';
    div.style.height = bBox.height * this.workspace_.scale + 'px';
    var xy = this.getAbsoluteXY_();
    // In RTL mode block fields and LTR input fields the left edge moves,
    // whereas the right edge is fixed.  Reposition the editor.
    if (this.sourceBlock_.RTL) {
        var borderBBox = this.getScaledBBox_();
        xy.x += borderBBox.width;
        xy.x -= div.offsetWidth;
    }
    // Shift by a few pixels to line up exactly.
    xy.y += 1;
    if (goog.userAgent.GECKO && Blockly.WidgetDiv.DIV.style.top) {
        // Firefox mis-reports the location of the border by a pixel
        // once the WidgetDiv is moved into position.
        xy.x -= 1;
        xy.y -= 1;
    }
    if (goog.userAgent.WEBKIT) {
        xy.y -= 3;
    }
    div.style.left = xy.x + 'px';
    div.style.top = xy.y + 'px';
};

/**
 * Close the editor, save the results, and dispose of the editable
 * text field's elements.
 * @return {!Function} Closure to call on destruction of the WidgetDiv.
 * @private
 */
Blockly.FieldOID.prototype.widgetDispose_ = function() {
    var thisField = this;
    return function() {
        var htmlInput = Blockly.FieldOID.htmlInput_;
        // Save the edit (if it validates).
        var text = htmlInput.value;
        thisField.setValue(text);
        thisField.sourceBlock_.rendered && thisField.sourceBlock_.render();
        Blockly.unbindEvent_(htmlInput.onKeyDownWrapper_);
        Blockly.unbindEvent_(htmlInput.onKeyUpWrapper_);
        Blockly.unbindEvent_(htmlInput.onKeyPressWrapper_);

        thisField.workspace_.removeChangeListener(
            htmlInput.onWorkspaceChangeWrapper_);

        Blockly.FieldOID.htmlInput_ = null;

        // Delete style properties.
        var style = Blockly.WidgetDiv.DIV.style;
        style.width = 'auto';
        style.height = 'auto';
        style.fontSize = '';
    };
};
