"use client";

import React, { useId } from 'react';

interface TrophyProps {
  size?: number;
  className?: string;
  glow?: boolean;
  withReflection?: boolean;
}

/**
 * Trophée Or Impérial - Style Real Madrid Champions League / Liga
 * Conçu avec des dégradés métalliques or multiples, poignées sculptées en 3D,
 * couvercle orné d'une étoile, corps cannelé, et socle en marbre noir/laiton gravé.
 */
export function RealMadridGoldCup({ size = 120, className = '', glow = false, withReflection = false }: TrophyProps) {
  const uniqueId = useId().replace(/:/g, '_');
  const height = Math.round(size * 1.25);

  return (
    <div style={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }} className={className}>
      {/* Halo de lumière arrière neutre / musée */}
      {glow && (
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: size * 1.2,
            height: size * 1.2,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.05) 45%, transparent 70%)',
            filter: 'blur(18px)',
            pointerEvents: 'none',
            zIndex: 0
          }}
        />
      )}

      {/* SVG Trophée Or Haute Définition */}
      <svg
        width={size}
        height={height}
        viewBox="0 -22 200 272"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'relative', zIndex: 1, filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.6))' }}
      >
        <defs>
          {/* Dégradé Or Primaire Haute Brillance */}
          <linearGradient id={`goldBody-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFBEB" />
            <stop offset="18%" stopColor="#FDE68A" />
            <stop offset="40%" stopColor="#F59E0B" />
            <stop offset="65%" stopColor="#D97706" />
            <stop offset="85%" stopColor="#B45309" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>

          {/* Dégradé Poignées 3D */}
          <linearGradient id={`goldHandle-${uniqueId}`} x1="0%" y1="20%" x2="100%" y2="80%">
            <stop offset="0%" stopColor="#FFFBEB" />
            <stop offset="30%" stopColor="#F59E0B" />
            <stop offset="70%" stopColor="#92400E" />
            <stop offset="100%" stopColor="#451A03" />
          </linearGradient>

          {/* Dégradé Socle Marbre Noir Bernabéu */}
          <linearGradient id={`marbleBase-${uniqueId}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2A2A30" />
            <stop offset="50%" stopColor="#18181C" />
            <stop offset="100%" stopColor="#0B0B0E" />
          </linearGradient>

          {/* Dégradé Plaque en Laiton Doré Gravé */}
          <linearGradient id={`brassPlate-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#B45309" />
            <stop offset="25%" stopColor="#FDE68A" />
            <stop offset="50%" stopColor="#FFFBEB" />
            <stop offset="75%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#92400E" />
          </linearGradient>

          {/* Reflet de Spécularité */}
          <linearGradient id={`specularHighlight-${uniqueId}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* 1. Poignées Royales Flamboyantes (Gauche et Droite) */}
        {/* Poignée Gauche */}
        <path
          d="M 58 65 C 10 65 8 125 46 150 C 52 154 58 156 65 156 C 54 140 38 126 38 98 C 38 78 48 72 58 65 Z"
          fill={`url(#goldHandle-${uniqueId})`}
          stroke="#B45309"
          strokeWidth="1.5"
        />
        <path
          d="M 52 72 C 24 78 20 115 48 138"
          stroke="#FFFBEB"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.8"
        />

        {/* Poignée Droite */}
        <path
          d="M 142 65 C 190 65 192 125 154 150 C 148 154 142 156 135 156 C 146 140 162 126 162 98 C 162 78 152 72 142 65 Z"
          fill={`url(#goldHandle-${uniqueId})`}
          stroke="#B45309"
          strokeWidth="1.5"
        />
        <path
          d="M 148 72 C 176 78 180 115 152 138"
          stroke="#FFFBEB"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.8"
        />

        {/* 2. Étoile Triomphale Sommet (Finial) */}
        <polygon
          points="100,10 105,24 120,25 109,35 113,50 100,41 87,50 91,35 80,25 95,24"
          fill="#FFFBEB"
          stroke="#F59E0B"
          strokeWidth="1.5"
          filter="drop-shadow(0 2px 4px rgba(0,0,0,0.4))"
        />
        <circle cx="100" cy="30" r="3" fill="#FFFBEB" />

        {/* 3. Couvercle Supérieur Ciselé */}
        <ellipse cx="100" cy="48" rx="22" ry="6" fill={`url(#goldBody-${uniqueId})`} />
        <ellipse cx="100" cy="46" rx="16" ry="4" fill="#FEF08A" opacity="0.7" />
        <path d="M 78 48 C 78 52 86 56 100 56 C 114 56 122 52 122 48 L 126 56 L 74 56 Z" fill={`url(#goldBody-${uniqueId})`} />

        {/* 4. Col Supérieur */}
        <path d="M 74 56 L 126 56 L 132 68 L 68 68 Z" fill={`url(#goldBody-${uniqueId})`} stroke="#B45309" strokeWidth="1" />
        <line x1="72" y1="62" x2="128" y2="62" stroke="#FFFBEB" strokeWidth="1.5" opacity="0.6" />

        {/* 5. Corps de la Coupe (Vase Principal) */}
        <path
          d="M 68 68 L 132 68 C 132 68 138 120 120 148 C 108 166 92 166 80 148 C 62 120 68 68 68 68 Z"
          fill={`url(#goldBody-${uniqueId})`}
          stroke="#92400E"
          strokeWidth="1.5"
        />

        {/* Rayures de relief / Cannelures Royales */}
        <path d="M 85 70 Q 82 110 92 152" stroke="#92400E" strokeWidth="1.2" opacity="0.6" fill="none" />
        <path d="M 115 70 Q 118 110 108 152" stroke="#78350F" strokeWidth="1.2" opacity="0.6" fill="none" />
        <path d="M 100 70 L 100 155" stroke="#FFFBEB" strokeWidth="1.5" opacity="0.4" fill="none" />

        {/* Médaillon Central - Armoiries Condor FC */}
        <circle cx="100" cy="105" r="16" fill="#1C1917" stroke="#FFFBEB" strokeWidth="1.5" />
        {/* Aigle / Condor stylisé dans le médaillon */}
        <path d="M 92 108 L 100 96 L 108 108 L 104 106 L 100 114 L 96 106 Z" fill="#F59E0B" />
        <circle cx="100" cy="101" r="2" fill="#FFFBEB" />

        {/* Éclat lumineux spéculaire vertical sur la coupe */}
        <path
          d="M 73 70 C 73 70 78 110 88 140 C 85 140 76 100 76 70 Z"
          fill={`url(#specularHighlight-${uniqueId})`}
        />

        {/* 6. Nœud / Anneau Central & Tige */}
        <ellipse cx="100" cy="162" rx="18" ry="5" fill={`url(#goldBody-${uniqueId})`} />
        <path d="M 90 163 L 110 163 L 107 186 L 93 186 Z" fill={`url(#goldHandle-${uniqueId})`} />
        <line x1="97" y1="165" x2="97" y2="184" stroke="#FFFBEB" strokeWidth="1.5" opacity="0.7" />
        <ellipse cx="100" cy="186" rx="22" ry="6" fill={`url(#goldBody-${uniqueId})`} stroke="#B45309" strokeWidth="1" />

        {/* 7. Socle Double Étage en Marbre d'Obsidienne */}
        <path d="M 72 190 L 128 190 L 134 208 L 66 208 Z" fill={`url(#marbleBase-${uniqueId})`} stroke="#451A03" strokeWidth="1" />
        {/* Liseré Or sur le socle */}
        <line x1="68" y1="206" x2="132" y2="206" stroke="#F59E0B" strokeWidth="1.5" opacity="0.8" />

        {/* Socle Inférieur Large */}
        <rect x="52" y="208" width="96" height="24" rx="4" fill={`url(#marbleBase-${uniqueId})`} stroke="#262626" strokeWidth="1.5" />

        {/* 8. Plaque en Laiton Doré Gravé */}
        <rect x="66" y="213" width="68" height="14" rx="2" fill={`url(#brassPlate-${uniqueId})`} stroke="#78350F" strokeWidth="1" />
        <text
          x="100"
          y="223.5"
          textAnchor="middle"
          fontSize="7"
          fontWeight="bold"
          fontFamily="system-ui, sans-serif"
          fill="#451A03"
          letterSpacing="1"
        >
          CONDOR FC
        </text>
      </svg>

      {/* Reflet au sol (effet miroir marbre Bernabéu) */}
      {withReflection && (
        <div
          style={{
            position: 'absolute',
            top: '96%',
            left: 0,
            right: 0,
            transform: 'scaleY(-0.35)',
            transformOrigin: 'top center',
            filter: 'blur(2px)',
            opacity: 0.25,
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 70%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 70%)',
            pointerEvents: 'none',
            userSelect: 'none',
            display: 'flex',
            justifyContent: 'center',
            zIndex: 0
          }}
        >
          <svg width={size} height={height * 0.7} viewBox="0 0 200 250" fill="none">
            <rect x="52" y="208" width="96" height="24" rx="4" fill="#CBD5E1" />
            <path d="M 68 68 L 132 68 C 132 68 138 120 120 148 C 108 166 92 166 80 148 C 62 120 68 68 68 68 Z" fill="#CBD5E1" />
          </svg>
        </div>
      )}
    </div>
  );
}

