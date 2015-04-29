Info = function() {};

Info.prototype.loadAndRenderInfo = function(id) {
    Main.showTintWithSpinner();
    Main.resource.getInfo(id);
};

Info.prototype.renderInfo = function(info) {
    Main.hideTint();
    Main.activateScene(Main.SCENE_INFO_ID);
    var videoList = document.getElementById('info_scene_videos_list'),
        qualities = {},
        url,
        video,
        videoButtonText;
    for (var v = 0; v < info.videos.length; v++) {
        qualities = info.videos[v]['streams']['http'];
        for (var q in qualities) {
            if (!qualities.hasOwnProperty(q)) {
                continue;
            }
            url = qualities[q];
            video = document.createElement('li');
            video.tabIndex = -1;
            video.className = 'video-stream';
            video.dataset.url = url;
            videoButtonText = document.createTextNode(q);
            video.appendChild(videoButtonText);
            videoList.appendChild(video);
        }
    }
    console.dir(info);
};

Info.prototype.enterHandler = function(keyEvent) {
    if (keyEvent.srcElement.classList.contains('video-stream')
        && keyEvent.srcElement.dataset['url'] != undefined
    ) {
        var url = keyEvent.srcElement.dataset['url'];
        Player.play(url);
        //infoScene.loadAndRenderInfo(keyEvent.srcElement.dataset['id']);
    }
};