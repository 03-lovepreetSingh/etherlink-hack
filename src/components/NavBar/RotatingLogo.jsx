'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Suspense, useRef, useState, useEffect } from 'react';
import { useThemeChange } from '../End/ThemeChangeContext';

const RotatingLogo = ({ size = 1, speed = 0.01, direction = 'clockwise', onLoad }) => {
    const modelRef = useRef();
    const { scene } = useGLTF('/NeowareLogo1.glb', undefined, (gltf) => {
        if (onLoad) onLoad();
    });

    useFrame(() => {
        if (modelRef.current) {
            const spinSpeed = direction === 'clockwise' ? speed : -speed;
            modelRef.current.rotation.y += spinSpeed;
        }
    });

    return <primitive ref={modelRef} object={scene} scale={size} onLoad={onLoad} />;
};

const NeowareLogo = ({ width = 100, height = 100, size = 1, speed = 0.01, direction = 'clockwise' }) => {
    const { isThemeDark, setIsThemeDark, isLoaded, setIsLoaded } = useThemeChange();

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoaded(true);
        }, 10000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div style={{ width, height, position: 'relative' }}>
            {/* {!isLoaded && (
                <div style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <img
                        src="/NeowareLogo2.png"
                        alt="Loading Neoware Logo"
                        style={{ maxWidth: '70%', maxHeight: '70%', objectFit: 'contain' }}
                    />
                </div>
            )} */}
            {/* {
                isLoaded && ( */}
            <>
                <Canvas camera={{ position: [0, 0, 3] }} gl={{ preserveDrawingBuffer: true }}>
                    <ambientLight intensity={1} />
                    <directionalLight position={[2, 2, 5]} intensity={1.5} />
                    <Suspense fallback={null}>
                        <RotatingLogo
                            size={size}
                            speed={speed}
                            direction={direction}
                            onLoad={() => setIsLoaded(true)}
                        />
                    </Suspense>
                </Canvas>
            </>
            {/* )
            } */}

        </div>
    );
};

export default NeowareLogo;
