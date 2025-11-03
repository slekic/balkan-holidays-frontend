export function dataURLtoFile(dataurl: string, filename: string) {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  let ext = mime.split('/')[1];
  if (ext.includes('+')) ext = ext.split('+')[0]; // svg+xml -> svg

  const allowed = ['jpeg', 'jpg', 'png', 'svg'];
  if (!allowed.includes(ext)) {
    throw new Error(`Nepodržani tip slike: ${ext}. Dozvoljeno: ${allowed.join(', ')}`);
  }

  return new File([u8arr], `${filename}.${ext}`, { type: mime });
}
