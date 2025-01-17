##Customization##

__Please Note: Styling is similar to customization but is in its [own section](#) for clarity.__

Griddle comes with a number of customization options to help it fit with your project goals.

<hr />
###Default Columns###

Use the `columns` property to set the default columns in a Griddle grid. Please [see the quickstart guide](quickstart.html#advanced) for an example.

<dl>
  <dt>columns</dt>
  <dd><strong>array (of string)</strong> - The columns that should be displayed by default. The other columns can be chosen via the grid settings. If no columns are set, Griddle will display all columns by default.</dd>
</dl>

###Column Metadata###

The column meta data property is used to specify column properties that are not part of the result data object. For instance, if you want to specify a displayName that is different than the property name in the result data, the `columnMetadata` property is where this would be defined.

Griddle parses and evaluates the following columnMetadata object properties:

<dl>
  <dt>columnName</dt>
  <dd><strong>string (required)</strong> - this is the name of the column as it appears in the results passed into Griddle.</dd>
</dl>

<dl>
  <dt>sortable</dt>
  <dd><strong>bool</strong> - Determines whether or not the user can sort this column (defaults to `true`, so specify `false` to disable sort)</dd>
</dl>

<dl>
  <dt>customCompareFn</dt>
  <dd><strong>function</strong></dd>
  <dd><strong>with 1 argument</strong> specifies a function that defines the sort order of the column data. Passed to [_.sortBy](https://lodash.com/docs#sortBy) method, invoked with 1 argument.</dd>
  <dd><strong>with 2 arguments</strong> specifies a function that defines the sort order of the column data. Passed to standard JS [sort](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) method, invoked ith 2 arguments. Useful, for example, wih naturalSort(a, b) from [javascript-natural-sort](https://www.npmjs.com/package/javascript-natural-sort)</dd>
</dl>

<dl>
  <dt>multiSort</dt>
  <dd><strong>object</strong> - allows to specify multiple sorting when sorting current column. Specified columns will be sorted after current</dd>
  ```multiSort: {
      columns: ['name'],
      orders: ['asc']
    }```
</dl>

<dl>
  <dt>order</dt>
  <dd><strong>int</strong> - The order that this column should appear in Griddle.</dd>
</dl>

<dl>
  <dt>locked</dt>
  <dd><strong>bool</strong> - Determines whether or not the user can disable this column from the settings.</dd>
</dl>

<dl>
  <dt>cssClassName</dt>
  <dd><strong>string</strong> - The css class name to apply to this column.</dd>
</dl>

<dl>
    <dt>titleStyles</dt>
    <dd><strong>object</strong> - collection of styles applied to column header</dd>
</dl>

<dl>
  <dt>displayName</dt>
  <dd><strong>string</strong> - The display name for the column. This is used when the name in the column heading and settings should be different from the data passed in to the Griddle component.</dd>
</dl>
<dl>
  <dt>customComponent</dt>
  <dd><strong>React Component</strong> - The component that should be rendered instead of the standard column data. This component will still be rendered inside of a `TD` element. (more information below in the [Custom Columns section](#customColumns).)</dd>
</dl>
<dl>
  <dt>customHeaderComponent</dt>
  <dd><strong>React Component</strong> - The component that should be rendered instead of the standard header data. This component will still be rendered inside of a `TH` element. (more information below in the [Custom Columns section](#customColumns).)</dd>
</dl>
<dl>
  <dt>customHeaderComponentProps</dt>
  <dd><strong>object</strong> - An object containing additional properties that will be passed into the custom header component. (more information below in the [Custom Columns section](#customColumns).)</dd>
</dl>

However, you are also able to pass other properties in as columnMetadata.

[columnMetadata can be accessed on the `metadata` property of a Custom Column component.](#custom-columns)

#####Example:#####

Assume we want to reverse the columns so name would be last, followed by followed by city, state, company, country and favorite number. Also we want the name column heading to read `Employee Name` instead of name.

Our metadata object would look something like

```
  {
    "columnName": "name",
    "order": 9,
    "locked": false,
    "visible": true,
    "displayName": "Employee Name"
  },
  {
    "columnName": "city",
    "order": 8,
    "locked": false,
    "visible": true
  },
  {
    "columnName": "state",
    "order": 7,
    "locked": false,
    "visible": true
  },
  {
    "columnName": "country",
    "order": 6,
    "locked": false,
    "visible": true
  },
  {
    "columnName": "company",
    "order": 5,
    "locked": false,
    "visible": true
  },
  {
    "columnName": "favoriteNumber",
    "order":  4,
    "locked": false,
    "visible": true,
    "displayName": "Favorite Number",
    "sortable": false
  }
```

We would then load Griddle as follows:

```
React.render(
  <Griddle results={fakeData} columnMetadata={exampleMetadata} showFilter={true}
    showSettings={true} columns={["name", "city", "state", "country"]}/>,
    document.getElementById('griddle-metadata')
```

@@include('./customization/customMetadata.html')

<a name="customColumns"></a>
###Custom Columns###

Custom column components are defined in the [Column Metadata object](#). The components are passed **data**, **rowData**, **metadata** properties.

<dl>
  <dt>data</dt>
  <dd><strong>object</strong> - the data that would normally be rendered in the column.</dd>
</dl>

<dl>
  <dt>rowData</dt>
  <dd><strong>object</strong> - the data for all items in the same row</dd>
</dl>

<dl>
  <dt>metadata</dt>
  <dd><strong>object</strong> - The columnMetadata object</dd>
</dl>

#####Example:#####

We are going to make the body of one of the columns a link. This link will use data from another column to determine the href.

Assume we have the following data for our grid:

```
var someData =  [
{
  "id": 0,
  "name": "Mayer Leonard",
  "city": "Kapowsin",
  "state": "Hawaii",
  "country": "United Kingdom",
  "company": "Ovolo",
  "favoriteNumber": 7
  },
  {
    "id": 1,
    "name": "Koch Becker",
    "city": "Johnsonburg",
    "state": "New Jersey",
    "country": "Madagascar",
    "company": "Eventage",
    "favoriteNumber": 2
  },
  ...
];
```

We want the **name** column to be a link to `/speakers/state/name` (where state and name are pulled in from the data). We can define a customComponent to be rendered as follows:

```
var LinkComponent = createReactClass({
  render: function(){
    url ="speakers/" + this.props.rowData.state + "/" + this.props.data;
    return <a href={url}>{this.props.data}</a>
  }
});
```

Additionally, we want the city and state column headers to be highlighted a specific color and have a filter by column input. We can define a custom header component as:

```
var HeaderComponent = createReactClass({
  textOnClick: function(e) {
    e.stopPropagation();
  },

  filterText: function(e) {
    this.props.filterByColumn(e.target.value, this.props.columnName)
  },

  render: function(){
    return (
      <span>
        <div><strong style={{color: this.props.color}}>{this.props.displayName}</strong></div>
        <input type='text' onChange={this.filterText} onClick={this.textOnClick} />
      </span>
    );
  }
});
```

<small>Please note: filterByColumn is a method that is passed as a prop to any customHeaderComponent.</small>

From there, we will set the customComponent value in the **name** columnMetadata object to this LinkComponent. We're also going to update **state** and **city**'s `customHeaderComponent` and `customHeaderComponentProps`.

```
var columnMeta = [
  {
  ...
  "columnName": "name",
  "order": 1,
  "locked": false,
  "visible": true,
  "customComponent": LinkComponent
  },
  {
  ...
  "columnName": "city",
  "customHeaderComponent": HeaderComponent,
  "customHeaderComponentProps": { color: 'red' }
  },
  {
  ...
  "columnName": "state",
  "customHeaderComponent": HeaderComponent,
  "customHeaderComponentProps": { color: 'blue' }
  },
  ...
];
```

Now, when Griddle is rendered with this columnMetadata, it should write the link as expected.

```
React.render(<Griddle data={someData} columnMetadata={columnMeta} />,
   document.getElementById('something'));
```

@@include('./customization/customColumn.html')

<hr />

###Custom sorting###

#####Example:#####

In this example we are going to sort `Employee Name` column by last name, followed by first name:

```
var exampleMetadata = [
  {
  "columnName": "id",
  "order": 1,
  "locked": false,
  "visible": false,
  "displayName": "ID"
  },
  {
  "columnName": "name",
  "order": 9,
  "locked": false,
  "visible": true,
  "displayName": "Employee Name",
  "compare": function(name) {
      var a = name.split(" ");
      return a[1] + " " + a[0];
    }
  },
  ...
]
```

Then, like in first example, but specify initialSort column:

```
React.render(
  <Griddle results={fakeData} columnMetadata={exampleMetadata} showFilter={true}
    showSettings={true} columns={["name", "city", "state", "country"]} initialSort="name"/>,
    document.getElementById('griddle-metadata')
```

@@include('./customization/customSorting.html')

<hr />

###Row Metadata###

<dl>
  <dt>bodyCssClassName</dt>
  <dd><strong>function or string</strong> - If you supply a string, that class is applied to all rows. If you supply a function, the rows data is supplied to that function as the first argument and you are expected to return the css class name. This is useful if you want to style a row based on the rows data.</dd>
</dl>

#####Example:#####

```javascript
var rowMetadata = {
    "bodyCssClassName": function(rowData) {
        if (rowData.action === "added") {
            return "green-row";
        } else if (rowData.action === "removed") {
            return "red-row";
        } else if (rowData.action === "transfer") {
            return "blue-row";
        }
        return "default-row";
    }
};

return (
    <div className="griddle-container">
        <Griddle results={this.state.rows} rowMetadata={rowMetadata} />
    </div>
)
```

###Custom Row Format###

Sometimes you may want to display grid data in a format other than a grid but still have pagination, filtering, etc. This type of formatting can be accomplished with the custom row format properties. To use custom row formatting, the **useCustomRowComponent** and the **customRowComponent** properties will need to be set.

<dl>
  <dt>useCustomRowComponent</dt>
  <dd><strong>bool</strong> - determines if custom row formats are applied</dd>
</dl>

<dl>
  <dt>customRowComponent</dt>
  <dd><strong>Component</strong> - the component to render in place of a grid row. This component receives a property named <strong>data</strong></dd>
</dl>

<dl>
  <dt>customRowComponentClassName</dt>
  <dd><strong>string</strong> - the CSS class name to apply to the format component.</dd>
</dl>

<dl>
  <dt>enableToggleCustom</dt>
  <dd><strong>bool</strong> - whether or not the user should be able to toggle between custom format and grid format.</dd>
</dl>

#####Example:#####

We are going to render our grid as a series of cards, keeping the pagination and filtering from Griddle in tact. Assume we are using the same data in the custom column example. We will need to create a custom component as follows:

```
var OtherComponent = createReactClass({
  getDefaultProps: function(){
    return { "data": {} };
  },
  render: function(){
    return (<div className="custom-row-card">
    <div className="name"><strong>{this.props.data.name}</strong><small>{this.props.data.company}</small></div>
    <div>{this.props.data.city}</div>
    <div>{this.props.data.state}, {this.props.data.country}</div>
    </div>);
  }
});

```

From there, Griddle can be rendered with the useCustomRowComponent and customRowComponent properties:

@@include('./customization/customRow.html')

<hr />

###Custom Grid Format###

In some cases, it may be ideal to use Griddle but display a global format other than a grid or series of rows. Assume we have an object containing temperature data for years and we want to display this data with a trend line chart. This is possible with a custom grid format component. To use custom grid formatting the **useCustomGridComponent** and **customGridComponent** properties need to be set.

<dl>
  <dt>useCustomGridComponent</dt>
  <dd><strong>bool</strong> - determines if custom row formats are applied</dd>
</dl>

<dl>
  <dt>customGridComponent</dt>
  <dd><strong>Component</strong> - the component to render in place of a grid row. This component receives a property named <strong>data</strong></dd>
</dl>

<dl>
  <dt>customGridComponentClassName</dt>
  <dd><strong>string</strong> - the CSS class name to apply to the format component.</dd>
</dl>

<dl>
  <dt>enableToggleCustom</dt>
  <dd><strong>bool</strong> - whether or not the user should be able to toggle between custom format and grid format.</dd>
</dl>

#####Example:#####

As stated above we are going to render a visualization of temperature data rather than a chart. To start off we need to create a visualization component that uses a data property to obtain its values (the following example uses the awesome [chartist library](http://gionkunz.github.io/chartist-js/) and [accompanying react component](https://fraserxu.me/react-chartist/)):

```
var TestLineChart = createReactClass({
  render: function(){
    var simpleLineChartData = {
      labels: _.keys(this.props.data[0]),
      series: []
    };

    _.each(this.props.data, function(item){
      simpleLineChartData.series.push(_.values(item));
      });
      return <ChartistGraph data={simpleLineChartData} type={'Line'} />
  }
});
```
@@include('./customization/testChart.html')

<hr />

###Custom Filtering and Filter Component###

Griddle supports custom filtering and custom filter components. In order to use a custom filter function set the property `useCustomFilterer` to true and pass in a function to the  `customFilterer` property. To use a custom filter component set `useCustomFilterComponent` to true and pass a component to `customFilterComponent`.

#####Example:#####

This example shows how to make a custom filter component with a custom filter function that does a case-insensitive search through the items. The component must call `this.props.changeFilter(val)` when the filter should be updated. In the example below we pass a string but any variable type can be used as long as the filter function is expecting it, for example an advanced query could be passed in using an object. The filter function signature takes the items to be filtered and the query to filter them by.

```javascript
      squish = require('object-squish');

  var customFilterFunction = function(items, query) {
    return _.filter(items, (item) => {
      var flat = squish(item);

      for (var key in flat) {
        if (String(flat[key]).toLowerCase().indexOf(query.toLowerCase()) >= 0) return true;
      };
      return false;
    });
  };

  var customFilterComponent = createReactClass({
    getDefaultProps: function() {
      return {
        "query": ""
      }
    },

    searchChange: function(event) {
      this.props.query = event.target.value;
      this.props.changeFilter(this.props.query);
    },

    render: function() {
      return (
        <div className="filter-container">
          <input type="text"
                 name="search"
                 placeholder="Search..."
                 onChange={this.searchChange} />
        </div>
      )
    }
  });
```

Then initialize Griddle:

```
React.render(
  <Griddle results={fakeData} showFilter={true}
  useCustomFilterer={true} customFilterer={customFilterFunction}
  useCustomFilterComponent={true} customFilterComponent={customFilterComponent}/>,
  document.getElementById('griddle-metadata')
```

<hr />

###Custom Paging Component###

If you want to customize the paging component, just set the property 'useCustomPagerComponent' to true and pass in another component as property named 'customPagerComponent'. The example component below shows 11 buttons (5 previous, current, 5 next):

<dl>
  <dt>useCustomPagerComponent</dt>
  <dd><strong>bool</strong> - Use custom pagination component rather than default pager. default: false</dd>
</dl>

<dl>
  <dt>customPagerComponent</dt>
  <dd><strong>object</strong> - The custom pagination component. default: {}</dd>
</dl>

<dl>
  <dt>customPagerComponentOptions</dt>
  <dd><strong>object</strong> - Any options to be passed to the custom pagination component. default: {}</dd>
</dl>

#####Example#####

```javascript
var OtherPager = createReactClass({
    getDefaultProps: function(){
        return{
            "maxPage": 0,
            "nextText": "",
            "previousText": "",
            "currentPage": 0,
        }
    },
    pageChange: function(event){
        this.props.setPage(parseInt(event.target.getAttribute("data-value")));
    },
    render: function(){
        var previous = "";
        var next = "";

        if(this.props.currentPage > 0){
            previous = <span onClick={this.props.previous} className="previous"><i className="glyphicon glyphicon-arrow-left"></i>{this.props.previousText}</span>
        }

        if(this.props.currentPage != (this.props.maxPage -1)){
            next = <span onClick={this.props.next} className="next">{this.props.nextText}<i className="glyphicon glyphicon-arrow-right"></i></span>
        }

        var options = [];

      var startIndex = Math.max(this.props.currentPage - 5, 0);
      var endIndex = Math.min(startIndex + 11, this.props.maxPage);

      if (this.props.maxPage >= 11 && (endIndex - startIndex) <= 10) {
        startIndex = endIndex - 11;
      }

        for(var i = startIndex; i < endIndex ; i++){
          var selected = this.props.currentPage == i ? "current-page-selected" : "";
            options.push(<button className={selected} data-value={i} onClick={this.pageChange}>{i + 1}</button>);
        }

        return (
            <div className="row custom-pager">
                <div className="col-xs-4">{previous}</div>
                <div className="col-xs-4 center pages">
                    {options}
                </div>
                <div className="col-xs-4 right">{next}</div>
            </div>
        )
    }
});
```

Then initialize your component as follows:

```
<Griddle results={fakeData} tableClassName="table" useCustomRowComponent="true"
  customRowComponent={OtherComponent} useCustomPagerComponent="true" customPagerComponent={OtherPager} />
```

@@include('./customization/customPaging.html')

<hr />

###No Data###

Griddle will, by default, show a message if there is no data in the result set. There are two ways that it can be customized though.

####Basic NoData message####

The first way to customize what Griddle does when there is no data is setting the `noDataMessage` property.

<dl>
  <dt>noDataMessage</dt>
  <dd><strong>string</strong> - The message that will be displayed when there is no data</dd>
</dl>

<dl>
  <dt>noDataClassName</dt>
  <dd><strong>string</strong> - The CSS class name to apply to the grid when no data is available <span class="text-light-grey">Default: griddle-nodata</span></dd>
</dl>

#####Example:#####

```
<Griddle noDataMessage={"No data could be found."} />
```

@@include('./customization/nodata-basic.html')

<hr />

####NoData Component####

Outside of the NoData message, Griddle can take a `customNoDataComponent` that will be displayed when there are no records.

<dl>
  <dt>customNoDataComponent</dt>
  <dd><strong>object</strong> - The component that will be displayed when there is no data</dd>
</dl>

#####Example:#####

```
var NoDataComponent = createReactClass({
    render: function(){
      return (<div>
          <h1>No data is available</h1>
          <a href="http://www.google.com">You can google for more data</a>
        </div>
      );
    }
});

React.render(<Griddle customNoDataComponent={NoDataComponent} />, document.getElementById("some-id"));
```

@@include('./customization/nodata-component.html')

<hr />

###Custom Icons###

Please see the [styling section](styling.html) for custom icons.
