import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Server, Activity, Terminal, Shield, Cpu, Globe } from 'lucide-react';

// -----------------------------------------------------------------------------
// THREE.JS SCENE COMPONENT
// -----------------------------------------------------------------------------
const ArchitecturalScene = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isThreeLoaded, setIsThreeLoaded] = useState(false);

  useEffect(() => {
    if (!(window as any).THREE) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
      script.async = true;
      script.onload = () => setIsThreeLoaded(true);
      document.body.appendChild(script);
    } else {
      setIsThreeLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isThreeLoaded || !mountRef.current) return;

    const THREE = (window as any).THREE;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    scene.fog = new THREE.Fog(0xffffff, 10, 50);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 25;
    camera.position.y = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const edges = new THREE.EdgesGeometry(geometry);
    const material = new THREE.LineBasicMaterial({ color: 0xeeeeee, linewidth: 1 });

    const group = new THREE.Group();
    const gridSize = 4;
    const gap = 2.5;

    for (let x = -gridSize; x <= gridSize; x++) {
      for (let y = -gridSize; y <= gridSize; y++) {
        for (let z = -gridSize; z <= gridSize; z++) {
          if (Math.random() > 0.85) {
            const line = new THREE.LineSegments(edges, material);
            line.position.set(x * gap, y * gap, z * gap);
            const scale = 0.5 + Math.random() * 0.5;
            line.scale.set(scale, scale, scale);
            group.add(line);
          }
        }
      }
    }

    scene.add(group);

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    const onDocumentMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX - windowHalfX) * 0.001;
      mouseY = (event.clientY - windowHalfY) * 0.001;
    };

    document.addEventListener('mousemove', onDocumentMouseMove);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    const animate = () => {
      requestAnimationFrame(animate);
      targetX = mouseX * 0.5;
      targetY = mouseY * 0.5;
      group.rotation.y += 0.001;
      group.rotation.x += (targetY - group.rotation.x) * 0.05;
      group.rotation.y += (targetX - group.rotation.y) * 0.05;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousemove', onDocumentMouseMove);
      if (mountRef.current) {
        mountRef.current.innerHTML = '';
      }
    };
  }, [isThreeLoaded]);

  return <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none opacity-50" />;
};

// -----------------------------------------------------------------------------
// UI COMPONENTS
// -----------------------------------------------------------------------------

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const addEventListeners = () => {
      document.addEventListener("mousemove", mMove);
      document.addEventListener("mouseenter", mEnter);
      document.addEventListener("mouseleave", mLeave);
    };

    const removeEventListeners = () => {
      document.removeEventListener("mousemove", mMove);
      document.removeEventListener("mouseenter", mEnter);
      document.removeEventListener("mouseleave", mLeave);
    };

    const mMove = (el: MouseEvent) => {
      setPosition({ x: el.clientX, y: el.clientY });
    };

    const mEnter = () => setHidden(false);
    const mLeave = () => setHidden(true);

    addEventListeners();
    return () => removeEventListeners();
  }, []);

  return (
    <div
      className={`hidden md:block fixed pointer-events-none z-[9999] mix-blend-difference transition-opacity duration-300 ${hidden ? 'opacity-0' : 'opacity-100'}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)'
      }}
    >
      <div className="relative w-8 h-8">
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white"></div>
        <div className="absolute left-1/2 top-0 h-full w-[1px] bg-white"></div>
      </div>
    </div>
  );
};

const Navigation = () => (
  <nav className="fixed top-0 w-full z-50 px-6 py-6 md:px-12 md:py-8 flex justify-between items-center mix-blend-difference text-white">
    <div className="text-sm font-bold tracking-[0.2em] uppercase">
      S—System<span className="opacity-50">_Inc.</span>
    </div>

    <div className="hidden md:flex gap-12 text-xs font-bold tracking-[0.2em] uppercase">
      {['Solutions', 'Research', 'Manifesto', 'Login'].map((item) => (
        <a key={item} href={`#${item.toLowerCase()}`} className="hover:opacity-50 transition-opacity">
          {item}
        </a>
      ))}
    </div>

    <button className="md:hidden">
      <div className="w-6 h-[2px] bg-white mb-1.5"></div>
      <div className="w-6 h-[2px] bg-white"></div>
    </button>
  </nav>
);

