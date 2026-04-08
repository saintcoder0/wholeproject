/* ═══════════════════════════════════════════════════════
   OJAS — foodDb.ts
   Database of basic foods and their Ayurvedic doshic effects.
═══════════════════════════════════════════════════════ */

export interface FoodItem {
  name: string;
  vata: '+' | '-' | '0';
  pitta: '+' | '-' | '0';
  kapha: '+' | '-' | '0';
}

export const FOOD_DB: FoodItem[] = [
  // Fruits
  { name: "Apple (Raw)", vata: "+", pitta: "-", kapha: "-" },
  { name: "Apple (Cooked)", vata: "-", pitta: "-", kapha: "-" },
  { name: "Avocado", vata: "-", pitta: "-", kapha: "+" },
  { name: "Banana", vata: "-", pitta: "-", kapha: "+" },
  { name: "Berries", vata: "-", pitta: "-", kapha: "-" },
  { name: "Coconut", vata: "-", pitta: "-", kapha: "+" },
  { name: "Dates", vata: "-", pitta: "-", kapha: "+" },
  { name: "Grapes", vata: "-", pitta: "-", kapha: "+" },
  { name: "Lemon", vata: "-", pitta: "-", kapha: "-" },
  { name: "Mango", vata: "-", pitta: "-", kapha: "+" },
  { name: "Papaya", vata: "-", pitta: "-", kapha: "-" },
  { name: "Pomegranate", vata: "-", pitta: "-", kapha: "-" },
  
  // Vegetables
  { name: "Asparagus", vata: "-", pitta: "-", kapha: "-" },
  { name: "Beetroot (Cooked)", vata: "-", pitta: "+", kapha: "+" },
  { name: "Broccoli (Cooked)", vata: "-", pitta: "-", kapha: "-" },
  { name: "Carrot (Cooked)", vata: "-", pitta: "-", kapha: "-" },
  { name: "Cucumber", vata: "+", pitta: "-", kapha: "-" },
  { name: "Garlic", vata: "-", pitta: "+", kapha: "-" },
  { name: "Onion (Cooked)", vata: "-", pitta: "-", kapha: "-" },
  { name: "Sweet Potato", vata: "-", pitta: "-", kapha: "+" },
  { name: "Spinach (Cooked)", vata: "-", pitta: "-", kapha: "+" },
  { name: "Zucchini", vata: "-", pitta: "-", kapha: "-" },
  
  // Grains
  { name: "Barley", vata: "+", pitta: "-", kapha: "-" },
  { name: "Oats (Cooked)", vata: "-", pitta: "-", kapha: "+" },
  { name: "Quinoa", vata: "-", pitta: "-", kapha: "-" },
  { name: "Rice (Basmati/White)", vata: "-", pitta: "-", kapha: "+" },
  { name: "Wheat", vata: "-", pitta: "-", kapha: "+" },

  // Spices
  { name: "Ginger (Fresh)", vata: "-", pitta: "-", kapha: "-" },
  { name: "Turmeric", vata: "-", pitta: "-", kapha: "-" },
  { name: "Ghee", vata: "-", pitta: "-", kapha: "-" },
  { name: "Honey", vata: "+", pitta: "+", kapha: "-" }
];
