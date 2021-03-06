
//  Use D3 to read the JSON file

function plots(id) {
  d3.json("samples.json").then((data) => {
    var sampleData = data.samples;
    console.log(sampleData);

  // Filtering the data and selecting the panel
  var newArray = sampleData.filter(object => object.id == id);
  var result = newArray[0];
  var OTU_id = result.otu_ids;
  var sample_values = result.sample_values;
  var labels = result.otu_labels;


  // Trace1 for OTU Data
  var trace1 = {
    x: sample_values.slice(0,10).reverse(),
    y: OTU_id.slice(0,10).map(OTU_id => `OTU_id ${OTU_id}`).reverse(),
    text:labels.slice(0,10).reverse(),
    name: "OTU",
    type: "bar",
    orientation: "h"
  };

  // data
  var chartData = [trace1];

  // Apply the group bar mode to the layout
  var layout = {
    title: "Top 10 OTU",
    margin: {
      l: 100,
      r: 100,
      t: 100,
      b: 100
    }
  };

  // Render the plot to the div tag with id "plot"
  Plotly.newPlot("bar", chartData, layout);

 // create the buble chart
    var bubbleData = [{

    x: OTU_id, 
    y: sample_values,
    text: labels,
    mode: "markers",
    marker: {
      size: sample_values,
      color: OTU_id,
      colorscale: "Earth"
    }
  }];
  Plotly.newPlot("bubble", bubbleData);
});


}

//Build function to read metadata

function metaData(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    console.log(metadata);

  // Filtering the data and selecting the panel
  var newArray = metadata.filter(object => object.id == sample);
  var result = newArray[0];

  var panelBody = d3.select(".panel-body");
  panelBody.html("");

  // Use `Object.entries` to add each key and value pair to the panelBody
  Object.entries(result).forEach(([key, value]) => {
    panelBody.append("h5").text(`${key}: ${value}`);
  });
 
  
});
}
// create a function to change the data every time
function optionChanged(sample) {
  metaData(sample);
  plots(sample);
};

// create an init function to select and read an id from the dropdown
function init() {

  var dropdown = d3.select("#selDataset");

  // read the data 
  d3.json("samples.json").then((data)=> {
      console.log(data)

      // connect the id with the dropdwown menu
      data.names.forEach(function(name) {
          dropdown.append("option").text(name).property("value");


      });
      var newSample = data.names[0];
      metaData(newSample);
      plots(newSample);
    });

  }
// call the init funtction      
init();
