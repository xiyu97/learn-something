import * as THREE from 'three'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js';



var camera, scene, renderer, composer;
var object, light;

var glitchPass;

var posX, flag = false;

init();
animate();

function init() {
    // 添加渲染器
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // 添加场景
    scene = new THREE.Scene();
    // scene.fog = new THREE.Fog(0x000000, 1, 1000);        // 雾化效果


    // 使用 透视摄像机PerspectiveCamera
    camera = new THREE.PerspectiveCamera(
        75, window.innerWidth / window.innerHeight,
        0.1, 1000
    );

    // 设置摄像机z轴位置
    camera.position.z = 15;

    // 创建3d对象
    object = new THREE.Object3D();
    scene.add(object);


    // 创建多面体
    var geometry = new THREE.SphereBufferGeometry(5, 32, 32);     // 球缓冲几何体
    var material = new THREE.MeshPhongMaterial({
        // color: 0x1d56d6,
        flatShading: false,
        wireframe: false,
        vertexColors: false
    });
    
    var texture = new THREE.TextureLoader().load("https://pic3.zhimg.com/80/v2-73631a443707a3b44bea16e11f5336c6_720w.jpg");
    material.map = texture;

    var mesh = new THREE.Mesh(geometry, material);
    object.add(mesh);

    object.rotation.x = 0.5;


    // 增加环境光源
    scene.add(new THREE.AmbientLight(0x222222));

    // 增加平行光源
    light = new THREE.DirectionalLight(0xffffff);
    light.position.set(1, 1, 1);
    scene.add(light);


    window.addEventListener('resize', onWindowResize, false);

    // window.addEventListener('mousedown', function(e){
    //     posX = e.clientX;
    //     flag = true;
    // },false)

    // window.addEventListener('mousemove', function(e){
    //     let change = e.clientX - posX;
    //     if(flag){
    //         change >= 0 ? (camera.rotation.y += 0.005) : camera.rotation.y -= 0.005;
    //     }
    // },false)

    // window.addEventListener('mouseup', function(e){
    //     flag = false;
    //     posX = e.clientX;
    // },false)

    // 后处理
    // composer = new EffectComposer(renderer);
    // composer.addPass(new RenderPass(scene, camera));

    // glitchPass = new GlitchPass();
    // composer.addPass(glitchPass);

    // var wildGlitchOption = document.getElementById('wildGlitch');
    // wildGlitchOption.addEventListener('change', updateOptions);

    // updateOptions();
}


// 渲染场景
function animate() {
    // 角度变换
    object.rotation.y += 0.003;

    // 位置变换

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}


// function updateOptions() {

//     var wildGlitch = document.getElementById('wildGlitch');
//     glitchPass.goWild = wildGlitch.checked;

// }

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    // composer.setSize(window.innerWidth, window.innerHeight);
}


