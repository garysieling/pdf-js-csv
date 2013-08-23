/*
pages[1][0]
Object {c: "N", x: 601.2750000000001, y: 66.87}
pages[1][1]
Object {c: "e", x: 609.9331980000001, y: 66.87}
pages[1][2]
Object {c: "t", x: 615.1955520000001, y: 66.87}
*/

/*
csv.split("\n").length
18
csv.split('","').length
195
*/

function makeClusters(marks, n) {
  var clusters = [];
  for (var i = 0; i < n; i++) {
    clusters[i] = [];
  }

  for (var j = 0; j < marks.length; j++) {
    var cluster = clusters[Math.floor(Math.random() * n)];
    cluster[cluster.length] = marks[j];
  }

  return clusters;
}

function dist(a, b) {
  return ((a.x - b.x) * (a.x - b.x) + 
          2 * (a.y - b.y) * (a.y - b.y));
}

function get_center(cluster) {
  if (cluster.length === 0) {
    return {x: 0, y: 0}
  }

  var x = 0;
  var y = 0;
  for (var i = 0; i < cluster.length; i++) {
    x += cluster[i].x;
    y += cluster[i].y;
  }

  return {x : x / cluster.length, y: y / cluster.length};
}

/*
get_center(clusters[0])
Object {x: 566.6290639692193, y: 566.6290639692193}
get_center(clusters[1])
Object {x: 573.3516736674399, y: 573.3516736674399}
get_center(clusters[2])
Object {x: 579.2144403231891, y: 579.2144403231891}
*/

function get_centers(clusters) {
  var centers = [];
  for (var i = 0; i < clusters.length; i++) {
    centers[i] = get_center(clusters[i]);
  }
  return centers;
}

/*
get_centers(clusters)
Array[195]
*/

function closest(centers, point) {
  var closest = -1, min_dist = -1;
  for (var i = 0; i < centers.length; i++) {
    var distance = dist(centers[i], point);
    if (distance < min_dist || min_dist === -1) {
      closest = i;
      min_dist = distance;
    }
  }
  return closest;
}

/*
closest(centers, centers[130])
130
closest(centers, centers[129])
129
closest(centers, centers[120])
120
*/

function avg_err(clusters) {
  var centers = get_centers(clusters);
  var err = 0;

  for (var i = 0; i < clusters.length; i++) {
    for (var j = 0; j < clusters[i].length; j++) {
      err += dist(clusters[i][j], centers[i]);
    }
  }

  return err;
}

/*
avg_err(clusters)
538350.7978454747
*/

function next(clusters, points) {
  var centers = get_centers(clusters);
  var new_clusters = [];
  for (var i = 0; i < clusters.length; i++) {
    new_clusters[i] = [];
  }
  
  for (var j = 0; j < points.length; j++) {
    var idx = closest(centers, points[j]);
    var cluster = new_clusters[idx];
    cluster[cluster.length] = points[j];
  }

  return new_clusters;
}

function tries(points, nc, n) {
  var res = makeClusters(points, nc);
  var err = avg_err(res);
  console.log(err);

  for (var i = 0; i < n; i++) {
    res = next(res, points);
    var err = avg_err(res);

    if (err === last_err) {
      return res;
    }
    var last_err = err;
    console.log(err);
  }

  return res;
}

res = tries(pages[1], 195, 100)
centers = get_centers(res);

function typewriter(a1, b1) {
  // 20 lines / page, 80 characters / line
  var a = get_center(a1);
  var b = get_center(b1);
  return (Math.floor(a.x / 1100 * 23) + Math.floor(a.y / 840 * 80)) -
         (Math.floor(b.x / 1100 * 23) + Math.floor(b.y / 840 * 80));
}

function prn_csv(res) {
  c.sort(typewriter);

  for (var i = 0; i < res.length; i++) {
    if (res[i].length > 0) {
      chrs = res[i].sort(typewriter);
      var w = '';
      var lastY = -1;
      for (var j = 0; j < chrs.length; j++) { 
        if (chrs[j].y - lastY > 0.5) {
          w += "<br>";
        }
        w += chrs[j].c;
        lastY = chrs[j].y;
      }
      console.log(w);
    }
  }
}
