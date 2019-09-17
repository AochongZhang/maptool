window.onload = function(){
    new ClipboardJS('#copy');

    // 获取地图显示容器
    var map = new qq.maps.Map(document.getElementById("container"), {
        center: new qq.maps.LatLng(30.318859,120.251026),
        zoom:16,
        draggableCursor: "crosshair"
    });

    // 初始化路线
    polyline = new qq.maps.Polyline({
        strokeColor: '#00BFFF',
        strokeWeight: 8,
        map: map,
        editable: true
    });

    // 初始化坐标数组
    var path = [];

    // 地图单击事件
    qq.maps.event.addListener(map, 'click', function(event) {
        path.push(new qq.maps.LatLng(event.latLng.getLat(), event.latLng.getLng()));
        polyline.setPath(path)
        console.log("添加节点 " + path)
    });

    // 路线添加节点事件
    qq.maps.event.addListener(polyline, 'insertNode', function (event) {
        updatePath();
    })

    // 路线删除节点事件
    qq.maps.event.addListener(polyline, 'removeNode', function (event) {
        updatePath();
    })

    // 路线移动节点事件
    qq.maps.event.addListener(polyline, 'adjustNode', function (event) {
        updatePath();
    })

    // 更新坐标数组
    function updatePath() {
        path = [];
        polyline.getPath().forEach(function (i) {
            path.push(i);
        });
        console.log("路径数组更新 " + path);
    }


    // 生成json
    function genJson () {
        var genData = [];
        for (var i = 0; i < path.length; i++) {
            var latLng = path[i];
            var data = {}
            var latitudeName = $("#latitude-name").val();
            var longitudeName = $("#longitude-name").val();
            data[latitudeName] = latLng.lat;
            data[longitudeName] = latLng.lng;
            // var data = {
            //     latitude: latLng.lat,
            //     longitude: latLng.lng
            // }
            genData.push(data);
        }
        setTextValue(JSON.stringify(genData, null, 2));
    }

    $("#gen").click(function () {
        genJson();
    })
    $("#gen2").click(function () {
        genJson();
    })

    // 闭合路线
    $("#close").click(function () {
        path.push(path[0])
        polyline.setPath(path);
    })

    // 清除路线
    $("#clean").click(function () {
        path = []
        polyline.setPath(path);
    })

    // 设置值到生成框
    function setTextValue(str) {
        var genText = $("#genText");
        genText.empty();
        genText.append(str);
        // 代码高亮
        hljs.highlightBlock(genText[0]);
    }
}

