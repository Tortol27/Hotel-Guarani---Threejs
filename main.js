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

    // Terraza
    geometry = new THREE.BoxGeometry(2.3,0.05,2.3);
    geometry.translate(-0.15,-1.4,0.9);
    material = new THREE.MeshToonMaterial( { color: 0x787878 } );
    cube = new THREE.Mesh(geometry, material);
    group.add(cube);
    
    // 1er piso
    geometry = new THREE.BoxGeometry(1.9,0.2,1.9);
    geometry.translate(-0.15,-1.5,0.85);
    material = new THREE.MeshToonMaterial( { color: 0x00278 } );
    cube = new THREE.Mesh(geometry, material);
    group.add(cube);

    // Planta baja central
    geometry = new THREE.BoxGeometry(1.1,0.2,0.8); 
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
    geometry.translate(-0.85,-1.3,0.85)
    material = new THREE.MeshToonMaterial( { color: 0xff1000 } );
    cube = new THREE.Mesh(geometry, material);
    group.add(cube);

    geometry = new THREE.BoxGeometry(0.7,0.01,0.55); // Piscina
    geometry.translate(-0.65,-1.37,1.6)
    material = new THREE.MeshToonMaterial( { color: 0xff110 } );
    cube = new THREE.Mesh(geometry, material);
    group.add(cube);

    // Pilares
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
    pillarGeometry.translate(0.7, -1.8, 1.85);
    // group.add(mesh);

    var pilares = new THREE.Group();
    pilares.add(mesh);
    for (let i = 0; i<6; i++){
        var mesh2 = mesh.clone();
        mesh2.translateX(-i/3);
        // group.add(mesh2);
        pilares.add(mesh2);
    }
    var pilarLadoDer = pilares.clone();
    pilarLadoDer.rotateY(Math.PI/2);
    pilarLadoDer.translateX(-0.75);
    pilarLadoDer.translateZ(-1);
    pilares.add(pilarLadoDer);
    
    var pilarAtras = pilarLadoDer.clone();
    pilarAtras.rotateY(Math.PI/2);
    pilarAtras.translateX(-0.75);
    pilarAtras.translateZ(-0.95);
    pilares.add(pilarAtras);

    var pilarLadoIzq = pilarAtras.clone();
    pilarLadoIzq.rotateY(Math.PI/2);
    pilarLadoIzq.translateX(-0.75);
    pilarLadoIzq.translateZ(-0.95);
    pilares.add(pilarLadoIzq);
    
    scene.add(pilares);


    // Habitaciones
    var A = new THREE.Vector3( 0, 1, 0.2);
    var B = new THREE.Vector3( 0.6, 0, 0.2 );
    var C = new THREE.Vector3( -0.6, 0, 0.2 );
    var height = 1;                   
    var geometry = new PrismGeometry( [ A, B, C ], height ); // utilizo para crear el prisma rectangular
    geometry.rotateX(Math.PI/2)
    geometry.scale(1.35,1.35,1.35)
    geometry.translate(0.1,0.29,0.1)
    // geometry.rotateY(Math.PI)
    var material = new THREE.MeshToonMaterial( { color: 0x78787 } );
    var cube = new THREE.Mesh( geometry, material );
    group.add( cube );

    // Bases Habitaciones
    var A = new THREE.Vector3( 0, 0.9, 0.2);
    var B = new THREE.Vector3( 0.5, 0, 0.2 );
    var C = new THREE.Vector3( -0.5, 0, 0.2 );
    var height = 0.15;                   
    var geometry = new PrismGeometry( [ A, B, C ], height ); // utilizo para crear el prisma rectangular
    geometry.rotateX(Math.PI/2);
    geometry.scale(1.25,1.25,1.25);
    geometry.translate(0.1,-1.05,0.15);
    // geometry.rotateY(Math.PI)
    var material = new THREE.MeshToonMaterial( { color: 0xFFBF00 } );
    var cube = new THREE.Mesh( geometry, material );
    group.add( cube );

    var A = new THREE.Vector3( 0.2, 0.7, 0.2);
    var B = new THREE.Vector3( 0.5, 0, 0.2 );
    var C = new THREE.Vector3( -0.5, 0, 0.2 );
    var D = new THREE.Vector3(-0.2,0.7,0.2);
    var height = 0.16;                   
    var geometry = new PrismGeometry( [ A, B, C, D ], height ); // utilizo para crear el prisma rectangular
    geometry.rotateX(Math.PI/2);
    // geometry.scale(1.05,1.05,1.05);
    geometry.translate(0.1,-1.2,0.17);
    var material = new THREE.MeshToonMaterial( { color: 0x78e667 } );
    var cube = new THREE.Mesh( geometry, material );
    group.add( cube );

    var geometry = new THREE.BoxGeometry(0.4,0.35,0.1); // Base rectangular de atras
    geometry.translate(0.08,-1.23,0.15);
    material = new THREE.MeshToonMaterial( { color: 0xb0171c } );
    cube = new THREE.Mesh(geometry, material);
    group.add(cube);

    // Pilares de Habitaciones
    
    var pilaresH = new THREE.Group();
    var pilar = new THREE.BufferGeometry();
    pilar.setIndex(indices);
    pilar.setAttribute('position',new THREE.BufferAttribute(pillarVertices, 3));
    material = new THREE.MeshToonMaterial( { color: 0xe36895 } );
    var meshH = new THREE.Mesh(pilar, material);
    pilaresH.scale.set(0.8, 0.8,0.8);
    pilaresH.rotateY(1.064);
    pilaresH.position.set(-1.43, 0.062,1.05);
    pilaresH.add(meshH);

    for (let i = 0; i<5; i++){
        var mesh2 = meshH.clone();
        mesh2.translateX(2*i/5);
        pilaresH.add(mesh2);
    }
    
    for (let i = 0; i<5; i++){
        var mesh2 = meshH.clone();
        mesh2.rotateOnAxis(new THREE.Vector3(0,1,0),Math.PI);
        mesh2.rotateY(1.0136);
        mesh2.translateZ(-3.34);
        mesh2.translateX(0.43);
        mesh2.translateX(-2*i/5);
        pilaresH.add(mesh2);
    }

    for (let i = 0; i<5; i++){
        var mesh2 = meshH.clone();
        mesh2.rotateY(Math.PI);
        mesh2.rotateY(-1.064);
        mesh2.translateX(-3.4);
        mesh2.translateZ(-0.7);
        if (i == 2) continue;
        mesh2.translateX(2*i/5);
        pilaresH.add(mesh2);
    }
    scene.add(pilaresH);

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