const SpecSheet = () => (
  <div className="absolute top-1/4 right-0 md:right-12 z-20 hidden lg:flex flex-col items-start gap-4 p-6 bg-white/80 backdrop-blur-sm border border-gray-100 max-w-[200px]">
    <h4 className="font-mono text-[10px] text-gray-400 uppercase tracking-widest border-b border-gray-200 w-full pb-2 mb-1">
      Component_Ref
    </h4>
    <div className="space-y-3 font-mono text-[10px] text-[#111]">
      <div className="flex justify-between w-full">
        <span className="text-gray-500">MDL</span>
        <span>X-9000</span>
      </div>
      <div className="flex justify-between w-full">
        <span className="text-gray-500">MAT</span>
        <span>ALUMINUM</span>
      </div>
      <div className="flex justify-between w-full">
        <span className="text-gray-500">WGT</span>
        <span>24.5kg</span>
      </div>
      <div className="flex justify-between w-full">
        <span className="text-gray-500">STS</span>
        <span className="text-green-600">ACTIVE</span>
      </div>
    </div>
    <div className="w-full h-[1px] bg-black mt-2"></div>
  </div>
);

const Hero = () => {
  return (
    <header className="relative w-full min-h-screen flex flex-col justify-center items-center px-6 md:px-12 border-b border-black/10 overflow-visible bg-white pt-20">
      <ArchitecturalScene />

      {/* Floating Specs */}
      <SpecSheet />

      <div className="relative z-10 max-w-[90rem] w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center h-full">

        {/* Typography Layer - Pushed back slightly */}
        <div className="lg:col-span-8 lg:col-start-1 relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <span className="w-2 h-2 bg-black rounded-full animate-pulse"></span>
            <p className="text-xs font-mono text-gray-500 tracking-widest uppercase">
              System Status: Nominal
            </p>
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-black tracking-tighter leading-[0.8] text-[#111] uppercase select-none relative">
            Infra<br />
            Structure<br />
            <span className="text-transparent stroke-text" style={{ WebkitTextStroke: '2px #ccc' }}>Simplified.</span>
          </h1>

          <div className="mt-12 flex items-center gap-6">
            <button className="bg-[#111] text-white px-8 py-4 text-xs font-bold tracking-widest uppercase hover:bg-black transition-colors flex items-center gap-4 group">
              Explore Solutions
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <span className="font-mono text-xs text-gray-400 block md:hidden lg:block">
              v.3.0.1 — Build 2024
            </span>
          </div>
        </div>

        {/* Product Shot Layer - Floating & Overlapping */}
        <div className="lg:col-span-6 lg:col-start-7 lg:row-start-1 relative z-20 mt-12 lg:mt-0 flex justify-center lg:justify-end pointer-events-none">
          <div className="relative w-full max-w-md lg:max-w-xl lg:translate-y-12 lg:-translate-x-12">
            {/* The Product Image */}
            <img
              src="https://images.unsplash.com/photo-1591405351990-4726e331f141?q=80&w=1000&auto=format&fit=crop"
              alt="Server Blade Unit"
              className="w-full h-auto object-contain drop-shadow-2xl grayscale contrast-125 brightness-110"
              style={{ mixBlendMode: 'multiply' }}
            />

            {/* Decorative Tech Lines around the image */}
            <div className="absolute -top-10 -right-10 w-20 h-20 border-t border-r border-black/20"></div>
            <div className="absolute -bottom-10 -left-10 w-20 h-20 border-b border-l border-black/20"></div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-6 md:left-12 text-xs font-mono flex flex-col items-start gap-2 text-gray-400 z-0">
        <div className="h-12 w-[1px] bg-gray-300"></div>
        <span>SCROLL TO INITIALIZE</span>
      </div>
    </header>
  );
};

interface BentoCardProps {
  title: string;
  subtitle: string;
  icon: React.ComponentType<any>;
  span?: string;
  children?: React.ReactNode;
  dark?: boolean;
  image?: string;
}

const BentoCard: React.FC<BentoCardProps> = ({ title, subtitle, icon: Icon, span = "", children, dark = false, image }) => (
  <div className={`group relative p-8 md:p-10 flex flex-col justify-between transition-all duration-500 border-b border-r border-gray-200 overflow-hidden 
    ${span} 
    ${dark ? 'bg-[#111] text-white' : 'bg-white text-[#111] hover:bg-gray-50'}
  `}>
    {/* Background Image Layer */}
    {image && (
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* The Image */}
        <img
          src={image}
          alt=""
          className={`w-full h-full object-cover transition-all duration-700 ease-out grayscale group-hover:grayscale-0 group-hover:scale-110 
                    ${dark ? 'opacity-30 group-hover:opacity-50' : 'opacity-10 group-hover:opacity-30'}`}
        />
        {/* Gradient Overlay for Readability */}
        <div className={`absolute inset-0 bg-gradient-to-t ${dark ? 'from-black/90 via-transparent' : 'from-gray-200/50 via-transparent'} to-transparent`} />
      </div>
    )}

    {/* Hover Borders */}
    <div className={`absolute top-0 left-0 w-0 h-[2px] transition-all duration-300 group-hover:w-full z-20 ${dark ? 'bg-white' : 'bg-black'}`}></div>
    <div className={`absolute top-0 left-0 h-0 w-[2px] transition-all duration-300 group-hover:h-full z-20 ${dark ? 'bg-white' : 'bg-black'}`}></div>

    {/* Content Wrapper (z-index to stay above image) */}
    <div className="relative z-10">
      <div className="flex justify-between items-start mb-12">
        <div className={`p-3 rounded-none border backdrop-blur-sm ${dark ? 'border-white/20 bg-white/5' : 'border-black/10 bg-white/50'}`}>
          <Icon strokeWidth={1} className="w-8 h-8" />
        </div>
        <span className="font-mono text-[10px] tracking-widest opacity-50 border border-current px-2 py-1 rounded-full backdrop-blur-sm">
          MOD. {Math.floor(Math.random() * 90) + 10}
        </span>
      </div>

      <div>
        <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-3 leading-none drop-shadow-sm">{title}</h3>
        <p className={`text-sm leading-relaxed max-w-xs drop-shadow-sm ${dark ? 'text-gray-300' : 'text-gray-600'}`}>{subtitle}</p>
        {children && <div className="mt-6">{children}</div>}
      </div>
    </div>
  </div>
);

