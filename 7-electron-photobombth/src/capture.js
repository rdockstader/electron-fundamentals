const electron = require('electron');

const video = require('./video');
const effects = require('./effects');
const countdown = require('./countdown');
const flash = require('./flash');

const { ipcRenderer: ipc, shell, remote } = electron;

const images = remote.require('./image');

let canvasTarget;
let seriously;
let videoSrc;

function formatImgTag(doc, bytes) {
    const div = doc.createElement('div');
    div.classList.add('photo');
    const close = doc.createElement('div');
    close.classList.add('photoClose');
    const img = new Image();
    img.classList.add('photoImg');
    img.src = bytes;
    div.appendChild(img);
    div.appendChild(close);
    return div;
}

window.addEventListener('DOMContentLoaded', _ => {
    const videoEl = document.getElementById('video');
    const canvasEl = document.getElementById('canvas');
    const recordEl = document.getElementById('record');
    const photosEl = document.querySelector('.photosContainer');
    const counterEl = document.getElementById('counter');
    const flashEl = document.getElementById('flash');

    seriously = new Seriously();
    videoSrc = seriously.source('#video');
    canvasTarget = seriously.target('#canvas');
    effects.choose(seriously, videoSrc, canvasTarget);

    video.init(navigator, videoEl);
    
    
    recordEl.addEventListener('click', _ => {
        
        countdown.start(counterEl, 3, _ => {
            flash(flashEl);
            const bytes = video.captureBytesFromLiveCanvas(canvasEl);
            ipc.send('image-captured', bytes);
            photosEl.appendChild(formatImgTag(document, bytes));
        });
    });

    photosEl.addEventListener('click', evt => {
        const isRm = evt.target.classList.contains('photoClose');
        const selector = isRm ? '.photoClose' : '.photoImg'

        const photos = Array.from(document.querySelectorAll(selector));
        const index = photos.findIndex(el => el == evt.target);

        if (index > -1) {
            if (isRm) {
                ipc.send('image-remove', index);
            } else {
                shell.showItemInFolder(images.getFromCache(index));
            }
        }  
    })
});

ipc.on('image-removed', (evt, index) => {
    console.log(index);
    const photos = Array.from(document.querySelectorAll('.photo'));
    console.log(photos);
    const child = photos[index];
    console.log(child);
    document.getElementById('photos').removeChild(child);
});

ipc.on('effect-choose', (evt, effectName) => {
    effects.choose(seriously, videoSrc, canvasTarget, effectName);
});

ipc.on('effect-cycle', (evt) => {
    effects.cycle(seriously, videoSrc, canvasTarget);
});