import './style.css'

import * as THREE from 'three';
import { PointLight } from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),

});

//preparing the renderer to render the scene and position the camera.
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render( scene, camera );

//3D Object.
const geometry = new THREE.TorusGeometry( 10, 3, 16, 100 );
//const geometry = new THREE.RingGeometry( 3, 9, 17);


//Material for the Torus. 
//const material = new THREE.MeshStandardMaterial( { color : 0x005500 , wireframe: true } );
//const material = new THREE.MeshStandardMaterial( { color : 0x6fffff , wireframe: true } );
const material = new THREE.MeshStandardMaterial( { color : 0x301934 , wireframe: true } );

//The creation of the mesh : geometry + material ==> a full object.
const torus = new THREE.Mesh( geometry, material );
//now we add it to the scene.
scene.add( torus );

//Loading a personal asset
const loader = new GLTFLoader();

const AGRO = loader.load( 'models/AGRO.glb', function ( gltf ) {

    var newMaterial = new THREE.MeshStandardMaterial({ color: 0x8B0000 /*color : 0x001100 */,  wireframe: true });
    var model = gltf.scene;
    model.material = newMaterial;

    model.traverse((o) => {
        if (o.isMesh) o.material = newMaterial;
      });

    model.position.z = 5;
    model.position.y = 5;
    model.position.x = 30;

    model.rotation.x += 10;
    model.rotation.y += 80;
    model.rotation.z += 10;
    scene.add( gltf.scene );
    moveAGRO( model )
    {
        model.position.z += 5;
        model.position.y += 5;
        model.position.x += -1;

        model.rotation.x += 10;
        model.rotation.y += 0.05;
        model.rotation.z += 10;
    }
    //gltf.position.setX(20);
    //model.setSize(50 , 50, 100);
    
    document.body.onscroll = moveAGRO;
    

    

}, undefined, function ( error ) {

	console.error( error );

} );

/*const agroMaterial = new THREE.MeshLambertMaterial( { color : 0x6fffff } );

const AGRO = new THREE.Mesh( agroGemetry, agroMaterial );
                
scene.add( AGRO );
*/



//adding light
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5,5,5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

//the lighthelper and gridhelper will help us put into prespective
//our light direction and the objects positions.
const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
//scene.add(lightHelper, gridHelper);

//To move arround the scene we need to use the orbitControls.
//const controls = new OrbitControls(camera, renderer.domElement);

/* ************************************************* */
/* This function will help populate a lot of objects */
/* into the scene.                                   */
/* ************************************************* */
function addStar()
{
    const geometry = new THREE.SphereGeometry(0.25, 24, 24);
    const material = new THREE.MeshStandardMaterial( { color: 0xffffff, wireframe: true } );
    const star = new THREE.Mesh ( geometry, material );

    //after preparing one object
    //now we are going to randomly
    //generate a position for each star.
    const [x, y, z] = Array(3).fill().map ( () => THREE.MathUtils.randFloatSpread( 100 ));

    star.position.set(x, y, z);
    scene.add(star);
}

Array(200).fill().forEach(addStar);

//Adding the background.
//const spaceTexture = new THREE.TextureLoader().load('oldTerminal.png');
const spaceTexture = new THREE.TextureLoader().load('space2.jpg');
scene.background = spaceTexture;

//Adding portfolio picture
const myPicTexture = new THREE.TextureLoader().load('Khaled.jpg');
const khaled = new THREE.Mesh(
        new THREE.BoxGeometry(3,3,3),
        new THREE.MeshBasicMaterial( { map: myPicTexture } )
);
khaled.position.z = -5;
khaled.position.x = 2;

scene.add(khaled);

//Adding a planet ^^.
const planetTexture = new THREE.TextureLoader().load('planet.png');
const normalTexture = new THREE.TextureLoader().load('normal.jpg');
const planet = new THREE.Mesh(
    new THREE.SphereGeometry(3,32,32),
    new THREE.MeshStandardMaterial( { 
        map: planetTexture,
        normalMap: normalTexture
    } )
)

scene.add(planet);


planet.position.z = 30;
planet.position.setX(-10);

/**********************************************************/
/* Move camera will help moving the elements              */
/* when scrolling.                                        */
/**********************************************************/
function moveCamera()
{
    const t = document.body.getBoundingClientRect().top;
    planet.rotation.x += 0.05;
    planet.rotation.y += 0.075;
    planet.rotation.z += 0.05;

    khaled.rotation.y += 0.01;
    khaled.rotation.z += 0.01;

    camera.position.z = t * -0.01;
    camera.position.x = t * -0.0002;
    camera.position.y = t * -0.0002;
}

document.body.onscroll = moveCamera;

/**********************************************************/
/* we reload the rendered result to render the new object */
/* with the help of the animate function which will       */
/* update the page for each frame.                        */
/**********************************************************/
function animate ()
{
    requestAnimationFrame( animate); // ==> reculsive call to the animate function 
                                     // to update the page for each frame.

    //Now for each frame the torus will rotate on the x, y and z axis.
    torus.rotation.x += 0.01;
    torus.rotation.y += 0.005;
    torus.rotation.z += 0.01;

    //to make the controls effective
    //we update it here in the animate function
    //to make sure that each action made by the user
    //is updated accordingly in each frame.
    //controls.update();

    renderer.render ( scene, camera );
}

animate();