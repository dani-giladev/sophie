/*
 * This file is generated and updated by Sencha Cmd. You can edit this file as
 * needed for your application, but these edits will have to be merged by
 * Sencha Cmd when upgrading.
 */
Ext.application({
    name: 'App',

    extend: 'App.Application',

    requires: [
        'Ext.ux.form.MultiSelect',
        'Ext.ux.TabReorderer',
        'Ext.form.field.HtmlEditor',
        
        // Chart graphics requirements
        'Ext.draw.modifier.Highlight',
        'Ext.chart.CartesianChart',
        'Ext.chart.axis.Time',
        'Ext.chart.axis.Numeric',
        'Ext.chart.axis.Category',
        'Ext.chart.series.Line',
        'Ext.chart.series.Scatter',
        'Ext.chart.series.CandleStick',
        'Ext.chart.series.Bar',
        'Ext.chart.series.Pie',
        'Ext.chart.interactions.PanZoom',
        'Ext.chart.interactions.ItemHighlight',
        'Ext.chart.interactions.Crosshair',
        'Ext.chart.interactions.CrossZoom',
        'Ext.chart.interactions.Rotate',
        'Ext.chart.PolarChart',
        'Ext.chart.legend.Legend',
        
        // Exporter requirements
        'Ext.grid.plugin.Exporter',
        'Ext.exporter.text.CSV'
    ]//,

    // The name of the initial view to create. With the classic toolkit this class
    // will gain a "viewport" plugin if it does not extend Ext.Viewport. With the
    // modern toolkit, the main view will be added to the Viewport.
    //
    //mainView: 'App.view.main.Main'
	
    //-------------------------------------------------------------------------
    // Most customizations should be made to App.Application. If you need to
    // customize this file, doing so below this section reduces the likelihood
    // of merge conflicts when upgrading to new versions of Sencha Cmd.
    //-------------------------------------------------------------------------
});
