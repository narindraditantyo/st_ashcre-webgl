import * as THREE from './three.js/build/three.module.js'
import { OrbitControls } from './three.js/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from './three.js/examples/jsm/loaders/GLTFLoader.js'

let scene, camera, cameraFPV, cameraTPV, control, renderer
let geometry, material, mesh, loader, texture, arrTexture
let light

let createMoonlight = () => {
    light = new THREE.PointLight(0xF4F1C9, 5, 500, 1.5)
    light.position.set(0, 500, 250)
    light.shadow.mapSize.width = 2048
    light.shadow.mapSize.height = 2048
    light.castShadow = true
    scene.add(light)
}

let createGround = (assetName, width, height, posX, posY, posZ, repX, repY) => {
    let filePath = './assets/' + assetName + '.jpg'

    geometry = new THREE.PlaneGeometry(width, height)
    loader = new THREE.TextureLoader()
    texture = loader.load(filePath)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(repX, repY)
    material = new THREE.MeshStandardMaterial({
        map: texture,
    })
    mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(posX, posY, posZ)
    mesh.rotation.x = -(Math.PI/2)
    scene.add(mesh)
}

let createBuilding = () => {
    let mesh = []
    var buildingPos = -237.5

    for(let i = 0; i < 20; i++) {
        let buildingHeight = Math.floor(Math.random() * 3) + 2

        geometry = new THREE.BoxGeometry(25, buildingHeight*30, 25)
        loader = new THREE.TextureLoader()
        texture = loader.load('./assets/building.jpg')
        material = new THREE.MeshStandardMaterial({
            roughness: 0.67,
            metalness: 0.65,
            map: texture
        })
    
        mesh[i] = new THREE.Mesh(geometry, material)
        mesh[i].position.set(-40, 0, buildingPos)
        mesh[i].receiveShadow = true
        buildingPos += 25

        scene.add(mesh[i])
    }

    buildingPos = -237.5
    for(let i = 0; i < 20; i++) {
        let buildingHeight = Math.floor(Math.random() * 3) + 2

        geometry = new THREE.BoxGeometry(25, buildingHeight*30, 25)
        loader = new THREE.TextureLoader()
        texture = loader.load('./assets/building.jpg')
        material = new THREE.MeshStandardMaterial({
            roughness: 0.67,
            metalness: 0.65,
            map: texture
        })
    
        mesh[i] = new THREE.Mesh(geometry, material)
        mesh[i].position.set(40, 0, buildingPos)
        mesh[i].receiveShadow = true
        buildingPos += 25

        scene.add(mesh[i])
    }
}

let createHeadlight = (posX) => {
    light = new THREE.SpotLight(0xFFFFFF, 1, 250, Math.PI/10)
    light.position.set(posX, 0, -50)
    return light
}

let assembleCar = () => {
    loader = new GLTFLoader()
    loader.load('./assets/model/model.glb', function(gltf) {
        let loadedCar = gltf.scene
        loadedCar.scale.set(5, 5, 5)
        loadedCar.position.x = 7.5
        loadedCar.rotation.y = Math.PI

        let leftHeadlight = createHeadlight(4.5)
        let rightHeadlight = createHeadlight(11.5)

        loadedCar.add(leftHeadlight)
        loadedCar.add(rightHeadlight)
        scene.add(loadedCar)
    })
}

let createPole = (posX, posZ) => {
    geometry = new THREE.CylinderGeometry(0.5, 0.5, 38)
    material = new THREE.MeshStandardMaterial({
        color: 0x43464B,
        roughness: 0.1,
        metalness: 0.6
    })
    mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(posX, 0, posZ)
    mesh.castShadow = true
    return mesh
}

let createContainer = (posX, posZ) => {
    geometry = new THREE.CylinderGeometry(2, 1, 2, 4, 1)
    material = new THREE.MeshPhongMaterial({
        wireframe: true
    })
    mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(posX, 20, posZ)
    mesh.castShadow = true
    return mesh
}

