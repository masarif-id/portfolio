'use client';

import { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import Anchor from '@/components/ui/anchor';
import Card from '@/components/ui/card';
import { FaX, FaSpotify, FaArrowRight } from 'react-icons/fa6';

interface Spotify {
    isPlaying: boolean;
    title: string;
    album: string;
    artist: string;
    albumImageUrl: string;
    songUrl: string;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function SpotifyPage() {
    const { data, error, isLoading } = useSWR<Spotify>('/api/now-playing', fetcher, {
        refreshInterval: 5000,
    });
    
    const mountRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<any>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        if (!mountRef.current) return;

        let scene: any, camera: any, renderer: any, controls: any;
        let particles: any[] = [];
        let animationId: number;

        const initThreeJS = async () => {
            // Dynamic import Three.js
            const THREE = await import('three');
            const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js');

            // Scene setup
            scene = new THREE.Scene();
            scene.fog = new THREE.Fog(0x000000, 10, 30);

            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.z = 12;

            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setClearColor(0x000000, 1);
            mountRef.current?.appendChild(renderer.domElement);

            controls = new OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.enableZoom = true;
            controls.autoRotate = true;
            controls.autoRotateSpeed = 0.5;

            const mouse = new THREE.Vector2();
            const mousePoint = new THREE.Vector3();
            const raycaster = new THREE.Raycaster();

            // Create text sprite function
            function createTextSprite(message: string, isMainText = false) {
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d')!;
                const fontSize = isMainText ? 64 : 32;
                const glowSize = isMainText ? 20 : 10;
                context.font = `${fontSize}px Arial`;
                
                const metrics = context.measureText(message);
                const textWidth = metrics.width;
                
                canvas.width = textWidth + glowSize * 2;
                canvas.height = fontSize * 1.5 + glowSize * 2;
                
                context.font = `${fontSize}px Arial`;
                context.shadowColor = 'white';
                context.shadowBlur = glowSize;
                context.fillStyle = isMainText ? '#1DB954' : 'white';
                context.fillText(message, glowSize, fontSize + glowSize / 2);
                
                const texture = new THREE.CanvasTexture(canvas);
                const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
                const sprite = new THREE.Sprite(spriteMaterial);
                
                const scale = isMainText ? canvas.width / 80 : canvas.width / 120;
                sprite.scale.set(scale, canvas.height / (isMainText ? 80 : 120), 1.0);
                return sprite;
            }

            // Create dot sprite function
            function createDotSprite() {
                const canvas = document.createElement('canvas');
                canvas.width = 16;
                canvas.height = 16;
                const context = canvas.getContext('2d')!;
                
                const gradient = context.createRadialGradient(8, 8, 0, 8, 8, 8);
                gradient.addColorStop(0, 'rgba(255,255,255,1)');
                gradient.addColorStop(0.2, 'rgba(255,255,255,0.8)');
                gradient.addColorStop(1, 'rgba(255,255,255,0)');
                
                context.fillStyle = gradient;
                context.fillRect(0, 0, 16, 16);
                
                const texture = new THREE.CanvasTexture(canvas);
                const spriteMaterial = new THREE.SpriteMaterial({ 
                    map: texture, 
                    transparent: true, 
                    blending: THREE.AdditiveBlending 
                });
                const sprite = new THREE.Sprite(spriteMaterial);
                
                return sprite;
            }

            // Create particles with dynamic content
            function createParticles() {
                // Clear existing particles
                particles.forEach(particle => scene.remove(particle));
                particles.length = 0;

                const baseWords = ['music', 'sound', 'rhythm', 'melody', 'harmony', 'beat', 'tune', 'vibe'];
                let dynamicWords = [...baseWords];
                
                // Add song title and artist if available
                if (data?.title) {
                    const titleWords = data.title.split(' ').filter(word => word.length > 2);
                    dynamicWords = [...titleWords.slice(0, 3), ...baseWords];
                }
                if (data?.artist) {
                    const artistWords = data.artist.split(' ').filter(word => word.length > 2);
                    dynamicWords = [...artistWords.slice(0, 2), ...dynamicWords];
                }

            const count = 400;
            const spread = 30;

            for (let i = 0; i < count; i++) {
                let particle: any;
                const rand = Math.random();

                if (rand < 0.4) {
                    particle = createDotSprite();
                    particle.scale.set(0.1, 0.1, 1.0);
                } else if (rand < 0.7) {
                    const word = dynamicWords[Math.floor(Math.random() * dynamicWords.length)];
                    particle = createTextSprite(word, false);
                } else if (rand < 0.85 && data?.title) {
                    // Add main song title occasionally
                    particle = createTextSprite(data.title.split(' ')[0] || 'Music', true);
                } else {
                    particle = createDotSprite();
                    const randomScale = Math.random() * 0.25 + 0.1;
                    particle.scale.set(randomScale, randomScale, 1.0);
                }
                
                const x = (Math.random() - 0.5) * spread;
                const y = (Math.random() - 0.5) * spread;
                const z = (Math.random() - 0.5) * spread;
                particle.position.set(x, y, z);
                
                particle.userData = {
                    basePosition: new THREE.Vector3(x, y, z),
                    velocity: new THREE.Vector3(0, 0, Math.random() * 0.02 + 0.02)
                };

                scene.add(particle);
                particles.push(particle);
            }
            }

            // Initial particle creation
            createParticles();
            setIsInitialized(true);
            // Animation loop
            function animate() {
                animationId = requestAnimationFrame(animate);
                controls.update();

                raycaster.setFromCamera(mouse, camera);
                const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
                raycaster.ray.intersectPlane(plane, mousePoint);

                particles.forEach(particle => {
                    particle.position.z += particle.userData.velocity.z;

                    const distanceToMouse = particle.position.distanceTo(mousePoint);
                    const repulsionRadius = 2.0;
                    
                    if (distanceToMouse < repulsionRadius) {
                        const repulsionForce = (1 - (distanceToMouse / repulsionRadius)) * 0.1;
                        const direction = new THREE.Vector3().subVectors(particle.position, mousePoint).normalize();
                        particle.position.add(direction.multiplyScalar(repulsionForce));
                    }

                    particle.position.lerp(
                        new THREE.Vector3(
                            particle.userData.basePosition.x, 
                            particle.userData.basePosition.y, 
                            particle.position.z
                        ), 
                        0.01
                    );
                    
                    if (particle.position.z > camera.position.z) {
                        particle.position.z = -spread / 2;
                        particle.userData.basePosition.x = (Math.random() - 0.5) * spread;
                        particle.userData.basePosition.y = (Math.random() - 0.5) * spread;
                        particle.position.x = particle.userData.basePosition.x;
                        particle.position.y = particle.userData.basePosition.y;
                    }
                });
                
                renderer.render(scene, camera);
            }
            animate();

            // Event listeners
            const handleMouseMove = (event: MouseEvent) => {
                mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
                mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            };

            const handleResize = () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            };

            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('resize', handleResize);

            // Store cleanup functions
            sceneRef.current = {
                cleanup: () => {
                    window.removeEventListener('mousemove', handleMouseMove);
                    window.removeEventListener('resize', handleResize);
                    cancelAnimationFrame(animationId);
                    if (mountRef.current && renderer.domElement) {
                        mountRef.current.removeChild(renderer.domElement);
                    }
                    renderer.dispose();
                }
            };
        };

        initThreeJS();

        return () => {
            if (sceneRef.current?.cleanup) {
                sceneRef.current.cleanup();
            }
        };
    }, [data?.title, data?.artist]);

    // Recreate particles when song changes
    useEffect(() => {
        if (isInitialized && sceneRef.current) {
            // Small delay to ensure smooth transition
            const timer = setTimeout(() => {
                // This will trigger the main useEffect to recreate particles
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [data?.title, data?.artist, isInitialized]);
    if (error) return <ErrorDisplay />;

    return (
        <div className="relative w-full h-screen overflow-hidden">
            {/* Three.js Canvas Container */}
            <div 
                ref={mountRef} 
                className="absolute inset-0 z-0"
                style={{ background: '#000000' }}
            />
            
            {/* Close Button */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 md:top-10">
                <Anchor className='inline-flex hover:mb-6 hover:scale-125' href='/'>
                    <FaX />
                    <div className='sr-only'>Close</div>
                </Anchor>
            </div>

            {/* Music Card */}
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none p-4">
                <div className="pointer-events-auto">
                    {isLoading ? <LoadingCard /> : <MusicCard data={data} />}
                </div>
            </div>
        </div>
    );
}

function MusicCard({ data }: { data?: Spotify }) {
    if (!data) return <LoadingCard />;

    return (
        <Card className="w-80 max-w-[85vw] bg-black/90 backdrop-blur-lg border border-white/30 shadow-2xl md:w-96">
            <div className="p-6 text-center md:p-8">
                {/* Album Cover */}
                {data.albumImageUrl && (
                    <div className="w-32 h-32 mx-auto mb-4 rounded-xl overflow-hidden shadow-2xl md:w-48 md:h-48 md:mb-6 md:rounded-2xl">
                        <img 
                            src={data.albumImageUrl} 
                            alt={data.album}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}
                
                {/* Track Info */}
                <div className="space-y-2 mb-4 md:space-y-3 md:mb-6">
                    <h1 className="text-lg font-bold text-white line-clamp-2 md:text-2xl">
                        {data.title}
                    </h1>
                    <p className="text-sm text-gray-300 md:text-lg">
                        {data.artist}
                    </p>
                    <p className="text-xs text-gray-400 md:text-sm">
                        {data.album}
                    </p>
                </div>

                {/* Status */}
                <div className="flex items-center justify-center gap-2 mb-4 md:mb-6">
                    {data.isPlaying && (
                        <div className="flex items-center gap-0.5">
                            <div className="w-0.5 h-3 bg-green-500 rounded-full animate-pulse md:w-1 md:h-4" />
                            <div className="w-0.5 h-3 bg-green-500 rounded-full animate-pulse md:w-1 md:h-4" style={{ animationDelay: '0.2s' }} />
                            <div className="w-0.5 h-3 bg-green-500 rounded-full animate-pulse md:w-1 md:h-4" style={{ animationDelay: '0.4s' }} />
                        </div>
                    )}
                    <p className="text-xs text-gray-400 md:text-sm">
                        {data.isPlaying ? 'Now Playing' : 'Recently Played'}
                    </p>
                </div>

                {/* Spotify Button */}
                <a
                    href={data.songUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full font-medium transition-all duration-300 hover:scale-105 text-sm md:gap-3 md:px-6 md:py-3 md:text-base"
                >
                    <FaSpotify className="text-sm md:text-base" />
                    Open in Spotify
                    <FaArrowRight className="-rotate-45 transition-transform duration-300 group-hover:rotate-0 text-sm md:text-base" />
                </a>
            </div>
        </Card>
    );
}

function LoadingCard() {
    return (
        <Card className="w-80 max-w-[85vw] bg-black/90 backdrop-blur-lg border border-white/30 md:w-96">
            <div className="p-6 text-center md:p-8">
                <div className="w-32 h-32 mx-auto mb-4 bg-gray-700 animate-pulse rounded-xl md:w-48 md:h-48 md:mb-6 md:rounded-2xl" />
                <div className="space-y-2 mb-4 md:space-y-3 md:mb-6">
                    <div className="h-6 bg-gray-700 animate-pulse rounded-md mx-auto w-3/4 md:h-8" />
                    <div className="h-4 bg-gray-700 animate-pulse rounded-md mx-auto w-1/2 md:h-6" />
                    <div className="h-3 bg-gray-700 animate-pulse rounded-md mx-auto w-2/3 md:h-4" />
                </div>
                <div className="h-10 bg-gray-700 animate-pulse rounded-full mx-auto w-40 md:h-12 md:w-48" />
            </div>
        </Card>
    );
}

function ErrorDisplay() {
    return (
        <div className="w-full h-screen bg-black flex items-center justify-center">
            <Card className="w-80 max-w-[85vw] bg-black/90 backdrop-blur-lg border border-red-500/30 md:w-96">
                <div className="p-6 text-center md:p-8">
                    <div className="text-red-500 mb-4">
                        <FaX size="2rem" className="mx-auto md:text-5xl" />
                    </div>
                    <h2 className="text-lg font-bold text-white mb-2 md:text-xl">Failed to Load</h2>
                    <p className="text-sm text-gray-400 mb-4 md:text-base md:mb-6">Unable to fetch Spotify data</p>
                    <Anchor href="/" className="inline-flex">
                        <FaArrowRight className="-rotate-45" />
                        Back to Home
                    </Anchor>
                </div>
            </Card>
        </div>
    );
}