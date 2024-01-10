import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Clase Prisma
class PrismGeometry extends THREE.ExtrudeGeometry {
  constructor(vertices, height) {
    super(new THREE.Shape(vertices), {depth: height, bevelEnabled: false});
  }
}

let container, stats;

let camera, scene, renderer;

let particleLight;
let group;

init();
animate();

function init() {
    camera = new THREE.PerspectiveCamera( 27, window.innerWidth / window.innerHeight, 0.25, 50 );
    camera.position.z = 10;
    camera.position.y = 3;

    scene = new THREE.Scene();

    group = new THREE.Group();
    scene.add( group );

    // LIGHTS
    particleLight = new THREE.Mesh(
        new THREE.SphereGeometry( .05, 8, 8 ),
        new THREE.MeshBasicMaterial( { color: 0xffffff } )
    );
    scene.add( particleLight );

    particleLight.add( new THREE.PointLight( 0xffffff, 90 ) );
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    var A = new THREE.Vector3( 0, 1, 0.2);
    var B = new THREE.Vector3( 0.6, 0, 0.2 );
    var C = new THREE.Vector3( -0.6, 0, 0.2 );
    var height = 1;                   
    var geometry = new PrismGeometry( [ A, B, C ], height ); // utilizo para crear el prisma rectangular
    geometry.rotateX(Math.PI/2)
    geometry.scale(1.3,1.3,1.3)
    geometry.translate(0.1,0.1,0.1)
    // geometry.rotateY(Math.PI)
    var material = new THREE.MeshToonMaterial( { color: 0x78787 } );
    var cube = new THREE.Mesh( geometry, material );
    group.add( cube );

    geometry = new THREE.BoxGeometry(2.3,0.05,2.3); // Terraza baja
    geometry.translate(-0.15,-1.4,0.9);
    material = new THREE.MeshToonMaterial( { color: 0x787878 } );
    cube = new THREE.Mesh(geometry, material);
    group.add(cube);
    
    geometry = new THREE.BoxGeometry(1.9,0.2,1.9); // 1er piso
    geometry.translate(-0.15,-1.5,0.85);
    material = new THREE.MeshToonMaterial( { color: 0x00278 } );
    cube = new THREE.Mesh(geometry, material);
    group.add(cube);

    geometry = new THREE.BoxGeometry(1.1,0.2,0.8); // Planta baja central
    geometry.translate(0.13,-1.7,0.9);
    material = new THREE.MeshToonMaterial( { color: 0xaa0078 } );
    cube = new THREE.Mesh(geometry, material);
    group.add(cube);

    geometry = new THREE.BoxGeometry(0.4,0.2,0.8); // Planta baja izq
    geometry.translate(-0.78,-1.7,0.9);
    material = new THREE.MeshToonMaterial( { color: 0xffffff } );
    cube = new THREE.Mesh(geometry, material);
    group.add(cube);

    geometry = new THREE.BoxGeometry(1.9,0.2,0.46); // Planta baja fondo
    geometry.translate(-0.15,-1.7,0.13);
    material = new THREE.MeshToonMaterial( { color: 0x00bc78 } );
    cube = new THREE.Mesh(geometry, material);
    group.add(cube);

    geometry = new THREE.ConeGeometry(0.45,0.15,3,1) // Tragaluz
    geometry.translate(-0.75,-1.3,0.85)
    material = new THREE.MeshToonMaterial( { color: 0xff1000 } );
    cube = new THREE.Mesh(geometry, material);
    group.add(cube);

    geometry = new THREE.BoxGeometry(0.7,0.01,0.55); // Piscina
    geometry.translate(-0.65,-1.37,1.6)
    material = new THREE.MeshToonMaterial( { color: 0xff110 } );
    cube = new THREE.Mesh(geometry, material);
    group.add(cube);

    // Pilar
    var pillarVertices = new Float32Array( [ 
        0.0, 0.0,  0.05, // v0
        0.1, 0.0,  0.0, // v1
        0.1, 0.4,  0.0, // v2
        0.0, 0.4,  0.05, // v3
        -0.05, 0.2, 0.075, // v4
        0.0, 0.0,  -0.05, // v5 = v0 backside
        0.0, 0.4,  -0.05, // v6 = v3 backside
        -0.05, 0.2, -0.075, // v7 = v4 backside
    ] );

    // regla de la mano derecha
    var indices = [
        // front
        0, 1, 2,
        2, 3, 0,
        0, 3, 4,

        // back
        1, 5, 2,
        6, 2, 5,
        6, 5, 7,

        // bottom lid
        1, 0, 5,

        // top lid
        3, 2, 6,

        // side top cover
        5, 0, 4,
        5, 4, 7,

        // side bottom cover
        3, 6, 4,
        4, 6, 7,
    ];

    var pillarGeometry = new THREE.BufferGeometry();
    pillarGeometry.setIndex(indices);
    pillarGeometry.setAttribute('position',new THREE.BufferAttribute(pillarVertices, 3));
    material = new THREE.MeshToonMaterial( { color: 0x606060 } );
    var mesh = new THREE.Mesh(pillarGeometry, material);
    
    // Translate, rotate y group.add las veces que se repita el pilar
    pillarGeometry.rotateY(-Math.PI / 2);
    pillarGeometry.translate(0.1, -1.8, 1.85);
    group.add(mesh);


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

    // for ( let i = 0; i < group.children.length; i ++ ) {

    //     const child = group.children[ i ];
    //     child.rotation.y += 0.005;

    // }

    renderer.render( scene, camera );

}

