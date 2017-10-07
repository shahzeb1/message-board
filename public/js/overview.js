// Any of the following formats may be used
var ctx = document.getElementById('myChart');

// AJAX json chart
var request = new XMLHttpRequest();
request.open('GET', '/api/overview', true);

request.onload = function() {
  if (request.status >= 200 && request.status < 400) {
    var data = JSON.parse(request.responseText);
    var d = []; // Data (int) values
    var l = []; // Labels (string) values
    for (var key in data) {
      l.push(key);
      d.push(parseInt(data[key]));
    }

    data = {
      datasets: [
        {
          data: d,
          backgroundColor: [
            '#3e95cd',
            '#8e5ea2',
            '#3cba9f',
            '#33DF00',
            '#462CA0',
            '#BA29D6'
          ]
        }
      ],
      labels: l
    };

    var myDoughnutChart = new Chart(ctx, {
      type: 'doughnut',
      data: data
    });
  } else {
    console.log('Hmm.. something went wrong.');
  }
};

request.onerror = function() {
  console.log('Hmm.. something went wrong.');
};

request.send();

// JSON get search list:
Array.prototype.findReg = function(match) {
  var reg = new RegExp(match);
  return this.filter(function(item) {
    return item.match(reg);
  });
};

var rq = new XMLHttpRequest();
rq.open('GET', '/api/search', true);
let searchList = [];
rq.onload = function() {
  if (rq.status >= 200 && rq.status < 400) {
    // Success!
    searchList = JSON.parse(rq.responseText);
  } else {
    // We reached our target server, but it returned an error
    console.log('Hmm.. something went wrong.');
  }
};

rq.onerror = function() {
  console.log('Hmm.. something went wrong.');
};

rq.send();

// Render the table with search results:
let createResultsTable = (d) => {
  const table = document.getElementsByClassName("searchResults")[0];
  table.innerHTML = null;
  if(d != null){
    for(let i = 0; i < d.length; i++) {
      let newRow   = table.insertRow(i);
      let newCell  = newRow.insertCell(0);
      newCell.innerHTML = `<a href="/c/${d[i]}">${d[i]}</a>`;
    }
  }
}

// When search input is pressed:
let pressed = () => {
  const input = document.getElementById('searchInput');
  const val = input.value;
  const d = searchList.findReg(`${val}`);
  if(d.length != searchList.length && d.length != 0) {
    createResultsTable(d);
  }
  if(val == "") {
    createResultsTable(null);
  }
}
document.getElementById('searchInput').addEventListener('keyup', pressed);

// Random button is clicked:
const r = document.getElementById("random");
const click = () => {
  const rand = Math.round(Math.random() * (searchList.length - 1));
  const loc = searchList[rand];
  window.location = `/c/${loc}`;
}
r.addEventListener('click', click);
