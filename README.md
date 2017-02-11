# Had A Love

## Intro

Recreating the Vessels ["Had A Love"](https://vesselsband.bandcamp.com/track/had-a-love-feat-anna-of-the-north) single artwork in 3D . Click / touch and drag to rotate the camera around. The camera will start moving to random positions after 5 seconds of inactivity.

Tech used:

* Javascript
* GLSL
* WebGL
* Three.js
* GSAP
* THREE.MeshLine

Uses a few different elements used to make this:

* Box geometry translated and rotated into place to create the star shape
2 point lights rotating around the main feature
* 65,536 GPGPU particles to create the dust, the shader takes the 2 point light positions and calculates the colour and opacity of each particle
* The spite’s MeshLine used to create the random hairs floating about


## Install

* `npm install budo -g`
* `npm install`
* `bower install`

## Run

`budo index.js`

Navigate to http://localhost:9966.


## Licence

MIT