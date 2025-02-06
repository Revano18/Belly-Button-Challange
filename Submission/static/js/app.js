// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    var metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    var sample_metadata = metadata.filter(row => row.id === parseInt(sample))[0];
    console.log(sample_metadata);

    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    var metadata_keys = Object.keys(sample_metadata);
    for (var i = 0; i < metadata_keys.length; i++) {
      // get key/value pair
      var key = metadata_keys[i]; 
      var value = sample_metadata[key];

      // add to html
      PANEL.append("p").text(`${key}: ${value}`);
    }
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    var samples = data.samples;

    // Filter the samples for the object with the desired sample number
    var sample_data = samples.filter(row => row.id === sample)[0]; 
    console.log(sample_data);

    // Get the otu_ids, otu_labels, and sample_values
    var otu_ids = sample_data.otu_ids;
    var otu_labels = sample_data.otu_labels;
    var sample_values = sample_data.sample_values;

    // Build a Bubble Chart
    var trace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        color: otu_ids,
        size: sample_values,
        colorscale: 'Portland'
      }
    };

    var traces = [trace];

    var layout = {
      title: {
        text: 'Bacteria Cultures per Sample'
      },
      yaxis: {
        title: {
          text: 'Number of Bacteria'
        }
      },
      xaxis: {
        title: {
          text: 'OTU ID'
        }
      },
      height: 600
    };
    

    // Render the Bubble Chart
    Plotly.newPlot("bubble", traces, layout)

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: { title: "Number of Bacteria"},
      yaxis: { title: "OTU ID"},
      height: 600
    };

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    var bar_trace = [{
      type: "bar",
      x: sample_values.slice(0, 10).reverse(),
      y: otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
      hovertext: otu_labels.slice(0, 10).reverse(),
      marker: {
        color: 'lightseagreen'
      },
      orientation: 'h'
    }];

    // Render the Bar Chart
    Plotly.newPlot("bar", bar_trace, barLayout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    var sampleNames = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    var dropdownMenu = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    sampleNames.forEach((sample) => {
      dropdownMenu.append("option")
        .text(sample)
        .property("value", sample);
    })

    // Get the first sample from the list
    var firstSample = sampleNames[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
