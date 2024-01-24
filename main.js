import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Clase Prisma
class PrismGeometry extends THREE.ExtrudeGeometry {
  constructor(vertices, height) {
    super(new THREE.Shape(vertices), {depth: height, bevelEnabled: false});
  }
}

let camera, scene, renderer;
let a = -3000;
let itBus = -1000, itBus2 = -1000;

let particleLight;
let group; 
let daffy, bus, bus2, hatch, hatch2, hatch3, kombi, kombi2;
let animacionDaffy = false, moveSun= true, moveTraffic = false;
var dir = -1;
let flag;
let clock = new THREE.Clock();
let v = new THREE.Vector3();
var groupFlag = new THREE.Group();


var showEasterEgg = false;
var eeGroup;

init();
animate();

function init() {
    camera = new THREE.PerspectiveCamera( 27, window.innerWidth / window.innerHeight, 0.25, 50 );
    camera.position.z = 10;
    camera.position.y = 3;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x99d6f0);

    group = new THREE.Group();
    scene.add( group );

    // LIGHTS
    particleLight = new THREE.Mesh(
        new THREE.SphereGeometry( .4, 16, 16 ),
        new THREE.MeshBasicMaterial( { color: 0xffffff } )
    );
    scene.add( particleLight );
    var light = new THREE.DirectionalLight( 0xffffff, 4 );
    light.castShadow = true;
    light.shadow.radius = 25;
    particleLight.add (light);
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.shadowMap.enabled= true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    document.addEventListener("keydown", onDocumentKeyDown, false);

    var light2 = new THREE.AmbientLight(0xffffff,1);
    group.add(light2);

    var textureloader = new THREE.TextureLoader();

    // Terraza
    geometry = new THREE.BoxGeometry(2.3,0.05,2.3);
    geometry.translate(-0.15,-1.4,0.9);
    const textureCemento = textureloader.load('textures/cemento.jpg' );
    textureCemento.wrapS = THREE.RepeatWrapping;
    textureCemento.wrapT = THREE.RepeatWrapping;
    textureCemento.repeat.x = 4;
    textureCemento.repeat.y = 4;
    textureCemento.repeat.z = 4;
    material = new THREE.MeshToonMaterial( { color: 0xBCBDB7, map: textureCemento } );
    material.shading = THREE.SmoothShading;
    cube = new THREE.Mesh(geometry, material);
    cube.receiveShadow = true;
    cube.castShadow = true;
    group.add(cube);
    
    // 1er piso
    geometry = new THREE.BoxGeometry(1.9,0.2,1.9);
    geometry.translate(-0.15,-1.5,0.85);
    material = new THREE.MeshToonMaterial( { color: 0xBCBDB7, map: textureCemento } );
    material.shading = THREE.SmoothShading;
    cube = new THREE.Mesh(geometry, material);
    cube.receiveShadow = true;
    cube.castShadow = true;
    group.add(cube);
    
    // Planta baja central
    geometry = new THREE.BoxGeometry(1.1,0.2,0.8); 
    geometry.translate(0.13,-1.7,0.9);
    material = new THREE.MeshToonMaterial( { color: 0xBCBDB7, map: textureCemento } );
    material.shading = THREE.SmoothShading;
    cube = new THREE.Mesh(geometry, material);
    cube.receiveShadow = true;
    cube.castShadow = true;
    group.add(cube);

    geometry = new THREE.BoxGeometry(0.4,0.2,0.8); // Planta baja izq
    geometry.translate(-0.78,-1.7,0.9);
    material = new THREE.MeshToonMaterial( { color: 0xBCBDB7, map: textureCemento } );
    material.shading = THREE.SmoothShading;
    cube = new THREE.Mesh(geometry, material);
    cube.receiveShadow = true;
    cube.castShadow = true;
    group.add(cube);

    geometry = new THREE.BoxGeometry(1.9,0.2,0.46); // Planta baja fondo
    geometry.translate(-0.15,-1.7,0.13);
    material = new THREE.MeshToonMaterial( { color: 0xBCBDB7, map: textureCemento } );
    material.shading = THREE.SmoothShading;
    cube = new THREE.Mesh(geometry, material);
    cube.receiveShadow = true;
    cube.castShadow = true;
    group.add(cube);

    geometry = new THREE.ConeGeometry(0.45,0.15,3,1) // Tragaluz
    geometry.translate(-0.85,-1.3,0.85);
    const textureVidrio2 = textureloader.load('textures/glass2.jpg' );
    textureVidrio2.wrapS = THREE.RepeatWrapping;
    textureVidrio2.wrapT = THREE.RepeatWrapping;
    textureVidrio2.repeat.x = 4;
    material = new THREE.MeshToonMaterial( { color: 0x3dd3eb, map: textureVidrio2, transparent: true } );
    material.opacity = 0.95;
    material.shading = THREE.SmoothShading;
    material.shadowSide = THREE.FrontSide;
    cube = new THREE.Mesh(geometry, material);
    cube.receiveShadow = true;
    cube.castShadow = true;
    group.add(cube);

    geometry = new THREE.BoxGeometry(0.8,0.001,0.65); // Piscina
    geometry.translate(-0.74,-1.37,1.51);
    var texturePool = textureloader.load('textures/pool.png' );
    texturePool.wrapS = THREE.RepeatWrapping;
    texturePool.wrapT = THREE.RepeatWrapping;
    // texturePool.repeat.x = 3;
    material = new THREE.MeshToonMaterial( { color: 0xffffff ,map: texturePool, transparent: true} );
    // material = new THREE.MeshToonMaterial( { color: 0xff110 } );
    material.shading = THREE.SmoothShading;
    cube = new THREE.Mesh(geometry, material);
    cube.receiveShadow = true;
    // cube.castShadow = true;
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
    
    material = new THREE.MeshToonMaterial( { color: 0xBCBDB7, map: textureCemento } );
    material.shading = THREE.SmoothShading;
    var mesh = new THREE.Mesh(pillarGeometry, material);
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    
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


    // Edificio de Habitaciones (Prisma Triangular)
    // Bases Habitaciones
    var A = new THREE.Vector3( 0, 0.9, 0.2);
    var B = new THREE.Vector3( 0.5, 0, 0.2 );
    var C = new THREE.Vector3( -0.5, 0, 0.2 );
    var height = 0.081;                   
    var geometry = new PrismGeometry( [ A, B, C ], height ); // utilizo para crear el prisma rectangular
    geometry.rotateX(Math.PI/2);
    geometry.scale(1.25,1.25,1.25);
    geometry.translate(0.1,-1.055,0.15);
    // geometry.rotateY(Math.PI)
    var material = new THREE.MeshToonMaterial( { color: 0x3b5178, map: textureCemento } );
    material.shading = THREE.SmoothShading;
    var cube = new THREE.Mesh( geometry, material );
    cube.receiveShadow = true;
    cube.castShadow = true;
    group.add( cube );

    var A = new THREE.Vector3( 0, 0.9, 0.2);
    var B = new THREE.Vector3( 0.5, 0, 0.2 );
    var C = new THREE.Vector3( -0.5, 0, 0.2 );
    var height = 0.035;                   
    var geometry = new PrismGeometry( [ A, B, C ], height ); // utilizo para crear el prisma rectangular
    geometry.rotateX(Math.PI/2);
    geometry.scale(1.25,1.255,1.25);
    geometry.translate(0.1,-1.155,0.15);
    // geometry.rotateY(Math.PI)
    var material = new THREE.MeshToonMaterial( { color: 0xBCBDB7, map: textureCemento } );
    material.shading = THREE.SmoothShading;
    var cube = new THREE.Mesh( geometry, material );
    cube.receiveShadow = true;
    cube.castShadow = true;
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
    var material = new THREE.MeshToonMaterial( { color: 0x3b5178, map: textureCemento } );
    material.shading = THREE.SmoothShading;
    var cube = new THREE.Mesh( geometry, material );
    cube.receiveShadow = true;
    cube.castShadow = true;
    group.add( cube );

    var geometry = new THREE.BoxGeometry(0.4,0.35,0.1); // Base rectangular de atras
    geometry.translate(0.1,-1.23,0.15);
    material = new THREE.MeshToonMaterial( { color: 0x3b5178, map: textureCemento } );
    material.shading = THREE.SmoothShading;
    cube = new THREE.Mesh(geometry, material);
    cube.receiveShadow = true;
    cube.castShadow = true;
    group.add(cube);

    // Pilares de Habitaciones
    
    var pilaresH = new THREE.Group();
    var pilar = new THREE.BufferGeometry();
    pilar.setIndex(indices);
    pilar.setAttribute('position',new THREE.BufferAttribute(pillarVertices, 3));
    material = new THREE.MeshToonMaterial( { color: 0xBCBDB7, map: textureCemento } );
    material.shading = THREE.SmoothShading;
    var meshH = new THREE.Mesh(pilar, material);
    meshH.receiveShadow = true;
    meshH.castShadow = true;
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

    // Un piso
    var piso = new THREE.Group();
    // Parte Ventana
    var A1 = new THREE.Vector3(0.1, 0.833, 0.2 );
    var A2 = new THREE.Vector3(-0.1, 0.833,0.2 );
    var B1 = new THREE.Vector3(0.5,0.167, 0.2 );
    var B2 = new THREE.Vector3(0.4, 0, 0.2 );
    var C1 = new THREE.Vector3(-0.5, 0.167, 0.2 );
    var C2 = new THREE.Vector3(-0.4 ,0, 0.2 );
    var height = 0.1;                   
    var geometry = new PrismGeometry( [ A1, B1,B2,C2,C1,A2 ], height ); // utilizo para crear el prisma rectangular
    geometry.rotateX(Math.PI/2);
    geometry.scale(1.35,1.35,1.35);
    geometry.translate(2.1,0.29,0.1);
    const textureVentanas = textureloader.load('textures/test_ventanas.jpg' );
    textureVentanas.wrapS = THREE.RepeatWrapping;
    textureVentanas.wrapT = THREE.RepeatWrapping;
    textureVentanas.repeat.x = 7;
    textureVentanas.repeat.y = 4;
    textureVentanas.repeat.z = 4;
    // clearcoat: 1.0,
    // clearcoatRoughness: 0.1,
    // metalness: 0.9,
    // roughness: 0.5,
    // color: 0x0000ff,
    // normalMap: normalMap3,
    var material = new THREE.MeshToonMaterial( { color: 0x757980, map: textureVentanas } );
    material.shading = THREE.SmoothShading;
    var cube = new THREE.Mesh( geometry, material );
    cube.receiveShadow = true;
    cube.castShadow = true;
    piso.add( cube );

    // Parte piso y balconcitos
    var A = new THREE.Vector3( 0, 1, 0.2);
    var B = new THREE.Vector3( 0.6, 0, 0.2 );
    var C = new THREE.Vector3( -0.6, 0, 0.2 );
    var height = 0.02;                   
    var geometry = new PrismGeometry( [ A1, B, C,A2 ], height ); // utilizo para crear el prisma rectangular
    geometry.rotateX(Math.PI/2);
    geometry.scale(1.35,1.35,1.35);
    geometry.translate(2.1,0.155,0.1);
    // geometry.rotateY(Math.PI)
    var material = new THREE.MeshToonMaterial( { color: 0xBCBDB7, map: textureCemento } );
    material.shading = THREE.SmoothShading;
    var cube = new THREE.Mesh( geometry, material );
    cube.receiveShadow = true;
    cube.castShadow = true;
    piso.add( cube );

    // Punta de vidrio
    var A = new THREE.Vector3( 0, 1, 0.2);
    var height = 0.112;                   
    var geometry = new PrismGeometry( [ A, A1,A2 ], height ); // utilizo para crear el prisma rectangular
    geometry.rotateX(Math.PI/2);
    geometry.scale(1.35,1.35,1.35);
    geometry.translate(2.1,0.29,0.1);
    // geometry.rotateY(Math.PI)
    const textureVidrio = textureloader.load('textures/glass.jpg' );
    textureVidrio.wrapS = THREE.RepeatWrapping;
    textureVidrio.wrapT = THREE.RepeatWrapping;
    textureVidrio.repeat.x = 7;
    textureVidrio.repeat.y = 4;
    textureVidrio.repeat.z = 4;
    var material = new THREE.MeshToonMaterial( { color: 0x3dd3eb, map: textureVidrio, transparent: true } );
    material.shading = THREE.SmoothShading;
    material.opacity = 0.95;
    var cube = new THREE.Mesh( geometry, material );
    cube.receiveShadow = true;
    cube.castShadow = true;
    piso.add( cube );

    var geometry = new THREE.BoxGeometry(0.4,0.165,0.05); // Parte rectangular de atras
    geometry.translate(2.1,0.207,0.1);
    material = new THREE.MeshToonMaterial( { color: 0x3b5178, map: textureCemento } );
    material.shading = THREE.SmoothShading;
    cube = new THREE.Mesh(geometry, material);
    cube.receiveShadow = true;
    cube.castShadow = true;
    piso.add(cube);
    
    var geometry = new THREE.BoxGeometry(0.3,0.07,0.01); // Ventana de atras
    geometry.translate(2.1,0.24,0.079);
    const textureVidrio3 = textureloader.load('textures/glass.jpg' );
    textureVidrio3.wrapS = THREE.RepeatWrapping;
    textureVidrio3.wrapT = THREE.RepeatWrapping;
    textureVidrio3.repeat.x = 2;
    material = new THREE.MeshToonMaterial( { color: 0x3dd3eb, map: textureVidrio3 } );
    material.shading = THREE.SmoothShading;
    cube = new THREE.Mesh(geometry, material);
    cube.receiveShadow = true;
    cube.castShadow = true;
    piso.add(cube);

    // Mutiplicar pisos
    piso.position.set(-2,-1.19,-0.01)
    var pisos = new THREE.Group();
    pisos.add(piso);

    for (let i =0 ; i<9; i++){
        var piso2 = piso.clone();
        piso2.translateY(i*0.15);
        pisos.add(piso2);
    }
    scene.add(pisos);

    // Techo
    var A = new THREE.Vector3( 0, 1, 0.2);
    var B = new THREE.Vector3( 0.6, 0, 0.2 );
    var C = new THREE.Vector3( -0.6, 0, 0.2 );
    var height = 0.03;                   
    var geometry = new PrismGeometry( [ A, B, C], height ); // utilizo para crear el prisma rectangular
    geometry.rotateX(Math.PI/2);
    geometry.scale(1.35,1.35,1.35);
    geometry.translate(0.1,0.342,0.1);
    var material = new THREE.MeshToonMaterial( { color: 0xBCBDB7, map: textureCemento } );
    material.shading = THREE.SmoothShading;
    var cube = new THREE.Mesh( geometry, material );
    cube.receiveShadow = true;
    cube.castShadow = true;
    var cube2 = cube.clone();
    cube2.translateY(0.14);
    group.add( cube );
    group.add( cube2 );

    var A = new THREE.Vector3( 0, 1, 0.2);
    var B = new THREE.Vector3( 0.6, 0, 0.2 );
    var C = new THREE.Vector3( -0.6, 0, 0.2 );
    var height = 0.12;                   
    var geometry = new PrismGeometry( [ A, B, C], height ); // utilizo para crear el prisma rectangular
    geometry.rotateX(Math.PI/2)
    geometry.scale(1,1,1);
    geometry.translate(0.1,0.45,0.2);
    var material = new THREE.MeshToonMaterial( { color: 0xBCBDB7, map: textureCemento } );
    material.shading = THREE.SmoothShading;
    var cube = new THREE.Mesh( geometry, material );
    cube.receiveShadow = true;
    cube.castShadow = true;
    group.add(cube)

    // Ventana arriba
    var geometry = new PrismGeometry( [ A, B1, C1,], height ); // utilizo para crear el prisma rectangular
    geometry.rotateX(Math.PI/2)
    geometry.scale(1.1,1.1,1.1);
    geometry.translate(0.1,0.45,0.2);
    var material = new THREE.MeshToonMaterial( { color: 0xdbd9d0, map: textureVidrio } );
    material.shading = THREE.SmoothShading;
    var cube = new THREE.Mesh( geometry, material );
    cube.receiveShadow = true;
    cube.castShadow = true;
    group.add(cube)

    // Ventana 1er Piso
    geometry = new THREE.BoxGeometry(0.85,0.2,0.01); // atras
    geometry.translate(-0.65,-1.5,-0.1);
    textureVidrio3.repeat.x = 4;
    material = new THREE.MeshToonMaterial( { color: 0xdbd9d0, map: textureVidrio3} );
    material.shading = THREE.SmoothShading;
    cube = new THREE.Mesh(geometry, material);
    cube.receiveShadow = true;
    cube.castShadow = true;
    group.add(cube);

    geometry = new THREE.BoxGeometry(1.9,0.17,0.01); // adelante
    geometry.translate(-0.15,-1.5,1.81);
    var textureVidrio4 = textureVidrio3.clone();
    textureVidrio4.repeat.x = 6;
    material = new THREE.MeshToonMaterial( { color: 0xdbd9d0, map: textureVidrio4} );
    material.shading = THREE.SmoothShading;
    cube = new THREE.Mesh(geometry, material);
    cube.receiveShadow = true;
    cube.castShadow = true;
    group.add(cube);

    geometry = new THREE.BoxGeometry(0.42,0.2,0.01); // izq 1
    geometry.translate(-1,-1.5,-1.1);
    geometry.rotateY(Math.PI/2);
    var textureVidrio5 = textureVidrio3.clone();
    textureVidrio5.repeat.x = 2;
    material = new THREE.MeshToonMaterial( { color: 0xdbd9d0, map: textureVidrio5} );
    material.shading = THREE.SmoothShading;
    cube = new THREE.Mesh(geometry, material);
    cube.receiveShadow = true;
    cube.castShadow = true;
    group.add(cube);

    geometry = new THREE.BoxGeometry(0.2,0.2,0.01); // izq 2
    geometry.translate(-0.4,-1.5,-1.1);
    geometry.rotateY(Math.PI/2);
    // textureVidrio3.repeat.x = 1;
    material = new THREE.MeshToonMaterial( { color: 0xdbd9d0, map: textureVidrio5} );
    material.shading = THREE.SmoothShading;
    cube = new THREE.Mesh(geometry, material);
    cube.receiveShadow = true;
    cube.castShadow = true;
    group.add(cube);

    // Ventanas Planta Baja
    geometry = new THREE.BoxGeometry(0.01,0.2,0.8); // izq
    geometry.translate(-1.,-1.7,0.9);
    material = new THREE.MeshToonMaterial( { color: 0xdbd9d0, map: textureVidrio3} );
    material.shading = THREE.SmoothShading;
    cube = new THREE.Mesh(geometry, material);
    cube.receiveShadow = true;
    cube.castShadow = true;
    group.add(cube);

    geometry = new THREE.BoxGeometry(0.01,0.2,0.8);  // der
    geometry.translate(0.68,-1.7,0.9);
    material = new THREE.MeshToonMaterial( { color: 0xdbd9d0, map: textureVidrio3} );
    material.shading = THREE.SmoothShading;
    cube = new THREE.Mesh(geometry, material);
    cube.receiveShadow = true;
    cube.castShadow = true;
    group.add(cube);

    geometry = new THREE.BoxGeometry(0.4,0.2,0.01);  // frente
    geometry.translate(-0.1,-1.7,1.3);
    material = new THREE.MeshToonMaterial( { color: 0xdbd9d0, map: textureVidrio5} );
    material.shading = THREE.SmoothShading;
    cube = new THREE.Mesh(geometry, material);
    cube.receiveShadow = true;
    cube.castShadow = true;
    group.add(cube);

    // Vereda
    geometry = new THREE.BoxGeometry(2.5,0.01,2.5);
    geometry.translate(-0.15,-1.81,0.9);
    material = new THREE.MeshToonMaterial( { color: 0xc9c7bf, map: textureCemento } );
    material.shading = THREE.SmoothShading;
    cube = new THREE.Mesh(geometry, material);
    cube.receiveShadow = true;
    // cube.castShadow = true;
    group.add(cube);

    // Calles
    geometry = new THREE.BoxGeometry(3.6,0.00001,4);
    geometry.translate(-0.15,-1.82,0.9);
    material = new THREE.MeshToonMaterial( { color: 0x5e5d5a, map: textureCemento } );
    material.shading = THREE.SmoothShading;
    cube = new THREE.Mesh(geometry, material);
    cube.receiveShadow = true;
    // cube.castShadow = true;
    group.add(cube);
    
    // Franjas peatonales
    geometry = new THREE.BoxGeometry(0.5,0.00001,0.2);
    geometry.translate(-1.67,-1.819,2.05);
    var textureFranja = textureloader.load('textures/franja.png' );
    textureFranja.wrapS = THREE.RepeatWrapping;
    textureFranja.wrapT = THREE.RepeatWrapping;
    textureFranja.repeat.x = 3;
    material = new THREE.MeshToonMaterial( { map: textureFranja, transparent: true} );
    material.shading = THREE.SmoothShading;
    cube = new THREE.Mesh(geometry, material);
    cube.receiveShadow = true;
    // cube.castShadow = true;
    group.add(cube);

    var cube2 = cube.clone();
    cube2.rotateY(Math.PI);
    cube2.translateX(0.3);
    cube2.translateZ(-1.82);
    group.add(cube2);

    var cube3 = cube.clone();
    cube3.translateZ(-2.3);
    group.add(cube3);
    
    var cube4 = cube2.clone();
    cube4.translateZ(-2.3);
    group.add(cube4);

    // Modelos 3D

    // This work is based on "Carpa Playera - beach tent" (https://sketchfab.com/3d-models/carpa-playera-beach-tent-ffdd0519fa604e138d88a0c7fa262bb8) by Harold.Llanos (https://sketchfab.com/Harold.Llanos) licensed under CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
    let carpa;
    var loader = new GLTFLoader();
    loader.load('models/carpa/scene.gltf', function (gltf) {
        const model = gltf.scene
        carpa = gltf.scene
        gltf.scene.traverse( function( node ) {
            if ( node.isMesh ) { node.castShadow = true; node.receiveShadow =true; }
        } );
        model.scale.set(0.1, 0.1, 0.1)
        model.translateX(0.6)
        model.translateY(-1.5)
        model.translateZ(1.4)
        scene.add(model)
        const model2 = gltf.scene.clone();
        model2.translateX(0.12);
        model2.translateZ(0.22);
        scene.add(model2);
        const model3 = gltf.scene.clone();
        model3.translateX(0.12);
        model3.translateZ(-0.22);
        scene.add(model3);
        const model4 = gltf.scene.clone();
        model4.translateX(0.12);
        model4.translateZ(-0.22*2);
        scene.add(model4);
    }, undefined, function (error) {
    console.error(error)
    });

    // This work is based on "Daffy Duck" (https://sketchfab.com/3d-models/daffy-duck-57b3d5631e4649da907977353aece0c8) by SteveTheDragon (https://sketchfab.com/SteveTheDragon) licensed under CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
    loader.load('models/daffy/scene.gltf', function (gltf) {
        const model = gltf.scene;
        daffy = gltf.scene;
        gltf.scene.traverse( function( node ) {
            if ( node.isMesh ) { node.castShadow = true; node.receiveShadow =true; }
        } );
        model.scale.set(0.03, 0.03, 0.03);
        model.translateX(0.6);
        model.translateY(-1.37);
        model.translateZ(1.4);
        model.rotateY(-Math.PI/2);
        model.visible = animacionDaffy;
        scene.add(model)
    }, undefined, function (error) {
    console.error(error)
    });

    // This work is based on "LowPoly Bus" (https://sketchfab.com/3d-models/lowpoly-bus-5c8b8d30a37543feae428846484d316b) by Scuderia Morello (https://sketchfab.com/scudmorello) licensed under CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
    loader.load('models/lowpoly_bus/scene.gltf', function (gltf) {
        const model = gltf.scene;
        bus = gltf.scene;
        gltf.scene.traverse( function( node ) {
            if ( node.isMesh ) { node.castShadow = true; node.receiveShadow =true; }
        } );
        model.scale.set(0.012, 0.012, 0.012);
        model.translateX(-1.7);
        model.translateY(-1.813);
        model.translateZ(-0.5);
        model.rotateY(Math.PI/2);
        model.visible = moveTraffic;
        scene.add(model)
    }, undefined, function (error) {
    console.error(error)
    });

    loader.load('models/lowpoly_bus/scene.gltf', function (gltf) {
        const model = gltf.scene;
        bus2 = gltf.scene;
        gltf.scene.traverse( function( node ) {
            if ( node.isMesh ) { node.castShadow = true; node.receiveShadow =true; }
        } );
        model.scale.set(0.012, 0.012, 0.012);
        model.translateX(1.5);
        model.translateY(-1.813);
        model.translateZ(2.75);
        model.rotateY(-Math.PI/2);
        model.visible = moveTraffic;
        scene.add(model)
    }, undefined, function (error) {
    console.error(error)
    });

    // This work is based on "LowPoly Hatch" (https://sketchfab.com/3d-models/lowpoly-hatch-e75d3a91e9df40f8b937b6f61837cef0) by Scuderia Morello (https://sketchfab.com/scudmorello) licensed under CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
    loader.load('models/lowpoly_hatch/scene.gltf', function (gltf) {
        const model = gltf.scene;
        hatch = gltf.scene;
        gltf.scene.traverse( function( node ) {
            if ( node.isMesh ) { node.castShadow = true; node.receiveShadow =true; }
        } );
        model.scale.set(0.05, 0.05, 0.05);
        model.translateX(-1);
        model.translateY(-1.82);
        model.translateZ(-0.7);
        model.rotateY(Math.PI/2);
        model.visible = moveTraffic;
        scene.add(model)
    }, undefined, function (error) {
    console.error(error)
    });

    loader.load('models/lowpoly_hatch2/scene.gltf', function (gltf) {
        const model = gltf.scene;
        hatch2 = gltf.scene;
        gltf.scene.traverse( function( node ) {
            if ( node.isMesh ) { node.castShadow = true; node.receiveShadow =true; }
        } );
        model.scale.set(0.05, 0.05, 0.05);
        model.translateX(1);
        model.translateY(-1.82);
        model.translateZ(-0.9);
        model.visible = moveTraffic;
        model.rotateY(Math.PI/2);
        scene.add(model)
    }, undefined, function (error) {
    console.error(error)
    });

    loader.load('models/lowpoly_hatch2/scene.gltf', function (gltf) {
        const model = gltf.scene;
        hatch3 = gltf.scene;
        gltf.scene.traverse( function( node ) {
            if ( node.isMesh ) { node.castShadow = true; node.receiveShadow =true; }
        } );
        model.scale.set(0.05, 0.05, 0.05);
        model.translateX(1.55);
        model.translateY(-1.82);
        model.translateZ(2.35);
        // model.visible = moveTraffic;
        model.rotateY(-Math.PI/2);
        scene.add(model);
    }, undefined, function (error) {
    console.error(error)
    });

    // This work is based on "VW Kombi 1969 LowPoly" (https://sketchfab.com/3d-models/vw-kombi-1969-lowpoly-f6a7b54ec6d24d8e95992f68be6c930c) by Scuderia Morello (https://sketchfab.com/scudmorello) licensed under CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
    loader.load('models/vw_kombi_1969_lowpoly/scene.gltf', function (gltf) {
        const model = gltf.scene;
        kombi = gltf.scene;
        gltf.scene.traverse( function( node ) {
            if ( node.isMesh ) { node.castShadow = true; node.receiveShadow =true; }
        } );
        model.scale.set(0.05, 0.05, 0.05);
        model.translateX(-1.6);
        model.translateY(-1.82);
        model.translateZ(-1);
        model.visible = moveTraffic;
        // model.rotateY(Math.PI/2);
        scene.add(model)
    }, undefined, function (error) {
    console.error(error)
    });

    loader.load('models/vw_kombi_1969_lowpoly/scene.gltf', function (gltf) {
        const model = gltf.scene;
        kombi2 = gltf.scene;
        gltf.scene.traverse( function( node ) {
            if ( node.isMesh ) { node.castShadow = true; node.receiveShadow =true; }
        } );
        model.scale.set(0.05, 0.05, 0.05);
        model.translateX(-1.9);
        model.translateY(-1.813);
        model.translateZ(2.55);
        model.visible = moveTraffic;
        model.rotateY(-Math.PI/2);
        scene.add(model)
    }, undefined, function (error) {
    console.error(error)
    });

    scene.traverse( function( object ) {
        if ( object.material ) object.needsUpdate = true;
        if ( object.texture ) object.needsUpdate = true;
    } );

    eeGroup = new THREE.Group();

    geometry = new THREE.BoxGeometry(0.6,0.001,0.7);
    geometry.translate(0.1,0.485,0.6);
    var texturePool = textureloader.load('textures/logo-guarani.png' );
    texturePool.wrapS = THREE.RepeatWrapping;
    texturePool.wrapT = THREE.RepeatWrapping;
    // texturePool.repeat.x = 3;
    material = new THREE.MeshToonMaterial( { color: 0xffffff ,map: texturePool, transparent: true} );
    // material = new THREE.MeshToonMaterial( { color: 0xff110 } );
    material.shading = THREE.SmoothShading;
    cube = new THREE.Mesh(geometry, material);
    cube.receiveShadow = true;
    // cube.castShadow = true;
    eeGroup.add(cube);

    easterEgg();

    
    // Modificacion examen Final, Agregar una bandera flameante a cualquier auto
    var geometry =  new THREE.PlaneGeometry(0.12,0.1,50,30);
    geometry.rotateX(-Math.PI/2);
    geometry.translate(1.66, -1.75, 2.35);
    const cerro = textureloader.load('textures/cerro.png' );
    cerro.wrapS = THREE.RepeatWrapping;
    cerro.wrapT = THREE.RepeatWrapping;
    var material = new THREE.MeshToonMaterial({map: cerro, castShadow: true, receiveShadow: true});
    flag = new THREE.Mesh(geometry, material);
    // hatch3.add(flag);
    // scene.add(flag);
    flag.rotation.set(0, 0, 0);


    groupFlag.add(flag);
    scene.add(groupFlag);
    groupFlag.translateY(-1.75);


    // EVENTS

    const controls = new OrbitControls( camera, renderer.domElement );
    controls.minDistance = 1;
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
    const timer = Date.now() * 0.00025;

    requestAnimationFrame( animate );
    if (animacionDaffy){
        daffy.position.x += 0.001*dir;
        if (daffy.position.x <= 0.4){
            dir = 1;
        }
        if (daffy.position.x >= 0.6){
            dir = -1;
        }
    }
    if (moveTraffic){
        
        bus.position.x += 0.012*( 1 + Math.sin(itBus*0.01));
        itBus += 1;
        if (bus.position.x >= 1.65){
            bus.position.x = -1.7;
            itBus = -1000;
        }
        bus2.position.x -= 0.01*( 1 + Math.sin(itBus2*0.01));;
        itBus2 += 1;
        if (bus2.position.x <= -1.9){
            bus2.position.x = 1.5;
            itBus2 = -1000;
        }
        hatch.position.x += 0.01;
        if (hatch.position.x >= 1.65){
            hatch.position.x = -1.9;
        }
        hatch2.position.x += 0.015;
        if (hatch2.position.x >= 1.65){
            hatch2.position.x = -1.9;
        }
        hatch3.position.x -= 0.005;
        flag.position.x -= 0.005;
        if (hatch3.position.x <= -1.9){
            hatch3.position.x = 1.65;
            flag.position.x = 0.12;
        }
        kombi2.position.x -= 0.006;
        if (kombi2.position.x <= -1.9){
            kombi2.position.x = 1.65;
        }
        if (kombi.position.z <= 1.8){
            kombi.position.z += 0.007;
        }
        if (hatch3.position.x >= 1  && bus2.position.x >= -1.5 && kombi2.position.x >= -1 && kombi.position.z >= 1.8){
            kombi.position.z += 0.01;
            if (kombi.position.z >= 2.7){
                kombi.position.z = -1;
            }
        }
    }
    let t = clock.getElapsedTime();
    waveFlag(t,v);
    render();

}

