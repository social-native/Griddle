(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("React"), require("_"));
	else if(typeof define === 'function' && define.amd)
		define(["React", "_"], factory);
	else if(typeof exports === 'object')
		exports["GriddleWithCallback"] = factory(require("React"), require("_"));
	else
		root["GriddleWithCallback"] = factory(root["React"], root["_"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var React = __webpack_require__(1);
	var _ = __webpack_require__(2);
	var Griddle = __webpack_require__(3);

	var GriddleWithCallback = createReactClass({displayName: "GriddleWithCallback",
		getDefaultProps: function(){
			return {
				getExternalResults: null,
				resultsPerPage: 5,
				loadingComponent: null,
				enableInfiniteScroll: false
			}
		},
	    getInitialState: function(){
	      var initial = { "results": [],
	          "page": 0,
	          "maxPage": 0,
	          "sortColumn":null,
	          "sortAscending":true
	      };

		  // If we need to get external results, grab the results.
		  initial.isLoading = true; // Initialize to 'loading'

	      return initial;
	    },
	    componentDidMount: function(){
				var state = this.state;
				state.pageSize = this.props.resultsPerPage;

				var that = this;

				if (!this.hasExternalResults()) {
					console.error("When using GriddleWithCallback, a getExternalResults callback must be supplied.");
					return;
				}

				// Update the state with external results when mounting
				state = this.updateStateWithExternalResults(state, function(updatedState) {
					that.setState(updatedState);
				});
	    },
		componentWillReceiveProps: function(nextProps) {
			var state = this.state,
			that = this;

			// Update the state with external results.
			state = this.updateStateWithExternalResults(state, function(updatedState) {
				that.setState(updatedState);
			});
		},
	    setPage: function(index, pageSize){
	        //This should interact with the data source to get the page at the given index
			var that = this;
			var state = {
				page: index,
				pageSize: setDefault(pageSize, this.state.pageSize)
			};

			this.updateStateWithExternalResults(state, function(updatedState) {
				that.setState(updatedState);
			});
	    },
		getExternalResults: function(state, callback) {
			var filter,
			sortColumn,
			sortAscending,
			page,
			pageSize;

			// Fill the search properties.
			if (state !== undefined && state.filter !== undefined) {
				filter = state.filter;
			} else {
				filter = this.state.filter;
			}

			if (state !== undefined && state.sortColumn !== undefined) {
				sortColumn = state.sortColumn;
			} else {
				sortColumn = this.state.sortColumn;
			}

			sortColumn = _.isEmpty(sortColumn) ? this.props.initialSort : sortColumn;

			if (state !== undefined && state.sortAscending !== undefined) {
				sortAscending = state.sortAscending;
			} else {
				sortAscending = this.state.sortAscending;
			}

			if (state !== undefined && state.page !== undefined) {
				page = state.page;
			} else {
				page = this.state.page;
			}

			if (state !== undefined && state.pageSize !== undefined) {
				pageSize = state.pageSize;
			} else {
				pageSize = this.state.pageSize;
			}

			// Obtain the results
			this.props.getExternalResults(filter, sortColumn, sortAscending, page, pageSize, callback);
		},
		updateStateWithExternalResults: function(state, callback) {
			var that = this;

			// Update the table to indicate that it's loading.
			this.setState({ isLoading: true });
			// Grab the results.
			this.getExternalResults(state, function(externalResults) {
				// Fill the state result properties
				if (that.props.enableInfiniteScroll && that.state.results) {
					state.results = that.state.results.concat(externalResults.results);
				} else {
					state.results = externalResults.results;
				}

				state.totalResults = externalResults.totalResults;
				state.maxPage = that.getMaxPage(externalResults.pageSize, externalResults.totalResults);
				state.isLoading = false;

				// If the current page is larger than the max page, reset the page.
				if (state.page >= state.maxPage) {
					state.page = state.maxPage - 1;
				}

				callback(state);
			});
		},
		getMaxPage: function(pageSize, totalResults){
				if (!totalResults) {
					totalResults = this.state.totalResults;
				}

				var maxPage = Math.ceil(totalResults / pageSize);
				return maxPage;
		},
		hasExternalResults: function() {
			return typeof(this.props.getExternalResults) === 'function';
		},
	    changeSort: function(sort, sortAscending){
	    	var that = this;
	      //this should change the sort for the given column
			var state = {
				page:0,
				sortColumn: sort,
				sortAscending: sortAscending
			};

			this.updateStateWithExternalResults(state, function(updatedState) {
				that.setState(updatedState);
			});
	    },
	    setFilter: function(filter){
	      /*
	        like everything else -- this is pretend code used to simulate something that we would do on the
	        server-side (aka we would generally post the filter as well as other information used to populate
	        the grid) and send back to the view (which would handle passing the data back to Griddle)
	      */
				var that = this;

				var state = {
					page: 0,
					filter: filter
				}

				this.updateStateWithExternalResults(state, function(updatedState) {
					//if filter is null or undefined reset the filter.
					if (_.isUndefined(filter) || _.isNull(filter) || _.isEmpty(filter)){
						updatedState.filter = filter;
						updatedState.filteredResults = null;
					}

					// Set the state.
					that.setState(updatedState);
				});
	    },
	    setPageSize: function(size){
				this.setPage(0, size);
	    },
	    render: function(){
				return React.createElement(Griddle, React.__spread({},  this.props, {useExternal: true, externalSetPage: this.setPage, 
					externalChangeSort: this.changeSort, externalSetFilter: this.setFilter, 
					externalSetPageSize: this.setPageSize, externalMaxPage: this.state.maxPage, 
					externalCurrentPage: this.state.page, results: this.state.results, tableClassName: "table", resultsPerPage: this.state.pageSize, 
					externalSortColumn: this.state.sortColumn, externalSortAscending: this.state.sortAscending, 
					externalLoadingComponent: this.props.loadingComponent, externalIsLoading: this.state.isLoading}))
		  }
	});

	module.exports = GriddleWithCallback;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */

	/*
	   Griddle - Simple Grid Component for React
	   https://github.com/DynamicTyped/Griddle
	   Copyright (c) 2014 Ryan Lanciaux | DynamicTyped

	   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
	*/
	var React = __webpack_require__(1);
	var GridTable = __webpack_require__(4);
	var GridFilter = __webpack_require__(5);
	var GridPagination = __webpack_require__(6);
	var GridSettings = __webpack_require__(7);
	var GridTitle = __webpack_require__(8);
	var GridNoData = __webpack_require__(9);
	var CustomRowComponentContainer = __webpack_require__(10);
	var CustomPaginationContainer = __webpack_require__(11);
	var _ = __webpack_require__(2);

	var Griddle = createReactClass({displayName: 'Griddle',
	    getDefaultProps: function() {
	        return{
	            "columns": [],
	            "columnMetadata": [],
	            "resultsPerPage":5,
	            "results": [], // Used if all results are already loaded.
	            "initialSort": "",
	            "initialSortAscending": true,
	            "gridClassName":"",
	            "tableClassName":"",
	            "customRowComponentClassName":"",
	            "settingsText": "Settings",
	            "filterPlaceholderText": "Filter Results",
	            "nextText": "Next",
	            "previousText": "Previous",
	            "maxRowsText": "Rows per page",
	            "enableCustomFormatText": "Enable Custom Formatting",
	            //this column will determine which column holds subgrid data
	            //it will be passed through with the data object but will not be rendered
	            "childrenColumnName": "children",
	            //Any column in this list will be treated as metadata and will be passed through with the data but won't be rendered
	            "metadataColumns": [],
	            "showFilter": false,
	            "showSettings": false,
	            "useCustomRowComponent": false,
	            "useCustomGridComponent": false,
	            "useCustomPagerComponent": false,
	            "useGriddleStyles": true,
	            "useGriddleIcons": true,
	            "customRowComponent": null,
	            "customGridComponent": null,
	            "customPagerComponent": {},
	            "enableToggleCustom":false,
	            "noDataMessage":"There is no data to display.",
	            "customNoDataComponent": null,
	            "showTableHeading":true,
	            "showPager":true,
	            "useFixedHeader":false,
	            "useExternal": false,
	            "externalSetPage": null,
	            "externalChangeSort": null,
	            "externalSetFilter": null,
	            "externalSetPageSize":null,
	            "externalMaxPage":null,
	            "externalCurrentPage": null,
	            "externalSortColumn": null,
	            "externalSortAscending": true,
	            "externalLoadingComponent": null,
	            "externalIsLoading": false,
	            "enableInfiniteScroll": false,
	            "bodyHeight": null,
	            "infiniteScrollSpacerHeight": 50,
	            "useFixedLayout": true,
	            "isSubGriddle": false,
	            "enableSort": true,
	            /* css class names */
	            "sortAscendingClassName": "sort-ascending",
	            "sortDescendingClassName": "sort-descending",
	            "parentRowCollapsedClassName": "parent-row",
	            "parentRowExpandedClassName": "parent-row expanded",
	            "settingsToggleClassName": "settings",
	            "nextClassName": "griddle-next",
	            "previousClassName": "griddle-previous",
	            /* icon components */
	            "sortAscendingComponent": " ▲",
	            "sortDescendingComponent": " ▼",
	            "parentRowCollapsedComponent": "▶",
	            "parentRowExpandedComponent": "▼",
	            "settingsIconComponent": "",
	            "nextIconComponent": "",
	            "previousIconComponent":""
	        };
	    },
	    /* if we have a filter display the max page and results accordingly */
	    setFilter: function(filter) {
	        if(this.props.useExternal) {
	            this.props.externalSetFilter(filter);
	            return;
	        }

	        var that = this,
	        updatedState = {
	            page: 0,
	            filter: filter
	        };

	        // Obtain the state results.
	       updatedState.filteredResults = _.filter(this.props.results,
	       function(item) {
	            var arr = _.values(item);
	            for(var i = 0; i < arr.length; i++){
	               if ((arr[i]||"").toString().toLowerCase().indexOf(filter.toLowerCase()) >= 0){
	                return true;
	               }
	            }

	            return false;
	        });

	        // Update the max page.
	        updatedState.maxPage = that.getMaxPage(updatedState.filteredResults);

	        //if filter is null or undefined reset the filter.
	        if (_.isUndefined(filter) || _.isNull(filter) || _.isEmpty(filter)){
	            updatedState.filter = filter;
	            updatedState.filteredResults = null;
	        }

	        // Set the state.
	        that.setState(updatedState);
	    },
	    setPageSize: function(size){
	        if(this.props.useExternal) {
	            this.props.externalSetPageSize(size);
	            return;
	        }

	        //make this better.
	        this.props.resultsPerPage = size;
	        this.setMaxPage();
	    },
	    toggleColumnChooser: function(){
	        this.setState({
	            showColumnChooser: !this.state.showColumnChooser
	        });
	    },
	    toggleCustomComponent: function(){
	        if(this.state.customComponentType === "grid"){
	            this.setProps({
	                useCustomGridComponent: !this.props.useCustomGridComponent
	            });
	        } else if(this.state.customComponentType === "row"){
	            this.setProps({
	                useCustomRowComponent: !this.props.useCustomRowComponent
	            });
	        }
	    },
	    getMaxPage: function(results, totalResults){
	        if(this.props.useExternal){
	          return this.props.externalMaxPage;
	        }

	        if (!totalResults) {
	          totalResults = (results||this.getCurrentResults()).length;
	        }
	        var maxPage = Math.ceil(totalResults / this.props.resultsPerPage);
	        return maxPage;
	    },
	    setMaxPage: function(results){
	        var maxPage = this.getMaxPage(results);
	        //re-render if we have new max page value
	        if (this.state.maxPage !== maxPage){
	          this.setState({page: 0, maxPage: maxPage, filteredColumns: this.props.columns });
	        }
	    },
	    setPage: function(number) {
	        if(this.props.useExternal) {
	            this.props.externalSetPage(number);
	            return;
	        }

	        //check page size and move the filteredResults to pageSize * pageNumber
	        if (number * this.props.resultsPerPage <= this.props.resultsPerPage * this.state.maxPage) {
	            var that = this,
	                state = {
	                    page: number
	                };

	                that.setState(state);
	        }
	    },
	    getColumns: function(){
	        var that = this;
	        var results = this.getCurrentResults();

	        //if we don't have any data don't mess with this
	        if (results === undefined || results.length === 0){ return [];}

	        var result = this.state.filteredColumns;

	        //if we didn't set default or filter
	        if (this.state.filteredColumns.length === 0){

	            var meta = [].concat(this.props.metadataColumns);

	            if(meta.indexOf(this.props.childrenColumnName) < 0){
	                meta.push(this.props.childrenColumnName);
	            }
	            result =  _.keys(_.omit(results[0], meta));
	        }


	        result = _.sortBy(result, function(item){
	            var metaItem = _.findWhere(that.props.columnMetadata, {columnName: item});

	            if (typeof metaItem === 'undefined' || metaItem === null || isNaN(metaItem.order)){
	                return 100;
	            }

	            return metaItem.order;
	        });

	        return result;
	    },
	    setColumns: function(columns){
	        columns = _.isArray(columns) ? columns : [columns];
	        this.setState({
	            filteredColumns: columns
	        });
	    },
	    nextPage: function() {
	        currentPage = this.getCurrentPage();
	        if (currentPage < this.getCurrentMaxPage() - 1) { this.setPage(currentPage + 1); }
	    },
	    previousPage: function() {
	      currentPage = this.getCurrentPage();
	        if (currentPage > 0) { this.setPage(currentPage - 1); }
	    },
	    changeSort: function(sort){
	        if(this.props.enableSort === false){ return; }
	        if(this.props.useExternal) {
	            this.props.externalChangeSort(sort, this.props.externalSortColumn === sort ? !this.props.externalSortAscending : true);
	            return;
	        }

	        var that = this,
	            state = {
	                page:0,
	                sortColumn: sort,
	                sortAscending: true
	            };

	        // If this is the same column, reverse the sort.
	        if(this.state.sortColumn == sort){
	            state.sortAscending = !this.state.sortAscending;
	        }

	        this.setState(state);
	    },
	    componentWillReceiveProps: function(nextProps) {
	        this.setMaxPage(nextProps.results);
	    },
	    getInitialState: function() {
	        var state =  {
	            maxPage: 0,
	            page: 0,
	            filteredResults: null,
	            filteredColumns: [],
	            filter: "",
	            sortColumn: this.props.initialSort,
	            sortAscending: this.props.initialSortAscending,
	            showColumnChooser: false
	        };

	        return state;
	    },
	    componentWillMount: function() {
	        this.verifyExternal();
	        this.verifyCustom();
	        this.setMaxPage();
	        //don't like the magic strings
	        if(this.props.useCustomGridComponent === true){
	            this.setState({
	                 customComponentType: "grid"
	            });
	        } else if(this.props.useCustomRowComponent === true){
	            this.setState({
	                customComponentType: "row"
	            });
	        } else {
	          this.setState({
	            filteredColumns: this.props.columns
	          })
	        }

	    },
	    //todo: clean these verify methods up
	    verifyExternal: function(){
	        if(this.props.useExternal === true){
	            //hooray for big ugly nested if
	            if(this.props.externalSetPage === null){
	                console.error("useExternal is set to true but there is no externalSetPage function specified.");
	            }

	            if(this.props.externalChangeSort === null){
	                console.error("useExternal is set to true but there is no externalChangeSort function specified.");
	            }

	            if(this.props.externalSetFilter === null){
	                console.error("useExternal is set to true but there is no externalSetFilter function specified.");
	            }

	            if(this.props.externalSetPageSize === null){
	                console.error("useExternal is set to true but there is no externalSetPageSize function specified.");
	            }

	            if(this.props.externalMaxPage === null){
	                console.error("useExternal is set to true but externalMaxPage is not set.");
	            }

	            if(this.props.externalCurrentPage === null){
	                console.error("useExternal is set to true but externalCurrentPage is not set. Griddle will not page correctly without that property when using external data.");
	            }
	        }
	    },
	    verifyCustom: function(){
	        if(this.props.useCustomGridComponent === true && this.props.customGridComponent === null){
	            console.error("useCustomGridComponent is set to true but no custom component was specified.")
	        }
	        if (this.props.useCustomRowComponent === true && this.props.customRowComponent === null){
	            console.error("useCustomRowComponent is set to true but no custom component was specified.")
	        }
	        if(this.props.useCustomGridComponent === true && this.props.useCustomRowComponent === true){
	            console.error("Cannot currently use both customGridComponent and customRowComponent.");
	        }
	    },
	    getDataForRender: function(data, cols, pageList){
	        var that = this;
	            //get the correct page size
	            if(this.state.sortColumn !== "" || this.props.initialSort !== ""){
	                data = _.sortBy(data, function(item){
	                    return item[that.state.sortColumn||that.props.initialSort];
	                });

	                if(this.state.sortAscending === false){
	                    data.reverse();
	                }
	            }

	            var currentPage = this.getCurrentPage();

	            if (!this.props.useExternal && pageList && (this.props.resultsPerPage * (currentPage+1) <= this.props.resultsPerPage * this.state.maxPage) && (currentPage >= 0)) {
	                if (this.isInfiniteScrollEnabled()) {
	                  // If we're doing infinite scroll, grab all results up to the current page.
	                  data = _.first(data, (currentPage + 1) * this.props.resultsPerPage);
	                } else {
	                  //the 'rest' is grabbing the whole array from index on and the 'initial' is getting the first n results
	                  var rest = _.rest(data, currentPage * this.props.resultsPerPage);
	                  data = _.initial(rest, rest.length-this.props.resultsPerPage);
	                }
	            }
	        var meta = [].concat(this.props.metadataColumns);
	        if (meta.indexOf(this.props.childrenColumnName) < 0){
	            meta.push(this.props.childrenColumnName);
	        }

	        var transformedData = [];

	        for(var i = 0; i<data.length; i++){
	            var mappedData = _.pick(data[i], cols.concat(meta));

	            if(typeof mappedData[that.props.childrenColumnName] !== "undefined" && mappedData[that.props.childrenColumnName].length > 0){
	                //internally we're going to use children instead of whatever it is so we don't have to pass the custom name around
	                mappedData["children"] = that.getDataForRender(mappedData[that.props.childrenColumnName], cols, false);

	                if(that.props.childrenColumnName !== "children") { delete mappedData[that.props.childrenColumnName]; }
	            }

	            transformedData.push(mappedData);
	        }

	        return transformedData;
	    },
	    //this is the current results
	    getCurrentResults: function(){
	      return this.state.filteredResults || this.props.results;
	    },
	    getCurrentPage: function(){
	      return this.props.externalCurrentPage||this.state.page;
	    },
	    getCurrentSort: function(){
	        return this.props.useExternal ? this.props.externalSortColumn : this.state.sortColumn;
	    },
	    getCurrentSortAscending: function(){
	        return this.props.useExternal ? this.props.externalSortAscending : this.state.sortAscending;
	    },
	    getCurrentMaxPage: function(){
	        return this.props.useExternal ? this.props.externalMaxPage : this.state.maxPage;
	    },
	    isInfiniteScrollEnabled: function(){
	      // If a custom pager is included, don't allow for infinite scrolling.
	      if (this.props.useCustomPagerComponent) {
	        return false;
	      }

	      // Otherwise, send back the property.
	      return this.props.enableInfiniteScroll;
	    },
	    render: function() {
	        var clearFix = {
	                    clear: "both",
	                    display: "table",
	                    width: "100%"
	        };

	        var that = this,
	            results = this.getCurrentResults();  // Attempt to assign to the filtered results, if we have any.

	        var headerTableClassName = this.props.tableClassName + " table-header";

	        //figure out if we want to show the filter section
	        var filter = (this.props.showFilter && this.props.useCustomGridComponent === false) ? React.createElement(GridFilter, {changeFilter: this.setFilter, placeholderText: this.props.filterPlaceholderText}) : "";
	        var settings = this.props.showSettings ? React.createElement("button", {type: "button", className: this.props.settingsToggleClassName, onClick: this.toggleColumnChooser, style: this.props.useGriddleStyles ? { background: "none", border: "none", padding: 0, margin: 0, fontSize: 14} : null}, this.props.settingsText, this.props.settingsIconComponent) : "";

	        //if we have neither filter or settings don't need to render this stuff
	        var topSection = "";
	        if (this.props.showFilter || this.props.showSettings){
	            var filterStyles = null,
	                settingsStyles = null,
	                topContainerStyles = null;

	            if(this.props.useGriddleStyles){
	                filterStyles = {
	                    "float": "left",
	                    width: "50%",
	                    textAlign: "left",
	                    color: "#222",
	                    minHeight: "1px"
	                };

	                settingsStyles= {
	                    "float": "left",
	                    width: "50%",
	                    textAlign: "right"
	                };

	                topContainerStyles = clearFix;
	            }

	           topSection = (
	            React.createElement("div", {className: "top-section", style: topContainerStyles}, 
	                React.createElement("div", {className: "griddle-filter", style: filterStyles}, 
	                   filter
	                ), 
	                React.createElement("div", {className: "griddle-settings-toggle", style: settingsStyles}, 
	                    settings
	                )
	            ));
	        }

	        var resultContent = "";
	        var pagingContent = "";
	        var keys = [];
	        var cols = this.getColumns();

	        //figure out which columns are displayed and show only those
	        var data = this.getDataForRender(results, cols, true);

	        //don't repeat this -- it's happening in getColumns and getDataForRender too...
	        var meta = this.props.metadataColumns;
	        if(meta.indexOf(this.props.childrenColumnName) < 0){
	            meta.push(this.props.childrenColumnName);
	        }


	        // Grab the column keys from the first results
	        keys = _.keys(_.omit(results[0], meta));

	        // Grab the current and max page values.
	        var currentPage = this.getCurrentPage();
	        var maxPage = this.getCurrentMaxPage();

	        // Determine if we need to enable infinite scrolling on the table.
	        var hasMorePages = (currentPage + 1) < maxPage;

	        // Grab the paging content if it's to be displayed
	        if (this.props.showPager && !this.isInfiniteScrollEnabled() && !this.props.useCustomGridComponent) {
	            pagingContent = (
	              React.createElement("div", {className: "griddle-footer"}, 
	                  this.props.useCustomPagerComponent ?
	                      React.createElement(CustomPaginationContainer, {next: this.nextPage, previous: this.previousPage, currentPage: currentPage, maxPage: maxPage, setPage: this.setPage, nextText: this.props.nextText, previousText: this.props.previousText, customPagerComponent: this.props.customPagerComponent}) :
	                      React.createElement(GridPagination, {useGriddleStyles: this.props.useGriddleStyles, next: this.nextPage, previous: this.previousPage, nextClassName: this.props.nextClassName, nextIconComponent: this.props.nextIconComponent, previousClassName: this.props.previousClassName, previousIconComponent: this.props.previousIconComponent, currentPage: currentPage, maxPage: maxPage, setPage: this.setPage, nextText: this.props.nextText, previousText: this.props.previousText})
	                  
	              )
	          );
	        }

	        //clean this stuff up so it's not if else all over the place. ugly if
	        if(this.props.useCustomGridComponent && this.props.customGridComponent !== null){
	            //this should send all the results it has
	            resultContent = React.createElement(this.props.customGridComponent, {data: this.props.results, className: this.props.customGridComponentClassName})
	        } else if(this.props.useCustomRowComponent){
	            resultContent = React.createElement("div", null, React.createElement(CustomRowComponentContainer, {data: data, columns: cols, metadataColumns: meta, 
	                className: this.props.customRowComponentClassName, customComponent: this.props.customRowComponent, 
	                style: clearFix}), this.props.showPager&&pagingContent)
	        } else {
	            resultContent = (React.createElement("div", {className: "griddle-body"}, React.createElement(GridTable, {useGriddleStyles: this.props.useGriddleStyles, isSubGriddle: this.props.isSubGriddle, 
	              useGriddleIcons: this.props.useGriddleIcons, useFixedLayout: this.props.useFixedLayout, columnMetadata: this.props.columnMetadata, 
	              showPager: this.props.showPager, pagingContent: pagingContent, data: data, columns: cols, metadataColumns: meta, className: this.props.tableClassName, 
	              enableInfiniteScroll: this.isInfiniteScrollEnabled(), enableSort: this.props.enableSort, nextPage: this.nextPage, changeSort: this.changeSort, sortColumn: this.getCurrentSort(), 
	              sortAscending: this.getCurrentSortAscending(), showTableHeading: this.props.showTableHeading, useFixedHeader: this.props.useFixedHeader, 
	              sortAscendingClassName: this.props.sortAscendingClassName, sortDescendingClassName: this.props.sortDescendingClassName, 
	              parentRowCollapsedClassName: this.props.parentRowCollapsedClassName, parentRowExpandedClassName: this.props.parentRowExpandedClassName, 
	              sortAscendingComponent: this.props.sortAscendingComponent, sortDescendingComponent: this.props.sortDescendingComponent, 
	              parentRowCollapsedComponent: this.props.parentRowCollapsedComponent, parentRowExpandedComponent: this.props.parentRowExpandedComponent, 
	              bodyHeight: this.props.bodyHeight, infiniteScrollSpacerHeight: this.props.infiniteScrollSpacerHeight, externalLoadingComponent: this.props.externalLoadingComponent, 
	              externalIsLoading: this.props.externalIsLoading, hasMorePages: hasMorePages})))
	        }



	        var columnSelector = this.state.showColumnChooser ? (
	            React.createElement(GridSettings, {columns: keys, selectedColumns: cols, setColumns: this.setColumns, settingsText: this.props.settingsText, 
	             settingsIconComponent: this.props.settingsIconComponent, maxRowsText: this.props.maxRowsText, setPageSize: this.setPageSize, 
	             showSetPageSize: !this.props.useCustomGridComponent, resultsPerPage: this.props.resultsPerPage, enableToggleCustom: this.props.enableToggleCustom, 
	             toggleCustomComponent: this.toggleCustomComponent, useCustomComponent: this.props.useCustomRowComponent || this.props.useCustomGridComponent, 
	             useGriddleStyles: this.props.useGriddleStyles, enableCustomFormatText: this.props.enableCustomFormatText, columnMetadata: this.props.columnMetadata})
	        ) : "";

	        var gridClassName = this.props.gridClassName.length > 0 ? "griddle " + this.props.gridClassName : "griddle";
	        //add custom to the class name so we can style it differently
	        gridClassName += this.props.useCustomRowComponent ? " griddle-custom" : "";

	        if (typeof results === 'undefined' || results.length === 0 && this.props.useExternal === false && this.props.externalIsLoading === false) {
	            var myReturn = null;
	            if (this.props.customNoDataComponent != null) {
	                myReturn = (React.createElement("div", {className: gridClassName}, React.createElement(this.props.customNoDataComponent, null)));

	                return myReturn
	            }

	            myReturn = (React.createElement("div", {className: gridClassName}, 
	                    topSection, 
	                    React.createElement(GridNoData, {noDataMessage: this.props.noDataMessage})
	                ));
	            return myReturn;

	        }

	        return (
	            React.createElement("div", {className: gridClassName}, 
	                topSection, 
	                columnSelector, 
	                React.createElement("div", {className: "griddle-container", style: this.props.useGriddleStyles&&!this.props.isSubGriddle? { border: "1px solid #DDD"} : null}, 
	                    resultContent
	                )
	            )
	        );

	    }
	});

	module.exports = Griddle;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */

	/*
	   Griddle - Simple Grid Component for React
	   https://github.com/DynamicTyped/Griddle
	   Copyright (c) 2014 Ryan Lanciaux | DynamicTyped

	   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
	*/
	var React = __webpack_require__(1);
	var GridTitle = __webpack_require__(8);
	var GridRowContainer = __webpack_require__(12);
	var _ = __webpack_require__(2);

	var GridTable = createReactClass({displayName: 'GridTable',
	  getDefaultProps: function(){
	    return{
	      "data": [],
	      "metadataColumns": [],
	      "className": "",
	      "enableInfiniteScroll": false,
	      "nextPage": null,
	      "hasMorePages": false,
	      "useFixedHeader": false,
	      "useFixedLayout": true,
	      "infiniteScrollSpacerHeight": null,
	      "bodyHeight": null,
	      "tableHeading": "",
	      "useGriddleStyles": true,
	      "useGriddleIcons": true,
	      "isSubGriddle": false,
	      "sortAscendingClassName": "sort-ascending",
	      "sortDescendingClassName": "sort-descending",
	      "parentRowCollapsedClassName": "parent-row",
	      "parentRowExpandedClassName": "parent-row expanded",
	      "sortAscendingComponent": " ▲",
	      "sortDescendingComponent": " ▼",
	      "parentRowCollapsedComponent": "▶",
	      "parentRowExpandedComponent": "▼",
	      "externalLoadingComponent": null,
	      "externalIsLoading": false,
	      "enableSort": true
	    }
	  },
	  componentDidMount: function() {
	    // After the initial render, see if we need to load additional pages.
	    this.gridScroll();
	  },
	  componentDidUpdate: function(prevProps, prevState) {
	    // After the subsequent renders, see if we need to load additional pages.
	    this.gridScroll();
	  },
	  gridScroll: function(){
	    if (this.props.enableInfiniteScroll && !this.props.externalIsLoading) {
	      // If the scroll height is greater than the current amount of rows displayed, update the page.
	      var scrollable = this.refs.scrollable.getDOMNode();
	      var scrollTop = scrollable.scrollTop
	      var scrollHeight = scrollable.scrollHeight;
	      var clientHeight = scrollable.clientHeight;

	      // Determine the diff by subtracting the amount scrolled by the total height, taking into consideratoin
	      // the spacer's height.
	      var scrollHeightDiff = scrollHeight - (scrollTop + clientHeight) - this.props.infiniteScrollSpacerHeight;

	      // Make sure that we load results a little before reaching the bottom.
	      var compareHeight = scrollHeightDiff * 0.8;

	      if (compareHeight <= this.props.infiniteScrollSpacerHeight) {
	        this.props.nextPage();
	      }
	    }
	  },
	  render: function() {
	    var that = this;
	    //figure out if we need to wrap the group in one tbody or many
	    var anyHasChildren = false;

	    var nodes = null;

	    // If the data is still being loaded, don't build the nodes unless this is an infinite scroll table.
	    if (!this.props.externalIsLoading || this.props.enableInfiniteScroll) {
	      nodes = this.props.data.map(function(row, index){
	          var hasChildren = (typeof row["children"] !== "undefined") && row["children"].length > 0;

	          //at least one item in the group has children.
	          if (hasChildren) { anyHasChildren = hasChildren; }

	          return (React.createElement(GridRowContainer, {useGriddleStyles: that.props.useGriddleStyles, isSubGriddle: that.props.isSubGriddle, 
	            sortAscendingClassName: that.props.sortAscendingClassName, sortDescendingClassName: that.props.sortDescendingClassName, 
	            parentRowExpandedClassName: that.props.parentRowExpandedClassName, parentRowCollapsedClassName: that.props.parentRowCollapsedClassName, 
	            parentRowExpandedComponent: that.props.parentRowExpandedComponent, parentRowCollapsedComponent: that.props.parentRowCollapsedComponent, 
	            data: row, metadataColumns: that.props.metadataColumns, columnMetadata: that.props.columnMetadata, key: index, 
	            uniqueId: _.uniqueId("grid_row"), hasChildren: hasChildren, tableClassName: that.props.className}))
	      });
	    }

	    var gridStyle = null;
	    var loadingContent = null;
	    var tableStyle = {
	      width: "100%"
	    };

	    if(this.props.useFixedLayout){
	      tableStyle.tableLayout = "fixed";
	    }

	    var infiniteScrollSpacerRow = null;
	    if (this.props.enableInfiniteScroll) {
	      // If we're enabling infinite scrolling, we'll want to include the max height of the grid body + allow scrolling.
	      gridStyle = {
	        "position": "relative",
	        "overflowY": "scroll",
	        "height": this.props.bodyHeight + "px",
	        "width": "100%"
	      };

	      // Only add the spacer row if the height is defined.
	      if (this.props.infiniteScrollSpacerHeight && this.props.hasMorePages) {
	        var spacerStyle = {
	          "height": this.props.infiniteScrollSpacerHeight + "px"
	        };

	        infiniteScrollSpacerRow = React.createElement("tr", {style: spacerStyle});
	      }
	    }

	    // If we're currently loading, populate the loading content
	    if (this.props.externalIsLoading) {
	      var defaultLoadingStyle = null;
	      var defaultColSpan = null;

	      if (this.props.useGriddleStyles) {
	        defaultLoadingStyle = {
	          textAlign: "center",
	          paddingBottom: "40px"
	        };

	        defaultColSpan = this.props.columns.length;
	      }

	      var loadingComponent = this.props.externalLoadingComponent ?
	        (React.createElement(this.props.externalLoadingComponent, null)) :
	        (React.createElement("div", null, "Loading..."));

	      loadingContent = (React.createElement("tbody", null, React.createElement("tr", null, React.createElement("td", {style: defaultLoadingStyle, colSpan: defaultColSpan}, loadingComponent))));
	    }

	    //construct the table heading component
	    var tableHeading = (this.props.showTableHeading ?
	        React.createElement(GridTitle, {columns: this.props.columns, useGriddleStyles: this.props.useGriddleStyles, useGriddleIcons: this.props.useGriddleIcons, 
	          changeSort: this.props.changeSort, sortColumn: this.props.sortColumn, sortAscending: this.props.sortAscending, 
	          sortAscendingClassName: this.props.sortAscendingClassName, sortDescendingClassName: this.props.sortDescendingClassName, 
	          sortAscendingComponent: this.props.sortAscendingComponent, sortDescendingComponent: this.props.sortDescendingComponent, 
	          columnMetadata: this.props.columnMetadata, enableSort: this.props.enableSort})
	        : "");

	    //check to see if any of the rows have children... if they don't wrap everything in a tbody so the browser doesn't auto do this
	    if (!anyHasChildren){
	      nodes = React.createElement("tbody", null, nodes, infiniteScrollSpacerRow)
	    }

	    var pagingContent = "";
	    if(this.props.showPager){
	      var pagingStyles = this.props.useGriddleStyles ?
	        {
	          "padding" : "0",
	          backgroundColor: "#EDEDED",
	          border: "0",
	          color: "#222"
	        }
	        : null;

	      pagingContent = (React.createElement("tbody", null, React.createElement("tr", null, 
	          React.createElement("td", {colSpan: this.props.columns.length, style: pagingStyles, className: "footer-container"}, 
	            this.props.pagingContent
	          )
	        )))
	    }

	    // If we have a fixed header, split into two tables.
	    if (this.props.useFixedHeader){
	      if (this.props.useGriddleStyles) {
	        tableStyle.tableLayout = "fixed";
	      }

	      return React.createElement("div", null, 
	              React.createElement("table", {className: this.props.className, style: (this.props.useGriddleStyles&&tableStyle)||null}, 
	                tableHeading
	              ), 
	              React.createElement("div", {ref: "scrollable", onScroll: this.gridScroll, style: gridStyle}, 
	                React.createElement("table", {className: this.props.className, style: (this.props.useGriddleStyles&&tableStyle)||null}, 
	                    nodes, 
	                    loadingContent, 
	                    pagingContent
	                )
	              )
	            );
	    }

	    return  React.createElement("div", {ref: "scrollable", onScroll: this.gridScroll, style: gridStyle}, 
	              React.createElement("table", {className: this.props.className, style: (this.props.useGriddleStyles&&tableStyle)||null}, 
	                  tableHeading, 
	                  nodes, 
	                  loadingContent, 
	                  pagingContent
	              )
	            )
	    }
	});

	module.exports = GridTable;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */

	/*
	   Griddle - Simple Grid Component for React
	   https://github.com/DynamicTyped/Griddle
	   Copyright (c) 2014 Ryan Lanciaux | DynamicTyped

	   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
	*/
	var React = __webpack_require__(1);

	var GridFilter = createReactClass({displayName: 'GridFilter',
	    getDefaultProps: function(){
	      return {
	        "placeholderText": ""
	      }
	    },
	    handleChange: function(event){
	        this.props.changeFilter(event.target.value);
	    },
	    render: function(){
	        return React.createElement("div", {className: "row filter-container"}, React.createElement("input", {type: "text", name: "filter", placeholder: this.props.placeholderText, className: "form-control", onChange: this.handleChange}))
	    }
	});

	module.exports = GridFilter;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */

	/*
	   Griddle - Simple Grid Component for React
	   https://github.com/DynamicTyped/Griddle
	   Copyright (c) 2014 Ryan Lanciaux | DynamicTyped

	   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
	*/
	var React = __webpack_require__(1);
	var _ = __webpack_require__(2);

	//needs props maxPage, currentPage, nextFunction, prevFunction
	var GridPagination = createReactClass({displayName: 'GridPagination',
	    getDefaultProps: function(){
	        return{
	            "maxPage": 0,
	            "nextText": "",
	            "previousText": "",
	            "currentPage": 0,
	            "useGriddleStyles": true,
	            "nextClassName": "griddle-next",
	            "previousClassName": "griddle-previous",
	            "nextIconComponent": null,
	            "previousIconComponent": null
	        }
	    },
	    pageChange: function(event){
	        this.props.setPage(parseInt(event.target.value, 10)-1);
	    },
	    render: function(){
	        var previous = "";
	        var next = "";

	        if(this.props.currentPage > 0){
	            previous = React.createElement("button", {type: "button", onClick: this.props.previous, style: this.props.useGriddleStyles ? {"color": "#222", border: "none", background: "none", margin: "0 0 0 10px"} : null}, this.props.previousIconComponent, this.props.previousText)
	        }

	        if(this.props.currentPage !== (this.props.maxPage -1)){
	            next = React.createElement("button", {type: "button", onClick: this.props.next, style: this.props.useGriddleStyles ? {"color":"#222", border: "none", background: "none", margin: "0 10px 0 0"} : null}, this.props.nextText, this.props.nextIconComponent)
	        }

	        var leftStyle = null;
	        var middleStyle = null;
	        var rightStyle = null;

	        if(this.props.useGriddleStyles === true){
	            var baseStyle = {
	                "float": "left",
	                minHeight: "1px",
	                marginTop: "5px"
	            };

	            rightStyle = _.extend({textAlign:"right", width: "34%"}, baseStyle);
	            middleStyle = _.extend({textAlign:"center", width: "33%"}, baseStyle);
	            leftStyle = _.extend({ width: "33%"}, baseStyle)
	        }

	        var options = [];

	        for(var i = 1; i<= this.props.maxPage; i++){
	            options.push(React.createElement("option", {value: i, key: i}, i));
	        }

	        return (
	            React.createElement("div", {style: this.props.useGriddleStyles ? { minHeight: "35px" } : null}, 
	                React.createElement("div", {className: this.props.previousClassName, style: leftStyle}, previous), 
	                React.createElement("div", {className: "griddle-page", style: middleStyle}, 
	                    React.createElement("select", {value: this.props.currentPage+1, onChange: this.pageChange}, 
	                        options
	                    ), " / ", this.props.maxPage
	                ), 
	                React.createElement("div", {className: this.props.nextClassName, style: rightStyle}, next)
	            )
	        )
	    }
	})

	module.exports = GridPagination;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */

	/*
	   Griddle - Simple Grid Component for React
	   https://github.com/DynamicTyped/Griddle
	   Copyright (c) 2014 Ryan Lanciaux | DynamicTyped

	   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
	*/
	var React = __webpack_require__(1);
	var _ = __webpack_require__(2);

	var GridSettings = createReactClass({displayName: 'GridSettings',
	    getDefaultProps: function(){
	        return {
	            "columns": [],
	            "columnMetadata": [],
	            "selectedColumns": [],
	            "settingsText": "",
	            "maxRowsText": "",
	            "resultsPerPage": 0,
	            "enableToggleCustom": false,
	            "useCustomComponent": false,
	            "useGriddleStyles": true,
	            "toggleCustomComponent": function(){}
	        };
	    },
	    setPageSize: function(event){
	        var value = parseInt(event.target.value, 10);
	        this.props.setPageSize(value);
	    },
	    handleChange: function(event){
	        if(event.target.checked === true && _.contains(this.props.selectedColumns, event.target.dataset.name) === false){
	            this.props.selectedColumns.push(event.target.dataset.name);
	            this.props.setColumns(this.props.selectedColumns);
	        } else {
	            /* redraw with the selected columns minus the one just unchecked */
	            this.props.setColumns(_.without(this.props.selectedColumns, event.target.dataset.name));
	        }
	    },
	    render: function(){
	        var that = this;

	        var nodes = [];
	        //don't show column selector if we're on a custom component
	        if (that.props.useCustomComponent === false){
	            nodes = this.props.columns.map(function(col, index){
	                var checked = _.contains(that.props.selectedColumns, col);
	                //check column metadata -- if this one is locked make it disabled and don't put an onChange event
	                var meta  = _.findWhere(that.props.columnMetadata, {columnName: col});
	                var displayName = col; 

	                if (typeof meta !== "undefined" && typeof meta.displayName !== "undefined" && meta.displayName != null) {
	                  displayName = meta.displayName;
	                }

	                if(typeof meta !== "undefined" && meta != null && meta.locked){
	                    return React.createElement("div", {className: "column checkbox"}, React.createElement("label", null, React.createElement("input", {type: "checkbox", disabled: true, name: "check", checked: checked, 'data-name': col}), displayName))
	                } else if(typeof meta !== "undefined" && meta != null && typeof meta.visible !== "undefined" && meta.visible === false){
	                    return null; 
	                }
	                return React.createElement("div", {className: "griddle-column-selection checkbox", style: that.props.useGriddleStyles ? { "float": "left", width: "20%"} : null}, React.createElement("label", null, React.createElement("input", {type: "checkbox", name: "check", onChange: that.handleChange, checked: checked, 'data-name': col}), displayName))
	            });
	        }

	        var toggleCustom = that.props.enableToggleCustom ?
	                (React.createElement("div", {className: "form-group"}, 
	                    React.createElement("label", {htmlFor: "maxRows"}, React.createElement("input", {type: "checkbox", checked: this.props.useCustomComponent, onChange: this.props.toggleCustomComponent}), " ", this.props.enableCustomFormatText)
	                ))
	                : "";

	        var setPageSize = this.props.showSetPageSize ? (React.createElement("div", null, 
	                    React.createElement("label", {htmlFor: "maxRows"}, this.props.maxRowsText, ":", 
	                        React.createElement("select", {onChange: this.setPageSize, value: this.props.resultsPerPage}, 
	                            React.createElement("option", {value: "5"}, "5"), 
	                            React.createElement("option", {value: "10"}, "10"), 
	                            React.createElement("option", {value: "25"}, "25"), 
	                            React.createElement("option", {value: "50"}, "50"), 
	                            React.createElement("option", {value: "100"}, "100")
	                        )
	                    )
	            )) : "";


	        return (React.createElement("div", {className: "griddle-settings", style: this.props.useGriddleStyles ? { backgroundColor: "#FFF", border: "1px solid #DDD", color: "#222", padding: "10px", marginBottom: "10px"} : null}, 
	                React.createElement("h6", null, this.props.settingsText), 
	                React.createElement("div", {className: "griddle-columns", style: this.props.useGriddleStyles ? { clear: "both", display: "table", width: "100%", borderBottom: "1px solid #EDEDED", marginBottom: "10px"} : null}, 
	                    nodes
	                ), 
	                setPageSize, 
	                toggleCustom
	            ));
	    }
	});

	module.exports = GridSettings;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */

	/*
	   Griddle - Simple Grid Component for React
	   https://github.com/DynamicTyped/Griddle
	   Copyright (c) 2014 Ryan Lanciaux | DynamicTyped

	   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
	*/
	var React = __webpack_require__(1);
	var _ = __webpack_require__(2);

	var GridTitle = createReactClass({displayName: 'GridTitle',
	    getDefaultProps: function(){
	        return {
	           "columns":[],
	           "sortColumn": "",
	           "sortAscending": true,
	           "headerStyle": null,
	           "useGriddleStyles": true,
	           "usGriddleIcons": true,
	           "sortAscendingClassName": "sort-ascending",
	           "sortDescendingClassName": "sort-descending",
	           "sortAscendingComponent": " ▲",
	           "sortDescendingComponent": " ▼",
	           "enableSort": true
	        }
	    },
	    sort: function(event){
	        this.props.changeSort(event.target.dataset.title||event.target.parentElement.dataset.title);
	    },
	    render: function(){
	        var that = this;

	        var nodes = this.props.columns.map(function(col, index){
	            var columnSort = "";
	            var sortComponent = null;
	            var titleStyles = null;

	            if (that.props.useGriddleStyles){
	              titleStyles = {
	                backgroundColor: "#EDEDEF",
	                border: "0",
	                borderBottom: "1px solid #DDD",
	                color: "#222",
	                padding: "5px",
	                cursor: that.props.enableSort ? "pointer" : "default"
	              }
	            }

	            if(that.props.sortColumn == col && that.props.sortAscending){
	                columnSort = that.props.sortAscendingClassName;
	                sortComponent = that.props.useGriddleIcons && that.props.sortAscendingComponent;
	            }  else if (that.props.sortColumn == col && that.props.sortAscending === false){
	                columnSort += that.props.sortDescendingClassName;
	                sortComponent = that.props.useGriddleIcons && that.props.sortDescendingComponent;
	            }

	            var displayName = col;
	            if (that.props.columnMetadata != null){
	              var meta = _.findWhere(that.props.columnMetadata, {columnName: col})
	              //the weird code is just saying add the space if there's text in columnSort otherwise just set to metaclassname
	              columnSort = meta == null ? columnSort : (columnSort && (columnSort + " ")||columnSort) + meta.cssClassName;
	              if (typeof meta !== "undefined" && typeof meta.displayName !== "undefined" && meta.displayName != null) {
	                  displayName = meta.displayName;
	              }
	            }

	            return (React.createElement("th", {onClick: that.sort, 'data-title': col, className: columnSort, key: displayName, style: titleStyles}, displayName, sortComponent));
	        });


	        return(
	            React.createElement("thead", null, 
	                React.createElement("tr", {style: this.titleStyles}, 
	                    nodes
	                )
	            )
	        );
	    }
	});

	module.exports = GridTitle;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */

	/*
	   Griddle - Simple Grid Component for React
	   https://github.com/DynamicTyped/Griddle
	   Copyright (c) 2014 Ryan Lanciaux | DynamicTyped

	   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
	*/
	var React = __webpack_require__(1);

	var GridNoData = createReactClass({displayName: 'GridNoData',
	    getDefaultProps: function(){
	        return {
	            "noDataMessage": "No Data"
	        }
	    },
	    render: function(){
	        var that = this;

	        return(
	            React.createElement("div", null, this.props.noDataMessage)
	        );
	    }
	});

	module.exports = GridNoData;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */

	/*
	   Griddle - Simple Grid Component for React
	   https://github.com/DynamicTyped/Griddle
	   Copyright (c) 2014 Ryan Lanciaux | DynamicTyped

	   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
	*/
	var React = __webpack_require__(1);

	var CustomRowComponentContainer = createReactClass({displayName: 'CustomRowComponentContainer',
	  getDefaultProps: function(){
	    return{
	      "data": [],
	      "metadataColumns": [],
	      "className": "",
	      "customComponent": {}
	    }
	  },
	  render: function() {
	    var that = this;

	    if (typeof that.props.customComponent !== 'function'){
	      console.log("Couldn't find valid template.");
	      return (React.createElement("div", {className: this.props.className}));
	    }

	    var nodes = this.props.data.map(function(row, index){
	        return React.createElement(that.props.customComponent, {data: row, metadataColumns: that.props.metadataColumns, key: index})
	    });

	    var footer = this.props.showPager&&this.props.pagingContent;
	    return (
	      React.createElement("div", {className: this.props.className, style: this.props.style}, 
	          nodes
	      )
	    );
	  }
	});

	module.exports = CustomRowComponentContainer;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */

	/*
	   Griddle - Simple Grid Component for React
	   https://github.com/DynamicTyped/Griddle
	   Copyright (c) 2014 Ryan Lanciaux | DynamicTyped

	   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
	*/
	var React = __webpack_require__(1);

	var CustomPaginationContainer = createReactClass({displayName: 'CustomPaginationContainer',
	  getDefaultProps: function(){
	    return{
	      "maxPage": 0,
	      "nextText": "",
	      "previousText": "",
	      "currentPage": 0,
	      "customPagerComponent": {}
	    }
	  },
	  render: function() {
	    var that = this;

	    if (typeof that.props.customPagerComponent !== 'function'){
	      console.log("Couldn't find valid template.");
	      return (React.createElement("div", null));
	    }

	    return (React.createElement(that.props.customPagerComponent, {maxPage: this.props.maxPage, nextText: this.props.nextText, previousText: this.props.previousText, currentPage: this.props.currentPage, setPage: this.props.setPage, previous: this.props.previous, next: this.props.next}));
	  }
	});

	module.exports = CustomPaginationContainer;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */

	/*
	   Griddle - Simple Grid Component for React
	   https://github.com/DynamicTyped/Griddle
	   Copyright (c) 2014 Ryan Lanciaux | DynamicTyped

	   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
	*/
	var React = __webpack_require__(1);
	var GridRow = __webpack_require__(13);

	var GridRowContainer = createReactClass({displayName: 'GridRowContainer',
	    getDefaultProps: function(){
	      return {
	        "useGriddleStyles": true,
	        "useGriddleIcons": true,
	        "isSubGriddle": false,
	        "parentRowCollapsedClassName": "parent-row",
	        "parentRowExpandedClassName": "parent-row expanded",
	        "parentRowCollapsedComponent": "▶",
	        "parentRowExpandedComponent": "▼"
	      };
	    },
	    getInitialState: function(){
	        return {
	           "data": {
	           },
	           "metadataColumns": [],
	           "showChildren":false
	        }
	    },
	    componentWillReceiveProps: function(){
	      this.setShowChildren(false);
	    },
	    toggleChildren: function(){
	      this.setShowChildren(this.state.showChildren === false);
	    },
	    setShowChildren: function(visible){
	      this.setState({
	        showChildren: visible 
	      });
	    },
	    render: function(){
	        var that = this;

	        if(typeof this.props.data === "undefined"){return (React.createElement("tbody", null));}
	        var arr = [];

	        arr.push(React.createElement(GridRow, {useGriddleStyles: this.props.useGriddleStyles, isSubGriddle: this.props.isSubGriddle, data: this.props.data, columnMetadata: this.props.columnMetadata, metadataColumns: that.props.metadataColumns, 
	          hasChildren: that.props.hasChildren, toggleChildren: that.toggleChildren, showChildren: that.state.showChildren, key: that.props.uniqueId, useGriddleIcons: that.props.useGriddleIcons, 
	          parentRowExpandedClassName: this.props.parentRowExpandedClassName, parentRowCollapsedClassName: this.props.parentRowCollapsedClassName, 
	          parentRowExpandedComponent: this.props.parentRowExpandedComponent, parentRowCollapsedComponent: this.props.parentRowCollapsedComponent}));
	          var children = null;

	        if(that.state.showChildren){

	            children =  that.props.hasChildren && this.props.data["children"].map(function(row, index){
	                if(typeof row["children"] !== "undefined"){
	                  return (React.createElement("tr", {style: {paddingLeft: 5}}, 
	                            React.createElement("td", {colSpan: Object.keys(that.props.data).length - that.props.metadataColumns.length, className: "griddle-parent", style: that.props.useGriddleStyles&&{border: "none", "padding": "0 0 0 5px"}}, 
	                              React.createElement(Griddle, {isSubGriddle: true, results: [row], tableClassName: that.props.tableClassName, parentRowExpandedClassName: that.props.parentRowExpandedClassName, 
	                                parentRowCollapsedClassName: that.props.parentRowCollapsedClassName, 
	                                showTableHeading: false, showPager: false, columnMetadata: that.props.columnMetadata, 
	                                parentRowExpandedComponent: that.props.parentRowExpandedComponent, 
	                                parentRowCollapsedComponent: that.props.parentRowCollapsedComponent})
	                            )
	                          ));
	                }

	                return React.createElement(GridRow, {useGriddleStyles: that.props.useGriddleStyles, isSubGriddle: that.props.isSubGriddle, data: row, metadataColumns: that.props.metadataColumns, isChildRow: true, columnMetadata: that.props.columnMetadata, key: _.uniqueId("grid_row")})
	            });
	        }

	        return that.props.hasChildren === false ? arr[0] : React.createElement("tbody", null, that.state.showChildren ? arr.concat(children) : arr)
	    }
	});

	module.exports = GridRowContainer;


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */

	/*
	   Griddle - Simple Grid Component for React
	   https://github.com/DynamicTyped/Griddle
	   Copyright (c) 2014 Ryan Lanciaux | DynamicTyped

	   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
	*/
	var React = __webpack_require__(1);
	var _ = __webpack_require__(2);

	var GridRow = createReactClass({displayName: 'GridRow',
	    getDefaultProps: function(){
	      return {
	        "isChildRow": false,
	        "showChildren": false,
	        "data": {},
	        "metadataColumns": [],
	        "hasChildren": false,
	        "columnMetadata": null,
	        "useGriddleStyles": true,
	        "useGriddleIcons": true,
	        "isSubGriddle": false,
	        "parentRowCollapsedClassName": "parent-row",
	        "parentRowExpandedClassName": "parent-row expanded",
	        "parentRowCollapsedComponent": "▶",
	        "parentRowExpandedComponent": "▼"

	      }
	    },
	    handleClick: function(){
	      this.props.toggleChildren();
	    },
	    render: function() {
	        var that = this;
	        var columnStyles = this.props.useGriddleStyles ?
	          {
	            padding: "5px",
	            backgroundColor: "#FFF",
	            borderTopColor: "#DDD",
	            color: "#222"
	          } : null;

	        var nodes = _.pairs(_.omit(this.props.data, this.props.metadataColumns)).map(function(col, index) {
	            var returnValue = null;
	            var meta = _.findWhere(that.props.columnMetadata, {columnName: col[0]});

	            //todo: Make this not as ridiculous looking
	            firstColAppend = index === 0 && that.props.hasChildren && that.props.showChildren === false && that.props.useGriddleIcons ?
	              React.createElement("span", {style: that.props.useGriddleStyles&&{fontSize: "10px", marginRight:"5px"}}, that.props.parentRowCollapsedComponent) :
	              index === 0 && that.props.hasChildren && that.props.showChildren && that.props.useGriddleIcons ?
	                React.createElement("span", {style: that.props.useGriddleStyles&&{fontSize: "10px"}}, that.props.parentRowExpandedComponent) : "";

	            if(index === 0 && that.props.isChildRow && that.props.useGriddleStyles){
	              columnStyles = _.extend(columnStyles, {paddingLeft:10})
	            }


	            if (that.props.columnMetadata !== null && that.props.columnMetadata.length > 0 && typeof meta !== "undefined"){
	              var colData = (typeof meta === 'undefined' || typeof meta.customComponent === 'undefined' || meta.customComponent === null) ? col[1] : React.createElement(meta.customComponent, {data: col[1], rowData: that.props.data});
	              returnValue = (meta == null ? returnValue : React.createElement("td", {onClick: that.props.hasChildren && that.handleClick, className: meta.cssClassName, key: index, style: columnStyles}, colData));
	            }

	            return returnValue || (React.createElement("td", {onClick: that.props.hasChildren && that.handleClick, key: index, style: columnStyles}, firstColAppend, col[1]));
	        });

	        //this is kind of hokey - make it better
	        var className = "standard-row";


	        if(that.props.isChildRow){
	            className = "child-row";
	        } else if (that.props.hasChildren){
	            className = that.props.showChildren ? this.props.parentRowExpandedClassName : this.props.parentRowCollapsedClassName;
	        }

	        return (React.createElement("tr", {className: className}, nodes));
	    }
	});

	module.exports = GridRow;


/***/ }
/******/ ])
});
