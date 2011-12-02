require(["dojo/_base/window", "dojo/dom", "dojo/dom-construct", "dojo/dom-style", "dojo/ready", "dojo/on", "dojo/query", 
		"dojox/charting/Chart", "dojox/charting/axis2d/Default", "dojox/charting/plot2d/ClusteredBars",
		"dojox/charting/plot2d/ClusteredColumns", "dojox/charting/plot2d/Default", "dojox/charting/plot2d/StackedAreas",
		"dojox/charting/plot2d/Bubble", "dojox/charting/plot2d/Candlesticks", "dojox/charting/plot2d/OHLC",
		"dojox/charting/plot2d/Pie"], 
		function(win, dom, domConstruct, domStyle, ready, on, query, Chart, Default, ClusteredBars,
			ClusteredColumns, Lines, StackedAreas, Bubble, Candlesticks, OHLC, Pie){
	
		var charts = {}, backgroundImage, backgroundColor, color, lastThemeName = "";
	
		function update(name){
			// change the theme based on the select change.
			var select = dom.byId("themeChooser"),
				usePageStyle = dom.byId("pageStyleChooser").checked;
	
			var test = false;
			if(name){
				//	make sure it's in the list first.
				for(var i=0, l=select.options.length; i<l; i++){
					if(select.options[i].value == name){
						select.options[i].selected = true;
						test = true;
						break;
					}
				}
			}
	
			if(!test){
				name = select.options[select.selectedIndex].value;
			}
			
			require(["dojox/charting/themes/" + name.replace(".", "/")], function(theme){
	
				var chartStyle = theme.chart;
		
				// set the suggested page style
				if(usePageStyle && chartStyle.pageStyle){
					domStyle.set(win.body(), chartStyle.pageStyle);
				}else{
					domStyle.set(win.body(), {
						backgroundColor: backgroundColor,
						backgroundImage: backgroundImage,
						color: color
					});
				}
				// set the theme
				if(lastThemeName != name){
					lastThemeName = name;
					if(theme){
						for(var chartName in charts){
							charts[chartName].setTheme(theme).render();
						}
					}
				}
			});
		}
	
		function init(){
			// retrieve initial values for fg/bg
			backgroundImage = domStyle.get(win.body(), "backgroundImage");
			backgroundColor = domStyle.get(win.body(), "backgroundColor");
			color = domStyle.get(win.body(), "color");
	
			charts.bars = new Chart("bars").
				addAxis("y", {fixLower: "minor", fixUpper: "minor", natural: true}).
				addAxis("x", {vertical: true, fixLower: "major", fixUpper: "major", includeZero: true}).
				addPlot("default", {type: ClusteredBars, gap: 5}).
				addSeries("Series A", [0.53, 0.51]).
				addSeries("Series B", [0.84, 0.79]).
				addSeries("Series C", [0.68, 0.95]).
				addSeries("Series D", [0.77, 0.66]);
	
			charts.columns = new Chart("columns").
				addAxis("x", {fixLower: "minor", fixUpper: "minor", natural: true}).
				addAxis("y", {vertical: true, fixLower: "major", fixUpper: "major", includeZero: true}).
				addPlot("default", {type: ClusteredColumns, gap: 5}).
				addSeries("Series A", [0.53, 0.51]).
				addSeries("Series B", [0.84, 0.79]).
				addSeries("Series C", [0.68, 0.95]).
				addSeries("Series D", [0.77, 0.66]);
	
			charts.lines = new Chart("lines").
				addAxis("x", {min: 0, max: 6, fixLower: "minor", fixUpper: "minor", natural: true}).
				addAxis("y", {vertical: true, fixLower: "major", fixUpper: "major", includeZero: true, max: 1}).
				addPlot("default", {type: Lines, lines: true, markers: true, tension: "X"}).
				addSeries("Series A", [{x: 0.5, y: 0.2}, {x: 1.5, y: 0.4}, {x: 2.0, y: 0.1}, {x: 5.0, y: 0.9}]).
				addSeries("Series B", [{x: 0.3, y: 0.6}, {x: 3.0, y: 0.5}, {x: 4.0, y: 0.9}, {x: 5.5, y: 0.7}]).
				addSeries("Series C", [{x: 0.8, y: 0.8}, {x: 3.4, y: 0.2}, {x: 5.3, y: 0.3}]).
				addSeries("Series D", [{x: 0.6, y: 0.9}, {x: 3.2, y: 0.8}, {x: 5.0, y: 0.1}]);
	
			charts.pieFan = new Chart("pieFan").
				addPlot("default", {type: Pie, radius: 60, labelOffset: -20, radGrad: dojox.gfx.renderer == "vml" ? "fan" : "native"}).
				addSeries("Series A", [0.35, 0.25, 0.42, 0.53, 0.69]);
	
			charts.bubbles = new Chart("bubbles").
				addAxis("x", {min: 0, max: 6, fixLower: "minor", fixUpper: "minor", natural: true}).
				addAxis("y", {vertical: true, fixLower: "major", fixUpper: "major", includeZero: true}).
				addPlot("default", {type: Bubble}).
				addSeries("Series A", [{x: 0.5, y: 5.0, size: 1.4}, {x: 1.5, y: 1.5, size: 4.5}, {x: 2.0, y: 9.0, size: 1.5}, {x: 5.0, y: 0.3, size: 0.8}]).
				addSeries("Series B", [{x: 0.3, y: 8.0, size: 2.5}, {x: 4.0, y: 6.0, size: 2.1}, {x: 5.5, y: 2.0, size: 3.2}]).
				addSeries("Series C", [{x: 2.0, y: 5.5, size: 2.5}, {x: 3.5, y: 2.5, size: 3.5}, {x: 5.2, y: 7.0, size: 3.0}]).
				addSeries("Series D", [{x: 3.2, y: 8.0, size: 2.0}]);
	
			charts.area = new Chart("area").
				addAxis("x", {fixLower: "major", fixUpper: "major"}).
				addAxis("y", {vertical: true, fixLower: "major", fixUpper: "major", min: 0}).
				addPlot("default", {type: StackedAreas, tension: "X"}).
				addSeries("Series A", [-2, 1.1, 1.2, 1.3, 1.4, 1.5, -1.6]).
				addSeries("Series B", [1, 1.6, 1.3, 1.4, 1.1, 1.5, 1.1]).
				addSeries("Series C", [1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6]);
	
			charts.pieLin = new Chart("pieLin").
				addPlot("default", {type: Pie, radius: 60, labelOffset: -20, radGrad: "linear"}).
				addSeries("Series A", [0.35, 0.25, 0.42, 0.53, 0.69]);
	
			charts.candle = new Chart("candle").
				addPlot("default", {type: Candlesticks, gap: 1}).
				addAxis("x", {fixLower: "major", fixUpper: "major", includeZero: true}).
				addAxis("y", {vertical: true, fixLower: "major", fixUpper: "major", natural: true}).
				addSeries("Series A", [
					{ open: 20, close: 16, high: 22, low: 8 },
					{ open: 16, close: 22, high: 26, low: 6, mid: 18 },
					{ open: 22, close: 18, high: 22, low: 11, mid: 21 },
					{ open: 18, close: 29, high: 32, low: 14, mid: 27 },
					{ open: 29, close: 24, high: 29, low: 13, mid: 27 },
					{ open: 24, close: 8, high: 24, low: 5 },
					{ open: 8, close: 16, high: 22, low: 2 },
					{ open: 16, close: 12, high: 19, low: 7 },
					{ open: 12, close: 20, high: 22, low: 8 },
					{ open: 20, close: 16, high: 22, low: 8 },
					{ open: 16, close: 22, high: 26, low: 6, mid: 18 },
					{ open: 22, close: 18, high: 22, low: 11, mid: 21 },
					{ open: 18, close: 29, high: 32, low: 14, mid: 27 },
					{ open: 29, close: 24, high: 29, low: 13, mid: 27 },
					{ open: 24, close: 8, high: 24, low: 5 },
					{ open: 8, close: 16, high: 22, low: 2 },
					{ open: 16, close: 12, high: 19, low: 7 },
					{ open: 12, close: 20, high: 22, low: 8 },
					{ open: 20, close: 16, high: 22, low: 8 },
					{ open: 16, close: 22, high: 26, low: 6 },
					{ open: 22, close: 18, high: 22, low: 11 },
					{ open: 18, close: 29, high: 32, low: 14 },
					{ open: 29, close: 24, high: 29, low: 13 },
					{ open: 24, close: 8, high: 24, low: 5 },
					{ open: 8, close: 16, high: 22, low: 2 },
					{ open: 16, close: 12, high: 19, low: 7 },
					{ open: 12, close: 20, high: 22, low: 8 },
					{ open: 20, close: 16, high: 22, low: 8 }]);
			charts.ohlc = new Chart("ohlc").
				addPlot("default", {type: OHLC, gap: 1}).
				addAxis("x", {fixLower: "major", fixUpper: "major", includeZero: true}).
				addAxis("y", {vertical: true, fixLower: "major", fixUpper: "major", natural: true}).
				addSeries("Series A", [
					{ open: 20, close: 16, high: 22, low: 8 },
					{ open: 16, close: 22, high: 26, low: 6 },
					{ open: 22, close: 18, high: 22, low: 11 },
					{ open: 18, close: 29, high: 32, low: 14 },
					{ open: 29, close: 24, high: 29, low: 13 },
					{ open: 24, close: 8, high: 24, low: 5 },
					{ open: 8, close: 16, high: 22, low: 2 },
					{ open: 16, close: 12, high: 19, low: 7 },
					{ open: 12, close: 20, high: 22, low: 8 },
					{ open: 20, close: 16, high: 22, low: 8 },
					{ open: 16, close: 22, high: 26, low: 6 },
					{ open: 22, close: 18, high: 22, low: 11 },
					{ open: 18, close: 29, high: 32, low: 14 },
					{ open: 29, close: 24, high: 29, low: 13 },
					{ open: 24, close: 8, high: 24, low: 5 },
					{ open: 8, close: 16, high: 22, low: 2 },
					{ open: 16, close: 12, high: 19, low: 7 },
					{ open: 12, close: 20, high: 22, low: 8 },
					{ open: 20, close: 16, high: 22, low: 8 },
					{ open: 16, close: 22, high: 26, low: 6 },
					{ open: 22, close: 18, high: 22, low: 11 },
					{ open: 18, close: 29, high: 32, low: 14 },
					{ open: 29, close: 24, high: 29, low: 13 },
					{ open: 24, close: 8, high: 24, low: 5 },
					{ open: 8, close: 16, high: 22, low: 2 },
					{ open: 16, close: 12, high: 19, low: 7 },
					{ open: 12, close: 20, high: 22, low: 8 },
					{ open: 20, close: 16, high: 22, low: 8 }]);
		var name;
		if(window.location.search.indexOf("?")>-1){
			name = window.location.search.substring(1);
			domConstruct.create("span", {
				style: "display: inline-block; margin-left: 1em;",
				innerHTML: '<a href="theme_preview-amd.html">Back to the Theme Previewer &raquo;&raquo;</a>'
			}, query("p.controls")[0]);
		}

		update(name);

		on(dom.byId("themeChooser"), "change", update);
		on(dom.byId("pageStyleChooser"), "click", update);
	}
		
	ready(init);
});