/**
 * Trophée Argent Platinum - Style Real Madrid Vice-Champion & Podiums Majeurs
 * Conçu avec des dégradés argent chromé, reflets miroir bleutés et socle graphite.
 */
export function RealMadridSilverCup({ size = 120, className = '', glow = false, withReflection = false }: TrophyProps) {
  const uniqueId = useId().replace(/:/g, '_');
  const height = Math.round(size * 1.25);

  return (
    <div style={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }} className={className}>
      {/* Halo argenté */}
      {glow && (
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: size * 1.2,
            height: size * 1.2,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(226, 232, 240, 0.3) 0%, rgba(148, 163, 184, 0.15) 50%, transparent 70%)',
            filter: 'blur(20px)',
            pointerEvents: 'none',
            zIndex: 0
          }}
        />
      )}

      {/* SVG Trophée Argent Haute Définition */}
      <svg
        width={size}
        height={height}
        viewBox="0 -22 200 272"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'relative', zIndex: 1, filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.5))' }}
      >
        <defs>
          {/* Dégradé Argent Chromé */}
          <linearGradient id={`silverBody-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="25%" stopColor="#E2E8F0" />
            <stop offset="50%" stopColor="#94A3B8" />
            <stop offset="75%" stopColor="#CBD5E1" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>

          {/* Dégradé Poignées Chromées */}
          <linearGradient id={`silverHandle-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="35%" stopColor="#CBD5E1" />
            <stop offset="70%" stopColor="#64748B" />
            <stop offset="100%" stopColor="#1E293B" />
          </linearGradient>

          {/* Dégradé Socle Graphite / Titane */}
          <linearGradient id={`graphiteBase-${uniqueId}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="50%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          {/* Plaque Argent Brossé */}
          <linearGradient id={`silverPlate-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#64748B" />
            <stop offset="30%" stopColor="#F8FAFC" />
            <stop offset="50%" stopColor="#FFFFFF" />
            <stop offset="70%" stopColor="#CBD5E1" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
        </defs>

        {/* Poignée Gauche */}
        <path
          d="M 58 65 C 10 65 8 125 46 150 C 52 154 58 156 65 156 C 54 140 38 126 38 98 C 38 78 48 72 58 65 Z"
          fill={`url(#silverHandle-${uniqueId})`}
          stroke="#475569"
          strokeWidth="1.5"
        />
        <path d="M 52 72 C 24 78 20 115 48 138" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.9" />

        {/* Poignée Droite */}
        <path
          d="M 142 65 C 190 65 192 125 154 150 C 148 154 142 156 135 156 C 146 140 162 126 162 98 C 162 78 152 72 142 65 Z"
          fill={`url(#silverHandle-${uniqueId})`}
          stroke="#475569"
          strokeWidth="1.5"
        />
        <path d="M 148 72 C 176 78 180 115 152 138" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.9" />

        {/* Étoile Supérieure */}
        <polygon
          points="100,10 105,24 120,25 109,35 113,50 100,41 87,50 91,35 80,25 95,24"
          fill="#FFFFFF"
          stroke="#94A3B8"
          strokeWidth="1.5"
        />

        {/* Couvercle */}
        <ellipse cx="100" cy="48" rx="22" ry="6" fill={`url(#silverBody-${uniqueId})`} />
        <ellipse cx="100" cy="46" rx="16" ry="4" fill="#FFFFFF" opacity="0.8" />
        <path d="M 78 48 C 78 52 86 56 100 56 C 114 56 122 52 122 48 L 126 56 L 74 56 Z" fill={`url(#silverBody-${uniqueId})`} />

        {/* Col */}
        <path d="M 74 56 L 126 56 L 132 68 L 68 68 Z" fill={`url(#silverBody-${uniqueId})`} stroke="#475569" strokeWidth="1" />
        <line x1="72" y1="62" x2="128" y2="62" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.8" />

        {/* Corps de la Coupe Argent */}
        <path
          d="M 68 68 L 132 68 C 132 68 138 120 120 148 C 108 166 92 166 80 148 C 62 120 68 68 68 68 Z"
          fill={`url(#silverBody-${uniqueId})`}
          stroke="#334155"
          strokeWidth="1.5"
        />

        {/* Cannelures */}
        <path d="M 85 70 Q 82 110 92 152" stroke="#475569" strokeWidth="1.2" opacity="0.6" fill="none" />
        <path d="M 115 70 Q 118 110 108 152" stroke="#334155" strokeWidth="1.2" opacity="0.6" fill="none" />
        <path d="M 100 70 L 100 155" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.6" fill="none" />

        {/* Médaillon Central */}
        <circle cx="100" cy="105" r="16" fill="#0F172A" stroke="#FFFFFF" strokeWidth="1.5" />
        <path d="M 92 108 L 100 96 L 108 108 L 104 106 L 100 114 L 96 106 Z" fill="#E2E8F0" />
        <circle cx="100" cy="101" r="2" fill="#FFFFFF" />

        {/* Reflet Spéculaire */}
        <path
          d="M 73 70 C 73 70 78 110 88 140 C 85 140 76 100 76 70 Z"
          fill="rgba(255,255,255,0.4)"
        />

        {/* Nœud & Tige */}
        <ellipse cx="100" cy="162" rx="18" ry="5" fill={`url(#silverBody-${uniqueId})`} />
        <path d="M 90 163 L 110 163 L 107 186 L 93 186 Z" fill={`url(#silverHandle-${uniqueId})`} />
        <line x1="97" y1="165" x2="97" y2="184" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.8" />
        <ellipse cx="100" cy="186" rx="22" ry="6" fill={`url(#silverBody-${uniqueId})`} stroke="#475569" strokeWidth="1" />

        {/* Socle Supérieur */}
        <path d="M 72 190 L 128 190 L 134 208 L 66 208 Z" fill={`url(#graphiteBase-${uniqueId})`} stroke="#1E293B" strokeWidth="1" />
        <line x1="68" y1="206" x2="132" y2="206" stroke="#94A3B8" strokeWidth="1.5" opacity="0.8" />

        {/* Socle Inférieur */}
        <rect x="52" y="208" width="96" height="24" rx="4" fill={`url(#graphiteBase-${uniqueId})`} stroke="#1E293B" strokeWidth="1.5" />

        {/* Plaque Argentée Gravée */}
        <rect x="66" y="213" width="68" height="14" rx="2" fill={`url(#silverPlate-${uniqueId})`} stroke="#334155" strokeWidth="1" />
        <text
          x="100"
          y="223.5"
          textAnchor="middle"
          fontSize="7"
          fontWeight="bold"
          fontFamily="system-ui, sans-serif"
          fill="#0F172A"
          letterSpacing="1"
        >
          CONDOR FC
        </text>
      </svg>

      {/* Reflet au sol */}
      {withReflection && (
        <div
          style={{
            position: 'absolute',
            top: '96%',
            left: 0,
            right: 0,
            transform: 'scaleY(-0.35)',
            transformOrigin: 'top center',
            filter: 'blur(2px)',
            opacity: 0.2,
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 70%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 70%)',
            pointerEvents: 'none',
            userSelect: 'none',
            display: 'flex',
            justifyContent: 'center',
            zIndex: 0
          }}
        >
          <svg width={size} height={height * 0.7} viewBox="0 0 200 250" fill="none">
            <rect x="52" y="208" width="96" height="24" rx="4" fill="#CBD5E1" />
            <path d="M 68 68 L 132 68 C 132 68 138 120 120 148 C 108 166 92 166 80 148 C 62 120 68 68 68 68 Z" fill="#E2E8F0" />
          </svg>
        </div>
      )}
    </div>
  );
}

