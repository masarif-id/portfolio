import { Description, Location, Project, Spotify, Article, ProductPreset, ProductLut, Contact } from '@/components/grid/widgets';
import { Layout } from 'react-grid-layout';

interface GridItem {
    i: string;
    component: React.ComponentType<any>;
}

export const gridItems: GridItem[] = [
    { i: 'description', component: Description },
    { i: 'location', component: Location },
    { i: 'project', component: Project },
    { i: 'spotify', component: Spotify },
    { i: 'article', component: Article },
    { i: 'product-preset', component: ProductPreset },
    { i: 'product-lut', component: ProductLut },
    { i: 'contact', component: Contact },
];

type Layouts = 'lg' | 'md' | 'sm';

export const layouts: { [key in Layouts]: Layout[] } = {
    lg: [
        { i: 'description', x: 0, y: 0, w: 2, h: 1 },
        { i: 'location', x: 2, y: 0, w: 1, h: 1 },
        { i: 'project', x: 3, y: 0, w: 1, h: 2 },
        { i: 'spotify', x: 0, y: 1, w: 1, h: 1 },
        { i: 'article', x: 1, y: 1, w: 2, h: 1 },
        { i: 'product-preset', x: 0, y: 2, w: 1, h: 1 },
        { i: 'product-lut', x: 1, y: 2, w: 1, h: 1 },
        { i: 'contact', x: 2, y: 2, w: 2, h: 1 },
    ],
    md: [
        { i: 'description', x: 0, y: 0, w: 2, h: 2 },
        { i: 'location', x: 2, y: 0, w: 2, h: 1 },
        { i: 'product-lut', x: 2, y: 1, w: 1, h: 1 },
        { i: 'project', x: 3, y: 1, w: 1, h: 2 },
        { i: 'spotify', x: 0, y: 2, w: 2, h: 1 },
        { i: 'product-preset', x: 2, y: 2, w: 1, h: 1 },
        { i: 'article', x: 0, y: 3, w: 2, h: 2 },
        { i: 'contact', x: 2, y: 3, w: 2, h: 2 },
    ],
    sm: [
        { i: 'description', x: 0, y: 0, w: 2, h: 2 },
        { i: 'location', x: 0, y: 2, w: 2, h: 1 },
        { i: 'product-lut', x: 0, y: 3, w: 1, h: 1 },
        { i: 'project', x: 1, y: 3, w: 1, h: 2 },
        { i: 'product-preset', x: 0, y: 4, w: 1, h: 1 },
        { i: 'spotify', x: 0, y: 5, w: 2, h: 2 },
        { i: 'article', x: 0, y: 7, w: 2, h: 2 },
        { i: 'contact', x: 0, y: 9, w: 2, h: 2 },
    ],
};

// Gallery layout with standard photo aspect ratios: 4:6 (landscape/portrait) and 1:1 (square)
// Using grid units where 2 units = 4:6 landscape, 1 unit = square 1:1, and 1x3 = 4:6 portrait
const projectLargeLayout: Layout[] = [
    // Row 1: Landscape 4:6 + Square + Square
    { i: 'images-1', x: 0, y: 0, w: 2, h: 1 },  // Landscape 4:6 (6:4 ratio)
    { i: 'images-2', x: 2, y: 0, w: 1, h: 1 },  // Square 1:1
    { i: 'images-3', x: 3, y: 0, w: 1, h: 1 },  // Square 1:1
    
    // Row 2: Portrait 4:6 + Landscape 4:6
    { i: 'images-4', x: 0, y: 1, w: 1, h: 2 },  // Portrait 4:6 (4:6 ratio)
    { i: 'images-5', x: 1, y: 1, w: 2, h: 1 },  // Landscape 4:6 (6:4 ratio)
    { i: 'images-6', x: 3, y: 1, w: 1, h: 1 },  // Square 1:1
    
    // Row 3: Square + Square + Portrait continues
    { i: 'images-7', x: 1, y: 2, w: 1, h: 1 },  // Square 1:1
    { i: 'images-8', x: 2, y: 2, w: 1, h: 1 },  // Square 1:1
    { i: 'images-9', x: 3, y: 2, w: 1, h: 1 },  // Square 1:1
    
    // Row 4: Landscape 4:6 + Square + Square
    { i: 'images-10', x: 0, y: 3, w: 2, h: 1 }, // Landscape 4:6 (6:4 ratio)
    { i: 'images-11', x: 2, y: 3, w: 1, h: 1 }, // Square 1:1
    { i: 'images-12', x: 3, y: 3, w: 1, h: 1 }, // Square 1:1
    
    // Row 5: Square + Portrait 4:6 + Square
    { i: 'images-13', x: 0, y: 4, w: 1, h: 1 }, // Square 1:1
    { i: 'images-14', x: 1, y: 4, w: 1, h: 2 }, // Portrait 4:6 (4:6 ratio)
    { i: 'images-15', x: 2, y: 4, w: 2, h: 1 }, // Landscape 4:6 (6:4 ratio)
    
    // Row 6: Square continues + Square
    { i: 'images-16', x: 0, y: 5, w: 1, h: 1 }, // Square 1:1
    { i: 'images-17', x: 2, y: 5, w: 1, h: 1 }, // Square 1:1
    { i: 'images-18', x: 3, y: 5, w: 1, h: 1 }, // Square 1:1
];

