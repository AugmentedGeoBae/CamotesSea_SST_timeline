Date.prototype.format = function (mask, utc) {
    return dateFormat(this, mask, utc);
};

var currentMonth = new Date();
currentMonth.setUTCDate(1, 0, 0, 0, 0);

var map = L.map('map', {
    zoom: 2,
    fullscreenControl: true,
    timeDimension: true,
    timeDimensionOptions:{
        timeInterval: "1981-09/" + currentMonth.format("yyyy-mm"),
        period: "P1M",
        currentTime: Date.parse("1981-09-01T00:00:00Z")
    },
    center: [20.0, 0.0],
}).setView([10.4, 124.45], 10);

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var proxy = 'server/proxy.php';
var testWMS = "https://www.ncei.noaa.gov/thredds/wms/ncFC/fc-oisst-daily-avhrr-only-dly/OISST_Daily_AVHRR-only_Feature_Collection_best.ncd"
var testLayer = L.tileLayer.wms(testWMS, {
    layers: 'sst',
    format: 'image/png',
    transparent: true,
    style: 'boxfill/sst_36',
    colorscalerange: '12,35',
    abovemaxcolor: "extend",
    belowmincolor: "extend",
    attribution: '<a href="http://www.ncdc.noaa.gov">NOAAs National Climatic Data Center</a>'
});

testLayer.setOpacity(0.5);

var testTimeLayer = L.timeDimension.layer.wms(testLayer, {
    proxy: proxy,
    updateTimeDimension: false,
});
testTimeLayer.addTo(map);

var testLegend = L.control({
    position: 'topright'
});
testLegend.onAdd = function(map) {
    var src = testWMS + "?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetLegendGraphic&LAYER=sst&PALETTE=sst_36&COLORSCALERANGE=-3,35";
    var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML +=
        '<img src="' + src + '" alt="legend">';
    return div;
};
testLegend.addTo(map);

L.Control.TimeDimensionCustom = L.Control.TimeDimension.extend({
    _getDisplayDateFormat: function(date){
        return date.format("dS mmmm yyyy");
    }
});
var timeDimensionControl = new L.Control.TimeDimensionCustom({
    playerOptions: {
        buffer: 1,
        minBufferReady: -1
    }
});
map.addControl(this.timeDimensionControl);