/**
 * Insigne / Écusson d'Honneur Condor FC - Étoile & Lauriers d'Or
 */
export function RealMadridStarShield({ size = 110, className = '', glow = false }: TrophyProps) {
  const uniqueId = useId().replace(/:/g, '_');

  return (
    <div style={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }} className={className}>
      {glow && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: size * 1.3,
            height: size * 1.3,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.22) 0%, rgba(202, 2, 79, 0.12) 50%, transparent 70%)',
            filter: 'blur(16px)',
            pointerEvents: 'none',
            zIndex: 0
          }}
        />
      )}

      <svg
        width={size}
        height={size}
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'relative', zIndex: 1, filter: 'drop-shadow(0 12px 20px rgba(0,0,0,0.5))', transform: 'translateY(8px)' }}
      >
        <defs>
          <linearGradient id={`goldShield-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFBEB" />
            <stop offset="25%" stopColor="#FDE68A" />
            <stop offset="55%" stopColor="#F59E0B" />
            <stop offset="85%" stopColor="#B45309" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>
          <radialGradient id={`shieldBackdrop-${uniqueId}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2A1B0A" />
            <stop offset="70%" stopColor="#120D06" />
            <stop offset="100%" stopColor="#080603" />
          </radialGradient>
        </defs>

        {/* Couronne de Lauriers d'Or autour du bouclier */}
        <g stroke={`url(#goldShield-${uniqueId})`} strokeWidth="3" fill="none" opacity="0.9">
          {/* Branche gauche */}
          <path d="M 32 105 C 18 80 25 45 48 28" />
          <path d="M 24 90 Q 14 85 24 78" />
          <path d="M 28 72 Q 18 67 30 62" />
          <path d="M 36 52 Q 26 48 39 42" />
          <path d="M 46 36 Q 38 30 52 26" />

          {/* Branche droite */}
          <path d="M 128 105 C 142 80 135 45 112 28" />
          <path d="M 136 90 Q 146 85 136 78" />
          <path d="M 132 72 Q 142 67 130 62" />
          <path d="M 124 52 Q 134 48 121 42" />
          <path d="M 114 36 Q 122 30 108 26" />
        </g>

        {/* Bouclier Royal Central */}
        <path
          d="M 80 18 L 122 36 C 122 88 102 124 80 142 C 58 124 38 88 38 36 Z"
          fill={`url(#shieldBackdrop-${uniqueId})`}
          stroke={`url(#goldShield-${uniqueId})`}
          strokeWidth="3.5"
        />

        {/* Liseré intérieur or */}
        <path
          d="M 80 25 L 115 40 C 115 84 98 116 80 132 C 62 116 45 84 45 40 Z"
          fill="none"
          stroke={`url(#goldShield-${uniqueId})`}
          strokeWidth="1"
          opacity="0.6"
        />

        {/* Grande Étoile Triomphale d'Or */}
        <polygon
          points="80,44 86,62 105,63 90,75 95,94 80,82 65,94 70,75 55,63 74,62"
          fill={`url(#goldShield-${uniqueId})`}
          stroke="#FFFBEB"
          strokeWidth="1"
          filter="drop-shadow(0 4px 6px rgba(0,0,0,0.6))"
        />

        {/* Ruban / Bandeau Condor Élite en Rouge Condor */}
        <rect x="52" y="102" width="56" height="15" rx="3" fill="#ca024f" stroke="#FFFBEB" strokeWidth="1" />
        <text
          x="80"
          y="113"
          textAnchor="middle"
          fontSize="7.5"
          fontWeight="900"
          fontFamily="system-ui, sans-serif"
          fill="#FFFBEB"
          letterSpacing="1"
        >
          ÉLITE CFC
        </text>
      </svg>
    </div>
  );
}

