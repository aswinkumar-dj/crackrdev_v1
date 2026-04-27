export function base64ToArrayBuffer(base64: string) {
  const binaryString = window.atob(base64);
  const bytes = new Uint8Array(binaryString.length);

  for (let index = 0; index < binaryString.length; index += 1) {
    bytes[index] = binaryString.charCodeAt(index);
  }

  return bytes.buffer;
}

export function arrayBufferToBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";

  for (let index = 0; index < bytes.byteLength; index += 1) {
    binary += String.fromCharCode(bytes[index]);
  }

  return window.btoa(binary);
}

export function float32ToPcm16(float32Array: Float32Array) {
  const pcm16 = new Int16Array(float32Array.length);

  for (let index = 0; index < float32Array.length; index += 1) {
    const sample = Math.max(-1, Math.min(1, float32Array[index]));
    pcm16[index] = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
  }

  return pcm16.buffer;
}

export function pcm16ToFloat32(buffer: ArrayBuffer) {
  const pcm16 = new Int16Array(buffer);
  const float32 = new Float32Array(pcm16.length);

  for (let index = 0; index < pcm16.length; index += 1) {
    float32[index] = pcm16[index] / 0x8000;
  }

  return float32;
}
