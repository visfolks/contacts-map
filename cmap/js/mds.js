
function draw_plot(url){
  var results = Papa.parse(url, {
    header: false,
    dynamicTypeing: true
  });


  var m = convert_pp_to_array(results);
  console.log(m);
  //d3.csv(url, function(error, data){
  //console.log(data)
  // Add dots
  // svg.append('g')
  //   .selectAll("dot")
  //   .data(data)
  //   .enter()
  //   .append("circle")
  //   .attr("cx", function (d) { return +d.x; } )
  //   .attr("cy", function (d) { return +d.y; } )
  //   .attr("r", 1.5)
  //   .style("fill", "#69b3a2") 

  // });

  MARGIN = 100;

  svg = d3.select('svg');

  width = svg.node().getBoundingClientRect().width;

  height = svg.node().getBoundingClientRect().height;

  keys = [..."abcdefghijklmnopqrstuvwzyz"];

  points_data = mds_classic(m);

  min_x = d3.min(points_data, function(d) {
    return d[0];
  });

  max_x = d3.max(points_data, function(d) {
    return d[0];
  });

  min_y = d3.min(points_data, function(d) {
    return d[1];
  });

  max_y = d3.max(points_data, function(d) {
    return d[1];
  });

  x = d3.scale.linear().domain([max_x, min_x]).range([MARGIN, width - MARGIN]);

  y = d3.scale.linear().domain([min_y, max_y]).range([MARGIN, height - MARGIN]);

  links_data = [];

  points_data.forEach(function(p1, i1) {
    var array;
    array = [];
    points_data.forEach(function(p2, i2) {
      if (i1 !== i2) {
        return array.push({
          source: p1,
          target: p2,
          dist: m[i1][i2]
        });
      }
    });
    return links_data = links_data.concat(array);
  });

  links = svg.selectAll('.link').data(links_data);

  links.enter().append('line').attr({
    "class": 'link',
    x1: function(d) {
      return x(d.source[0]);
    },
    y1: function(d) {
      return y(d.source[1]);
    },
    x2: function(d) {
      return x(d.target[0]);
    },
    y2: function(d) {
      return y(d.target[1]);
    }
  });

  points = svg.selectAll('.point').data(points_data);

  enter_points = points.enter().append('g').attr({
    "class": 'point',
    transform: function(d) {
      return "translate(" + (x(d[0])) + "," + (y(d[1])) + ")";
    }
  });

  enter_points.append('circle').attr({
    r: 6,
    opacity: 0.3
  });

  enter_points.append('circle').attr({
    r: 4
  });

  enter_points.append('text').text(function(d, i) {
    return keys[i];
  }).attr({
    y: 12,
    dy: '0.35em'
  });

  enter_points.append('title').text(function(d, i) {
    return d[0] + ", " + d[1];
  });

  enter_points.on('click', function(d) {

  });


};

function convert_pp_to_array(results){

  var mat = [];

  for (const row in results.data){
    //console.log(results.data[row]);
    if (results.data[row].length > 1)
      mat.push(results.data[row].map(Number));
  }
  return (mat);
}


// given a matrix of distances between some points, returns the
/// point coordinates that best approximate the distances
mds_classic = function(distances, dimensions) {
  dimensions = dimensions || 2;

  // square distances
  var M = numeric.mul(-.5, numeric.pow(distances, 2));

  // double centre the rows/columns
  function mean(A) { return numeric.div(numeric.add.apply(null, A), A.length); }
  var rowMeans = mean(M),
    colMeans = mean(numeric.transpose(M)),
    totalMean = mean(rowMeans);

  for (var i = 0; i < M.length; ++i) {
    for (var j =0; j < M[0].length; ++j) {
      M[i][j] += totalMean - rowMeans[i] - colMeans[j];
    }
  }

  // take the SVD of the double centred matrix, and return the
  // points from it
  var ret = numeric.svd(M),
    eigenValues = numeric.sqrt(ret.S);
  return ret.U.map(function(row) {
    return numeric.mul(row, eigenValues).splice(0, dimensions);
  });
};
