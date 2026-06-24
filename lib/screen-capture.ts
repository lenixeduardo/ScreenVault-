export async function captureScreen(): Promise<Blob> {
  const stream = await navigator.mediaDevices.getDisplayMedia({
    video: true,
    audio: false,
  });

  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.srcObject = stream;
    video.onloadedmetadata = () => {
      video.play();
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        stream.getTracks().forEach((t) => t.stop());
        reject(new Error('Canvas context not available'));
        return;
      }
      ctx.drawImage(video, 0, 0);
      stream.getTracks().forEach((t) => t.stop());

      const quality = canvas.width * canvas.height > 1920 * 1080 ? 0.8 : 0.92;
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Canvas toBlob() returned null'));
        },
        'image/jpeg',
        quality
      );
    };
    video.onerror = () => {
      stream.getTracks().forEach((t) => t.stop());
      reject(new Error('Video element error'));
    };
  });
}

export async function uploadCapture(blob: Blob): Promise<{ id: string }> {
  const form = new FormData();
  form.append('image', blob, 'capture.jpg');
  const res = await fetch('/api/captures', { method: 'POST', body: form });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Upload failed with status ${res.status}`);
  }
  return res.json();
}

export async function uploadFile(file: File): Promise<{ id: string }> {
  const form = new FormData();
  form.append('image', file);
  const res = await fetch('/api/captures', { method: 'POST', body: form });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Upload failed with status ${res.status}`);
  }
  return res.json();
}