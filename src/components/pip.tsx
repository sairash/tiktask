import { useCallback, useEffect, useRef, useState } from 'react';
import CountDownContainer from './CountDownContainer';
import ControlButtons from './ControlButtons';
import useMusicModalStore from '@/store/musicStore';
import useTimeStore from '@/store/timeStore';
import useSettingsStore from '@/store/settingsStore';
import useTaskStore from '@/store/taskStore';

declare global {
  interface DocumentPictureInPicture {
    requestWindow(opts?: { width?: number; height?: number }): Promise<Window>;
  }
  interface Window {
    documentPictureInPicture?: DocumentPictureInPicture;
  }
}

function copyStyles(source: Document, target: Document) {
  [...source.styleSheets].forEach((sheet) => {
    try {
      if (sheet.href) {
        const link = target.createElement('link');
        link.rel = 'stylesheet';
        link.href = sheet.href;
        target.head.appendChild(link);
      } else if (sheet.ownerNode) {
        target.head.appendChild((sheet.ownerNode as Element).cloneNode(true));
      }
    } catch (_) {}
  });
}

function getTimerLabel(state: number): string {
  if (state === 8) return 'Long Break';
  return state % 2 === 0 ? 'Focus Timer' : 'Short Break';
}

function renderCanvasFrame(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const { timeStamp, state } = useTimeStore.getState();
  const minutes = Math.floor(timeStamp / 60000).toString().padStart(2, '0');
  const seconds = Math.floor((timeStamp % 60000) / 1000).toString().padStart(2, '0');
  const label = getTimerLabel(state);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'center';
  ctx.font = 'bold 48px monospace';
  ctx.fillText(`${minutes}:${seconds}`, canvas.width / 2, canvas.height / 2 + 16);
  ctx.font = '18px sans-serif';
  ctx.fillText(label, canvas.width / 2, canvas.height / 2 - 32);
}