let createLid = (posX, posZ) => {
    geometry = new THREE.CylinderGeometry(1, 2, 1, 4, 1)
    material = new THREE.MeshPhongMaterial({
        wireframe: true
    })
    mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(posX, 21.5, posZ)
    mesh.castShadow = true
    return mesh
}

let createBulb = (posX, posZ) => {
    geometry = new THREE.SphereGeometry(1)
    material = new THREE.MeshPhongMaterial({
        side: THREE.BackSide
    })
    mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(posX, 20, posZ)
    return mesh
}

let createLight = (posX, posZ) => {
    light = new THREE.PointLight(0xFFFFFF, 1, (250/6)*2, 2)
    light.castShadow = true
    return light
}

let assembleStreetlamp = () => {
    let assembledStreetlamp = []
    let streetlampPos = (250/6)*3

    for(let i = 0; i < 4; i++) {
        let pole = createPole(-20, streetlampPos)
        let container = createContainer(-20, streetlampPos)
        let lid = createLid(-20, streetlampPos)
        let bulb = createBulb(-20, streetlampPos)
        let streetLight = createLight(-20, streetlampPos)

        bulb.add(streetLight)
        assembledStreetlamp[i] = [pole, container, lid, bulb]

        assembledStreetlamp[i].forEach(object => {
            scene.add(object)
        });

        streetlampPos -= 500/6
    }

    assembledStreetlamp = []
    streetlampPos = 250/6*3
    for(let i = 0; i < 4; i++) {
        let pole = createPole(20, streetlampPos)
        let container = createContainer(20, streetlampPos)
        let lid = createLid(20, streetlampPos)
        let bulb = createBulb(20, streetlampPos)
        let streetLight = createLight(20, streetlampPos)

        bulb.add(streetLight)
        assembledStreetlamp[i] = [pole, container, lid, bulb]

        assembledStreetlamp[i].forEach(object => {
            scene.add(object)
        });

        streetlampPos -= 500/6
    }
}

let createSkybox = () => {
    geometry = new THREE.BoxGeometry(500, 500, 500)
    loader = new THREE.TextureLoader()
    arrTexture = [
        loader.load('./assets/cubemap/px.png'),
        loader.load('./assets/cubemap/nx.png'),
        loader.load('./assets/cubemap/py.png'),
        loader.load('./assets/cubemap/ny.png'),
        loader.load('./assets/cubemap/pz.png'),
        loader.load('./assets/cubemap/nz.png')
    ]
    material = arrTexture.map(texture => {
        return new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.BackSide
        })
    })
    mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(0, -70, 0)
    scene.add(mesh)
}

let init = () => {
    let sWidth = window.innerWidth
    let sHeight = window.innerHeight

    scene = new THREE.Scene()

    cameraTPV = new THREE.PerspectiveCamera(45, sWidth/sHeight, 0.1, 5000)
    cameraTPV.position.set(0, 50, 325)
    cameraTPV.lookAt(0, 0, 0)

    cameraFPV = new THREE.PerspectiveCamera(45, sWidth/sHeight, 0.1, 500)
    cameraFPV.position.set(7.5, 10, -25)
    cameraFPV.lookAt(7.5, 10, -250)

    camera = cameraFPV

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(sWidth, sHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    document.body.appendChild(renderer.domElement)

    window.addEventListener('resize', function() {
        sWidth = window.innerWidth
        sHeight = window.innerHeight
        camera.aspect = sWidth/sHeight
        renderer.setSize(sWidth, sHeight)
    })

    if(camera == cameraTPV) {
        control = new OrbitControls(camera, renderer.domElement)
        control.addEventListener('change', renderer)
        control.maxDistance = 325
    }

    // Background
    createSkybox()

    // Ground
    createGround('asphalt', 500, 500, 0, 0, 0, 20, 20)
    createGround('road', 30, 500, 0, 0, 1, 1, 8)
    

    // Lighting
    createMoonlight()

    // Building
    createBuilding()

    // Streetlamps
    assembleStreetlamp()

    // Car
    // assembleCar()

    animate()
}

let animate = () => {
    renderer.render(scene, camera)
    requestAnimationFrame(animate)
}

window.onload = () => {
    init()
}