export const projectLayouts: { [key in Layouts]: Layout[] } = {
    lg: projectLargeLayout,
    md: projectLargeLayout,
    sm: [
        // Mobile layout with 4:6 and 1:1 ratios (2 columns)
        { i: 'images-1', x: 0, y: 0, w: 2, h: 1 },  // Landscape 4:6
        { i: 'images-2', x: 0, y: 1, w: 1, h: 1 },  // Square 1:1
        { i: 'images-3', x: 1, y: 1, w: 1, h: 1 },  // Square 1:1
        { i: 'images-4', x: 0, y: 2, w: 1, h: 2 },  // Portrait 4:6
        { i: 'images-5', x: 1, y: 2, w: 1, h: 1 },  // Square 1:1
        { i: 'images-6', x: 1, y: 3, w: 1, h: 1 },  // Square 1:1
        { i: 'images-7', x: 0, y: 4, w: 2, h: 1 },  // Landscape 4:6
        { i: 'images-8', x: 0, y: 5, w: 1, h: 1 },  // Square 1:1
        { i: 'images-9', x: 1, y: 5, w: 1, h: 1 },  // Square 1:1
        { i: 'images-10', x: 0, y: 6, w: 2, h: 1 }, // Landscape 4:6
        { i: 'images-11', x: 0, y: 7, w: 1, h: 2 }, // Portrait 4:6
        { i: 'images-12', x: 1, y: 7, w: 1, h: 1 }, // Square 1:1
        { i: 'images-13', x: 1, y: 8, w: 1, h: 1 }, // Square 1:1
        { i: 'images-14', x: 0, y: 9, w: 1, h: 1 }, // Square 1:1
        { i: 'images-15', x: 1, y: 9, w: 1, h: 1 }, // Square 1:1
        { i: 'images-16', x: 0, y: 10, w: 2, h: 1 }, // Landscape 4:6
        { i: 'images-17', x: 0, y: 11, w: 1, h: 1 }, // Square 1:1
        { i: 'images-18', x: 1, y: 11, w: 1, h: 1 }, // Square 1:1
    ],
};

const spotifyLargeLayout: Layout[] = [
    { i: 'spotify-1', x: 0, y: 0, w: 2, h: 1 },
    { i: 'spotify-2', x: 2, y: 0, w: 1, h: 1 },
    { i: 'spotify-3', x: 3, y: 0, w: 1, h: 2 },
    { i: 'spotify-4', x: 0, y: 1, w: 1, h: 1 },
    { i: 'spotify-5', x: 1, y: 1, w: 2, h: 1 },
];

export const spotifyLayouts: { [key in Layouts]: Layout[] } = {
    lg: spotifyLargeLayout,
    md: spotifyLargeLayout,
    sm: [
        { i: 'spotify-1', x: 0, y: 0, w: 2, h: 1 },
        { i: 'spotify-2', x: 0, y: 1, w: 1, h: 1 },
        { i: 'spotify-3', x: 1, y: 1, w: 1, h: 2 },
        { i: 'spotify-4', x: 0, y: 2, w: 1, h: 1 },
        { i: 'spotify-5', x: 0, y: 3, w: 2, h: 1 },
    ],
};