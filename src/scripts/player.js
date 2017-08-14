'use strict';

import '../styles/vjs.css';

// import VJS_ie8 from 'videojs/ie8/videojs-ie8.js';
import VJS from 'video.js';
// import HLS from 'videojs-contrib-hls';
import VJS_chs from 'videojs/lang/zh-CN.js';
import videoData from '../../data/video.json';

const SRC = videoData.list[0].path;
const SWF = require('../swf/video-js.swf');
const SWF_HLS = require('../swf/video-js-hls.swf');

let Video, Player, CurTime = 0;

const opts = {
    textTrackDisplay: false,
    captionsButton: false,
    textTrackSettings: false,
    controlBar: {
        children: [
            'playToggle',
            'currentTimeDisplay',
            'timeDivider',
            'durationDisplay',
            'progressControl',
            // 'liveDisplay',
            // 'remainingTimeDisplay',
            // 'customControlSpacer',
            // 'playbackRateMenuButton',
            // 'chaptersButton',
            // 'descriptionsButton',
            // 'subtitlesButton',
            // 'captionsButton',
            // 'audioTrackButton',
            'fullscreenToggle',
            'volumeMenuButton',
        ],
    },
    // loadingSpinner: false,
    errorDisplay: false,
    preload: true,
    autoplay: true,
    controls: true,
    language: 'zh-CN',
    techOrder: selectTech(SRC),

    // html5: {
    //     hls: {
    //         withCredentials: true
    //     }
    // },
    flash: {
        // hls: {
        //     withCredentials: true
        // },
        swf: selectSWF(SRC),
        flashVars: {
            hls_debug: false,
            hls_debug2: false
        }
    },

};

function judgeHls(src) {
    return src.match(/\.m3u8$/) ? true : false;
}

function selectTech(src) {
    if (judgeHls(src)) {
        return ['flash', 'html5'];
        // return ['html5', 'flash'];
    } else if (src.match(/\.flv$/)) {
        return ['flash', 'html5'];
    } else {
        return ['html5', 'flash'];
    }
}

function selectSWF(src) {
    return judgeHls(src) ? SWF_HLS : SWF;
}

function init(ele = document.body) {
    Video = document.createElement('video');
    Video.setAttribute('class', 'ui-video video-js vjs-default-skin');
    ele.appendChild(Video);

    // 实例化
    Player = VJS(Video, opts);

    Player.on('timeupdate', (e, c) => {
        CurTime = Player.currentTime();
        console.log(CurTime);
    });

    Player.on('play', (e) => {
        Player.currentTime(CurTime);
    });

    if (opts.techOrder[0] == 'flash') {
        Player.src(SRC);
    } else {
        Player.src({
            src: SRC,
            type: 'application/x-mpegURL',
        });
    }
}

function destroy() {
    Player && Player.dispose();
}

export { init, destroy };