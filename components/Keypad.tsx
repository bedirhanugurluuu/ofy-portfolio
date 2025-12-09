"use client";
import React, { useEffect, useLayoutEffect, useState, useRef } from "react";

export default function Keypad() {
  const clickAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      clickAudioRef.current = new Audio(
        'https://cdn.freesound.org/previews/378/378085_6260145-lq.mp3'
      );
    }
  }, []);

  const handleKeyClick = () => {
    if (clickAudioRef.current) {
      clickAudioRef.current.currentTime = 0;
      clickAudioRef.current.play().catch(() => {});
    }
  };

  useLayoutEffect(() => {
    // CSS'i hemen yükle (render'dan önce)
    const styleId = 'keypad-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        .keypad-wrapper {
          position: relative;
          width: 100%;
          max-width: 400px;
          min-width: 280px;
          margin: 0;
          flex-shrink: 0;
        }

        .keypad {
          position: relative;
          aspect-ratio: 400 / 310;
          display: flex;
          place-items: center;
          width: 100%;
          max-width: 400px;
          min-width: 280px;
          -webkit-tap-highlight-color: transparent;
          transform-style: preserve-3d;
        }

        .keypad__base {
          position: absolute;
          bottom: 0;
          width: 100%;
          z-index: 1;
        }

        .keypad__base img {
          width: 100%;
          display: block;
        }

        .key {
          transform-style: preserve-3d;
          border: 0;
          background: transparent;
          padding: 0;
          cursor: pointer;
          outline: none;
          position: absolute;
          z-index: 2;
        }

        .key[data-pressed='true'] .key__content,
        .key:active .key__content {
          transform: translateY(calc(var(--travel, 20) * 1%));
        }

        .key__content {
          width: 100%;
          display: inline-block;
          height: 100%;
          transition: transform 0.12s ease-out;
          position: relative;
        }

        .key__mask {
          width: 100%;
          height: 100%;
          display: inline-block;
        }

        .key__text {
          height: 46%;
          width: 86%;
          position: absolute;
          font-size: 12cqi;
          z-index: 21;
          top: 5%;
          left: 0;
          mix-blend-mode: normal;
          color: hsl(0, 0%, 94%);
          translate: 8% 10%;
          transform: rotateX(36deg) rotateY(45deg) rotateX(-90deg) rotate(0deg);
          text-align: left;
          padding: 1ch;
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
        }

        .key img {
          width: 100%;
          display: block;
          filter: hue-rotate(calc(var(--hue, 0) * 1deg))
            saturate(var(--saturate, 1)) brightness(var(--brightness, 1));
        }

        .keypad__single {
          width: 40.5%;
          left: 54%;
          bottom: 36%;
          height: 46%;
          clip-path: polygon(
            0 0,
            54% 0,
            89% 24%,
            100% 70%,
            54% 100%,
            46% 100%,
            0 69%,
            12% 23%,
            47% 0%
          );
        }

        .keypad__single--left {
          left: 29.3%;
          bottom: 54.2%;
        }

        .keypad__single .key__text {
          width: 52%;
          height: 62%;
          translate: 45% -16%;
          font-size: 21px;
        }

        .keypad__single img {
          top: 0;
          opacity: 1;
          width: 96%;
          position: absolute;
          left: 50%;
          transform: translate(-50%, 1%);
        }

        .keypad__double {
          width: 64%;
          height: 65%;
          left: 6%;
          bottom: 17.85%;
          clip-path: polygon(
            34% 0,
            93% 44%,
            101% 78%,
            71% 100%,
            66% 100%,
            0 52%,
            0 44%,
            7% 17%,
            30% 0
          );
        }

        .keypad__double .key__text {
          height: 46%;
          width: 86%;
          top: 5%;
          left: 0;
          translate: 8% 10%;
          font-size: 22px;
        }

        .keypad__double img {
          top: 0;
          opacity: 1;
          width: 99%;
          position: absolute;
          left: 50%;
          transform: translate(-50%, 1%);
        }

        @media (max-width: 768px) {
          .keypad-wrapper {
            max-width: 100%;
            width: 100%;
            margin: 2rem auto 0;
          }
          .keypad {
            max-width: 300px;
            margin: 0 auto;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // CodePen stilinde keypad tuşları - 3 tuş (ok, go, create mantığı)
  const keys = [
    { 
      id: 'one', 
      text: 'ok', 
      type: 'single', 
      left: true, 
      hue: 0, 
      saturate: 1, 
      brightness: 1.2 
    },
    { 
      id: 'two', 
      text: 'go', 
      type: 'single', 
      left: false, 
      hue: 114, 
      saturate: 1.4, 
      brightness: 1.2 
    },
    { 
      id: 'three', 
      text: 'create.', 
      type: 'double', 
      hue: 0, 
      saturate: 0, 
      brightness: 1 
    },
  ];

  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    // Görselleri biraz geciktirerek yükle (100ms sonra)
    const timer = setTimeout(() => {
      setImagesLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="keypad-wrapper">
      <div 
        className="keypad"
        style={{
          aspectRatio: '400 / 310',
          minHeight: '220px',
        } as React.CSSProperties}
      >
        {imagesLoaded && (
          <>
            <div className="keypad__base">
              <img 
                src="https://assets.codepen.io/605876/keypad-base.png?format=auto&quality=86" 
                alt="Keypad base"
                loading="lazy"
                decoding="async"
                width="400"
                height="310"
              />
            </div>

            {keys.map((keyConfig) => {
              return (
                <div
                  key={keyConfig.id}
                  id={keyConfig.id}
                  className={`key keypad__${keyConfig.type} ${keyConfig.left ? 'keypad__single--left' : ''}`}
                  onClick={handleKeyClick}
                  style={{
                    '--hue': String(keyConfig.hue),
                    '--saturate': String(keyConfig.saturate),
                    '--brightness': String(keyConfig.brightness),
                  } as React.CSSProperties}
                >
                  <span className="key__mask">
                    <span className="key__content">
                      <span className="key__text">{keyConfig.text}</span>
                      <img 
                        src={`https://assets.codepen.io/605876/keypad-${keyConfig.type}.png?format=auto&quality=86`}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        width="400"
                        height="310"
                      />
                    </span>
                  </span>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
