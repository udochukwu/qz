import {
  Book,
  Scale,
  Umbrella,
  HeartPulse,
  Calculator,
  Laptop,
  Globe,
  MessageCircle,
  Palette,
  Landmark,
  TrendingUp,
  Settings,
  Drama,
  Dumbbell,
  ChefHat,
  Sprout,
  Camera,
  Wrench,
  Star,
  FlaskRound,
  PersonStanding,
} from 'lucide-react';
// 📚 - Literature or any reading-intensive class
// 🧪 - Science classes, such as Chemistry or Biology
// 🔢 - Mathematics, Statistics, or any class involving numbers
// 💻 - Computer Science, Information Technology, or any tech-related class
// 🌍 - Geography, Earth Sciences, or Environmental Studies
// 🗣️ - Language classes or courses focusing on public speaking and communication
// 🎨 - Arts, including Fine Arts, Design, and Music
// 🏛️ - History or any class focused on ancient civilizations or cultures
// 📈 - Economics, Business Studies, or any class dealing with finance and markets
// ⚖️ - Law, Ethics, or any course dealing with legal studies
// 🧘 - Psychology, Sociology, or any class related to mental health and well-being
// 🏥 - Health Sciences, Nursing, or Medical-related courses
// ⚙️ - Engineering, Physics, or any class that involves mechanics or construction
// 🎭 - Theater, Drama, or any performing arts course
// 🏋️‍♂️ - Physical Education, Sports Science, or any fitness-related class
// 🍳 - Culinary Arts, Nutrition, or any food-related course
// 🌱 - Agriculture, Botany, or any class focused on plants and gardening
// 📸 - Photography, Film Studies, or any class related to visual media
// 🛠️ - Workshop, Carpentry, or any hands-on skill-based class
// 🌟 - Favorite class or a class where you expect to excel

export const emojis = [
  '📚',
  '🧪',
  '🔢',
  '💻',
  '🌍',
  '🗣️',
  '🎨',
  '🏛️',
  '📈',
  '⚖️',
  '🧘',
  '🏥',
  '⚙️',
  '🎭',
  '🏋️‍♂️',
  '🍳',
  '🌱',
  '📸',
  '🛠️',
  '🌟',
] as const;

export type Emoji = (typeof emojis)[number];

export const emojiToLucideIconMap = {
  '📚': Book,
  '🧪': FlaskRound,
  '🔢': Calculator,
  '💻': Laptop,
  '🌍': Globe,
  '🗣️': MessageCircle,
  '🎨': Palette,
  '🏛️': Landmark,
  '📈': TrendingUp,
  '⚖️': Scale,
  '🧘': PersonStanding,
  '🏥': HeartPulse,
  '⚙️': Settings,
  '🎭': Drama,
  '🏋️‍♂️': Dumbbell,
  '🍳': ChefHat,
  '🌱': Sprout,
  '📸': Camera,
  '🛠️': Wrench,
  '🌟': Star,
} as const;
