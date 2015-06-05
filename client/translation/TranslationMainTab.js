/*
 * Copyright (c) 2014 - Copyright holders CIRSFID and Department of
 * Computer Science and Engineering of the University of Bologna
 *
 * Authors:
 * Monica Palmirani – CIRSFID of the University of Bologna
 * Fabio Vitali – Department of Computer Science and Engineering of the University of Bologna
 * Luca Cervone – CIRSFID of the University of Bologna
 *
 * Permission is hereby granted to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The Software can be used by anyone for purposes without commercial gain,
 * including scientific, individual, and charity purposes. If it is used
 * for purposes having commercial gains, an agreement with the copyright
 * holders is required. The above copyright notice and this permission
 * notice shall be included in all copies or substantial portions of the
 * Software.
 *
 * Except as contained in this notice, the name(s) of the above copyright
 * holders and authors shall not be used in advertising or otherwise to
 * promote the sale, use or other dealings in this Software without prior
 * written authorization.
 *
 * The end-user documentation included with the redistribution, if any,
 * must include the  acknowledgment: "This product includes
 * software developed by University of Bologna (CIRSFID and Department of
 * Computer Science and Engineering) and its authors (Monica Palmirani,
 * Fabio Vitali, Luca Cervone)", in the same place and form as other
 * third-party acknowledgments. Alternatively, this acknowledgment may
 * appear in the software itself, in the same form and location as other
 * such third-party acknowledgments.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 * CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISEfollowing, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

Ext.define('LIME.ux.translation.TranslationMainTab', {
    extend: 'Ext.panel.Panel',
    requires : ['Ext.ux.IFrame'],
    controller: 'translationMainTabController',
    alias: 'widget.translationMainTab',

    cls: 'editorTab',
    notEditMode: true,

    width: '100%',
    padding: 0,
    margin: 0,
    border: 0,
    layout: {
        type: 'vbox',
        align : 'stretch',
        pack  : 'start',
    },

    items: [{
        xtype: 'uxiframe',
        src: 'languagesPlugins/akoma3.0/client/translation/iframe/index.html',
        flex: 1,
        listeners: {
            'load': function () {
                // Export window Translator object
                var mainCmp = this.up('translationMainTab'),
                    win = this.getWin(),
                    Translator = win.Translator;
                mainCmp.fireEvent('ready', Translator);
                Translator.contextMenuCallback = mainCmp.onContextMenu.bind(mainCmp);
                Translator.focusCallback = mainCmp.onFocus.bind(mainCmp);
            }
        }
    }, {
        xtype: 'menu',
        hidden: true,
        items: [{
            text: 'Translated',
            handler: function () {
                this.up('translationMainTab').fireEvent('updateItem', this.up().focusedItem, 'translated');
            }
        },{
            text: 'Not translated',
            handler: function () {
                this.up('translationMainTab').fireEvent('updateItem', this.up().focusedItem, 'todo');
            }
        },{
            text: 'Pending',
            handler: function () {
                this.up('translationMainTab').fireEvent('updateItem', this.up().focusedItem, 'pending');
            }
        }]
    }, {
        xtype: 'grid',
        height: 150,
        title: 'Proposed translations',
        store: 'proposedTranslationsStore',
        columns: [
            { text: '#',  dataIndex: 'pos' },
            { text: 'Proposed translation', dataIndex: 'translation', flex: 3 },
            { text: 'Usage statistics', dataIndex: 'stats', flex: 1 }
        ],
        bbar: [
            { 
                xtype: 'button', 
                text: 'Use selected translation',
                handler: function () {
                    try {
                        var selection = this.up('grid').getSelectionModel().getSelection();
                        var translation = selection[0].get('translation');
                        this.up('translationMainTab').fireEvent('useProposed', translation);
                    } catch (e) {
                        console.log('Nothing was selected');
                    }
                }
            }
        ]
    }],

    dockedItems: [{
        xtype: 'widget.simplepagingtoolbar'
    }],

    initComponent: function () {
        this.title = Locale.getString('tabTitle', 'translation');
        this.callParent(arguments);
    },

    onContextMenu: function (id, screenX, screenY) {
        this.down('menu').focusedItem = parseInt(id)
        this.down('menu').showAt(screenX, screenY);
        var me = this;
    },

    onFocus: function (id) {
        this.down('pagingtoolbar').moveTo(id+1);
    }
});
