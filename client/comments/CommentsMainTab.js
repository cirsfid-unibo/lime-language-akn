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

Ext.define('LIME.ux.comments.CommentsMainTab', {
    extend : 'Ext.panel.Panel',

    alias : 'widget.commentsMainTab',

    cls : 'editorTab',
    
    notEditMode : true,

    width : '100%',
    padding : 0,
    margin : 0,
    border : 0,
    autoScroll: true,
    layout : {
        type : 'vbox',
        padding : '0',
        align : 'stretch'
    },

    items: [{
        xtype: 'container',
        cls: 'akomantosoViewer',
        listeners: {
            afterrender: function(cmp){
                // Add contextmenu event to the view
                cmp.getEl().on('contextmenu', function(e) {
                    cmp.fireEvent('contextmenu', cmp, e);
                });
                cmp.getEl().on('click', function(e) {
                    cmp.fireEvent('click', cmp, e);
                });
            }
        }
    }],

    initComponent: function () {
        this.title = Locale.getString('tabTitle', 'comments');
        this.closable = false;
        this.callParent(arguments);
    },

    setContent: function (html) {
        this.down('container').update(html);
    },

    getContentDom: function(extNode) {
        var node = this.down('container').el.down('.x-autocontainer-innerCt');
        return (extNode) ? node : node.dom;
    }
});
