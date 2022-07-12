// This object contains the state of the app
export default {
    isDev: true,
    isVREnabled: false,
    maxAnisotropy: 1,
    fog: {
        color: 0x121212,
        near: 0.002
    },
    camera: {
        fov: 70,
        near: 0.1,
        far: 1000,
        aspect: 1,
        posX: 0,
        posY: 0,
        posZ: 1000
    },
    controls: {
        autoRotate: false,
        autoRotateSpeed: -0.5,
        rotateSpeed: 0.5,
        zoomSpeed: 0.8,
        minDistance: 0.1,
        maxDistance: 1000,
        minPolarAngle: Math.PI / 5,
        maxPolarAngle: Math.PI / 2,
        minAzimuthAngle: -Infinity,
        maxAzimuthAngle: Infinity,
        enableDamping: true,
        dampingFactor: 0.5,
        enableZoom: true,
        target: {
            x: 0,
            y: 0,
            z: 0
        }
    },
    ambientLight: {
        enabled: true,
        color: 0x333333
    },
    directionalLight: {
        enabled: true,
        color: 0xf0f0f0,
        intensity: 0.2,
        x: -75,
        y: 180,
        z: 150
    },
    pointLight: {
        enabled: true,
        color: 0xffffff,
        intensity: 0.34,
        distance: 115,
        x: 0,
        y: 0,
        z: 0
    },
    hemiLight: {
        enabled: true,
        color: 0xc8c8c8,
        groundColor: 0xffffff,
        intensity: 0.55,
        x: 0,
        y: 0,
        z: 0
    },
    shadow: {
        enabled: true,
        helperEnabled: false,
        bias: 0,
        mapWidth: 2048,
        mapHeight: 2048,
        near: 250,
        far: 400,
        top: 100,
        right: 100,
        bottom: -100,
        left: -100
    }
};