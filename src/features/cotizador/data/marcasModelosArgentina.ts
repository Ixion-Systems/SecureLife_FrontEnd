/**
 * Marcas y Modelos Oficiales Comercializados en Argentina
 * 
 * Dataset curado con las principales terminales e importadores oficiales
 * de la República Argentina (ADEFA / CIDOA), incluyendo modelos icónicos,
 * utilitarios, pick-ups y vehículos de entrada y alta gama.
 *
 * @module features/cotizador/data/marcasModelosArgentina
 */

export interface MarcaVehiculo {
  id: string;
  nombre: string;
  origenPrincipal?: string;
  modelos: string[];
}

export const MARCAS_ARGENTINA: MarcaVehiculo[] = [
  {
    id: 'toyota',
    nombre: 'Toyota',
    modelos: [
      'Hilux',
      'Corolla',
      'Corolla Cross',
      'Yaris',
      'Etios',
      'SW4',
      'RAV4',
      'Hiace',
      'Prius',
      'Land Cruiser Prado',
      'Land Cruiser 300',
      'GR Yaris',
      'Camry',
    ],
  },
  {
    id: 'volkswagen',
    nombre: 'Volkswagen',
    modelos: [
      'Amarok',
      'Gol Trend',
      'Polo',
      'Virtus',
      'Nivus',
      'T-Cross',
      'Taos',
      'Vento',
      'Tiguan Allspace',
      'Saveiro',
      'Suran',
      'Fox',
      'Up!',
      'Passat',
      'Scirocco',
      'ID.4',
    ],
  },
  {
    id: 'fiat',
    nombre: 'Fiat',
    modelos: [
      'Cronos',
      'Pulse',
      'Fastback',
      'Strada',
      'Toro',
      'Mobi',
      'Argo',
      'Fiorino',
      'Ducato',
      '500 (Cinquecento)',
      'Palio',
      'Siena',
      'Grand Siena',
      'Uno',
      'Punto',
      'Doblò',
    ],
  },
  {
    id: 'chevrolet',
    nombre: 'Chevrolet',
    modelos: [
      'Tracker',
      'Cruze',
      'Onix',
      'Onix Plus',
      'Spin',
      'S10',
      'Montana',
      'Trailblazer',
      'Prisma',
      'Celta',
      'Classic / Corsa',
      'Equinox',
      'Camaro',
      'Agile',
      'Sonic',
      'Cobalt',
    ],
  },
  {
    id: 'renault',
    nombre: 'Renault',
    modelos: [
      'Sandero',
      'Stepway',
      'Logan',
      'Kangoo',
      'Duster',
      'Duster Oroch / Oroch',
      'Alaskan',
      'Kwid',
      'Kardian',
      'Master',
      'Captur',
      'Fluence',
      'Clio Mio / Clio 2',
      'Megane',
      'Koleos',
      'Symbol',
    ],
  },
  {
    id: 'ford',
    nombre: 'Ford',
    modelos: [
      'Ranger',
      'Ranger Raptor',
      'Maverick',
      'Territory',
      'Bronco Sport',
      'Bronco',
      'Kuga Híbrida',
      'Mustang',
      'Mustang Mach-E',
      'F-150',
      'F-150 Raptor',
      'Transit',
      'EcoSport',
      'Focus',
      'Fiesta Kinetic',
      'Ka',
      'Mondeo',
    ],
  },
  {
    id: 'peugeot',
    nombre: 'Peugeot',
    modelos: [
      '208',
      '2008',
      '3008',
      '5008',
      'Partner',
      'Expert',
      'Boxer',
      '308',
      '408',
      '207 Compact',
      '206',
    ],
  },
  {
    id: 'citroen',
    nombre: 'Citroën',
    modelos: [
      'C3',
      'C3 Aircross',
      'C4 Cactus',
      'Berlingo',
      'Jumpy',
      'Jumper',
      'C4 Lounge',
      'C3 Picasso',
      'C4 Picasso',
    ],
  },
  {
    id: 'nissan',
    nombre: 'Nissan',
    modelos: [
      'Frontier',
      'Kicks',
      'Versa',
      'Sentra',
      'X-Trail',
      'Leaf',
      'March',
      'Note',
      'Tiida',
      'Murano',
    ],
  },
  {
    id: 'jeep',
    nombre: 'Jeep',
    modelos: [
      'Renegade',
      'Compass',
      'Commander',
      'Grand Cherokee',
      'Wrangler',
      'Gladiator',
    ],
  },
  {
    id: 'honda',
    nombre: 'Honda',
    modelos: [
      'HR-V',
      'ZR-V',
      'CR-V',
      'Civic',
      'City',
      'Fit',
      'WR-V',
      'Accord',
      'Pilot',
    ],
  },
  {
    id: 'hyundai',
    nombre: 'Hyundai',
    modelos: [
      'Creta',
      'Tucson',
      'Santa Fe',
      'HB20',
      'Kona',
      'Staria',
      'i10 / Grand i10',
      'i30',
      'H1',
    ],
  },
  {
    id: 'kia',
    nombre: 'Kia',
    modelos: [
      'Seltos',
      'Sportage',
      'Carnival',
      'Rio',
      'Cerato',
      'Picanto',
      'Sorento',
      'K2500',
    ],
  },
  {
    id: 'mercedes-benz',
    nombre: 'Mercedes-Benz',
    modelos: [
      'Sprinter',
      'Clase A',
      'Clase C',
      'Clase E',
      'GLA',
      'GLB',
      'GLC',
      'GLE',
      'Vito',
    ],
  },
  {
    id: 'bmw',
    nombre: 'BMW',
    modelos: [
      'Serie 1 (118i, 128ti)',
      'Serie 2 Gran Coupé',
      'Serie 3 (320i, 330e, M340i)',
      'Serie 4',
      'X1',
      'X2',
      'X3',
      'X4',
      'X5',
      'X6',
    ],
  },
  {
    id: 'audi',
    nombre: 'Audi',
    modelos: [
      'A1 Sportback',
      'A3 Sedán / Sportback',
      'A4',
      'A5 Sportback',
      'Q2',
      'Q3 / Q3 Sportback',
      'Q5',
      'Q7',
      'Q8',
      'e-tron',
    ],
  },
  {
    id: 'ram',
    nombre: 'RAM',
    modelos: [
      'Rampage',
      '1500 Rebel / Laramie',
      '2500 Heavy Duty',
    ],
  },
  {
    id: 'chery',
    nombre: 'Chery',
    modelos: [
      'Tiggo 2 / Tiggo 2 Pro',
      'Tiggo 4 / Tiggo 4 Pro',
      'Tiggo 7 Pro',
      'Tiggo 8 Pro',
      'QQ',
    ],
  },
  {
    id: 'ds',
    nombre: 'DS Automobiles',
    modelos: [
      'DS 3 Crossback',
      'DS 4',
      'DS 7 Crossback',
      'DS 9',
    ],
  },
];

/**
 * Retorna la lista ordenada de todas las marcas oficiales
 */
export function getMarcasNombres(): string[] {
  return MARCAS_ARGENTINA.map((m) => m.nombre);
}

/**
 * Retorna los modelos disponibles para una marca dada (búsqueda flexible insensible a mayúsculas/minúsculas)
 */
export function getModelosPorMarca(nombreMarca: string): string[] {
  if (!nombreMarca || !nombreMarca.trim()) return [];

  const normalizada = nombreMarca.trim().toLowerCase();
  const encontrada = MARCAS_ARGENTINA.find(
    (m) =>
      m.nombre.toLowerCase() === normalizada ||
      m.id.toLowerCase() === normalizada ||
      normalizada.includes(m.nombre.toLowerCase())
  );

  return encontrada ? encontrada.modelos : [];
}
