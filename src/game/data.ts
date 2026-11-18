import type { BusType, RouteType, AchievementType, PrestigeTrack, QuizQuestion } from './types';

export const BUS_TYPES: BusType[] = [
  { id: 'minibus', name: 'Minibus', desc: 'Your first bus. Small but eager.', city: 'London', unlockCost: 0, baseFare: 1, baseCapacity: 4, baseSpeed: 0.35, basePopularity: 4, baseLoadTime: 5, color: 'bg-royal-500', roofColor: 'bg-royal-600', seatColor: 'bg-gold-300', length: 70, height: 40, icon: 'Bus' },
  { id: 'citybus', name: 'City Bus', desc: 'Standard transit. More seats, steady fares.', city: 'Manchester', unlockCost: 500, baseFare: 3, baseCapacity: 8, baseSpeed: 0.3, basePopularity: 6, baseLoadTime: 6, color: 'bg-royal-600', roofColor: 'bg-royal-700', seatColor: 'bg-gold-300', length: 90, height: 46, icon: 'Bus' },
  { id: 'coach', name: 'Intercity Coach', desc: 'Long-distance comfort. Premium fares.', city: 'Birmingham', unlockCost: 8000, baseFare: 8, baseCapacity: 12, baseSpeed: 0.28, basePopularity: 8, baseLoadTime: 7, color: 'bg-emerald-600', roofColor: 'bg-emerald-700', seatColor: 'bg-white', length: 100, height: 46, icon: 'Bus' },
  { id: 'doubledecker', name: 'Double-Decker', desc: 'Two floors of passengers. Big earner.', city: 'Edinburgh', unlockCost: 120000, baseFare: 20, baseCapacity: 16, baseSpeed: 0.25, basePopularity: 10, baseLoadTime: 8, color: 'bg-gold-500', roofColor: 'bg-gold-600', seatColor: 'bg-royal-700', length: 95, height: 58, icon: 'Bus' },
  { id: 'articulated', name: 'Articulated Bus', desc: 'Bendy bus, massive capacity.', city: 'Glasgow', unlockCost: 2000000, baseFare: 50, baseCapacity: 22, baseSpeed: 0.22, basePopularity: 14, baseLoadTime: 9, color: 'bg-teal-600', roofColor: 'bg-teal-700', seatColor: 'bg-gold-200', length: 120, height: 48, icon: 'Truck' },
  { id: 'electric', name: 'Electric Bus', desc: 'Eco-friendly. Fast and popular.', city: 'Bristol', unlockCost: 35000000, baseFare: 130, baseCapacity: 28, baseSpeed: 0.3, basePopularity: 18, baseLoadTime: 8, color: 'bg-cyan-600', roofColor: 'bg-cyan-700', seatColor: 'bg-white', length: 100, height: 48, icon: 'Zap' },
  { id: 'hybrid', name: 'Hybrid Bus', desc: 'Best of both worlds. High fares.', city: 'Liverpool', unlockCost: 600000000, baseFare: 350, baseCapacity: 35, baseSpeed: 0.28, basePopularity: 22, baseLoadTime: 9, color: 'bg-violet-600', roofColor: 'bg-violet-700', seatColor: 'bg-gold-200', length: 105, height: 50, icon: 'Leaf' },
  { id: 'autonomous', name: 'Autonomous Fleet', desc: 'Self-driving. Ultimate capacity.', city: 'Leeds', unlockCost: 12000000000, baseFare: 1000, baseCapacity: 45, baseSpeed: 0.32, basePopularity: 30, baseLoadTime: 10, color: 'bg-fuchsia-600', roofColor: 'bg-fuchsia-700', seatColor: 'bg-white', length: 110, height: 52, icon: 'Bot' },
];

export const ROUTE_TYPES: RouteType[] = [
  { id: 'r1', name: 'Downtown Loop', city: 'Springfield', desc: 'Your starting route.', cost: 0, earningsMul: 1, unlockAt: 0, icon: 'MapPin', color: 'bg-royal-500' },
  { id: 'r2', name: 'Harbor Line', city: 'Port Bay', desc: '+25% all fares.', cost: 2000, earningsMul: 1.25, unlockAt: 1500, icon: 'Anchor', color: 'bg-royal-600' },
  { id: 'r3', name: 'University Route', city: 'College Town', desc: '+30% all fares.', cost: 40000, earningsMul: 1.3, unlockAt: 30000, icon: 'GraduationCap', color: 'bg-emerald-600' },
  { id: 'r4', name: 'Airport Express', city: 'Sky City', desc: '+40% all fares.', cost: 800000, earningsMul: 1.4, unlockAt: 600000, icon: 'Plane', color: 'bg-gold-500' },
  { id: 'r5', name: 'Mountain Pass', city: 'Pine Ridge', desc: '+50% all fares.', cost: 20000000, earningsMul: 1.5, unlockAt: 15000000, icon: 'Mountain', color: 'bg-teal-600' },
  { id: 'r6', name: 'Cross-Country', city: 'Capital', desc: '+75% all fares.', cost: 600000000, earningsMul: 1.75, unlockAt: 500000000, icon: 'Route', color: 'bg-cyan-600' },
  { id: 'r7', name: 'Maglev Link', city: 'Neo Tokyo', desc: '×2 all fares.', cost: 25000000000, earningsMul: 2, unlockAt: 18000000000, icon: 'Rocket', color: 'bg-fuchsia-600' },
];

