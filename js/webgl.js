// global variables
let renderer, scene, camera, logo, logoGroup1, logoGroup2, orbitingCubes, i;
// webgl container
const CONTAINER = document.getElementById('webgl');
// cube material
const MATERIAL = new THREE.MeshPhongMaterial({
    color: 0xeaebed,
    specular: 0x050505,
    shininess: 100
});

function init() {
    setup();
    createCubes();
    positionCubes();
    lighting();
}

function animate() {
    requestAnimationFrame(animate);

    animations();

    renderer.render(scene, camera);
}

function setup() {
    renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setSize(CONTAINER.offsetWidth, CONTAINER.offsetHeight);
    renderer.setPixelRatio(2);
    CONTAINER.appendChild(renderer.domElement);

    scene = new THREE.Scene();
    renderer.setClearColor(0x000000, 0);

    camera = new THREE.PerspectiveCamera(20, CONTAINER.offsetWidth / CONTAINER.offsetHeight, 1, 70);
    camera.position.set(0, -6, 50);
    camera.lookAt(0, 0, 0);

    window.addEventListener('resize', function () {
        renderer.setSize(CONTAINER.offsetWidth, CONTAINER.offsetHeight);
        camera.aspect = CONTAINER.offsetWidth / CONTAINER.offsetHeight;
        camera.updateProjectionMatrix();
    });
}

/* ===================== */
/* ===== FUNCTIONS ===== */
/* ===================== */

function createCubes() {

    // contains 3 logo cubes
    logoGroup1 = new THREE.Object3D();
    logoGroup1.position.set(-2, 0, 0);

    // contains the other 3 logo cubes
    logoGroup2 = new THREE.Object3D();
    logoGroup2.position.set(2.4, -1.25, -3.5);

    // adds 3 cubes logoGroup1
    logoGroup1.add(
        new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), MATERIAL),
        new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), MATERIAL),
        new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), MATERIAL));

    // adds 3 cubes logoGroup2
    logoGroup2.add(
        new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.8, 1.8), MATERIAL),
        new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.8, 1.8), MATERIAL),
        new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.8, 1.8), MATERIAL));

    // contains all orbiting cubes
    orbitingCubes = new THREE.Object3D();
    orbitingCubes.position.set(0, 1, -3);

    // adds all 3 orbiting cubes
    orbitingCubes.add(
        new THREE.Object3D().add(new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.4, 1.4), MATERIAL)),
        new THREE.Object3D().add(new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.4, 1.4), MATERIAL)),
        new THREE.Object3D().add(new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.4, 1.4), MATERIAL)));

    // contains the entire logo (logoGroup1 & logoGroup2)
    logo = new THREE.Object3D();
    logo.position.set(0, 0, 0);
    logo.add(logoGroup1, logoGroup2);

    scene.add(logo, orbitingCubes);
}

function positionCubes() {
    // logo orientation and position arguments
    const logoArr = [
        {
            group: logoGroup2,
            rotateX: (-22 * Math.PI) / 180, rotateY: (20 * Math.PI) / 180, rotateZ: (12 * Math.PI) / 180,
            posY: 5
        },
        {
            group: logoGroup1,
            rotateX: (-30 * Math.PI) / 180, rotateY: (-6 * Math.PI) / 180, rotateZ: (-34 * Math.PI) / 180,
            posY: 5.2
        }
    ];

    // orbiting cubes rotation and position arguments
    const orbitingCubesArr = [
        {
            rotationX: 3.5 * Math.PI / 3, rotationY: 2 * Math.PI,
            posX: -7, posY: 0, posZ: -4
        },
        {
            rotationX: 3.5 * Math.PI / 3, rotationY: 2 * Math.PI,
            posX: 8, posY: -1.5, posZ: 4
        },
        {
            rotationX: 4 * Math.PI / 3, rotationY: 0,
            posX: 8, posY: 0, posZ: 0
        }
    ];

    i = 2;
    while (i--) {
        // orients logo
        logoArr[i]['group']
            .rotateX(logoArr[i].rotateX)
            .rotateY(logoArr[i].rotateY)
            .rotateZ(logoArr[i].rotateZ);

        // positions logo
        logoArr[i]['group'].children[1].position.set(0, logoArr[i].posY / 2, 0);
        logoArr[i]['group'].children[2].position.set(0, logoArr[i].posY, 0);
    }

    i = 3;
    while (i--) {
        // sets rotation for each orbiting cube
        orbitingCubes.children[i].rotation.x = orbitingCubesArr[i].rotationX;
        orbitingCubes.children[i].rotation.y = orbitingCubesArr[i].rotationY;

        // sets position for each orbiting cube
        orbitingCubes.children[i].children[0].position.set(
            orbitingCubesArr[i].posX,
            orbitingCubesArr[i].posY,
            orbitingCubesArr[i].posZ);
    }
}

function lighting() {
    let light = new THREE.HemisphereLight(0xeaebed, 0x000000, 2);
    light.position.set(2, 8, .5);
    scene.add(light);
}

// rotation/movement for orbiting cubes and the logo
function animations() {
    i = 3;
    while (i--) {
        // rotates orbiting cubes around logo
        orbitingCubes.children[i].rotation.y += .016;
        // spins orbiting cubes
        orbitingCubes.children[i].children[0].rotation.y += .032;
        orbitingCubes.children[i].children[0].rotation.x += .016;
    }

    // logo hovering effect
    let time = new Date().getTime();
    logo.position.y = Math.sin(time / 750) * .5;
}

init();
animate();