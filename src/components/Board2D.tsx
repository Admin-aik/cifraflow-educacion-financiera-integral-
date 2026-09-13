import React, { useRef, useEffect, useState, useCallback } from 'react';
import { BoardTile, CharacterArchetype } from '../types';
import { Sparkles, ZoomIn, ZoomOut, RotateCcw, Info } from 'lucide-react';

interface Board2DProps {
  innerTiles: BoardTile[];
  outerTiles: BoardTile[];
  playerIndex: number;
  isOnFastTrack: boolean;
  archetype: CharacterArchetype;
  isMoving: boolean;
  diceValue: number[];
  isRolling: boolean;
  onTileClick?: (tile: BoardTile) => void;
  cameraMode?: 'isometric' | 'topdown' | 'follow';
}

export const Board2D: React.FC<Board2DProps> = ({
  innerTiles,
  outerTiles,
  playerIndex,
  isOnFastTrack,
  archetype,
  isMoving,
  diceValue,
  isRolling,
  onTileClick,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Viewport transform (Pan & Zoom)
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedTile, setSelectedTile] = useState<BoardTile | null>(null);
  const [hoveredTile, setHoveredTile] = useState<BoardTile | null>(null);

  // Interpolated pawn position
  const pawnPosRef = useRef({ angle: 0, radius: 190, currentAngle: 0, currentRadius: 190, jumpOffset: 0 });
  const animFrameRef = useRef<number>(0);

  // Handle pawn movement angle calculation
  useEffect(() => {
    const activeTiles = isOnFastTrack ? outerTiles : innerTiles;
    const count = activeTiles.length;
    const targetTile = activeTiles[playerIndex] || activeTiles[0];
    const targetAngle = (targetTile.index / count) * Math.PI * 2 - Math.PI / 2;
    const targetRadius = isOnFastTrack ? 320 : 195;

    pawnPosRef.current.angle = targetAngle;
    pawnPosRef.current.radius = targetRadius;
  }, [playerIndex, isOnFastTrack, innerTiles, outerTiles]);

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let startTime = performance.now();

    const render = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2 + pan.x;
      const centerY = height / 2 + pan.y;

      // Clear Screen
      ctx.fillStyle = '#050814';
      ctx.fillRect(0, 0, width, height);

      // Background Cyberpunk Grid
      ctx.save();
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.08)';
      ctx.lineWidth = 1;
      const gridSize = 40 * zoom;
      const offsetX = (pan.x % gridSize);
      const offsetY = (pan.y % gridSize);

      for (let x = offsetX; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = offsetY; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      ctx.restore();

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.scale(zoom, zoom);

      // Draw Center Energy Core
      const pulse = Math.sin(elapsed * 3) * 6;
      ctx.beginPath();
      ctx.arc(0, 0, 80 + pulse, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(6, 182, 212, 0.05)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Center Holographic Symbol
      ctx.save();
      ctx.rotate(elapsed * 0.2);
      ctx.beginPath();
      ctx.arc(0, 0, 50, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
      ctx.setLineDash([8, 8]);
      ctx.stroke();
      ctx.restore();

      // Center Text / Dice Result Display
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      if (isRolling) {
        ctx.font = 'bold 22px monospace';
        ctx.fillStyle = '#38bdf8';
        ctx.fillText('⚡ LANZANDO...', 0, -10);
      } else if (diceValue.length > 0) {
        ctx.font = 'bold 28px monospace';
        ctx.fillStyle = '#00f2fe';
        ctx.shadowColor = '#00f2fe';
        ctx.shadowBlur = 10;
        ctx.fillText(`🎲 ${diceValue.join(' + ')}`, 0, -8);
        ctx.font = '11px monospace';
        ctx.fillStyle = '#94a3b8';
        ctx.shadowBlur = 0;
        ctx.fillText(`TOTAL: ${diceValue.reduce((a, b) => a + b, 0)}`, 0, 16);
      } else {
        ctx.font = 'bold 16px monospace';
        ctx.fillStyle = '#06b6d4';
        ctx.fillText('CIFRAFLOW', 0, -10);
        ctx.font = '10px monospace';
        ctx.fillStyle = '#64748b';
        ctx.fillText('NÚCLEO 2050', 0, 10);
      }
      ctx.restore();

      // Track 1: Fast Track Connecting Laser Line (Outer Loop)
      const outerR = 320;
      ctx.beginPath();
      ctx.arc(0, 0, outerR, 0, Math.PI * 2);
      ctx.strokeStyle = isOnFastTrack ? 'rgba(245, 158, 11, 0.4)' : 'rgba(99, 102, 241, 0.2)';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Track 2: Rat Race Inner Connecting Line
      const innerR = 195;
      ctx.beginPath();
      ctx.arc(0, 0, innerR, 0, Math.PI * 2);
      ctx.strokeStyle = !isOnFastTrack ? 'rgba(6, 182, 212, 0.4)' : 'rgba(51, 65, 85, 0.3)';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw Inner Tiles (Rat Race)
      innerTiles.forEach((tile) => {
        const count = innerTiles.length;
        const angle = (tile.index / count) * Math.PI * 2 - Math.PI / 2;
        const tx = Math.cos(angle) * innerR;
        const ty = Math.sin(angle) * innerR;
        const isCurrent = !isOnFastTrack && playerIndex === tile.index;
        const isHovered = hoveredTile?.id === tile.id;

        // Tile Box
        ctx.save();
        ctx.translate(tx, ty);
        ctx.rotate(angle + Math.PI / 2);

        const tileW = 42;
        const tileH = 32;

        ctx.beginPath();
        ctx.roundRect(-tileW / 2, -tileH / 2, tileW, tileH, 6);
        ctx.fillStyle = isCurrent ? '#0e7490' : isHovered ? '#1e293b' : '#090d16';
        ctx.fill();

        ctx.lineWidth = isCurrent ? 2.5 : isHovered ? 2 : 1;
        ctx.strokeStyle = isCurrent ? '#00f2fe' : isHovered ? '#38bdf8' : tile.color || '#334155';
        ctx.stroke();

        // Tile Icon
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(tile.icon || '•', 0, -2);

        // Tile short label / index
        ctx.font = 'bold 8px monospace';
        ctx.fillStyle = isCurrent ? '#ffffff' : '#94a3b8';
        ctx.fillText(`${tile.index + 1}`, 0, 10);

        ctx.restore();
      });

      // Draw Outer Tiles (Fast Track)
      outerTiles.forEach((tile) => {
        const count = outerTiles.length;
        const angle = (tile.index / count) * Math.PI * 2 - Math.PI / 2;
        const tx = Math.cos(angle) * outerR;
        const ty = Math.sin(angle) * outerR;
        const isCurrent = isOnFastTrack && playerIndex === tile.index;
        const isHovered = hoveredTile?.id === tile.id;

        ctx.save();
        ctx.translate(tx, ty);
        ctx.rotate(angle + Math.PI / 2);

        const tileW = 54;
        const tileH = 38;

        ctx.beginPath();
        ctx.roundRect(-tileW / 2, -tileH / 2, tileW, tileH, 8);
        ctx.fillStyle = isCurrent ? '#78350f' : isHovered ? '#1e1b4b' : '#0b0f19';
        ctx.fill();

        ctx.lineWidth = isCurrent ? 2.5 : isHovered ? 2 : 1.2;
        ctx.strokeStyle = isCurrent ? '#fbbf24' : isHovered ? '#818cf8' : tile.color || '#f59e0b';
        ctx.stroke();

        ctx.font = '16px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(tile.icon || '⭐', 0, -4);

        ctx.font = 'bold 8px monospace';
        ctx.fillStyle = isCurrent ? '#fef08a' : '#cbd5e1';
        ctx.fillText(tile.name.slice(0, 7), 0, 11);

        ctx.restore();
      });

      // Interpolate Player Pawn Position
      const p = pawnPosRef.current;
      const angleDiff = p.angle - p.currentAngle;
      // Handle wrap around smoothly
      let dAngle = Math.atan2(Math.sin(angleDiff), Math.cos(angleDiff));
      p.currentAngle += dAngle * 0.15;
      p.currentRadius += (p.radius - p.currentRadius) * 0.15;

      const px = Math.cos(p.currentAngle) * p.currentRadius;
      const py = Math.sin(p.currentAngle) * p.currentRadius;

      // Draw Player Mecha Pawn
      ctx.save();
      ctx.translate(px, py);

      // Glowing Aura
      const auraGlow = 20 + Math.sin(elapsed * 6) * 4;
      const gradient = ctx.createRadialGradient(0, 0, 4, 0, 0, auraGlow);
      gradient.addColorStop(0, archetype.color || '#00f2fe');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, auraGlow, 0, Math.PI * 2);
      ctx.fill();

      // Pawn Outer Ring
      ctx.beginPath();
      ctx.arc(0, 0, 18, 0, Math.PI * 2);
      ctx.fillStyle = '#020617';
      ctx.fill();
      ctx.strokeStyle = archetype.color || '#00f2fe';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = archetype.color || '#00f2fe';
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Pawn Avatar Icon
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(archetype.avatar || '🤖', 0, 0);

      // Player Label Tag
      ctx.font = 'bold 9px monospace';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('TÚ', 0, -26);

      ctx.restore();

      ctx.restore();

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [innerTiles, outerTiles, playerIndex, isOnFastTrack, archetype, isRolling, diceValue, zoom, pan, hoveredTile]);

  // Handle Resize of canvas to match container
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current || !canvasRef.current) return;
      canvasRef.current.width = containerRef.current.clientWidth;
      canvasRef.current.height = containerRef.current.clientHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Pointer event handlers for dragging & clicking
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
      return;
    }

    // Check hovered tile
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const centerX = canvasRef.current.width / 2 + pan.x;
    const centerY = canvasRef.current.height / 2 + pan.y;

    const localX = (mouseX - centerX) / zoom;
    const localY = (mouseY - centerY) / zoom;

    const allTiles = [
      ...innerTiles.map((t) => ({ ...t, r: 195, count: innerTiles.length })),
      ...outerTiles.map((t) => ({ ...t, r: 320, count: outerTiles.length })),
    ];

    let found: BoardTile | null = null;
    for (const t of allTiles) {
      const angle = (t.index / t.count) * Math.PI * 2 - Math.PI / 2;
      const tx = Math.cos(angle) * t.r;
      const ty = Math.sin(angle) * t.r;
      const dist = Math.hypot(localX - tx, localY - ty);
      if (dist < 26) {
        found = t;
        break;
      }
    }
    setHoveredTile(found);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDragging(false);
    if (hoveredTile) {
      setSelectedTile(hoveredTile);
      onTileClick?.(hoveredTile);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomDelta = e.deltaY < 0 ? 1.1 : 0.9;
    setZoom((prev) => Math.max(0.5, Math.min(2.5, prev * zoomDelta)));
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[420px] select-none overflow-hidden rounded-2xl border border-cyan-500/20 bg-slate-950 shadow-2xl shadow-cyan-950/40"
    >
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
        className="w-full h-full cursor-grab active:cursor-grabbing block"
      />

      {/* Top Left Track Status */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 backdrop-blur-md border border-cyan-500/40 text-xs font-mono text-cyan-300 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>{isOnFastTrack ? '⚡ VÍA RÁPIDA (ANILLO ORBITAL)' : '🔄 CARRERA DE RATAS (CIRCUITO INTERNO)'}</span>
        </div>
        <div className="px-2.5 py-1.5 rounded-lg bg-slate-900/90 backdrop-blur-md border border-slate-700 text-xs font-mono text-slate-400">
          Casilla #{playerIndex + 1}
        </div>
      </div>

      {/* Controls: Zoom In / Zoom Out / Reset */}
      <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 rounded-xl p-1 shadow-xl">
        <button
          onClick={() => setZoom((z) => Math.min(2.5, z * 1.2))}
          className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 active:scale-95 transition-all"
          title="Acercar"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(0.5, z / 1.2))}
          className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 active:scale-95 transition-all"
          title="Alejar"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            setZoom(1);
            setPan({ x: 0, y: 0 });
          }}
          className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 active:scale-95 transition-all"
          title="Restablecer Vista"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Selected/Hovered Tile Preview Tooltip */}
      {hoveredTile && (
        <div className="absolute bottom-4 left-4 z-10 bg-slate-900/95 border border-cyan-500/40 rounded-xl p-3 shadow-2xl backdrop-blur-md max-w-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="text-xl">{hoveredTile.icon}</span>
            <div>
              <div className="text-xs font-mono font-bold text-white uppercase">{hoveredTile.name}</div>
              <div className="text-[10px] text-cyan-400 font-mono">
                {hoveredTile.track === 'FAST_TRACK' ? 'Vía Rápida Orbital' : 'Circuito Carrera de Ratas'} • Casilla #{hoveredTile.index + 1}
              </div>
            </div>
          </div>
          <p className="text-[11px] text-slate-300 mt-1.5 leading-relaxed">{hoveredTile.description}</p>
        </div>
      )}

      {/* Navigation hints */}
      <div className="absolute top-4 right-4 z-10 hidden sm:flex items-center gap-2 pointer-events-none text-[11px] font-mono text-slate-500 bg-slate-950/70 px-3 py-1 rounded-md border border-slate-800/60 backdrop-blur-sm">
        <span>🖱️ Arrastra para mover</span>
        <span>•</span>
        <span>Rueda para Zoom</span>
        <span>•</span>
        <span>Pasa el cursor para inspeccionar</span>
      </div>
    </div>
  );
};
