/*
*    main.js
*    Mastering Data Visualization with D3.js
*    10.6 - D3 Brushes
*/

// Global variables
var lineChart,
    donutChart1,
    donutChart2,
    timeline;
var filteredData = {};
var donutData = [];
var parseTime = d3.timeParse("%m/%d/%Y");
var formatTime = d3.timeFormat("%m/%d/%Y");
var color = d3.scaleOrdinal(d3.schemeCategory10);

// Event listeners
$("#coin-select").on("change", function() {
    coinChanged();
})
$("#var-select").on("change", function() { 
    lineChart.wrangleData();
    timeline.wrangleData();
})

// Add jQuery UI slider
$("#date-slider").slider({
    range: true,
    //max: parseTime("31/10/2017").getTime(),
    //min: parseTime("12/5/2013").getTime(),
    max: parseTime("1/23/2019").getTime(),
    min: parseTime("4/28/2013").getTime(),
    step: 86400000, // One day
    //values: [parseTime("12/5/2013").getTime(), parseTime("31/10/2017").getTime()],
    values: [parseTime("4/28/2013").getTime(), parseTime("1/23/2019").getTime()],
    slide: function(event, ui){
        dates = ui.values.map(function(val) { return new Date(val); });
        xVals = dates.map(function(date) { return timeline.x(date); });

        timeline.brushComponent
            .call(timeline.brush.move, xVals);
    }
});

function arcClicked(arc){
    $("#coin-select").val(arc.data.coin);
    coinChanged();
}

function coinChanged(){
    donutChart1.wrangleData();
    donutChart2.wrangleData();
    lineChart.wrangleData();
    timeline.wrangleData();
}

function brushed() {
    var selection = d3.event.selection || timeline.x.range();
    var newValues = selection.map(timeline.x.invert);

    $("#date-slider")
        .slider('values', 0, newValues[0])
        .slider('values', 1, newValues[1]);
    $("#dateLabel1").text(formatTime(newValues[0]));
    $("#dateLabel2").text(formatTime(newValues[1]));
    lineChart.wrangleData();
}

d3.json("data/coins3.json").then(function(data){
    // Prepare and clean data
    for (var coin in data) {
        if (!data.hasOwnProperty(coin)) {
            continue;
        }
        filteredData[coin] = data[coin].filter(function(d){
            return !(d["price_usd"] == null);
        });
        filteredData[coin].forEach(function(d){
            d["price_usd"] = +d["price_usd"];
            d["24h_vol"] = +d["24h_vol"];
            d["market_cap"] = +d["market_cap"];
            d["date"] = parseTime(d["date"]);
        });
        donutData.push({
            "coin": coin,
            "data": filteredData[coin].slice(-1)[0]
        });
    }

    lineChart = new LineChart("#line-area");

    donutChart1 = new DonutChart("#donut-area1", "24h_vol");
    donutChart2 = new DonutChart("#donut-area2", "market_cap");

    timeline = new Timeline("#timeline-area");

});

/* new code 
var startBtn = document.getElementById("get-started");
startBtn.onclick = function() {
    alert("This application displays the 5 largest cryptocurrencies and their fluctuations in price, trading volume, and market capitalization over time. I used Python to scrape all the data from coinmarketcap.com. To explore, click INSTRUCTIONS to officially begin.");
};

var instructBtn = document.getElementById("instructions");
instructBtn.onclick = function() {
 	alert("[1 of 3] : Drag the ends of the date slider (top left) or the ends of the timeline (bottom of the page) to only include dates within a specific time period.");
    alert("[2 of 3] : Choose a cryptocurrency and a metric from the 2 dropdown lists below. You can also click on a color in the donut chart to choose the cryptocurrency.");
    alert("[3 of 3] : Hover over the line graph to see the specific $$ value. Enjoy!");	
};*/
 
 // Get the modal
var modal = document.getElementById('myModal'),
modal2 = document.getElementById('myModal2');

// Get the button that opens the modal
var btn = document.getElementById("get-started"),
btn2 = document.getElementById("instructions");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0],
span2 = document.getElementsByClassName("close")[1];

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
};

btn2.onclick = function() {
  modal2.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
};

span2.onclick = function() {
  modal2.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if ((event.target == modal) || (event.target == modal2)) {
    modal.style.display = "none";
    modal2.style.display = "none";
  }
};