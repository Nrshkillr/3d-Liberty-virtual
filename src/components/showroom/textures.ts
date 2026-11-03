import * as THREE from "three";

type SignVariant = "cream" | "navy" | "wood";

function makeCanvas(width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas 2D is unavailable");
  return { canvas, context };
}

function toTexture(canvas: HTMLCanvasElement) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}

function wrapText(
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
) {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (context.measureText(candidate).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

let floorTexture: THREE.CanvasTexture | null = null;
let woodTexture: THREE.CanvasTexture | null = null;
let rugTexture: THREE.CanvasTexture | null = null;
let counterTexture: THREE.CanvasTexture | null = null;

export function getFloorTexture() {
  if (floorTexture) return floorTexture;

  const { canvas, context } = makeCanvas(1024, 1024);
  context.fillStyle = "#b98b62";
  context.fillRect(0, 0, 1024, 1024);

  const plankHeight = 128;
  const shades = ["#c29872", "#b98a61", "#c9a17c", "#b28359", "#c59a71", "#ad8057"];

  for (let row = 0; row < 8; row += 1) {
    const y = row * plankHeight;
    const offset = row % 2 === 0 ? 0 : -170;

    for (let col = -1; col < 5; col += 1) {
      const x = col * 340 + offset;
      const width = 340;
      const gradient = context.createLinearGradient(x, y, x + width, y + plankHeight);
      gradient.addColorStop(0, shades[(row + col + 6) % shades.length]);
      gradient.addColorStop(0.5, shades[(row + col + 2) % shades.length]);
      gradient.addColorStop(1, shades[(row + col + 4) % shades.length]);
      context.fillStyle = gradient;
      context.fillRect(x, y, width, plankHeight);

      context.strokeStyle = "rgba(76,48,26,0.18)";
      context.lineWidth = 2;
      for (let grain = 0; grain < 16; grain += 1) {
        context.beginPath();
        const grainY = y + 8 + Math.random() * (plankHeight - 16);
        context.moveTo(x, grainY);
        context.bezierCurveTo(
          x + width * 0.3,
          grainY + (Math.random() - 0.5) * 12,
          x + width * 0.7,
          grainY + (Math.random() - 0.5) * 12,
          x + width,
          grainY,
        );
        context.stroke();
      }

      context.strokeStyle = "rgba(70,44,24,0.35)";
      context.lineWidth = 3;
      context.strokeRect(x, y, width, plankHeight);
    }
  }

  for (let i = 0; i < 1200; i += 1) {
    context.fillStyle = `rgba(80,50,25,${Math.random() * 0.05})`;
    context.fillRect(Math.random() * 1024, Math.random() * 1024, 2, 2);
  }

  floorTexture = toTexture(canvas);
  floorTexture.wrapS = THREE.RepeatWrapping;
  floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set(5, 4);
  return floorTexture;
}

export function getWoodTexture() {
  if (woodTexture) return woodTexture;

  const { canvas, context } = makeCanvas(512, 512);
  context.fillStyle = "#9b6f4b";
  context.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 44; i += 1) {
    const y = Math.random() * 512;
    context.strokeStyle = `rgba(58,34,18,${0.05 + Math.random() * 0.12})`;
    context.lineWidth = 1 + Math.random() * 3;
    context.beginPath();
    context.moveTo(0, y);
    context.bezierCurveTo(160, y + 10, 340, y - 8, 512, y + 4);
    context.stroke();
  }

  const gradient = context.createLinearGradient(0, 0, 512, 512);
  gradient.addColorStop(0, "rgba(255,231,201,0.12)");
  gradient.addColorStop(0.5, "rgba(255,231,201,0)");
  gradient.addColorStop(1, "rgba(43,24,10,0.12)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 512, 512);

  woodTexture = toTexture(canvas);
  woodTexture.wrapS = THREE.RepeatWrapping;
  woodTexture.wrapT = THREE.RepeatWrapping;
  return woodTexture;
}

export function getRugTexture() {
  if (rugTexture) return rugTexture;

  const { canvas, context } = makeCanvas(640, 768);
  context.fillStyle = "#efe4d2";
  context.fillRect(0, 0, 640, 768);

  context.strokeStyle = "#102a43";
  context.lineWidth = 18;
  context.strokeRect(22, 22, 596, 724);

  context.strokeStyle = "#d9773f";
  context.lineWidth = 5;
  context.strokeRect(48, 48, 544, 672);

  context.strokeStyle = "rgba(16,42,67,0.18)";
  context.lineWidth = 2;
  for (let i = 0; i < 9; i += 1) {
    const x = 95 + i * 55;
    for (let j = 0; j < 11; j += 1) {
      const y = 95 + j * 55;
      context.beginPath();
      context.moveTo(x, y - 10);
      context.lineTo(x + 10, y);
      context.lineTo(x, y + 10);
      context.lineTo(x - 10, y);
      context.closePath();
      context.stroke();
    }
  }

  context.strokeStyle = "rgba(16,42,67,0.1)";
  context.lineWidth = 1;
  for (let y = 0; y < 768; y += 5) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(640, y);
    context.stroke();
  }

  rugTexture = toTexture(canvas);
  return rugTexture;
}

export function getCounterTexture() {
  if (counterTexture) return counterTexture;

  const { canvas, context } = makeCanvas(512, 512);
  context.fillStyle = "#173b5c";
  context.fillRect(0, 0, 512, 512);

  for (let x = 0; x < 512; x += 26) {
    const gradient = context.createLinearGradient(x, 0, x + 26, 0);
    gradient.addColorStop(0, "rgba(8,24,38,0.55)");
    gradient.addColorStop(0.35, "rgba(255,255,255,0.08)");
    gradient.addColorStop(0.7, "rgba(255,255,255,0.02)");
    gradient.addColorStop(1, "rgba(8,24,38,0.45)");
    context.fillStyle = gradient;
    context.fillRect(x, 0, 26, 512);
  }

  counterTexture = toTexture(canvas);
  counterTexture.wrapS = THREE.RepeatWrapping;
  counterTexture.wrapT = THREE.RepeatWrapping;
  counterTexture.repeat.set(4, 1);
  return counterTexture;
}

let blobTexture: THREE.CanvasTexture | null = null;
let haloTexture: THREE.CanvasTexture | null = null;

export function getBlobShadowTexture() {
  if (blobTexture) return blobTexture;

  const { canvas, context } = makeCanvas(256, 256);
  const gradient = context.createRadialGradient(128, 128, 6, 128, 128, 126);
  gradient.addColorStop(0, "rgba(12,20,26,0.55)");
  gradient.addColorStop(0.45, "rgba(12,20,26,0.3)");
  gradient.addColorStop(0.78, "rgba(12,20,26,0.1)");
  gradient.addColorStop(1, "rgba(12,20,26,0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 256, 256);

  blobTexture = toTexture(canvas);
  return blobTexture;
}

export function getHaloTexture() {
  if (haloTexture) return haloTexture;

  const { canvas, context } = makeCanvas(256, 256);
  const gradient = context.createRadialGradient(128, 128, 30, 128, 128, 126);
  gradient.addColorStop(0, "rgba(255,255,255,0)");
  gradient.addColorStop(0.56, "rgba(255,255,255,0)");
  gradient.addColorStop(0.72, "rgba(255,214,160,0.55)");
  gradient.addColorStop(0.86, "rgba(255,196,120,0.2)");
  gradient.addColorStop(1, "rgba(255,196,120,0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 256, 256);

  haloTexture = toTexture(canvas);
  return haloTexture;
}

export function createSignTexture({
  title,
  subtitle,
  variant = "cream",
  width = 1024,
  height = 256,
  accent = "#d9773f",
}: {
  title: string;
  subtitle?: string;
  variant?: SignVariant;
  width?: number;
  height?: number;
  accent?: string;
}) {
  const { canvas, context } = makeCanvas(width, height);

  const palette =
    variant === "navy"
      ? { bg: "#102a43", fg: "#faf6ee", muted: "rgba(250,246,238,0.62)", line: "rgba(250,246,238,0.18)" }
      : variant === "wood"
        ? { bg: "#8a6244", fg: "#fdf6ea", muted: "rgba(253,246,234,0.7)", line: "rgba(253,246,234,0.2)" }
        : { bg: "#fbf6ed", fg: "#102a43", muted: "rgba(16,42,67,0.6)", line: "rgba(16,42,67,0.14)" };

  context.fillStyle = palette.bg;
  context.fillRect(0, 0, width, height);

  context.strokeStyle = palette.line;
  context.lineWidth = Math.max(2, height * 0.008);
  context.strokeRect(height * 0.06, height * 0.06, width - height * 0.12, height - height * 0.12);

  context.fillStyle = accent;
  context.fillRect(height * 0.06 + 12, height * 0.06 + 12, Math.max(5, width * 0.006), height - height * 0.12 - 24);

  context.textAlign = "center";
  context.fillStyle = palette.fg;
  context.font = `600 ${Math.round(height * 0.3)}px Georgia, 'Times New Roman', serif`;
  context.fillText(title, width / 2, subtitle ? height * 0.53 : height * 0.62, width * 0.82);

  if (subtitle) {
    context.fillStyle = palette.muted;
    context.font = `600 ${Math.round(height * 0.082)}px 'Segoe UI', Arial, sans-serif`;
    context.letterSpacing = `${Math.round(height * 0.03)}px`;
    context.fillText(subtitle.toUpperCase(), width / 2, height * 0.74, width * 0.8);
  }

  return toTexture(canvas);
}

export function createLabelTexture(name: string, model: string) {
  const { canvas, context } = makeCanvas(512, 168);
  context.fillStyle = "#fbf6ed";
  context.fillRect(0, 0, 512, 168);

  context.strokeStyle = "rgba(16,42,67,0.16)";
  context.lineWidth = 3;
  context.strokeRect(5, 5, 502, 158);

  context.fillStyle = "#b85f2b";
  context.fillRect(5, 5, 502, 7);

  context.textAlign = "left";
  context.fillStyle = "rgba(16,42,67,0.5)";
  context.font = "700 16px 'Segoe UI', Arial, sans-serif";
  context.letterSpacing = "2px";
  context.fillText("LIBERTY ENTERPRISES", 26, 46);

  context.fillStyle = "#102a43";
  context.font = "600 28px Georgia, 'Times New Roman', serif";
  const lines = wrapText(context, name, 400);
  lines.slice(0, 1).forEach((line, index) => {
    context.fillText(line, 26, 82 + index * 32);
  });

  context.fillStyle = "#b85f2b";
  context.font = "600 18px 'Segoe UI', Arial, sans-serif";
  context.letterSpacing = "1px";
  context.fillText(`MODEL ${model || "—"}`, 26, 146);

  return toTexture(canvas);
}

export function createPosterTexture({
  title,
  subtitle,
  variant = "cream",
}: {
  title: string;
  subtitle: string;
  variant?: SignVariant;
}) {
  const { canvas, context } = makeCanvas(640, 860);

  const palette =
    variant === "navy"
      ? { bg: "#102a43", fg: "#faf6ee", muted: "rgba(250,246,238,0.62)" }
      : variant === "wood"
        ? { bg: "#8a6244", fg: "#fdf6ea", muted: "rgba(253,246,234,0.68)" }
        : { bg: "#f6ecdd", fg: "#102a43", muted: "rgba(16,42,67,0.58)" };

  context.fillStyle = palette.bg;
  context.fillRect(0, 0, 640, 860);

  context.strokeStyle = palette.muted;
  context.globalAlpha = 0.35;
  context.lineWidth = 2;
  context.strokeRect(30, 30, 580, 800);
  context.globalAlpha = 1;

  context.strokeStyle = "#c49a5a";
  context.lineWidth = 4;
  context.beginPath();
  context.arc(320, 360, 150, 0, Math.PI * 2);
  context.stroke();

  context.strokeStyle = "rgba(217,119,63,0.55)";
  context.lineWidth = 2;
  context.beginPath();
  context.arc(320, 360, 118, Math.PI * 1.1, Math.PI * 2.2);
  context.stroke();

  context.fillStyle = "#d9773f";
  context.beginPath();
  context.arc(320, 360, 8, 0, Math.PI * 2);
  context.fill();

  context.textAlign = "center";
  context.fillStyle = palette.fg;
  context.font = "600 46px Georgia, 'Times New Roman', serif";
  const lines = wrapText(context, title, 500);
  lines.slice(0, 3).forEach((line, index) => {
    context.fillText(line, 320, 600 + index * 54);
  });

  context.fillStyle = palette.muted;
  context.font = "600 19px 'Segoe UI', Arial, sans-serif";
  context.letterSpacing = "4px";
  context.fillText(subtitle.toUpperCase(), 320, 786, 520);

  return toTexture(canvas);
}