/**
 * Composant Socle Présentoir Real Madrid (Pedestal Showcase)
 * Permet d'asseoir le trophée sur un podium en marbre illuminé par un spot
 */
export function RealMadridPedestal({
  children,
  badge,
  count,
  title,
  sub,
  isGold = true,
  active = false,
  onClick
}: {
  children: React.ReactNode;
  badge?: string;
  count?: string;
  title: string;
  sub?: string;
  isGold?: boolean;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '1.5rem 1.2rem',
        borderRadius: '20px',
        background: active 
          ? 'linear-gradient(180deg, rgba(212, 175, 55, 0.18) 0%, rgba(18, 18, 24, 0.95) 45%, #0B0B0E 100%)'
          : 'linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, rgba(16, 16, 20, 0.85) 50%, #0A0A0C 100%)',
        border: active 
          ? '2px solid rgba(245, 158, 11, 0.8)' 
          : isGold 
            ? '1px solid rgba(212, 175, 55, 0.25)' 
            : '1px solid rgba(226, 232, 240, 0.18)',
        boxShadow: active
          ? '0 20px 45px rgba(245, 158, 11, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
          : '0 15px 35px rgba(0, 0, 0, 0.6)',
        transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        overflow: 'hidden',
        textAlign: 'center',
        userSelect: 'none'
      }}
    >
      {/* Faisceau lumineux descendant (Overhead Spotlight) */}
      <div
        style={{
          position: 'absolute',
          top: '-20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '120px',
          height: '140px',
          background: isGold
            ? 'radial-gradient(ellipse at top, rgba(254, 240, 138, 0.35) 0%, rgba(245, 158, 11, 0.12) 40%, transparent 80%)'
            : 'radial-gradient(ellipse at top, rgba(255, 255, 255, 0.35) 0%, rgba(148, 163, 184, 0.12) 40%, transparent 80%)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* Badge Flottant Supérieur */}
      {badge && (
        <span
          style={{
            position: 'relative',
            zIndex: 2,
            display: 'inline-block',
            marginBottom: '0.8rem',
            padding: '3px 12px',
            borderRadius: '20px',
            fontSize: '0.7rem',
            fontWeight: '800',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            color: isGold ? '#F59E0B' : '#E2E8F0',
            background: isGold ? 'rgba(245, 158, 11, 0.15)' : 'rgba(226, 232, 240, 0.1)',
            border: isGold ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(226, 232, 240, 0.25)'
          }}
        >
          {badge}
        </span>
      )}

      {/* Trophée Posé */}
      <div style={{ position: 'relative', zIndex: 2, margin: '0.9rem 0 0.8rem', minHeight: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </div>

      {/* Chiffre d'Honneur Gravé (ex: x 3) */}
      {count && (
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            fontFamily: 'var(--font-heading)',
            fontSize: '1.8rem',
            fontWeight: '900',
            color: isGold ? '#FDE68A' : '#FFFFFF',
            textShadow: isGold ? '0 0 15px rgba(245, 158, 11, 0.6)' : '0 0 15px rgba(255, 255, 255, 0.4)',
            marginTop: '4px'
          }}
        >
          {count}
        </div>
      )}

      {/* Titre & Description */}
      <div style={{ position: 'relative', zIndex: 2, marginTop: '4px' }}>
        <h4
          style={{
            margin: '0 0 4px',
            fontFamily: 'var(--font-heading)',
            fontSize: '1.05rem',
            color: 'white',
            letterSpacing: '0.5px',
            textTransform: 'uppercase'
          }}
        >
          {title}
        </h4>
        {sub && (
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#94A3B8', lineHeight: 1.4 }}>
            {sub}
          </p>
        )}
      </div>

      {/* Socle en bas avec effet de profondeur */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '6px',
          background: isGold
            ? 'linear-gradient(90deg, transparent, #F59E0B, #FEF08A, #F59E0B, transparent)'
            : 'linear-gradient(90deg, transparent, #94A3B8, #FFFFFF, #94A3B8, transparent)',
          opacity: active ? 1 : 0.6
        }}
      />
    </div>
  );
}
