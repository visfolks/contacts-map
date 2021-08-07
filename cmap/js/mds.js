function process_file(url) {

    var results = Papa.parse(url, {
        header: true,
        dynamicTypeing: true
    });

  var fnames = [], m, n;
  var fvecs = [];
    var mat = [];
    for (var row in results.data) {
      if (results.data[row].name.length > 0){
        fnames.push(results.data[row].name)
       // console.log(row) 
        var cur_row = [];
        for (const fld in results.data[row]){
          if (fld !== "name"){
            cur_row.push(results.data[row][fld]);
          } 
        }
        fvecs.push(cur_row.map(Number));
      }
        //     mat.push(results.data[row].map(Number));
    }
  m = fnames.length;
  n = fvecs[0].length;
    return [fnames, fvecs, m, n];
}
function jaccard(fvecs, m, n ){

  console.log(fnames);
  console.log(fvecs);
  console.log(m, n);

  var dmat = new Array(m);
  for (var i = 0; i < m; i++) {
  dmat[i] = new Array(n); // make each element an array
}

  for (var i=0; i<m ; i++){

    for (var j=i+1; j<m; j++){

      var uni = 0;
      var inter =0;

      for (var k=0; k<n; k++){
        uni = uni + (fvecs[i][k] || fvecs[j][k]);
        inter = inter + (fvecs[i][k] && fvecs[j][k]);
        // console.log(fvecs[i+k] || fvecs[j*n+k]);
      }

      dmat[i][j] = ((uni-inter))/(uni);
      dmat[j][i] = dmat[i][j];
    }
      dmat[i][i] = 0;
  }

  console.log(dmat);
  return [dmat]
}

function draw_plot(fnames, dmat) {
    // extract feature vectors
    // get Jaccard distances
    // jaccard(fvecs, m, n, dmat);
    // var results = Papa.parse(url, {
    //     header: false,
    //     dynamicTypeing: true
    // });
    // var m = convert_pp_to_array(results);
    var m = dmat;
    console.log(m);
    MARGIN = 100;
    d3.selectAll("svg > *").remove();
    svg = d3.select('svg');
    width = svg.node().getBoundingClientRect().width;
    height = svg.node().getBoundingClientRect().height;
    // keys = [..."abcdefghijklmnopqrstuvwzyz"];
    keys = fnames;
    points_data = mds_classic(m);
    console.log(points_data);
    min_x = d3.min(points_data, function (d) {
        return d[0];
    });
    max_x = d3.max(points_data, function (d) {
        return d[0];
    });
    min_y = d3.min(points_data, function (d) {
        return d[1];
    });
    max_y = d3.max(points_data, function (d) {
        return d[1];
    });

    x = d3.scaleLinear().domain([max_x, min_x]).range([MARGIN, width - MARGIN]);
    y = d3.scaleLinear().domain([min_y, max_y]).range([MARGIN, height - MARGIN]);
  
    var points_obj = get_points_obj (points_data);
    console.log(points_obj);

    var simulation = d3.forceSimulation(points_obj)
	.force('x', d3.forceX().x(function(d) {
    return x(d.xpos);
  }))
  .force('y', d3.forceY().y(function(d) {
    return y(d.ypos);
  }))
    .force('collision', d3.forceCollide().radius(function(d) {
		return d.radius
	}))
	.on('tick', ticked);

function ticked() {
	var u = d3.select('svg')
		.selectAll('.point')
		.data(points_obj);

  var enter_points = 
  u.join('g')
  .attr("class","point")
    .attr("transform", function(d){
      return "translate(" + ((d.x)) + "," + (d.y) + ")"
    });
  
		enter_points.append('circle')
		.attr('r', function(d) {
			return d.radius
		})
		.attr('cx', function(d) {
			return 0;
		})
		.attr('cy', function(d) {
			return 0;
		});

   enter_points.append('text')
    .attr("dx", 12)
    .attr("dy", ".35em")
    .text(function (d, i) {
        return keys[i];
    });
}


  // u.append("text").text(function(d,i){
  //   return keys[i];
  // })
  // .attr("dx", "0.35em")
  // .attr("y", 12);

    // // points = svg.selectAll('.point').data(points_data);
    // enter_points = points.enter().append('g').attr({
    //     "class": 'point',
    //     transform: function (d) {
    //         return "translate(" + (x(d[0])) + "," + (y(d[1])) + ")";
    //     }
    // });
    // enter_points.append('circle').attr({
    //     r: 6,
    //     opacity: 0.3
    // });
    // enter_points.append('circle').attr({
    //     r: 4
    // });
    // enter_points.append('text').text(function (d, i) {
    //     return keys[i];
    // }).attr({
    //     y: 12,
    //     dy: '0.35em'
    // });
    // enter_points.append('title').text(function (d, i) {
    //     return d[0] + ", " + d[1];
    // });
    // enter_points.on('click', function (d) {
    // });
}

function get_points_obj(points_data){

  points_obj = [];

  for (idx in points_data){
    var pt = points_data[idx];
    points_obj.push({"xpos":pt[0], "ypos":pt[1], "radius": 7});
  }
  return points_obj;
}

function convert_pp_to_array(results) {
    var mat = [];
    for (var row in results.data) {
        //console.log(results.data[row]);
        if (results.data[row].length > 1)
            mat.push(results.data[row].map(Number));
    }
    return (mat);
}
// given a matrix of distances between some points, returns the
/// point coordinates that best approximate the distances
mds_classic = function (distances, dimensions) {
    dimensions = dimensions || 2;
    // square distances
    var M = numeric.mul(-.5, numeric.pow(distances, 2));
    // double centre the rows/columns
    function mean(A) { return numeric.div(numeric.add.apply(null, A), A.length); }
    var rowMeans = mean(M), colMeans = mean(numeric.transpose(M)), totalMean = mean(rowMeans);
    for (var i = 0; i < M.length; ++i) {
        for (var j = 0; j < M[0].length; ++j) {
            M[i][j] += totalMean - rowMeans[i] - colMeans[j];
        }
    }
    // take the SVD of the double centred matrix, and return the
    // points from it
    var ret = numeric.svd(M), eigenValues = numeric.sqrt(ret.S);
    return ret.U.map(function (row) {
        return numeric.mul(row, eigenValues).splice(0, dimensions);
    });
};
