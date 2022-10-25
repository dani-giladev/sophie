Ext.define('App.view.msgBox', {
    extend: 'Ext.window.Window',
    xtype: 'msgBox',
    alias: 'widget.msgBox',
    
    modal: true,
    width: 500,
    height: 300,
    resizable: false,       
    header: false, 
    frame: false,
    border: true,
    renderTo: Ext.getBody(),
    layout: 'border',
    
    title: '',
    msg: '',
    enabledCancelButton: false,
    accept: false,
    textAcceptButton: 'Accept',
    textCancelButton: 'Cancel',
    
    initComponent: function() 
    {
        var me = this;
        
        this.items = 
        [
            {
                xpanel: 'panel',
                region: 'north',
                layout: 'hbox',
                width: '100%',
                height: 50, 
                frame: false,
                border: false,
                items:
                [
                    {
                        xtype: 'label',
                        html: me.title,
                        width: '100%',
                        height: 50,
                        border: true,
                        padding: '15 0 0 10',
                        style: {
                            'background': 'lightskyblue',
                            'color': 'white',
                            'font-size': '20px'
                        }
                    }
                ]
            },
            {
                xtype: 'panel',
                region: 'center',
                width: '100%',
                height: '100%',
                border: false,
                frame: false,
                layout: {
                    type: 'vbox',
                    align: 'center',
                    pack: 'center'
                }, 
                items:
                [
                    {
                        xtype: 'label',
                        html: me.msg,
                        width: '100%',
                        style: {
                            'text-align': 'center',
                            'font-size': '25px',
                            padding: '5px',
                            'line-height': '150%'
                        }
                    }
                ]
            },
            {
                xpanel: 'panel',
                region: 'south',
                layout: 'hbox',
                width: '100%',
                height: 50, 
                frame: false,
                border: false,
                defaults: {
                    flex: 1,
                    xtype: 'button',
                    width: '100%',
                    height: '100%'
                },
                items:
                [
                    {
                        html: '<span class="button-std">'+ me.textAcceptButton + '</span>',
                        handler: function(){
                            me.accept = true;
                            me.close();
                        }
                    },
                    {
                        html: '<span class="button-std">'+ me.textCancelButton + '</span>',
                        hidden: !me.enabledCancelButton,
                        handler: function(){
                            me.close();
                        }
                    }
                ]
            }
        ];

        this.callParent(arguments);
    }
});