export const PRESTIGE_TRACKS: PrestigeTrack[] = [
  { id: 'p_fare', name: 'Fare Optimization', desc: '+10% all fares per level.', icon: 'Ticket', value: 0.1, maxLevel: 50 },
  { id: 'p_speed', name: 'Fleet Tuning', desc: '+5% bus speed per level.', icon: 'Gauge', value: 0.05, maxLevel: 30 },
  { id: 'p_popular', name: 'Brand Power', desc: '+15% passenger popularity per level.', icon: 'Star', value: 0.15, maxLevel: 30 },
  { id: 'p_cost', name: 'Economies of Scale', desc: '-4% upgrade costs per level.', icon: 'TrendingDown', value: 0.04, maxLevel: 20 },
  { id: 'p_offline', name: 'Depot Automation', desc: '+25% offline earnings per level.', icon: 'Moon', value: 0.25, maxLevel: 20 },
];

export const ACHIEVEMENTS: AchievementType[] = [
  { id: 'first_trip', name: 'First Departure', desc: 'Complete your first bus trip.', icon: 'MousePointerClick', check: (c) => c.totalTrips >= 1 },
  { id: 'trips_50', name: 'Getting Busy', desc: 'Complete 50 trips.', icon: 'Bus', check: (c) => c.totalTrips >= 50 },
  { id: 'trips_500', name: 'Veteran Driver', desc: 'Complete 500 trips.', icon: 'BusFront', check: (c) => c.totalTrips >= 500 },
  { id: 'money_1k', name: 'Small Change', desc: 'Earn $1,000 total.', icon: 'Coins', check: (c) => c.totalEarned >= 1000 },
  { id: 'money_1m', name: 'Millionaire', desc: 'Earn $1M total.', icon: 'Banknote', check: (c) => c.totalEarned >= 1000000 },
  { id: 'money_1b', name: 'Billionaire', desc: 'Earn $1B total.', icon: 'Gem', check: (c) => c.totalEarned >= 1000000000 },
  { id: 'money_1t', name: 'Trillionaire', desc: 'Earn $1T total.', icon: 'Crown', check: (c) => c.totalEarned >= 1000000000000 },
  { id: 'fleet_3', name: 'Growing Fleet', desc: 'Own 3 bus types.', icon: 'Bus', check: (c) => c.busesOwned >= 3 },
  { id: 'fleet_all', name: 'Full Garage', desc: 'Own all bus types.', icon: 'Train', check: (c) => c.busesOwned >= 8 },
  { id: 'routes_3', name: 'Connected', desc: 'Unlock 3 routes.', icon: 'Map', check: (c) => c.routesOwned >= 3 },
  { id: 'routes_all', name: 'Global Network', desc: 'Unlock all routes.', icon: 'Globe', check: (c) => c.routesOwned >= 7 },
  { id: 'prestige_1', name: 'Reborn', desc: 'Prestige for the first time.', icon: 'Sparkles', check: (c) => c.prestigeCount >= 1 },
  { id: 'prestige_5', name: 'Seasoned', desc: 'Prestige 5 times.', icon: 'Medal', check: (c) => c.prestigeCount >= 5 },
  { id: 'quiz_10', name: 'Quiz Whiz', desc: 'Answer 10 quiz questions correctly.', icon: 'Brain', check: (c) => c.quizCorrect >= 10 },
  { id: 'stars_3', name: 'First Star Depot', desc: 'Earn 3 stars on any depot.', icon: 'Star', check: (c) => c.totalStars >= 3 },
  { id: 'stars_all', name: 'All-Star Fleet', desc: 'Get 3 stars on every depot.', icon: 'Crown', check: (c) => c.totalStars >= 24 },
  { id: 'playtime_1h', name: 'Dedicated', desc: 'Play for 1 hour.', icon: 'Clock', check: (c) => c.playTime >= 3600 },
];

export const SAVE_KEY = 'idle-bus-empire-v3';
export const TICK_MS = 50;
export const AUTO_SAVE_MS = 8000;
export const OFFLINE_CAP_SECONDS = 60 * 60 * 8;
export const QUIZ_COOLDOWN = 30;

export function upgradeCost(busIndex: number, baseFare: number, level: number): number {
  const tierMul = Math.pow(2.5, busIndex);
  const base = baseFare * 8 * tierMul;
  return Math.floor(base * Math.pow(1.6, level));
}

export function autoDispatchCost(busIndex: number, baseFare: number): number {
  const tierMul = Math.pow(3, busIndex);
  return Math.floor(baseFare * 50 * tierMul);
}

