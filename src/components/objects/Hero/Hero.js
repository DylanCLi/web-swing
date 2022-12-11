import * as THREE from 'three';
import { SceneParams } from '../../../params';

class Hero extends THREE.Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            velocity: new THREE.Vector3(-1,0,0),
            inWeb: false,
            previous: new THREE.Vector3(),
            //webPosition: new THREE.Vector3(),
        };
        this.name = 'hero';

        // this.getWorldPosition(this.state.camera.position);
        // this.state.camera.position.add(new THREE.Vector3(9,0,0));

        // add meshes to group
        const bodyGeo = new THREE.SphereGeometry(0.5);//THREE.BoxGeometry(0.5,0.5,0.5);
        const bodyMat = new THREE.MeshPhongMaterial();
        bodyMat.color.setHex(SceneParams.heroColor);
        const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
        bodyMesh.castShadow = true;
        bodyMesh.receiveShadow = true;
        this.add(bodyMesh);

        // Add self to parent's update list
        parent.addToUpdateList(this);    
    }

    update(timeStamp) {
        // const oldPos = this.position.clone();//new THREE.Vector3();
        // //this.getWorldPosition(oldPos);

        // const offset = this.state.velocity.clone().multiplyScalar(timeStamp * this.state.speed); 
        // this.position.add(offset);
        // this.state.camera.position.add(offset);

        // const newPos = this.position.clone(); //new THREE.Vector3();
        // //this.getWorldPosition(newPos);
        // const delta = newPos.clone().sub(oldPos);

        // const cameraOffset = new THREE.Vector3(9,0,0);
        // this.state.camera.position.copy(newPos).add(cameraOffset);
        // // this.state.camera.position.add(delta);
        // this.state.camera.lookAt(newPos);

        //this.state.mesh.position.set(old.x + timeStamp / 10000, old.y, old.z)
    }
}

export default Hero;