function easterEgg() {
    var light = new THREE.SpotLight( 0xffff00, 0.8, 40, 0.7, 1 );
    light.position.set(0.7, -1.8, 1.85);
    light.target.position.set(light.position.x, 0, light.position.z);
    var target = light.target;
    light.castShadow = true;
    eeGroup.add(light.target);
    eeGroup.add(light);

    for (let i = 1; i < 6; i++) {
        var light2 = light.clone();
        var target2 = target.clone();
        light2.translateX(-i / 3);
        target2.translateX(-i / 3);
        light2.target = target2;
        eeGroup.add(light2);
        eeGroup.add(target2);
    }

    eeGroup.visible = showEasterEgg;
    scene.add(eeGroup);
}

function waveFlag(t, v){
    
    for (let i = 0; i < flag.geometry.attributes.position.count; i++){
        v.fromBufferAttribute(flag.geometry.attributes.position, i);
        const wavex1 = 0.0005 * Math.sin(v.x * 2 * t);
        const wavex2 = 0.0025 * Math.sin(v.x * 3 * t * 2);
        const wavex3 = 0.005 * Math.sin(v.y * t);
  
        flag.geometry.attributes.position.setY(i, wavex1 + wavex2 + wavex3)
      }
      flag.geometry.attributes.position.needsUpdate = true;
}

function render() {

    if (moveSun){
        var timer = a * 0.00025;
        particleLight.position.x = 17 * Math.sin( timer * 2 );
        particleLight.position.y = 17 * Math.cos( timer * 2 );
        a+= 1;
        if (a >= 3000){
            a = a*-1;
        }
    }
    renderer.render( scene, camera );

}


function onDocumentKeyDown(event) {
    let paso = 0.1
    let key = event.key;
    
    switch (key) {
        case 's':
            moveSun = !moveSun;
            break;
        case 't':
            moveTraffic = !moveTraffic
            break;
        case 'd':
            animacionDaffy = !animacionDaffy;
            break;
        case 'g':
            showEasterEgg = !showEasterEgg;
    }
    daffy.visible = animacionDaffy;
    bus.visible = moveTraffic;
    bus2.visible = moveTraffic;
    hatch.visible = moveTraffic;
    hatch2.visible = moveTraffic;
    kombi.visible = moveTraffic;
    kombi2.visible = moveTraffic;
    hatch3.visible = moveTraffic;
    eeGroup.visible = showEasterEgg;
  }
