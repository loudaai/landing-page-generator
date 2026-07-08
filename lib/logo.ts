export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read the logo file."));
    reader.readAsDataURL(file);
  });
}

function hexToRgb(hex: string): [number, number, number] | null {
  const value = hex.replace("#", "").trim();
  if (value.length !== 6) return null;
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  if ([r, g, b].some((n) => Number.isNaN(n))) return null;
  return [r, g, b];
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n)))
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function colorDistance(a: [number, number, number], b: [number, number, number]) {
  return Math.sqrt(
    (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2
  );
}

export async function extractPalette(
  dataUrl: string,
  count = 3
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const size = 32;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas not supported."));
          return;
        }
        ctx.drawImage(img, 0, 0, size, size);
        const data = ctx.getImageData(0, 0, size, size).data;

        const buckets = new Map<string, { rgb: [number, number, number]; n: number }>();
        for (let i = 0; i < data.length; i += 4) {
          const a = data[i + 3];
          if (a < 125) continue;
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const key = `${r >> 4},${g >> 4},${b >> 4}`;
          const existing = buckets.get(key);
          if (existing) {
            existing.n += 1;
            existing.rgb[0] += r;
            existing.rgb[1] += g;
            existing.rgb[2] += b;
          } else {
            buckets.set(key, { rgb: [r, g, b], n: 1 });
          }
        }

        const sorted = [...buckets.values()]
          .map((b) => ({
            rgb: [
              b.rgb[0] / b.n,
              b.rgb[1] / b.n,
              b.rgb[2] / b.n,
            ] as [number, number, number],
            n: b.n,
          }))
          .sort((a, b) => b.n - a.n);

        const palette: string[] = [];
        for (const item of sorted) {
          if (palette.length >= count) break;
          const hex = rgbToHex(item.rgb[0], item.rgb[1], item.rgb[2]);
          const rgb = hexToRgb(hex);
          if (!rgb) continue;
          const tooClose = palette.some((p) => {
            const pr = hexToRgb(p);
            return pr ? colorDistance(pr, rgb) < 48 : false;
          });
          if (tooClose) continue;
          palette.push(hex);
        }

        if (palette.length === 0) {
          reject(new Error("No colors found."));
          return;
        }
        resolve(palette);
      } catch {
        reject(new Error("Palette extraction failed."));
      }
    };
    img.onerror = () => reject(new Error("Could not load the logo image."));
    img.src = dataUrl;
  });
}
