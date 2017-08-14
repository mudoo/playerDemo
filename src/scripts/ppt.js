'use strict';

import '../styles/lightgallery.css';
import lightGallery from 'lightgallery.js';
import LG_Thumb from 'lg-thumbnail.js';
import LG_Full from 'lg-fullscreen.js';
import LG_Zoom from 'lg-zoom.js';
import pptData from '../../data/doc.json';

let DocEle, galleryData;

function parseData(list) {
    if (!list || !list instanceof Array) return [];

    let res = [];
    list.forEach(item => {
        res.push({
            src: item.path,
            thumb: item.path
        })
    });
    return res;
}

function init(ele = document.body) {
    if (DocEle) {
        DocEle.style.display = 'block';
        return;
    }

    DocEle = document.createElement('div');
    DocEle.className = 'ui-document';
    ele.appendChild(DocEle);

    lightGallery(DocEle, {
        container: DocEle,
        mask: false,

        mode: 'lg-slide',

        escKey: false,
        close: false,
        closable: false,

        download: true,

        thumbnail: true,
        thumbWidth: 200,
        thumbContHeight: 180,
        thumbMargin: 20,
        showThumbByDefault: false,

        zoom: true,
        scale: .8,

        fullScreen: true,

        mousewheel: true,
        loop: false,
        hideBarsDelay: 0,

        dynamic: true,
        dynamicEl: parseData(pptData.list)
    });
}

function destroy() {
    DocEle && (DocEle.style.display = 'none');
}

export { init, destroy };