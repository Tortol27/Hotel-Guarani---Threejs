import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let container, stats;

let camera, scene, renderer;

let particleLight;
let group;

init();
animate();

function init() {
    camera = new THREE.PerspectiveCamera( 27, window.innerWidth / window.innerHeight, 0.25, 50 );
    camera.position.z = 10;

    scene = new THREE.Scene();

    group = new THREE.Group();
    scene.add( group );

    // LIGHTS
    particleLight = new THREE.Mesh(
        new THREE.SphereGeometry( .05, 8, 8 ),
        new THREE.MeshBasicMaterial( { color: 0xffffff } )
    );
    scene.add( particleLight );

    particleLight.add( new THREE.PointLight( 0xffffff, 30 ) );
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

    // EVENTS

    const controls = new OrbitControls( camera, renderer.domElement );
    controls.minDistance = 3;
    controls.maxDistance = 30;

    window.addEventListener( 'resize', onWindowResize );
}

function onWindowResize() {

    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize( width, height );

}

function animate() {

    requestAnimationFrame( animate );

    render();

    // stats.update();

}

function render() {

    const timer = Date.now() * 0.000025;

    particleLight.position.x = Math.sin( timer * 7 ) * 3;
    particleLight.position.y = Math.cos( timer * 5 ) * 4;
    particleLight.position.z = Math.cos( timer * 3 ) * 3;

    for ( let i = 0; i < group.children.length; i ++ ) {

        const child = group.children[ i ];
        child.rotation.y += 0.005;

    }

    renderer.render( scene, camera );

}