export function starCost(busIndex: number, baseFare: number, currentStars: number): number {
  const tierMul = Math.pow(5, busIndex);
  const base = baseFare * 500 * tierMul;
  return Math.floor(base * Math.pow(8, currentStars));
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  { id: 'q1', category: 'Bus History', question: 'What was the first motorized bus powered by?', options: ['Steam', 'Electricity', 'Diesel', 'Horse'], answer: 1 },
  { id: 'q2', category: 'Bus History', question: 'In which decade did the first double-decker buses appear in London?', options: ['1850s', '1890s', '1920s', '1950s'], answer: 1 },
  { id: 'q3', category: 'Bus History', question: 'What does "omnibus" literally mean?', options: ['For everyone', 'Many wheels', 'Long road', 'Public transport'], answer: 0 },
  { id: 'q4', category: 'Bus History', question: 'Which city introduced the first horse-drawn omnibus in 1662?', options: ['London', 'Paris', 'Rome', 'Berlin'], answer: 1 },
  { id: 'q5', category: 'Bus History', question: 'What color are London buses famously?', options: ['Green', 'Blue', 'Red', 'Yellow'], answer: 2 },
  { id: 'q6', category: 'Bus History', question: 'The Routemaster double-decker was introduced in which year?', options: ['1948', '1956', '1968', '1975'], answer: 1 },
  { id: 'q7', category: 'Bus History', question: 'What does an articulated bus have that a regular bus does not?', options: ['Two engines', 'A flexible middle section', 'Double wheels', 'A trailer'], answer: 1 },
  { id: 'q8', category: 'Bus History', question: 'Which country pioneered bus rapid transit (BRT) systems in the 1970s?', options: ['Brazil', 'UK', 'USA', 'Germany'], answer: 0 },
  { id: 'q9', category: 'Bus History', question: 'What fuel did early 20th century buses commonly use before diesel?', options: ['Petrol', 'Coal gas', 'Steam', 'All of these'], answer: 3 },
  { id: 'q10', category: 'Bus History', question: 'The "Bendy Bus" is a nickname for what type of bus?', options: ['Double-decker', 'Articulated bus', 'Minibus', 'Coach'], answer: 1 },
  { id: 'q11', category: 'London', question: 'What is the name of London\'s famous clock tower near buses?', options: ['Big Ben', 'The Shard', 'The Gherkin', 'The Eye'], answer: 0 },
  { id: 'q12', category: 'London', question: 'Which London bus route is one of the oldest, running since 1911?', options: ['Route 11', 'Route 1', 'Route 25', 'Route 15'], answer: 0 },
  { id: 'q13', category: 'Manchester', question: 'Manchester is known as the birthplace of which transport system?', options: ['The railway', 'The canal', 'The tram', 'The motorway'], answer: 0 },
  { id: 'q14', category: 'Manchester', question: 'What is Manchester\'s famous football stadium?', options: ['Anfield', 'Old Trafford', 'Stamford Bridge', 'Emirates'], answer: 1 },
  { id: 'q15', category: 'Birmingham', question: 'Birmingham is Britain\'s second-largest city. What is it famous for?', options: ['Shipbuilding', 'Canals and manufacturing', 'Fishing', 'Wine'], answer: 1 },
  { id: 'q16', category: 'Edinburgh', question: 'What annual event is Edinburgh famous for?', options: ['The Olympics', 'The Fringe Festival', 'Carnival', 'Oktoberfest'], answer: 1 },
  { id: 'q17', category: 'Glasgow', question: 'Glasgow\'s name comes from Gaelic meaning what?', options: ['Dear green place', 'Great river', 'Cold hill', 'Old fort'], answer: 0 },
  { id: 'q18', category: 'Bristol', question: 'Bristol is famous for which engineering achievement?', options: ['The Concorde', 'The Tube', 'The Chunnel', 'The Spitfire'], answer: 0 },
  { id: 'q19', category: 'Liverpool', question: 'Which world-famous band came from Liverpool?', options: ['The Rolling Stones', 'The Beatles', 'Queen', 'Oasis'], answer: 1 },
  { id: 'q20', category: 'Leeds', question: 'Leeds is a major city in which English region?', options: ['The South West', 'Yorkshire', 'The Lake District', 'Cornwall'], answer: 1 },
  { id: 'q21', category: 'Bus History', question: 'What does "BRT" stand for in public transport?', options: ['Bus Rapid Transit', 'Big Red Truck', 'British Road Train', 'Bus Route Terminal'], answer: 0 },
  { id: 'q22', category: 'London', question: 'How many zones does the London transport network have?', options: ['3', '6', '9', '12'], answer: 1 },
  { id: 'q23', category: 'Bus History', question: 'Who is credited with running the first regular bus service in 1824?', options: ['George Shillibeer', 'Thomas Telford', 'Isambard Brunel', 'Henry Royce'], answer: 0 },
  { id: 'q24', category: 'Manchester', question: 'Manchester\'s Metrolink is what type of transport?', options: ['Underground', 'Tram network', 'Bus lane', 'Monorail'], answer: 1 },
  { id: 'q25', category: 'Liverpool', question: 'Liverpool is a major port on which body of water?', options: ['The North Sea', 'The Irish Sea', 'The Channel', 'The Atlantic'], answer: 1 },
];
