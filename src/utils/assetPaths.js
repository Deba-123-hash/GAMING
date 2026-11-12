export const ASSET_PATHS = {
  models: {
    players: '/models/players',
    stadium: '/models/stadium',
    football: '/models/football',
    trophies: '/models/trophies',
  },
  animations: '/animations/players',
  textures: '/textures',
  environments: '/environments/hdri',
  images: '/images',
  audio: '/audio',
};

export function buildModelPath(category, filename) {
  const base = ASSET_PATHS.models[category] || '/models';
  return `${base}/${filename}`;
}