const Solutions = () => {
  return (
    <section className="w-full bg-[#f4f4f4] relative z-20" id="solutions">
      <div className="px-6 md:px-12 py-12 border-b border-gray-300 flex justify-between items-end">
        <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-gray-400">Core Services</h2>
        <div className="font-mono text-xs text-gray-400">GRID_LAYOUT_4X4</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 border-l border-t border-gray-200">
        <BentoCard
          title="Strategic Consulting"
          subtitle="We strip away complexity to reveal the optimal system state for your enterprise architecture."
          icon={Terminal}
          span="md:col-span-2 md:row-span-2 min-h-[400px]"
          image="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop"
        >
          <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-dashed border-gray-300/50">
            {['Audit', 'Roadmap', 'Migration', 'Scale'].map(tag => (
              <div key={tag} className="flex items-center gap-2 font-mono text-xs uppercase text-gray-600">
                <div className="w-1.5 h-1.5 bg-black"></div> {tag}
              </div>
            ))}
          </div>
        </BentoCard>

        <BentoCard
          title="IDC Hardware"
          subtitle="Tier 4 Datacenters. Liquid cooling. Zero latency execution."
          icon={Server}
          span="md:col-span-1 md:row-span-2"
          dark={true}
          image="https://images.unsplash.com/photo-1558494949-ef2bb2298ce0?q=80&w=1000&auto=format&fit=crop"
        >
          <div className="font-mono text-xs text-gray-400 mt-4 space-y-2 relative z-10">
            <div className="flex justify-between"><span>UPTIME</span> <span className="text-white">99.999%</span></div>
            <div className="flex justify-between"><span>TEMP</span> <span className="text-white">18°C</span></div>
            <div className="flex justify-between"><span>SECURITY</span> <span className="text-white">BIO-METRIC</span></div>
          </div>
        </BentoCard>

        <BentoCard
          title="Cloud Sync"
          subtitle="Seamless distribution."
          icon={Globe}
          span="md:col-span-1"
          image="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop"
        />

        <BentoCard
          title="Security"
          subtitle="End-to-end encryption."
          icon={Shield}
          span="md:col-span-1"
          image="https://images.unsplash.com/photo-1563206767-5b1d972b9fb9?q=80&w=1000&auto=format&fit=crop"
        />

        <BentoCard
          title="Edge Computing"
          subtitle="Processing power closer to the data source."
          icon={Cpu}
          span="md:col-span-2"
          image="https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=1000&auto=format&fit=crop"
        />

        <div className="hidden md:flex flex-col justify-center items-center bg-[#e5e5e5] border-b border-r border-gray-200 col-span-2 p-10">
          <Activity className="w-16 h-16 text-gray-300 mb-4" />
          <div className="font-mono text-xs text-gray-400 tracking-widest uppercase">System Idle</div>
        </div>

      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="bg-white text-[#111] border-t border-black px-6 md:px-12 py-20 relative z-20">
    <div className="flex flex-col md:flex-row justify-between items-start gap-12">
      <div className="max-w-md">
        <h4 className="text-2xl font-bold tracking-tight mb-6">S—System_Inc.</h4>
        <p className="text-sm text-gray-500 leading-relaxed mb-8">
          Inspired by the precision of Swiss design and the robustness of industrial engineering.
          We build digital tools that last.
        </p>
        <div className="flex gap-4">
          <input type="email" placeholder="ENTER EMAIL" className="bg-[#f4f4f4] px-4 py-3 text-xs font-mono w-64 outline-none focus:ring-1 ring-black" />
          <button className="bg-black text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-800">
            Sub
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-16 md:gap-24">
        <div>
          <h5 className="font-mono text-xs text-gray-400 uppercase tracking-widest mb-6">Zurich</h5>
          <ul className="space-y-4 text-sm font-medium">
            <li><a href="#" className="hover:underline">Bahnhofstrasse 12</a></li>
            <li><a href="#" className="hover:underline">+41 44 200 00 00</a></li>
            <li><a href="#" className="hover:underline">zurich@s-system.com</a></li>
          </ul>
        </div>
        <div>
          <h5 className="font-mono text-xs text-gray-400 uppercase tracking-widest mb-6">Social</h5>
          <ul className="space-y-4 text-sm font-medium">
            <li><a href="#" className="hover:underline">Instagram</a></li>
            <li><a href="#" className="hover:underline">Twitter / X</a></li>
            <li><a href="#" className="hover:underline">LinkedIn</a></li>
          </ul>
        </div>
      </div>
    </div>
    <div className="mt-20 pt-8 border-t border-gray-100 flex justify-between items-center font-mono text-[10px] text-gray-400 uppercase">
      <span>© 2024 S—SYSTEM INC.</span>
      <span>ALL RIGHTS RESERVED</span>
    </div>
  </footer>
);

export default function App() {
  return (
    <div className="bg-white min-h-screen text-[#111] font-sans selection:bg-black selection:text-white overflow-x-hidden">
      <CustomCursor />
      <Navigation />
      <Hero />
      <Solutions />
      <Footer />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;900&family=JetBrains+Mono:wght@400;500&display=swap');
        
        :root {
          --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          --font-mono: 'JetBrains Mono', monospace;
        }

        body {
            font-family: var(--font-sans);
            cursor: none; 
        }
        
        @media (max-width: 768px) {
            body { cursor: auto; }
        }

        .stroke-text {
            -webkit-text-stroke: 1px #ccc;
        }

        ::-webkit-scrollbar {
            width: 8px;
        }
        ::-webkit-scrollbar-track {
            background: #fff; 
        }
        ::-webkit-scrollbar-thumb {
            background: #ccc; 
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #000; 
        }
      `}</style>
    </div>
  );
}