const PictureInPictureDiv = () => {
  const { toggle } = useMusicModalStore();
  const { ticking, toggleTicking } = useTimeStore();
  const { togglTaskeOpen } = useTaskStore();
  const settingsStore = useSettingsStore();

  const divRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pipWindowRef = useRef<Window | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isPiPActiveRef = useRef(false);

  const [isPiPActive, setIsPiPActive] = useState(false);
  const [isDocPiPSupported, setIsDocPiPSupported] = useState(false);
  const [isVideoPiPSupported, setIsVideoPiPSupported] = useState(false);

  const [curButtonState, setCurButtonState] = useState<string[]>([
    'play', 'music', 'settings', 'picture-in-picture',
  ]);

  useEffect(() => {
    setIsDocPiPSupported('documentPictureInPicture' in window);
    setIsVideoPiPSupported('pictureInPictureEnabled' in document);
  }, []);

  useEffect(() => {
    isPiPActiveRef.current = isPiPActive;
  }, [isPiPActive]);

  useEffect(() => {
    setCurButtonState(prev => [
      prev[0], prev[1], prev[2],
      isPiPActive ? 'picture-in-picture-open' : 'picture-in-picture',
    ]);
  }, [isPiPActive]);

  useEffect(() => {
    setCurButtonState(prev => [
      ticking ? 'pause' : 'play', prev[1], prev[2], prev[3],
    ]);
  }, [ticking]);

  // Canvas fallback: subscribe to timeStamp outside React rendering
  useEffect(() => {
    if (isDocPiPSupported || !isVideoPiPSupported) return;
    let prevTimeStamp = useTimeStore.getState().timeStamp;
    const unsub = useTimeStore.subscribe((s) => {
      if (s.timeStamp !== prevTimeStamp) {
        prevTimeStamp = s.timeStamp;
        if (isPiPActiveRef.current && canvasRef.current) {
          renderCanvasFrame(canvasRef.current);
        }
      }
    });
    return unsub;
  }, [isDocPiPSupported, isVideoPiPSupported]);

  // Canvas fallback: handle leavepictureinpicture
  useEffect(() => {
    if (isDocPiPSupported) return;
    const video = videoRef.current;
    if (!video) return;
    const onLeave = () => setIsPiPActive(false);
    video.addEventListener('leavepictureinpicture', onLeave);
    return () => video.removeEventListener('leavepictureinpicture', onLeave);
  }, [isDocPiPSupported]);

  const openDocPiP = useCallback(async () => {
    if (!window.documentPictureInPicture || !divRef.current) return;
    try {
      const pipWin = await window.documentPictureInPicture.requestWindow({
        width: 320,
        height: 180,
      });
      copyStyles(document, pipWin.document);
      pipWin.document.body.style.margin = '0';
      pipWin.document.body.style.display = 'grid';
      pipWin.document.body.style.placeItems = 'center';
      pipWin.document.body.style.height = '100vh';
      pipWin.document.body.style.background = '#ffffff';
      pipWin.document.body.appendChild(divRef.current);
      pipWindowRef.current = pipWin;
      setIsPiPActive(true);

      pipWin.addEventListener('pagehide', () => {
        if (divRef.current && containerRef.current) {
          containerRef.current.prepend(divRef.current);
        }
        pipWindowRef.current = null;
        setIsPiPActive(false);
      });
    } catch (err) {
      console.error('Document PiP failed:', err);
      setIsPiPActive(false);
    }
  }, []);

  const closeDocPiP = useCallback(() => {
    pipWindowRef.current?.close();
  }, []);

  const openCanvasPiP = useCallback(async () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    try {
      canvas.width = 320;
      canvas.height = 180;
      renderCanvasFrame(canvas);
      const stream = canvas.captureStream(1);
      video.srcObject = stream;
      await new Promise<void>((resolve) => {
        video.addEventListener('loadedmetadata', () => resolve(), { once: true });
      });
      await video.play();
      await video.requestPictureInPicture();
      setIsPiPActive(true);
    } catch (err) {
      console.error('Canvas PiP failed:', err);
      setIsPiPActive(false);
    }
  }, []);

  const closeCanvasPiP = useCallback(async () => {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      }
    } catch (_) {}
    setIsPiPActive(false);
  }, []);

  const togglePiP = useCallback(() => {
    if (isPiPActiveRef.current) {
      if (isDocPiPSupported) closeDocPiP();
      else closeCanvasPiP();
    } else {
      if (isDocPiPSupported) openDocPiP();
      else if (isVideoPiPSupported) openCanvasPiP();
    }
  }, [isDocPiPSupported, isVideoPiPSupported, openDocPiP, closeDocPiP, openCanvasPiP, closeCanvasPiP]);

  const btnEvent = useCallback((data: string, _close: boolean) => {
    switch (data) {
      case 'pip':
        togglePiP();
        break;
      case 'play':
        toggleTicking();
        break;
      case 'music':
        toggle();
        break;
      case 'settings':
        settingsStore.toggle();
        break;
      case 'task':
        togglTaskeOpen();
        break;
      default:
        break;
    }
  }, [togglePiP, toggleTicking, toggle, settingsStore, togglTaskeOpen]);

  const isPiPSupported = isDocPiPSupported || isVideoPiPSupported;

  return (
    <div className='h-full w-full'>
      <div ref={containerRef} className="grid place-items-center h-full w-full">
        <div
          ref={divRef}
          style={{ color: 'var(--theme-text)' }}
          className='py-20'
        >
          <CountDownContainer />
        </div>
        <ControlButtons btnEvent={btnEvent} activeButtons={curButtonState} />
      </div>

      {!isDocPiPSupported && isVideoPiPSupported && (
        <>
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          <video
            playsInline
            crossOrigin="anonymous"
            ref={videoRef}
            style={{ display: 'none' }}
            muted
          />
        </>
      )}

      {!isPiPSupported && <p>Picture-in-Picture is not supported in your browser</p>}
    </div>
  );
};

export default PictureInPictureDiv;
