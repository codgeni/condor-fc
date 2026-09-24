"use client";

import React, { useId } from 'react';

interface TrophyProps {
  size?: number;
  className?: string;
  glow?: boolean;
  withReflection?: boolean;
}

// ============================================================================
// 1. TOURNOI CHALE CHALE — TRIPLÉ HISTORIQUE (Style Grand Chelem / Grandes Oreilles)
// ============================================================================
/**
 * Trophée Grand Chelem "Grandes Oreilles"
 * Coupe royale avec grandes poignées courbées au-dessus du bord, corps cannelé,
 * médaillon armoiries Condor FC et socle en marbre noir d'obsidienne avec plaque dorée.
 */
export function ChaleChaleTripleCup({ size = 120, className = '', glow = false, withReflection = false }: TrophyProps) {
  const uniqueId = useId().replace(/:/g, '_');
  const height = Math.round(size * 1.15);

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
            background: 'radial-gradient(circle, rgba(254, 240, 138, 0.25) 0%, rgba(245, 158, 11, 0.08) 50%, transparent 70%)',
            filter: 'blur(20px)',
            pointerEvents: 'none',
            zIndex: 0
          }}
        />
      )}

      <svg
        width={size}
        height={height}
        viewBox="0 15 220 235"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'relative', zIndex: 1, filter: 'drop-shadow(0 14px 24px rgba(0,0,0,0.65))' }}
      >
        <defs>
          <linearGradient id={`goldMain-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFDF0" />
            <stop offset="18%" stopColor="#FDE68A" />
            <stop offset="42%" stopColor="#F59E0B" />
            <stop offset="70%" stopColor="#D97706" />
            <stop offset="90%" stopColor="#92400E" />
            <stop offset="100%" stopColor="#451A03" />
          </linearGradient>

          <linearGradient id={`goldHandle-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFBEB" />
            <stop offset="35%" stopColor="#F59E0B" />
            <stop offset="75%" stopColor="#B45309" />
            <stop offset="100%" stopColor="#290E02" />
          </linearGradient>

          <linearGradient id={`marbleDark-${uniqueId}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2A2A32" />
            <stop offset="50%" stopColor="#17171C" />
            <stop offset="100%" stopColor="#0B0B0E" />
          </linearGradient>

          <linearGradient id={`brassPlate-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#92400E" />
            <stop offset="25%" stopColor="#FDE68A" />
            <stop offset="50%" stopColor="#FFFDF0" />
            <stop offset="75%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>

          <linearGradient id={`specular-${uniqueId}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFBEB" stopOpacity="0.25" />
            <stop offset="60%" stopColor="#FFFBEB" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#FFFBEB" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* 1. Grandes Oreilles (Grandes Poignées Triomphales qui montent au-dessus du bord) */}
        {/* Poignée Gauche */}
        <path
          d="M 68 62 C 10 32 6 128 50 156 C 58 161 66 163 74 163 C 62 144 44 126 44 95 C 44 68 58 64 68 62 Z"
          fill={`url(#goldHandle-${uniqueId})`}
          stroke="#92400E"
          strokeWidth="1.5"
        />

        {/* Poignée Droite */}
        <path
          d="M 152 62 C 210 32 214 128 170 156 C 162 161 154 163 146 163 C 158 144 176 126 176 95 C 176 68 162 64 152 62 Z"
          fill={`url(#goldHandle-${uniqueId})`}
          stroke="#92400E"
          strokeWidth="1.5"
        />

        {/* 2. Couvercle Supérieur & Finial Noble */}
        <ellipse cx="110" cy="48" rx="26" ry="7" fill={`url(#goldMain-${uniqueId})`} />
        <ellipse cx="110" cy="46" rx="18" ry="4" fill="#FEF08A" opacity="0.8" />
        <circle cx="110" cy="41" r="5" fill={`url(#goldHandle-${uniqueId})`} stroke="#B45309" strokeWidth="1.2" />
        <circle cx="110" cy="39.5" r="1.5" fill="#FEF08A" />

        {/* 3. Col & Lèvres Supérieures */}
        <path d="M 80 48 C 80 54 90 58 110 58 C 130 58 140 54 140 48 L 146 62 L 74 62 Z" fill={`url(#goldMain-${uniqueId})`} />
        <path d="M 74 62 L 146 62 L 150 74 L 70 74 Z" fill={`url(#goldMain-${uniqueId})`} stroke="#92400E" strokeWidth="1" />
        <line x1="75" y1="68" x2="145" y2="68" stroke="#FDE68A" strokeWidth="1.2" opacity="0.4" />

        {/* 4. Corps Principal de la Coupe (Grand Vase Flûté) */}
        <path
          d="M 70 74 L 150 74 C 150 74 158 132 134 162 C 122 178 98 178 86 162 C 62 132 70 74 70 74 Z"
          fill={`url(#goldMain-${uniqueId})`}
          stroke="#78350F"
          strokeWidth="1.5"
        />

        {/* Rayures cannelées royales */}
        <path d="M 90 76 Q 86 122 98 166" stroke="#92400E" strokeWidth="1.2" opacity="0.6" fill="none" />
        <path d="M 130 76 Q 134 122 122 166" stroke="#78350F" strokeWidth="1.2" opacity="0.6" fill="none" />
        <path d="M 110 76 L 110 168" stroke="#FDE68A" strokeWidth="1.2" opacity="0.35" fill="none" />

        {/* Médaillon Central Armoiries Condor FC */}
        <circle cx="110" cy="112" r="17" fill="#141418" stroke="#FDE68A" strokeWidth="1.6" />
        <path d="M 102 116 L 110 102 L 118 116 L 114 114 L 110 122 L 106 114 Z" fill="#F59E0B" />
        <circle cx="110" cy="108" r="2.2" fill="#FEF08A" />

        {/* Spécularité miroir vertical */}
        <path d="M 76 76 C 76 76 82 120 94 152 C 90 152 80 110 80 76 Z" fill={`url(#specular-${uniqueId})`} />

        {/* 5. Nœud & Tige Ciselée */}
        <ellipse cx="110" cy="172" rx="20" ry="6" fill={`url(#goldMain-${uniqueId})`} />
        <path d="M 100 173 L 120 173 L 116 195 L 104 195 Z" fill={`url(#goldHandle-${uniqueId})`} />
        <line x1="107" y1="175" x2="107" y2="193" stroke="#FDE68A" strokeWidth="1.2" opacity="0.45" />
        <ellipse cx="110" cy="195" rx="24" ry="6" fill={`url(#goldMain-${uniqueId})`} stroke="#B45309" strokeWidth="1" />

        {/* 6. Socle en Marbre Noir d'Obsidienne */}
        <path d="M 80 199 L 140 199 L 146 215 L 74 215 Z" fill={`url(#marbleDark-${uniqueId})`} stroke="#451A03" strokeWidth="1" />
        <line x1="77" y1="213" x2="143" y2="213" stroke="#F59E0B" strokeWidth="1.5" opacity="0.8" />
        <rect x="58" y="215" width="104" height="24" rx="4" fill={`url(#marbleDark-${uniqueId})`} stroke="#222226" strokeWidth="1.5" />

        {/* 7. Plaque Laiton Gravée */}
        <rect x="72" y="220" width="76" height="14" rx="2" fill={`url(#brassPlate-${uniqueId})`} stroke="#78350F" strokeWidth="1" />
        <text x="110" y="230" textAnchor="middle" fontSize="7.5" fontWeight="900" fontFamily="system-ui, sans-serif" fill="#381E08" letterSpacing="2">
          CONDOR FC
        </text>
      </svg>

      {/* Reflet miroir Bernabéu */}
      {withReflection && (
        <div
          style={{
            position: 'absolute',
            top: '98%',
            left: 0,
            right: 0,
            transform: 'scaleY(-0.32)',
            transformOrigin: 'top center',
            filter: 'blur(2px)',
            opacity: 0.22,
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 70%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 70%)',
            pointerEvents: 'none',
            userSelect: 'none',
            display: 'flex',
            justifyContent: 'center',
            zIndex: 0
          }}
        >
          <svg width={size} height={height * 0.65} viewBox="0 15 220 235" fill="none">
            <rect x="58" y="215" width="104" height="24" rx="4" fill="#CBD5E1" />
            <path d="M 70 74 L 150 74 C 150 74 158 132 134 162 C 122 178 98 178 86 162 C 62 132 70 74 70 74 Z" fill="#CBD5E1" />
          </svg>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 2. TOURNOI BACK TO SCHOOL — CHAMPION NATIONAL U17 (Calice à Couronne Royale)
// ============================================================================
/**
 * Trophée National à Couronne d'Or (Style La Liga / Premier League)
 * Calice élancé avec col festonné de créneaux royaux, poignées ailes sculptées,
 * taille ceinturée de perles et piédestal circulaire à gradins.
 */
export function BackToSchoolNationalCup({ size = 120, className = '', glow = false, withReflection = false }: TrophyProps) {
  const uniqueId = useId().replace(/:/g, '_');
  const height = Math.round(size * 1.15);

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
            background: 'radial-gradient(circle, rgba(253, 230, 138, 0.28) 0%, rgba(217, 119, 6, 0.1) 50%, transparent 70%)',
            filter: 'blur(20px)',
            pointerEvents: 'none',
            zIndex: 0
          }}
        />
      )}

      <svg
        width={size}
        height={height}
        viewBox="0 15 220 235"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'relative', zIndex: 1, filter: 'drop-shadow(0 14px 24px rgba(0,0,0,0.65))' }}
      >
        <defs>
          <linearGradient id={`btsGold-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFDF0" />
            <stop offset="20%" stopColor="#FDE68A" />
            <stop offset="45%" stopColor="#EAB308" />
            <stop offset="70%" stopColor="#CA8A04" />
            <stop offset="90%" stopColor="#854D0E" />
            <stop offset="100%" stopColor="#422006" />
          </linearGradient>

          <linearGradient id={`btsWing-${uniqueId}`} x1="0%" y1="20%" x2="100%" y2="80%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="35%" stopColor="#EAB308" />
            <stop offset="75%" stopColor="#A16207" />
            <stop offset="100%" stopColor="#451A03" />
          </linearGradient>

          <linearGradient id={`btsBase-${uniqueId}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2D281E" />
            <stop offset="50%" stopColor="#1C1812" />
            <stop offset="100%" stopColor="#0B0907" />
          </linearGradient>

          <linearGradient id={`btsPlate-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#713F12" />
            <stop offset="30%" stopColor="#FEF08A" />
            <stop offset="50%" stopColor="#FFFDF0" />
            <stop offset="70%" stopColor="#EAB308" />
            <stop offset="100%" stopColor="#713F12" />
          </linearGradient>
        </defs>

        {/* 1. Poignées Ailées Dynamiques Sculptées */}
        {/* Aile Gauche */}
        <path
          d="M 68 76 C 24 50 18 106 46 142 C 54 150 64 154 74 154 C 66 138 52 120 52 98 C 52 82 62 78 68 76 Z"
          fill={`url(#btsWing-${uniqueId})`}
          stroke="#713F12"
          strokeWidth="1.5"
        />

        {/* Aile Droite */}
        <path
          d="M 152 76 C 196 50 202 106 174 142 C 166 150 156 154 146 154 C 154 138 168 120 168 98 C 168 82 158 78 152 76 Z"
          fill={`url(#btsWing-${uniqueId})`}
          stroke="#713F12"
          strokeWidth="1.5"
        />

        {/* 2. Couronne Royale Supérieure (Créneaux Festonnés) */}
        {/* Créneaux festonnés à 7 pointes nobles */}
        <path
          d="M 76 60 L 82 48 L 90 56 L 100 44 L 110 56 L 120 44 L 130 56 L 138 48 L 144 60 Z"
          fill={`url(#btsGold-${uniqueId})`}
          stroke="#A16207"
          strokeWidth="1.2"
        />
        <circle cx="100" cy="42" r="2.5" fill="#FEF08A" />
        <circle cx="110" cy="40" r="3" fill="#FEF08A" />
        <circle cx="120" cy="42" r="2.5" fill="#FEF08A" />

        {/* Lèvre et Col Festonné */}
        <ellipse cx="110" cy="60" rx="34" ry="7" fill={`url(#btsGold-${uniqueId})`} stroke="#713F12" strokeWidth="1" />
        <ellipse cx="110" cy="58" rx="26" ry="4" fill="#FEF08A" opacity="0.75" />

        {/* 3. Vase Calice Élancé (Silhouette Championnat National) */}
        <path
          d="M 76 60 L 144 60 C 144 60 148 116 132 152 C 122 170 98 170 88 152 C 72 116 76 60 76 60 Z"
          fill={`url(#btsGold-${uniqueId})`}
          stroke="#713F12"
          strokeWidth="1.5"
        />

        <circle cx="110" cy="106" r="14" fill="#1C1917" stroke="#FEF08A" strokeWidth="1.5" />
        {/* Aigle souverain Condor */}
        <path d="M 104 108 L 110 98 L 116 108 L 110 114 Z" fill="#FEF08A" />

        {/* 4. Ceinture de Perles & Tige Royale */}
        <ellipse cx="110" cy="168" rx="22" ry="5" fill={`url(#btsGold-${uniqueId})`} />
        {/* 5 perles royales */}
        <circle cx="96" cy="168" r="2" fill="#FEF08A" />
        <circle cx="103" cy="169" r="2" fill="#FEF08A" />
        <circle cx="110" cy="170" r="2.5" fill="#FEF08A" />
        <circle cx="117" cy="169" r="2" fill="#FEF08A" />
        <circle cx="124" cy="168" r="2" fill="#FEF08A" />

        {/* Colonne Cannelée Tapered */}
        <path d="M 102 172 L 118 172 L 115 194 L 105 194 Z" fill={`url(#btsWing-${uniqueId})`} stroke="#713F12" strokeWidth="1" />
        <ellipse cx="110" cy="195" rx="26" ry="6" fill={`url(#btsGold-${uniqueId})`} stroke="#A16207" strokeWidth="1" />

        {/* 5. Piédestal à Gradins Sombre d'Élite */}
        <path d="M 78 198 L 142 198 L 148 214 L 72 214 Z" fill={`url(#btsBase-${uniqueId})`} stroke="#451A03" strokeWidth="1" />
        <line x1="75" y1="212" x2="145" y2="212" stroke="#EAB308" strokeWidth="1.5" opacity="0.8" />
        <rect x="56" y="214" width="108" height="24" rx="4" fill={`url(#btsBase-${uniqueId})`} stroke="#1F1B14" strokeWidth="1.5" />

        {/* 6. Plaque Laiton Gravée */}
        <rect x="70" y="219" width="80" height="14" rx="2" fill={`url(#btsPlate-${uniqueId})`} stroke="#713F12" strokeWidth="1" />
        <text x="110" y="229.5" textAnchor="middle" fontSize="7.5" fontWeight="900" fontFamily="system-ui, sans-serif" fill="#422006" letterSpacing="2">
          CONDOR FC
        </text>
      </svg>

      {withReflection && (
        <div
          style={{
            position: 'absolute',
            top: '98%',
            left: 0,
            right: 0,
            transform: 'scaleY(-0.32)',
            transformOrigin: 'top center',
            filter: 'blur(2px)',
            opacity: 0.22,
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 70%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 70%)',
            pointerEvents: 'none',
            userSelect: 'none',
            display: 'flex',
            justifyContent: 'center',
            zIndex: 0
          }}
        >
          <svg width={size} height={height * 0.65} viewBox="0 15 220 235" fill="none">
            <rect x="56" y="214" width="108" height="24" rx="4" fill="#CBD5E1" />
            <path d="M 76 60 L 144 60 C 144 60 148 116 132 152 C 122 170 98 170 88 152 C 72 116 76 60 76 60 Z" fill="#CBD5E1" />
          </svg>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 3. TOURNOI COPA UNDECIMA — CHAMPION U15 (Amphore Antique à Volutes)
// ============================================================================
/**
 * Trophée Amphore Noble "Copa Undecima" (Style Coupe de France / Copa del Rey)
 * Silhouette en amphore grecque avec poignées en col de cygne et volutes doubles,
 * large bandeau central orné de feuilles de laurier, et socle d'acanthe à deux étages.
 */
export function CopaUndecimaWinterCup({ size = 120, className = '', glow = false, withReflection = false }: TrophyProps) {
  const uniqueId = useId().replace(/:/g, '_');
  const height = Math.round(size * 1.15);

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
            background: 'radial-gradient(circle, rgba(254, 215, 170, 0.28) 0%, rgba(234, 88, 12, 0.08) 50%, transparent 70%)',
            filter: 'blur(20px)',
            pointerEvents: 'none',
            zIndex: 0
          }}
        />
      )}

      <svg
        width={size}
        height={height}
        viewBox="0 15 220 235"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'relative', zIndex: 1, filter: 'drop-shadow(0 14px 24px rgba(0,0,0,0.65))' }}
      >
        <defs>
          <linearGradient id={`undecimaGold-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFBEB" />
            <stop offset="22%" stopColor="#FBBF24" />
            <stop offset="48%" stopColor="#D97706" />
            <stop offset="72%" stopColor="#B45309" />
            <stop offset="92%" stopColor="#78350F" />
            <stop offset="100%" stopColor="#451A03" />
          </linearGradient>

          <linearGradient id={`undecimaScroll-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FEF3C7" />
            <stop offset="40%" stopColor="#F59E0B" />
            <stop offset="80%" stopColor="#92400E" />
            <stop offset="100%" stopColor="#290E02" />
          </linearGradient>

          <linearGradient id={`undecimaBase-${uniqueId}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2A1B0E" />
            <stop offset="50%" stopColor="#181008" />
            <stop offset="100%" stopColor="#0B0603" />
          </linearGradient>
        </defs>

        {/* 1. Poignées Volutes Doubles en Col de Cygne (Style Amphore Classique) */}
        {/* Poignée Gauche à Volute */}
        <path
          d="M 72 68 C 22 56 12 112 38 138 C 48 148 58 150 68 144 C 54 136 34 118 36 94 C 38 74 58 70 72 68 Z"
          fill={`url(#undecimaScroll-${uniqueId})`}
          stroke="#78350F"
          strokeWidth="1.5"
        />
        <circle cx="36" cy="74" r="5" fill="#FEF3C7" stroke="#92400E" strokeWidth="1" />
        <circle cx="64" cy="144" r="4" fill="#FEF3C7" stroke="#92400E" strokeWidth="1" />

        {/* Poignée Droite à Volute */}
        <path
          d="M 148 68 C 198 56 208 112 182 138 C 172 148 162 150 152 144 C 166 136 186 118 184 94 C 182 74 162 70 148 68 Z"
          fill={`url(#undecimaScroll-${uniqueId})`}
          stroke="#78350F"
          strokeWidth="1.5"
        />
        <circle cx="184" cy="74" r="5" fill="#FEF3C7" stroke="#92400E" strokeWidth="1" />
        <circle cx="156" cy="144" r="4" fill="#FEF3C7" stroke="#92400E" strokeWidth="1" />

        {/* 2. Large Col d'Amphore & Dôme Supérieur */}
        <ellipse cx="110" cy="50" rx="28" ry="7" fill={`url(#undecimaGold-${uniqueId})`} />
        <ellipse cx="110" cy="48" rx="20" ry="4" fill="#FEF3C7" opacity="0.8" />
        <circle cx="110" cy="43" r="4.5" fill={`url(#undecimaScroll-${uniqueId})`} stroke="#78350F" strokeWidth="1.2" />
        <circle cx="110" cy="41.5" r="1.5" fill="#FFFBEB" />

        <path d="M 76 52 L 144 52 L 140 68 L 80 68 Z" fill={`url(#undecimaGold-${uniqueId})`} stroke="#78350F" strokeWidth="1" />

        {/* 3. Corps Bombé d'Amphore Noble */}
        <path
          d="M 80 68 C 80 68 54 100 68 140 C 76 162 96 172 110 172 C 124 172 144 162 152 140 C 166 100 140 68 140 68 Z"
          fill={`url(#undecimaGold-${uniqueId})`}
          stroke="#78350F"
          strokeWidth="1.5"
        />

        {/* 4. Bandeau Central Horizontal Gravé de Lauriers */}
        <path d="M 64 104 C 64 104 84 112 110 112 C 136 112 156 104 156 104 L 154 122 C 154 122 134 130 110 130 C 86 130 66 122 66 122 Z" fill="#451A03" stroke="#FDE68A" strokeWidth="1" />
        {/* Motifs de lauriers stylisés dorés */}
        <text x="110" y="120.5" textAnchor="middle" fontSize="7.5" fontWeight="900" fontFamily="system-ui, sans-serif" fill="#FEF3C7" letterSpacing="2">
          COPA UNDECIMA
        </text>

        {/* 5. Base Acanthe Ciselée */}
        <ellipse cx="110" cy="174" rx="24" ry="6" fill={`url(#undecimaGold-${uniqueId})`} />
        <path d="M 98 176 L 122 176 L 118 196 L 102 196 Z" fill={`url(#undecimaScroll-${uniqueId})`} />
        <ellipse cx="110" cy="196" rx="28" ry="6" fill={`url(#undecimaGold-${uniqueId})`} stroke="#78350F" strokeWidth="1" />

        {/* 6. Socle en Acajou & Onyx */}
        <path d="M 76 199 L 144 199 L 150 215 L 70 215 Z" fill={`url(#undecimaBase-${uniqueId})`} stroke="#381E08" strokeWidth="1" />
        <line x1="73" y1="213" x2="147" y2="213" stroke="#F59E0B" strokeWidth="1.5" opacity="0.8" />
        <rect x="54" y="215" width="112" height="24" rx="4" fill={`url(#undecimaBase-${uniqueId})`} stroke="#1F140A" strokeWidth="1.5" />

        {/* 7. Plaque Laiton Gravée */}
        <rect x="68" y="220" width="84" height="14" rx="2" fill={`url(#undecimaGold-${uniqueId})`} stroke="#78350F" strokeWidth="1" />
        <text x="110" y="230" textAnchor="middle" fontSize="7.5" fontWeight="900" fontFamily="system-ui, sans-serif" fill="#290E02" letterSpacing="2">
          CONDOR FC
        </text>
      </svg>

      {withReflection && (
        <div
          style={{
            position: 'absolute',
            top: '98%',
            left: 0,
            right: 0,
            transform: 'scaleY(-0.32)',
            transformOrigin: 'top center',
            filter: 'blur(2px)',
            opacity: 0.22,
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 70%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 70%)',
            pointerEvents: 'none',
            userSelect: 'none',
            display: 'flex',
            justifyContent: 'center',
            zIndex: 0
          }}
        >
          <svg width={size} height={height * 0.65} viewBox="0 15 220 235" fill="none">
            <rect x="54" y="215" width="112" height="24" rx="4" fill="#CBD5E1" />
            <path d="M 80 68 C 80 68 54 100 68 140 C 76 162 96 172 110 172 C 124 172 144 162 152 140 C 166 100 140 68 140 68 Z" fill="#CBD5E1" />
          </svg>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 4. FLAG DAY 13e ÉDITION — VICE-CHAMPION U15 (Coupe Aérodynamique Platinum)
// ============================================================================
/**
 * Trophée Platine Contemporain Aérodynamique (Style Supercoupe UEFA / Club World Cup)
 * Lignes géométriques acérées, poignées angulaires polygonales,
 * finition miroir chromée et socle hexagonal en titane brossé.
 */
export function FlagDaySilverCup({ size = 120, className = '', glow = false, withReflection = false }: TrophyProps) {
  const uniqueId = useId().replace(/:/g, '_');
  const height = Math.round(size * 1.15);

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
            background: 'radial-gradient(circle, rgba(226, 232, 240, 0.35) 0%, rgba(148, 163, 184, 0.12) 50%, transparent 70%)',
            filter: 'blur(20px)',
            pointerEvents: 'none',
            zIndex: 0
          }}
        />
      )}

      <svg
        width={size}
        height={height}
        viewBox="0 15 220 235"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'relative', zIndex: 1, filter: 'drop-shadow(0 14px 24px rgba(0,0,0,0.6))' }}
      >
        <defs>
          <linearGradient id={`flagSilver-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="25%" stopColor="#E2E8F0" />
            <stop offset="50%" stopColor="#94A3B8" />
            <stop offset="75%" stopColor="#CBD5E1" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>

          <linearGradient id={`flagHandle-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="35%" stopColor="#CBD5E1" />
            <stop offset="70%" stopColor="#64748B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          <linearGradient id={`flagTitanium-${uniqueId}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="50%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0B1120" />
          </linearGradient>

          <linearGradient id={`flagPlate-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="30%" stopColor="#F8FAFC" />
            <stop offset="50%" stopColor="#FFFFFF" />
            <stop offset="70%" stopColor="#CBD5E1" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
        </defs>

        {/* 1. Poignées Géométriques Angulaires Aérodynamiques */}
        {/* Poignée Gauche Cantilever */}
        <polygon
          points="70,68 24,96 42,142 66,150 62,136 38,126 30,98 72,76"
          fill={`url(#flagHandle-${uniqueId})`}
          stroke="#475569"
          strokeWidth="1.2"
        />

        {/* Poignée Droite Cantilever */}
        <polygon
          points="150,68 196,96 178,142 154,150 158,136 182,126 190,98 148,76"
          fill={`url(#flagHandle-${uniqueId})`}
          stroke="#475569"
          strokeWidth="1.2"
        />

        {/* 2. Lèvres et Dôme Chromé Biseauté */}
        <ellipse cx="110" cy="50" rx="30" ry="7" fill={`url(#flagSilver-${uniqueId})`} />
        <ellipse cx="110" cy="48" rx="22" ry="4" fill="#FFFFFF" opacity="0.9" />
        <circle cx="110" cy="43" r="4.5" fill={`url(#flagHandle-${uniqueId})`} stroke="#475569" strokeWidth="1.2" />
        <circle cx="110" cy="41.5" r="1.5" fill="#FFFFFF" />

        {/* 3. Corps Conique Miroir et Facettes Aérodynamiques */}
        <path
          d="M 72 56 L 148 56 L 140 120 L 126 166 L 94 166 L 80 120 Z"
          fill={`url(#flagSilver-${uniqueId})`}
          stroke="#334155"
          strokeWidth="1.5"
        />

        {/* Bande Facettée Centrale Miroir */}
        <polygon points="102,56 118,56 114,166 106,166" fill="#FFFFFF" opacity="0.65" />
        <polygon points="118,56 138,56 126,166 114,166" fill="#64748B" opacity="0.3" />

        {/* Médaillon Argenté Condor */}
        <circle cx="110" cy="104" r="16" fill="#0F172A" stroke="#FFFFFF" strokeWidth="1.6" />
        <path d="M 102 108 L 110 94 L 118 108 L 114 106 L 110 114 L 106 106 Z" fill="#E2E8F0" />
        <circle cx="110" cy="100" r="2.2" fill="#FFFFFF" />

        {/* 4. Tige et Ceinture Platine */}
        <ellipse cx="110" cy="168" rx="18" ry="5" fill={`url(#flagSilver-${uniqueId})`} />
        <path d="M 100 169 L 120 169 L 116 195 L 104 195 Z" fill={`url(#flagHandle-${uniqueId})`} />
        <line x1="107" y1="171" x2="107" y2="193" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.8" />
        <ellipse cx="110" cy="195" rx="24" ry="6" fill={`url(#flagSilver-${uniqueId})`} stroke="#475569" strokeWidth="1" />

        {/* 5. Socle Hexagonal en Titane Brossé */}
        <path d="M 76 199 L 144 199 L 152 215 L 68 215 Z" fill={`url(#flagTitanium-${uniqueId})`} stroke="#1E293B" strokeWidth="1" />
        <line x1="72" y1="213" x2="148" y2="213" stroke="#94A3B8" strokeWidth="1.5" opacity="0.8" />
        <rect x="52" y="215" width="116" height="24" rx="4" fill={`url(#flagTitanium-${uniqueId})`} stroke="#1E293B" strokeWidth="1.5" />

        {/* 6. Plaque Argentée Gravée */}
        <rect x="66" y="220" width="88" height="14" rx="2" fill={`url(#flagPlate-${uniqueId})`} stroke="#334155" strokeWidth="1" />
        <text x="110" y="230" textAnchor="middle" fontSize="7.5" fontWeight="900" fontFamily="system-ui, sans-serif" fill="#0F172A" letterSpacing="2">
          CONDOR FC
        </text>
      </svg>

      {withReflection && (
        <div
          style={{
            position: 'absolute',
            top: '98%',
            left: 0,
            right: 0,
            transform: 'scaleY(-0.32)',
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
          <svg width={size} height={height * 0.65} viewBox="0 15 220 235" fill="none">
            <rect x="52" y="215" width="116" height="24" rx="4" fill="#CBD5E1" />
            <path d="M 72 56 L 148 56 L 140 120 L 126 166 L 94 166 L 80 120 Z" fill="#CBD5E1" />
          </svg>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 5. FLAG DAY 12e ÉDITION — PREMIER PODIUM HISTORIQUE U13 (Vase Sterling d'Époque)
// ============================================================================
/**
 * Trophée Héritage en Argent Massif (Style Coupe Européenne Classique)
 * Vase traditionnel ciselé avec anses en anneaux suspendus, cannelures perlées,
 * finition argent patiné et socle cubique en marbre gris veiné.
 */
export function FlagDayHistoricalSilverCup({ size = 120, className = '', glow = false, withReflection = false }: TrophyProps) {
  const uniqueId = useId().replace(/:/g, '_');
  const height = Math.round(size * 1.15);

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
            background: 'radial-gradient(circle, rgba(203, 213, 225, 0.3) 0%, rgba(100, 116, 139, 0.12) 50%, transparent 70%)',
            filter: 'blur(20px)',
            pointerEvents: 'none',
            zIndex: 0
          }}
        />
      )}

      <svg
        width={size}
        height={height}
        viewBox="0 15 220 235"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'relative', zIndex: 1, filter: 'drop-shadow(0 14px 24px rgba(0,0,0,0.6))' }}
      >
        <defs>
          <linearGradient id={`histSilver-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="20%" stopColor="#F1F5F9" />
            <stop offset="45%" stopColor="#CBD5E1" />
            <stop offset="75%" stopColor="#64748B" />
            <stop offset="100%" stopColor="#1E293B" />
          </linearGradient>

          <linearGradient id={`histHandle-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="35%" stopColor="#94A3B8" />
            <stop offset="75%" stopColor="#475569" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          <linearGradient id={`histMarble-${uniqueId}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="50%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#090D16" />
          </linearGradient>
        </defs>

        {/* 1. Anses Classiques à Anneaux Circulaires Rétro */}
        {/* Anse Gauche */}
        <circle cx="56" cy="110" r="22" stroke={`url(#histHandle-${uniqueId})`} strokeWidth="7" fill="none" />
        <circle cx="56" cy="110" r="18" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.75" fill="none" />
        <rect x="70" y="98" width="8" height="24" rx="3" fill={`url(#histSilver-${uniqueId})`} stroke="#334155" strokeWidth="1" />

        {/* Anse Droite */}
        <circle cx="164" cy="110" r="22" stroke={`url(#histHandle-${uniqueId})`} strokeWidth="7" fill="none" />
        <circle cx="164" cy="110" r="18" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.75" fill="none" />
        <rect x="142" y="98" width="8" height="24" rx="3" fill={`url(#histSilver-${uniqueId})`} stroke="#334155" strokeWidth="1" />

        {/* 2. Col Évasé à Frise Perlée */}
        <ellipse cx="110" cy="54" rx="32" ry="7" fill={`url(#histSilver-${uniqueId})`} stroke="#334155" strokeWidth="1" />
        <ellipse cx="110" cy="52" rx="24" ry="4" fill="#FFFFFF" opacity="0.85" />
        <circle cx="110" cy="46" r="4.5" fill={`url(#histHandle-${uniqueId})`} stroke="#475569" strokeWidth="1.2" />
        <circle cx="110" cy="44.5" r="1.5" fill="#FFFFFF" />

        {/* 3. Vase Traditionnel Cannelé */}
        <path
          d="M 78 54 L 142 54 C 142 54 148 108 136 142 C 126 168 94 168 84 142 C 72 108 78 54 78 54 Z"
          fill={`url(#histSilver-${uniqueId})`}
          stroke="#1E293B"
          strokeWidth="1.5"
        />

        {/* Cannelures verticales en godrons */}
        <path d="M 94 80 Q 90 120 100 156" stroke="#475569" strokeWidth="1.5" fill="none" />
        <path d="M 126 80 Q 130 120 120 156" stroke="#475569" strokeWidth="1.5" fill="none" />
        <path d="M 110 56 L 110 162" stroke="#FFFFFF" strokeWidth="2" opacity="0.7" fill="none" />

        {/* Médaillon Armoiries Sterling */}
        <circle cx="110" cy="105" r="15" fill="#0B132B" stroke="#FFFFFF" strokeWidth="1.5" />
        <polygon points="110,95 114,103 122,104 116,110 118,118 110,113 102,118 104,110 98,104 106,103" fill="#E2E8F0" />

        {/* 4. Pied d'Époque à Gradins */}
        <ellipse cx="110" cy="168" rx="20" ry="5" fill={`url(#histSilver-${uniqueId})`} />
        <path d="M 102 170 L 118 170 L 115 194 L 105 194 Z" fill={`url(#histHandle-${uniqueId})`} />
        <ellipse cx="110" cy="195" rx="26" ry="6" fill={`url(#histSilver-${uniqueId})`} stroke="#334155" strokeWidth="1" />

        {/* 5. Socle Cubique en Marbre Veiné */}
        <path d="M 76 199 L 144 199 L 148 214 L 72 214 Z" fill={`url(#histMarble-${uniqueId})`} stroke="#1E293B" strokeWidth="1" />
        <line x1="74" y1="212" x2="146" y2="212" stroke="#94A3B8" strokeWidth="1.5" opacity="0.8" />
        <rect x="56" y="214" width="108" height="24" rx="4" fill={`url(#histMarble-${uniqueId})`} stroke="#1E293B" strokeWidth="1.5" />

        {/* 6. Plaque Sterling Gravée */}
        <rect x="68" y="219" width="84" height="14" rx="2" fill={`url(#histSilver-${uniqueId})`} stroke="#334155" strokeWidth="1" />
        <text x="110" y="229.5" textAnchor="middle" fontSize="7.5" fontWeight="900" fontFamily="system-ui, sans-serif" fill="#0F172A" letterSpacing="2">
          CONDOR FC
        </text>
      </svg>

      {withReflection && (
        <div
          style={{
            position: 'absolute',
            top: '98%',
            left: 0,
            right: 0,
            transform: 'scaleY(-0.32)',
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
          <svg width={size} height={height * 0.65} viewBox="0 15 220 235" fill="none">
            <rect x="56" y="214" width="108" height="24" rx="4" fill="#CBD5E1" />
            <path d="M 78 54 L 142 54 C 142 54 148 108 136 142 C 126 168 94 168 84 142 C 72 108 78 54 78 54 Z" fill="#CBD5E1" />
          </svg>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 6. ÉCUSSON D'EXCELLENCE — ROSTER OFFICIEL CONDOR FC
// ============================================================================
/**
 * Insigne / Écusson d'Honneur Condor FC - Lauriers d'Or et Ruban Rubis
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
        style={{ position: 'relative', zIndex: 1, filter: 'drop-shadow(0 12px 20px rgba(0,0,0,0.5))', transform: 'translateY(6px)' }}
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

        {/* Couronne de Lauriers d'Or sculptée */}
        <g stroke={`url(#goldShield-${uniqueId})`} strokeWidth="3" fill="none" opacity="0.95">
          <path d="M 32 105 C 18 80 25 45 48 28" />
          <path d="M 24 90 Q 14 85 24 78" />
          <path d="M 28 72 Q 18 67 30 62" />
          <path d="M 36 52 Q 26 48 39 42" />
          <path d="M 46 36 Q 38 30 52 26" />

          <path d="M 128 105 C 142 80 135 45 112 28" />
          <path d="M 136 90 Q 146 85 136 78" />
          <path d="M 132 72 Q 142 67 130 62" />
          <path d="M 124 52 Q 134 48 121 42" />
          <path d="M 114 36 Q 122 30 108 26" />
        </g>

        {/* Bouclier Royal Central Biseauté */}
        <path
          d="M 80 18 L 122 36 C 122 88 102 124 80 142 C 58 124 38 88 38 36 Z"
          fill={`url(#shieldBackdrop-${uniqueId})`}
          stroke={`url(#goldShield-${uniqueId})`}
          strokeWidth="3.5"
        />

        <path
          d="M 80 25 L 115 40 C 115 84 98 116 80 132 C 62 116 45 84 45 40 Z"
          fill="none"
          stroke={`url(#goldShield-${uniqueId})`}
          strokeWidth="1.2"
          opacity="0.65"
        />

        {/* Aigle Triomphal Condor FC au Cœur de l'Écusson */}
        <path d="M 68 76 L 80 50 L 92 76 L 88 74 L 80 84 L 72 74 Z" fill={`url(#goldShield-${uniqueId})`} filter="drop-shadow(0 4px 6px rgba(0,0,0,0.6))" />
        <circle cx="80" cy="58" r="3" fill="#FFFDF0" />

        {/* Ruban Condor Élite en Rouge Condor */}
        <rect x="52" y="100" width="56" height="15" rx="3" fill="#ca024f" stroke="#FFFBEB" strokeWidth="1" />
        <text x="80" y="111" textAnchor="middle" fontSize="7.5" fontWeight="900" fontFamily="system-ui, sans-serif" fill="#FFFBEB" letterSpacing="1">
          ÉLITE CFC
        </text>
      </svg>
    </div>
  );
}

// ============================================================================
// COMPATIBILITY ALIASES
// ============================================================================
export const RealMadridGoldCup = ChaleChaleTripleCup;
export const RealMadridSilverCup = FlagDaySilverCup;
