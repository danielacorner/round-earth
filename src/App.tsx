import "./App.css";
import { Canvas, useThree } from "react-three-fiber";
import { Leva, useControls } from "leva";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  OrbitControls,
  PerspectiveCamera,
  TransformControls,
} from "@react-three/drei";

const MATERIAL_PROPS = {
  roughness: 0.5,
  metalness: 0.12,
  transparent: true,
  opacity: 0.7,
};

function App() {
  const { sphereRadiusKm, boxWidthM, boxHeightAboveGroundKm } = useControls({
    sphereRadiusKm: { min: 100, max: 6371, value: 100, step: 100 },
    boxWidthM: { min: 50, max: 240, value: 50 },
    boxHeightAboveGroundKm: { min: 0.1, max: 27.4, value: 0.1 },
  });

  return (
    <div>
      <Leva oneLineLabels={true} />

      <Canvas
        style={{
          width: "100%",
          height: "100vh",
          background: "black",
        }}
      >
        <PerspectiveCamera makeDefault {...{}} />

        <Scene
          {...{
            sphereRadiusKm,
            boxWidthKm: boxWidthM / 1000,
            boxHeightAboveGroundKm,
          }}
        />
      </Canvas>
      <div
        style={{
          background: "white",
          position: "fixed",
          padding: "8px 16px",
          bottom: "10vw",
          right: "10vw",
          borderRadius: 8,
          boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.25)",
          opacity: 0.6,
        }}
      >
        sphere radius: {sphereRadiusKm} km
        <br />
        box width: {boxWidthM} m
        <br />
        box height from the ground: {boxHeightAboveGroundKm} km
      </div>
    </div>
  );
}

export default App;

function Scene({
  sphereRadiusKm,
  boxWidthKm,
  boxHeightAboveGroundKm,
}: {
  sphereRadiusKm: number;
  boxWidthKm: number;
  boxHeightAboveGroundKm: number;
}) {
  const boxRef = useRef<THREE.Mesh>(null);

  // when one of the measures changes, position the camera on top of the sphere facing the box
  const { camera } = useThree();
  useEffect(() => {
    if (!boxRef.current) return;
    const x = 0;
    const y = boxRef.current.position.y;
    // const y = sphereRadiusKm + boxHeightAboveGroundKm;
    const z = -boxWidthKm * 4;
    camera.position.set(x, y, z);
    camera.lookAt(boxRef.current.position);
  }, [sphereRadiusKm, boxWidthKm, boxHeightAboveGroundKm]);

  const { cameraRotation } = useControls({
    cameraRotation: {
      value: [10, 10],
      joystick: "invertY",
    },
  });
  // camera rotation
  useEffect(() => {
    camera.rotation.set(cameraRotation[0], cameraRotation[1], 0);
  }, []);

  return (
    <>
      {/* need to turn off OrbitControls to access the camera */}
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <mesh scale={sphereRadiusKm} castShadow receiveShadow>
        <sphereGeometry args={[1, 100, 100]} />
        <meshPhysicalMaterial color="white" {...MATERIAL_PROPS} />
      </mesh>
      <mesh
        scale={boxWidthKm / 2}
        ref={boxRef}
        position={[
          0,
          sphereRadiusKm + boxWidthKm / 2 + boxHeightAboveGroundKm,
          0,
        ]}
        rotation={[0, 0, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshPhysicalMaterial color="red" {...MATERIAL_PROPS} />
      </mesh>
    </>
  );
}

function getAngleOfHorizonAtScreenWidth(r: number, h: number) {
  const angle = (1 - r / (r + h)) ^ 2 ^ 0.5;
  return angle;
}
