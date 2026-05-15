export interface CategoryItem {
  id: string
  label: string
  emoji: string
  sound?: string
  color: string
}

export interface Category {
  id: string
  name: string
  emoji: string
  color: string
  comingSoon: boolean
  items: CategoryItem[]
}

export const CATEGORIES: Category[] = [
  {
    id: 'animals',
    name: 'Animals',
    emoji: '🦁',
    color: '#FF9F43',
    comingSoon: true,
    items: [
      { id: 'lion', label: 'Lion', emoji: '🦁', color: '#FF9F43' },
      { id: 'tiger', label: 'Tiger', emoji: '🐯', color: '#FF6B6B' },
      { id: 'elephant', label: 'Elephant', emoji: '🐘', color: '#A0AEC0' },
      { id: 'giraffe', label: 'Giraffe', emoji: '🦒', color: '#FECA57' },
      { id: 'penguin', label: 'Penguin', emoji: '🐧', color: '#4D96FF' },
      { id: 'monkey', label: 'Monkey', emoji: '🐒', color: '#8B5E3C' },
      { id: 'panda', label: 'Panda', emoji: '🐼', color: '#333' },
      { id: 'rabbit', label: 'Rabbit', emoji: '🐰', color: '#FF6BB5' },
      { id: 'frog', label: 'Frog', emoji: '🐸', color: '#6BCB77' },
      { id: 'owl', label: 'Owl', emoji: '🦉', color: '#8B4513' },
      { id: 'dolphin', label: 'Dolphin', emoji: '🐬', color: '#4ECDC4' },
      { id: 'horse', label: 'Horse', emoji: '🐴', color: '#A0522D' },
      { id: 'bear', label: 'Bear', emoji: '🐻', color: '#8B4513' },
      { id: 'cat', label: 'Cat', emoji: '🐱', color: '#FF9F43' },
      { id: 'dog', label: 'Dog', emoji: '🐶', color: '#D4A76A' },
      { id: 'chicken', label: 'Chicken', emoji: '🐔', color: '#FECA57' },
      { id: 'parrot', label: 'Parrot', emoji: '🦜', color: '#6BCB77' },
      { id: 'snake', label: 'Snake', emoji: '🐍', color: '#6BCB77' },
      { id: 'turtle', label: 'Turtle', emoji: '🐢', color: '#4ECDC4' },
      { id: 'butterfly', label: 'Butterfly', emoji: '🦋', color: '#A855F7' },
    ],
  },
  {
    id: 'vehicles',
    name: 'Vehicles',
    emoji: '🚗',
    color: '#4D96FF',
    comingSoon: true,
    items: [
      { id: 'car', label: 'Car', emoji: '🚗', color: '#FF6B6B' },
      { id: 'bus', label: 'Bus', emoji: '🚌', color: '#FECA57' },
      { id: 'train', label: 'Train', emoji: '🚂', color: '#4D96FF' },
      { id: 'airplane', label: 'Airplane', emoji: '✈️', color: '#A0AEC0' },
      { id: 'boat', label: 'Boat', emoji: '⛵', color: '#4ECDC4' },
      { id: 'helicopter', label: 'Helicopter', emoji: '🚁', color: '#6BCB77' },
      { id: 'bicycle', label: 'Bicycle', emoji: '🚲', color: '#FF9F43' },
      { id: 'rocket', label: 'Rocket', emoji: '🚀', color: '#A855F7' },
      { id: 'firetruck', label: 'Fire Truck', emoji: '🚒', color: '#FF6B6B' },
      { id: 'ambulance', label: 'Ambulance', emoji: '🚑', color: '#FF6BB5' },
      { id: 'tractor', label: 'Tractor', emoji: '🚜', color: '#6BCB77' },
      { id: 'motorcycle', label: 'Motorcycle', emoji: '🏍️', color: '#333' },
      { id: 'taxi', label: 'Taxi', emoji: '🚕', color: '#FECA57' },
      { id: 'policecar', label: 'Police Car', emoji: '🚓', color: '#4D96FF' },
      { id: 'scooter', label: 'Scooter', emoji: '🛵', color: '#FF9F43' },
    ],
  },
  {
    id: 'food',
    name: 'Food',
    emoji: '🍕',
    color: '#FF6B6B',
    comingSoon: true,
    items: [
      { id: 'apple', label: 'Apple', emoji: '🍎', color: '#FF6B6B' },
      { id: 'pizza', label: 'Pizza', emoji: '🍕', color: '#FF9F43' },
      { id: 'icecream', label: 'Ice Cream', emoji: '🍦', color: '#FF6BB5' },
      { id: 'cake', label: 'Cake', emoji: '🎂', color: '#A855F7' },
      { id: 'banana', label: 'Banana', emoji: '🍌', color: '#FECA57' },
      { id: 'watermelon', label: 'Watermelon', emoji: '🍉', color: '#6BCB77' },
      { id: 'grapes', label: 'Grapes', emoji: '🍇', color: '#A855F7' },
      { id: 'strawberry', label: 'Strawberry', emoji: '🍓', color: '#FF6B6B' },
      { id: 'cookie', label: 'Cookie', emoji: '🍪', color: '#D4A76A' },
      { id: 'donut', label: 'Donut', emoji: '🍩', color: '#FF6BB5' },
      { id: 'orange', label: 'Orange', emoji: '🍊', color: '#FF9F43' },
      { id: 'cherry', label: 'Cherry', emoji: '🍒', color: '#FF6B6B' },
      { id: 'bread', label: 'Bread', emoji: '🍞', color: '#D4A76A' },
      { id: 'cupcake', label: 'Cupcake', emoji: '🧁', color: '#FF6BB5' },
      { id: 'broccoli', label: 'Broccoli', emoji: '🥦', color: '#6BCB77' },
      { id: 'corn', label: 'Corn', emoji: '🌽', color: '#FECA57' },
      { id: 'carrot', label: 'Carrot', emoji: '🥕', color: '#FF9F43' },
      { id: 'taco', label: 'Taco', emoji: '🌮', color: '#FF9F43' },
      { id: 'lollipop', label: 'Lollipop', emoji: '🍭', color: '#A855F7' },
      { id: 'pancakes', label: 'Pancakes', emoji: '🥞', color: '#D4A76A' },
    ],
  },
  {
    id: 'nature',
    name: 'Nature',
    emoji: '🌈',
    color: '#6BCB77',
    comingSoon: true,
    items: [
      { id: 'sun', label: 'Sun', emoji: '☀️', color: '#FECA57' },
      { id: 'moon', label: 'Moon', emoji: '🌙', color: '#A0AEC0' },
      { id: 'star', label: 'Star', emoji: '⭐', color: '#FECA57' },
      { id: 'rainbow', label: 'Rainbow', emoji: '🌈', color: '#FF6B6B' },
      { id: 'cloud', label: 'Cloud', emoji: '☁️', color: '#E2E8F0' },
      { id: 'flower', label: 'Flower', emoji: '🌸', color: '#FF6BB5' },
      { id: 'tree', label: 'Tree', emoji: '🌳', color: '#6BCB77' },
      { id: 'mountain', label: 'Mountain', emoji: '⛰️', color: '#8B4513' },
      { id: 'snowflake', label: 'Snowflake', emoji: '❄️', color: '#4ECDC4' },
      { id: 'rain', label: 'Rain', emoji: '🌧️', color: '#4D96FF' },
      { id: 'leaf', label: 'Leaf', emoji: '🍃', color: '#6BCB77' },
      { id: 'mushroom', label: 'Mushroom', emoji: '🍄', color: '#FF6B6B' },
      { id: 'cactus', label: 'Cactus', emoji: '🌵', color: '#6BCB77' },
      { id: 'volcano', label: 'Volcano', emoji: '🌋', color: '#FF6B6B' },
      { id: 'tornado', label: 'Tornado', emoji: '🌪️', color: '#A0AEC0' },
    ],
  },
  {
    id: 'ocean',
    name: 'Ocean',
    emoji: '🐠',
    color: '#4ECDC4',
    comingSoon: true,
    items: [
      { id: 'fish', label: 'Fish', emoji: '🐟', color: '#4D96FF' },
      { id: 'whale', label: 'Whale', emoji: '🐋', color: '#4D96FF' },
      { id: 'octopus', label: 'Octopus', emoji: '🐙', color: '#A855F7' },
      { id: 'crab', label: 'Crab', emoji: '🦀', color: '#FF6B6B' },
      { id: 'dolphin', label: 'Dolphin', emoji: '🐬', color: '#4ECDC4' },
      { id: 'shark', label: 'Shark', emoji: '🦈', color: '#A0AEC0' },
      { id: 'turtle', label: 'Turtle', emoji: '🐢', color: '#6BCB77' },
      { id: 'starfish', label: 'Starfish', emoji: '⭐', color: '#FF9F43' },
      { id: 'seahorse', label: 'Seahorse', emoji: '🦑', color: '#FF6BB5' },
      { id: 'jellyfish', label: 'Jellyfish', emoji: '🪼', color: '#A855F7' },
      { id: 'lobster', label: 'Lobster', emoji: '🦞', color: '#FF6B6B' },
      { id: 'shrimp', label: 'Shrimp', emoji: '🦐', color: '#FF9F43' },
      { id: 'coral', label: 'Coral', emoji: '🪸', color: '#FF6BB5' },
      { id: 'shell', label: 'Shell', emoji: '🐚', color: '#FECA57' },
      { id: 'anchor', label: 'Anchor', emoji: '⚓', color: '#333' },
    ],
  },
]
