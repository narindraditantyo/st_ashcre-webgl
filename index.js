import * as THREE from './three.js/build/three.module.js'
import { OrbitControls } from './three.js/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from './three.js/examples/jsm/loaders/GLTFLoader.js'

let scene, camera, cameraFPV, cameraTPV, control, renderer
let skybox, moonlight, asphalt, road, text1, text2, loadedCar
let geometry, material, mesh, loader, texture, arrTexture, font
let light

let createMoonlight = () => {
    light = new THREE.PointLight(0xF4F1C9, 1, 1000, 1.5)
    light.position.set(0, 500, 250)
    light.shadow.mapSize.width = 2048
    light.shadow.mapSize.height = 2048
    light.castShadow = true
    light.target = scene
    return light
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
    mesh.rotation.x = -(Math.PI/2)
    mesh.position.set(posX, posY, posZ)
    return mesh
}

let createBuilding = () => {
    let mesh = []
    var buildingPos = -237.5

    for(let i = 0; i < 20; i++) {
        let buildingHeight = Math.floor(Math.random() * 3) + 2

        geometry = new THREE.BoxGeometry(25, buildingHeight*30, 25)
        loader = new THREE.TextureLoader()
        texture = loader.load('./assets/building.jpg')
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
        texture.repeat.set(25/30, (buildingHeight*30)/30)
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

let createHeadlightBulb = (posX) => {
    geometry = new THREE.SphereGeometry(0.1)
    material = new THREE.MeshPhongMaterial({
        side: THREE.BackSide
    })
    mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(posX/5, 4/5, 13.5/5)
    return mesh
}

let createHeadlight = (posX) => {
    light = new THREE.SpotLight(0xFFFFFF, 7.5, 250, THREE.Math.degToRad(7.75))
    light.position.set(0, 0, -25/5)
    light.castShadow = true

    let targetObject = new THREE.Object3D()
    targetObject.position.set(posX/5, 0, 100/5)
    loadedCar.add(targetObject)

    light.target = targetObject
    return light
}

let assembleCar = () => {
    loader = new GLTFLoader()
    loader.load('./assets/model/model.glb', (gltf) => {
        loadedCar = gltf.scene
        loadedCar.scale.set(5, 5, 5)
        loadedCar.position.set(7.5, 0, 100)
        loadedCar.rotation.y = Math.PI

        let leftBulb = createHeadlightBulb(-3)
        let leftHeadlight = createHeadlight(-3)
        leftBulb.add(leftHeadlight)
        loadedCar.add(leftBulb)

        let rightBulb = createHeadlightBulb(3)
        let rightHeadlight = createHeadlight(3)
        rightBulb.add(rightHeadlight)
        loadedCar.add(rightBulb)

        window.addEventListener('keydown', (event) => {
            var pressedKey = event.which

            if(camera == cameraFPV) {
                if(pressedKey == 87) {
                    loadedCar.position.z -= 3
                    cameraFPV.position.z -= 3
                    camera = cameraFPV
                } else if(pressedKey == 83) {
                    loadedCar.position.z += 3
                    cameraFPV.position.z += 3
                    camera = cameraFPV
                }
            }
        })

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
    geometry = new THREE.CylinderGeometry(0.5, 2, 1, 4, 1)
    material = new THREE.MeshPhongMaterial({
        wireframe: true
    })
    mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(posX, 21.5, posZ)
    mesh.castShadow = true
    return mesh
}

let createBulb = (posX, posZ, side) => {
    geometry = new THREE.SphereGeometry(0.5)
    material = new THREE.MeshPhongMaterial({
        side: THREE.BackSide
    })
    mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(posX, 20, posZ)
    return mesh
}

let createLight = (intensity) => {
    light = new THREE.PointLight(0xFFFFFF, 1, 175, 5)
    light.castShadow = true
    return light
}

let assembleStreetlamp = () => {
    let assembledStreetlamp = [[],[]]
    let componentStreetlamp
    let streetlampPos
    let posX = -20

    for(let i = 0; i < 2; i++) {
        streetlampPos = (250/6)*3

        for(let j = 0; j < 4; j++) {
            componentStreetlamp = []

            let pole = createPole(posX, streetlampPos)
            let container = createContainer(posX, streetlampPos)
            let lid = createLid(posX, streetlampPos)
            let bulb = createBulb(posX, streetlampPos, THREE.BackSide)
            let streetLight = createLight(1)

            bulb.add(streetLight)
            componentStreetlamp.push(pole, container, lid, bulb)
            assembledStreetlamp[i].push(componentStreetlamp)

            assembledStreetlamp[i][j].forEach(object => {
                scene.add(object)
            })

            window.addEventListener('click', (event) => {
                if(event.target == assembledStreetlamp[i][j][3]) {
                    if(assembledStreetlamp[i][j][3].getObjectByName('streetLights') == createLight(1)) {
                        assembledStreetlamp[i][j][3] = createBulb(posX, streetlampPos, THREE.FrontSide)
                        assembledStreetlamp[i][j][3].getObjectByName('streetLights') = createLight(0)
                    } else {
                        assembledStreetlamp[i][j][3] = createBulb(posX, streetlampPos, THREE.BackSide)
                        assembledStreetlamp[i][j][3].getObjectByName('streetLights') = createLight(1)
                    }
                }
            })

            streetlampPos -= 500/6
        }

        posX += 40
    }

    
}

let createText = (inputText, posY) => {
    loader = new THREE.FontLoader()
    loader.load('./three.js/examples/fonts/helvetiker_regular.typeface.json', (font) => {
        geometry = new THREE.TextGeometry(inputText, {
            font: font,
            size: 6.25,
            height: 3
        })
        geometry.center()
        material = new THREE.MeshStandardMaterial()
        mesh = new THREE.Mesh(geometry, material)
        mesh.position.y = posY
        scene.add(mesh)
    })
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
    return mesh
}

let init = () => {
    let sWidth = window.innerWidth
    let sHeight = window.innerHeight

    scene = new THREE.Scene()

    cameraTPV = new THREE.PerspectiveCamera(45, sWidth/sHeight, 0.1, 5000)
    cameraTPV.position.set(-12.5, 25, 250)
    cameraTPV.lookAt(0, 0, 0)

    cameraFPV = new THREE.PerspectiveCamera(45, sWidth/sHeight, 0.1, 5000)
    cameraFPV.position.set(7.5, 7.5, 85)
    cameraFPV.lookAt(7.5, 7.5, -250)

    camera = cameraTPV

    renderer = new THREE.WebGLRenderer({
        antialias: true
    })
    renderer.setSize(sWidth, sHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    document.body.appendChild(renderer.domElement)

    window.addEventListener('resize', () => {
        sWidth = window.innerWidth
        sHeight = window.innerHeight
        camera.aspect = sWidth/sHeight
        renderer.setSize(sWidth, sHeight)
    })

    window.addEventListener('keydown', (event) => {
        var pressedKey = event.which

        if(pressedKey == 17) {
            if(camera == cameraTPV) camera = cameraFPV
            else camera = cameraTPV
        }
    })

    if(camera == cameraTPV) {
        control = new OrbitControls(camera, renderer.domElement)
        control.addEventListener('change', renderer)
        control.maxDistance = 250
        control.maxPolarAngle = Math.PI/2.125
        control.target.clamp
    }

    // Background
    skybox = createSkybox()

    // Ground
    asphalt = createGround('asphalt', 500, 500, 0, 0, 0, 20, 20)
    road = createGround('road', 30, 500, 0, 0.01, 0, 1, 8)

    // Lighting
    moonlight = createMoonlight()

    // Building
    createBuilding()

    // Streetlamps
    assembleStreetlamp()

    // Text
    createText('ST.', 11)
    createText('ASHCRE', 4)

    // Car
    assembleCar()

    let objects = [skybox, moonlight, asphalt, road]
    objects.forEach(object => {
        scene.add(object)
    })

    animate()
}

let animate = () => {
    renderer.render(scene, camera)
    requestAnimationFrame(animate)
}

window.onload = () => {
    init()
}