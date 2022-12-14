import * as THREE from 'three';
import { ArrowHelper, Object3D, Vector3 } from 'three';

const heroMat = new THREE.MeshPhongMaterial();

const HEAD_SIZE = 0.3;
const BODY_WIDTH = 0.3;
const BODY_LENGTH = 0.4;
const ARM_WIDTH = 0.1;
const ARM_LENGTH = 0.5;
const LEG_WIDTH = 0.12;
const LEG_LENGTH = 0.2;
const PADDING = 0.05;
const HEIGHT = HEAD_SIZE + BODY_LENGTH + LEG_LENGTH + PADDING * 2;

class Hero extends THREE.Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        heroMat.color.setHex(global.params.heroColor);

        // Init state
        this.state = {
            inWeb: false,
            pivot: new Vector3(),
            spineDir: new Vector3(0, -1, 0),
        };
        
        this.parts = {
            head: null,
            body: null,
            leftArm: null,
            rightArm: null,
            leftLeg: null,
            rightLeg: null,
            leftShoulder: new Object3D(),
            rightShoulder: new Object3D(),
        }

        this.initHead();
        this.initBody();
        this.initArms();
        this.initLegs();

        // const testGeo = new THREE.BoxGeometry(0.5, 1, 0.5);
        // const test = new THREE.Mesh(testGeo);
        // this.add(test);
        // test.position.set(0, -0.5, 0); 

        // add meshes to group
        // const bodyGeo = new THREE.SphereGeometry(0.5);
        // bodyMat.color.setHex(SceneParams.heroColor);
        // const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
        // bodyMesh.castShadow = true;
        // bodyMesh.receiveShadow = true;
        // this.add(bodyMesh);

        Object.keys(this.parts).forEach( (key) => {
            this.parts[key].castShadow = true;
            this.parts[key].receiveShadow = true;
            if (key != "leftArm" && key != "rightArm") {
                this.add(this.parts[key]);
            }
        });

        // Add self to parent's update list
        parent.addToUpdateList(this);    
    }

    initHead() {
        const headGeo = new THREE.BoxGeometry(HEAD_SIZE, HEAD_SIZE, HEAD_SIZE);
        this.parts.head = new THREE.Mesh(headGeo, heroMat);
        this.parts.head.position.set(0, - HEAD_SIZE / 2);
    }

    initBody() {
        const bodyGeo = new THREE.BoxGeometry(BODY_WIDTH, BODY_LENGTH, BODY_WIDTH);
        this.parts.body = new THREE.Mesh(bodyGeo, heroMat);
        this.parts.body.position.set(0, -HEIGHT + LEG_LENGTH + PADDING + BODY_LENGTH / 2, 0);
    }

    initArms() {
        this.parts.leftShoulder.position.set(-BODY_WIDTH / 2 - PADDING - ARM_WIDTH / 2, -HEAD_SIZE - PADDING, 0);
        this.parts.rightShoulder.position.set(BODY_WIDTH / 2 + PADDING + ARM_WIDTH / 2, -HEAD_SIZE - PADDING, 0);

        const armGeo = new THREE.BoxGeometry(ARM_WIDTH, ARM_LENGTH, ARM_WIDTH);
        this.parts.leftArm = new THREE.Mesh(armGeo, heroMat);
        this.parts.rightArm = new THREE.Mesh(armGeo, heroMat);

        this.parts.leftShoulder.add(this.parts.leftArm);
        this.parts.rightShoulder.add(this.parts.rightArm);

        this.parts.leftArm.position.set(0, -ARM_LENGTH / 2, 0);
        this.parts.rightArm.position.set(0, -ARM_LENGTH / 2, 0);
    }

    initLegs() {
        const legGeo = new THREE.BoxGeometry(LEG_WIDTH, LEG_LENGTH, LEG_WIDTH);
        this.parts.leftLeg = new THREE.Mesh(legGeo, heroMat);
        this.parts.rightLeg = new THREE.Mesh(legGeo, heroMat);
        this.parts.leftLeg.position.set(-BODY_WIDTH / 2 + LEG_WIDTH / 2, -HEIGHT + LEG_LENGTH / 2, 0);            
        this.parts.rightLeg.position.set(BODY_WIDTH / 2 - LEG_WIDTH / 2, -HEIGHT + LEG_LENGTH / 2, 0);       
    }

    update(state) {
        // from in web to out
        if (state.inWeb && !this.state.inWeb) {
            // move arms up
            this.parts.leftArm.position.add(new Vector3(0, ARM_LENGTH, 0));
            this.parts.rightArm.position.add(new Vector3(0, ARM_LENGTH, 0));
            this.parts.leftShoulder.rotation.z = -Math.PI / 8;
            this.parts.rightShoulder.rotation.z = Math.PI / 8;
        }

        // from out of web to in
        if (!state.inWeb && this.state.inWeb) {
            // reset arms
            this.parts.leftShoulder.rotation.z = 0;
            this.parts.rightShoulder.rotation.z = 0;
            this.parts.leftArm.position.add(new Vector3(0, -ARM_LENGTH, 0));
            this.parts.rightArm.position.add(new Vector3(0, -ARM_LENGTH, 0));

            // this.rotateX = 0;
            // this.rotateY = 0;
            // this.rotateZ = 0;
            // this.state.spineDir = new Vector3(0, -1, 0);
        }

        this.state.inWeb = state.inWeb;

        if (this.state.inWeb) {
            const v = this.state.spineDir;
            const p = state.pivot.clone().normalize();
            const axis = new Vector3();
            axis.crossVectors(v, p).normalize();
            let angle = Math.acos(v.dot(p));
            if (angle < Math.PI / 2) angle -= Math.PI;
            else angle += Math.PI;
            this.rotateOnWorldAxis(axis, angle);
            this.state.spineDir = p.multiplyScalar(-1);
        }
    }
}

export default Hero;
