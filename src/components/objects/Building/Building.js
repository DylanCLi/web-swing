import * as THREE from 'three';
import { SceneParams } from '../../../params';

class Building extends THREE.Group {
    constructor(parent, type) {
        // invalid building type
        if (type < 0 || type >= global.params.buildingHeight.length) return;

        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            //mesh: new THREE.Mesh(buildGeo),
        };

        // add meshes to group
        let buildGeo = global.params.buildingGeo[type];
        let buildMat = global.params.buildingMat;

        // if (type == 1) buildGeo = global.params.buildingGeo1;
        // else if (type == 2) buildGeo = global.params.buildingGeo2;
        // else buildGeo = global.params.buildingGeo1;

        buildMat.color.setHex(global.params.buildingColor);

        const building = new THREE.Mesh(buildGeo, buildMat);
        building.receiveShadow = true;
        building.castShadow = true;
        this.add(building);

        // Add self to parent's update list
        parent.addToUpdateList(this);
    }

    update(state) {
        this.position.add(state.offset);
        // const old = this.state.mesh.position;
        // this.state.mesh.position.set(old.x, old.y, old.z)
    }
}

export default Building;
