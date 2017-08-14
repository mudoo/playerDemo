import '../../styles/base.less';

import * as Player from '../player';
import * as PPT from '../ppt';

import '../../styles/index.less';

const $nav = document.querySelector('#js_nav');
const $navs = $nav.querySelectorAll('a');
const $cont = document.querySelector('#js_content');

const Modules = {
    'player': Player,
    'ppt': PPT
};

let LastModule;

function navigate(module = Player) {
    if (LastModule == module) return;

    LastModule && LastModule.destroy && LastModule.destroy();
    LastModule = module;
    module.init && module.init($cont);
}

function navigateTo(target) {
    let module = target.getAttribute('data-module');

    if (!Modules[module]) return;

    for (let i = 0; i < $navs.length; i++) {
        $navs[i].className = '';
    }

    target.className = 'active';
    navigate(Modules[module]);
}

function init() {
    $nav.addEventListener('click', e => {
        e = e || event;
        navigateTo(e.target);
    })

    navigateTo($navs[0]);
}

init();