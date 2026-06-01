const images = import.meta.glob('../assets/images/*.{jpg,jpeg,JPG,JPEG,png,webp}', { eager: true, query: '?url', import: 'default' });

const allUrls = Object.values(images);

export const imageList = allUrls.map((url, i) => ({
  id: i + 1,
  url,
  alt: `Memory ${i + 1}`,
}));

const homeUrls = allUrls.filter((url) => {
  const name = url.split('/').pop().toLowerCase();
  return name.includes('marbine') || name.includes('original_2ed7');
});

export const homeImages = homeUrls.slice(0, 7).map((url, i) => ({
  id: `marbine-${i + 1}`,
  url,
  alt: `Marbine ${i + 1}`,
}));

export const heroImages = homeImages;
export const carouselImages = homeImages;
