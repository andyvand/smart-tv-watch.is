Player = {
    play: function(url) {
        var v = document.createElement('video');
        v.id = 'player';
        v.width = '320';
        v.height = '240';
        v.controls = 'controls';
        v.crossOrigin = 'use-credentials';
        v.preload = 'metadata';
        var s = document.createElement('source');
        s.src = url;
        s.type = 'video/mp4';
        v.appendChild(s);
        document.getElementById('player_wrapper').innerHTML = '';
        document.getElementById('player_wrapper').appendChild(v);
        document.getElementById('player_wrapper').style.display = 'block';
        //v.pause();
        v.load();
        v.play();
    }
};