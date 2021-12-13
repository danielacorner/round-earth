import "./App.css";
import { Canvas } from "react-three-fiber";
import { Leva, useControls } from "leva";
import { OrbitControls } from "@react-three/drei";
function App() {
  const { radius, boxRadius } = useControls({
    radius: 1,
    boxRadius: 0.25,
  });

  return (
    <div>
      <Leva />

      <Canvas
        style={{
          width: "100%",
          height: "100vh",
          background: "black",
        }}
      >
        <mesh>
          <sphereBufferGeometry args={[radius, 999, 999]} />
          <meshBasicMaterial color="white" />
        </mesh>
        <mesh position={[0, radius + boxRadius, 0]} rotation={[0, 0, 0]}>
          <boxBufferGeometry args={[boxRadius, boxRadius, boxRadius]} />
          <meshBasicMaterial color="red" />
        </mesh>
        <OrbitControls {...({} as any) /* react-three/drei+typescript bug */} />
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
        }}
      >
        sphere radius: {radius} meter{radius === 1 ? "" : "s"}
        <br />
        box radius: {boxRadius} meter{boxRadius === 1 ? "" : "s"}
      </div>
    </div>
  );
}

export default App;
