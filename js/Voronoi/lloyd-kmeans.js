
"use strict";

var kmeans = function(data, n_clusters) {
    if (typeof data === 'undefined') throw new Error('Sample data is missing.');
    if (typeof n_clusters === 'undefined') n_clusters = 3;

    var n_features = null,
        n_samples  = null;

    var centroids = new Array(),
        labels    = new Array(),
        inertia   = 0;

    n_features = data.length;
    n_samples  = data[0].length;
    for (var f = 0; f < n_features; f++) {
        if (n_samples !== data[f].length)
            throw new Error('n_samples are not the same for all features.');
    }

    var boundaries = new Array();
    for (var f = 0; f < n_features; f++) {
        boundaries[f] = { min: Infinity, max: -Infinity };
        for (var s = 0; s < n_samples; s++) {
            if (data[f][s] < boundaries[f].min)
                boundaries[f].min = data[f][s];
            if (data[f][s] > boundaries[f].max)
                boundaries[f].max = data[f][s];
        }
    }

    for (var c = 0; c < n_clusters; c++) {
        centroids[c] = new Array();
        for (var f = 0; f < n_features; f++) {
            centroids[c][f] = Math.random() * (boundaries[f].max - boundaries[f].min) + boundaries[f].min;
        }
    }

    self.step = function() {
        inertia = 0;

        for (var s = 0; s < n_samples; s++) {

            var distance = Infinity,
                label    = 0;

            for (var c = 0; c < n_clusters; c++) {
                var _distance = 0;

                for (var f = 0; f < n_features; f++)
                    _distance += (data[f][s] - centroids[c][f]) * (data[f][s] - centroids[c][f]);
                if (_distance < distance) {
                    distance = _distance;
                    label    = c;
                }
            }

            inertia  += distance;
            labels[s] = label;
        }

        for (var c = 0; c < n_clusters; c++) {
            for (var f = 0; f < n_features; f++) {

                var mean_sum   = 0,
                    mean_count = 0;

                for (var s = 0; s < n_samples; s++) {
                    if (labels[s] === c) {
                        mean_sum  += data[f][s];
                        mean_count++;
                    }
                }

                centroids[c][f] = mean_sum / mean_count;
            }
        }

        return {
            centroids: centroids,
            labels: labels,
            inertia: inertia
        }
    }

    self.predict = function(max_iterations) {
        if (typeof max_iterations === 'undefined' || !Number.isInteger(max_iterations))  max_iterations = 100;

        var previous_centroids = null;
        for (var i = 0; i < max_iterations; i++) {
            previous_centroids = centroids.toString();
            step();
            if (centroids.toString() === previous_centroids) break;
        }
        return {
            centroids: centroids,
            labels: labels,
            inertia: inertia
        }
    }

    return self;
}