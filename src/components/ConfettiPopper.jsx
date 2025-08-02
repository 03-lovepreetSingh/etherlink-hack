'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

const DEFAULT_PARTICLE_COUNT = 150;
const DEFAULT_EXPLOSION_FACTOR = 0.7;
const DEFAULT_SHOOT_DIRECTION = -90;
const DEFAULT_LIFESPAN_FACTOR = 1.0;
const DEFAULT_GRAVITY = 0.08;

const PARTICLE_COLORS = [
    'rgba(250, 204, 21, 0.7)', 'rgba(251, 146, 60, 0.7)', 'rgba(248, 113, 113, 0.7)',
    'rgba(244, 114, 182, 0.7)', 'rgba(167, 139, 250, 0.7)', 'rgba(96, 165, 250, 0.7)',
    'rgba(74, 222, 128, 0.7)', 'rgba(212, 212, 216, 0.7)'
];

// --- Physics Constants ---
const INITIAL_BLAST_POWER_RANGE = [5, 15];
const SPREAD = Math.PI / 3; // 60 degree cone

const randomRange = (min, max) => Math.random() * (max - min) + min;

const createParticle = (x, y, { explosionFactor, shootDirection, lifespanFactor, gravity }) => {
    const baseAngleRad = shootDirection * (Math.PI / 180);
    const particleAngle = randomRange(baseAngleRad - SPREAD / 2, baseAngleRad + SPREAD / 2);
    const blastPower = randomRange(...INITIAL_BLAST_POWER_RANGE) * explosionFactor;

    return {
        x, y,
        width: randomRange(5, 10), height: randomRange(10, 25),
        mass: randomRange(0.9, 1.1), drag: randomRange(0.95, 0.99),
        zRotation: randomRange(0, 360), zRotationSpeed: randomRange(-15, 15),
        yRotation: randomRange(0, Math.PI * 2), yRotationSpeed: randomRange(-0.07, 0.07),
        color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
        vx: Math.cos(particleAngle) * blastPower, vy: Math.sin(particleAngle) * blastPower,
        lifespan: randomRange(250, 450) * lifespanFactor, age: 0, opacity: 1,
        flutterAngle: randomRange(0, Math.PI * 2), flutterSpeed: randomRange(0.02, 0.06),
        flutterMagnitude: randomRange(0.5, 1.2),
        gravity: gravity,
    };
};

const updateParticle = (p) => {
    const newParticle = { ...p };
    newParticle.vx *= newParticle.drag;
    newParticle.vy *= newParticle.drag;
    newParticle.vy += newParticle.gravity * newParticle.mass;
    newParticle.flutterAngle += newParticle.flutterSpeed;
    newParticle.x += Math.sin(newParticle.flutterAngle) * newParticle.flutterMagnitude;
    newParticle.x += newParticle.vx;
    newParticle.y += newParticle.vy;
    newParticle.zRotation += newParticle.zRotationSpeed;
    newParticle.yRotation += newParticle.yRotationSpeed;
    newParticle.age++;
    if (newParticle.age / newParticle.lifespan > 0.7) {
        const fadeProgress = (newParticle.age / newParticle.lifespan - 0.7) / 0.3;
        newParticle.opacity = 1 - fadeProgress;
    }
    return newParticle;
};

const drawParticle = (ctx, p) => {
    if (p.opacity <= 0) return;
    ctx.save();
    ctx.translate(p.x, p.y);
    const scaleX = Math.cos(p.yRotation);
    ctx.scale(scaleX, 1);
    ctx.rotate(p.zRotation * Math.PI / 180);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.opacity;
    ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height / 3);
    ctx.restore();
};

const isParticleDead = (p) => p.age >= p.lifespan || p.opacity <= 0;

// --- Custom Hook for Confetti Logic ---
const useConfetti = (canvasRef, options) => {
    const particlesRef = useRef([]);
    const animationFrameId = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const setCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        setCanvasSize();
        window.addEventListener('resize', setCanvasSize);
        return () => window.removeEventListener('resize', setCanvasSize);
    }, [canvasRef]);

    const pop = useCallback((x, y) => {
        if (!canvasRef.current) return;

        if (animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current);
        }

        particlesRef.current = Array.from({ length: options.particleCount }, () => createParticle(x, y, options));

        const animate = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particlesRef.current.forEach(p => drawParticle(ctx, p));
            particlesRef.current = particlesRef.current
                .map(updateParticle)
                .filter(p => !isParticleDead(p));

            if (particlesRef.current.length > 0) {
                animationFrameId.current = requestAnimationFrame(animate);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        };

        animationFrameId.current = requestAnimationFrame(animate);

    }, [options, canvasRef]);

    return pop;
};

const ConfettiCanvas = ({ popperOrigin, ...options }) => {
    const canvasRef = useRef(null);
    const pop = useConfetti(canvasRef, options);

    useEffect(() => {
        if (popperOrigin) {
            pop(popperOrigin.x, popperOrigin.y);
        }
    }, [popperOrigin, pop]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full pointer-events-none z-50"
        />
    );
};

export default ConfettiCanvas;