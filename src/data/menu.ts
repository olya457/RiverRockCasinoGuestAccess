import {images} from '../assets';
import type {MenuCategoryKey, MenuItem} from '../types/app';

export const menuCategories: Array<{key: MenuCategoryKey; label: string; icon: string}> = [
  {key: 'signature', label: 'Signature Entrees', icon: '🥩'},
  {key: 'light', label: 'Fresh & Light', icon: '🥗'},
  {key: 'desserts', label: 'Desserts & Drinks', icon: '🍰'},
];

export const menuItems: MenuItem[] = [
  {
    id: 'grilled-ribeye-steak',
    category: 'signature',
    name: 'Grilled Ribeye Steak',
    description:
      'A premium hand-selected ribeye steak grilled to your preferred doneness and served with roasted seasonal vegetables, herb butter, and a rich house-made sauce.',
    price: 42,
    prepTime: 30,
    image: images.food.ribeye,
  },
  {
    id: 'atlantic-salmon-fillet',
    category: 'signature',
    name: 'Atlantic Salmon Fillet',
    description:
      'Fresh Atlantic salmon lightly seasoned and grilled to perfection, accompanied by seasonal vegetables, lemon butter sauce, and a side of herb rice.',
    price: 34,
    prepTime: 25,
    image: images.food.salmon,
  },
  {
    id: 'chicken-supreme',
    category: 'signature',
    name: 'Chicken Supreme',
    description:
      'Tender chicken breast pan-seared until golden brown and served with creamy garlic sauce, buttery mashed potatoes, and fresh vegetables.',
    price: 28,
    prepTime: 22,
    image: images.food.chicken,
  },
  {
    id: 'truffle-mushroom-pasta',
    category: 'signature',
    name: 'Truffle Mushroom Pasta',
    description:
      'Fresh fettuccine pasta tossed with sauteed mushrooms, parmesan cheese, and a creamy truffle sauce that delivers a rich and elegant flavor.',
    price: 26,
    prepTime: 20,
    image: images.food.pasta,
  },
  {
    id: 'braised-beef-short-ribs',
    category: 'signature',
    name: 'Braised Beef Short Ribs',
    description:
      'Slow-cooked beef short ribs prepared for hours until perfectly tender, served with smooth potato puree and a savory red wine reduction.',
    price: 38,
    prepTime: 35,
    image: images.food.ribs,
  },
  {
    id: 'pacific-poke-bowl',
    category: 'light',
    name: 'Pacific Poke Bowl',
    description:
      'Fresh tuna served over seasoned rice with avocado, cucumber, edamame, carrots, and sesame dressing for a refreshing and balanced meal.',
    price: 22,
    prepTime: 15,
    image: images.food.poke,
  },
  {
    id: 'caesar-salad-deluxe',
    category: 'light',
    name: 'Caesar Salad Deluxe',
    description:
      'Crisp romaine lettuce tossed with creamy Caesar dressing, parmesan cheese, crunchy croutons, and slices of grilled chicken breast.',
    price: 18,
    prepTime: 12,
    image: images.food.caesar,
  },
  {
    id: 'mediterranean-bowl',
    category: 'light',
    name: 'Mediterranean Bowl',
    description:
      'A healthy combination of quinoa, roasted vegetables, feta cheese, olives, chickpeas, and a light herb vinaigrette dressing.',
    price: 20,
    prepTime: 15,
    image: images.food.mediterranean,
  },
  {
    id: 'shrimp-avocado-salad',
    category: 'light',
    name: 'Shrimp Avocado Salad',
    description:
      'Juicy shrimp paired with ripe avocado, mixed greens, cherry tomatoes, and citrus vinaigrette for a fresh and flavorful experience.',
    price: 24,
    prepTime: 14,
    image: images.food.shrimp,
  },
  {
    id: 'smoked-salmon-plate',
    category: 'light',
    name: 'Smoked Salmon Plate',
    description:
      'Premium smoked salmon served with cream cheese, capers, red onions, fresh greens, and artisan bread slices.',
    price: 23,
    prepTime: 10,
    image: images.food.smokedSalmon,
  },
  {
    id: 'new-york-cheesecake',
    category: 'desserts',
    name: 'New York Cheesecake',
    description:
      'A rich and creamy New York-style cheesecake topped with berry sauce and finished with fresh seasonal berries.',
    price: 12,
    prepTime: 8,
    image: images.food.cheesecake,
  },
  {
    id: 'chocolate-lava-cake',
    category: 'desserts',
    name: 'Chocolate Lava Cake',
    description:
      'Warm chocolate cake with a molten chocolate center, served alongside vanilla ice cream and chocolate drizzle.',
    price: 14,
    prepTime: 12,
    image: images.food.lavaCake,
  },
  {
    id: 'seasonal-fruit-platter',
    category: 'desserts',
    name: 'Seasonal Fruit Platter',
    description:
      'A colorful assortment of freshly sliced seasonal fruits carefully selected each day for maximum freshness and flavor.',
    price: 11,
    prepTime: 7,
    image: images.food.fruit,
  },
  {
    id: 'signature-cappuccino',
    category: 'desserts',
    name: 'Signature Cappuccino',
    description:
      'Freshly brewed premium espresso blended with steamed milk and topped with smooth, velvety foam.',
    price: 6,
    prepTime: 5,
    image: images.food.cappuccino,
  },
  {
    id: 'tropical-smoothie',
    category: 'desserts',
    name: 'Tropical Smoothie',
    description:
      'A refreshing blend of mango, pineapple, banana, and orange juice, served chilled and prepared fresh to order.',
    price: 8,
    prepTime: 6,
    image: images.food.smoothie,
  },
];
