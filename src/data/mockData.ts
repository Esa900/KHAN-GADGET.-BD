import { Product, Voucher, Order } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'kg-prod-1',
    title: 'Anker 65W GaN 3-Port Fast Charger (2C+1A) PowerIQ 3.0 for iPhone & Android',
    category: 'Chargers & Cables',
    brand: 'Anker',
    price: 4999,
    originalPrice: 7500,
    stock: 24,
    rating: 4.9,
    reviewCount: 384,
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'High-speed GaN III technology powers MacBook, iPad, iPhone 16/15 Pro Max, and Samsung S24 Ultra at up to 65W max. Foldable plug with active temperature shield.',
    specs: {
      'Total Output': '65W Max',
      'Port Layout': '2x USB-C, 1x USB-A',
      'Technology': 'GaN III & PowerIQ 3.0',
      'Safety': 'ActiveShield 2.0 Dynamic Temp Sensor',
      'Warranty': '18 Months Official Warranty'
    },
    isFlashSale: true,
    isDarazMall: true,
    freeDelivery: true,
    variants: [
      { name: 'Color', options: ['Matte Black', 'Glacier White'] }
    ],
    reviews: [
      {
        id: 'r1',
        author: 'Hamza Tariq',
        rating: 5,
        date: '2025-02-18',
        comment: 'Super fast charging for my S24 Ultra. Does not heat up at all. 100% genuine Anker from Khan Gadget!',
        verified: true
      },
      {
        id: 'r2',
        author: 'Nusrat Jahan',
        rating: 5,
        date: '2025-02-10',
        comment: 'Original product with warranty card. Delivered in 2 days in Dhaka. Extremely satisfied.',
        verified: true
      }
    ]
  },
  {
    id: 'kg-prod-2',
    title: 'Baseus Blade 100W 20000mAh Ultra-Thin Laptop & Phone Power Bank with Digital Display',
    category: 'Power Banks',
    brand: 'Baseus',
    price: 9800,
    originalPrice: 13500,
    stock: 18,
    rating: 4.8,
    reviewCount: 219,
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'World-renowned ultra slim 18mm laptop-grade powerbank with dual Type-C ports supporting bidirectional 100W PD charging and precise battery status LED screen.',
    specs: {
      'Capacity': '20,000mAh / 74Wh',
      'Max Output': '100W Power Delivery',
      'Display': 'Real-time Wattage & Battery Percentage',
      'Thickness': '18mm Ultra-Slim Profile',
      'Warranty': '1 Year Replacement'
    },
    isFlashSale: true,
    isDarazMall: true,
    freeDelivery: true,
    variants: [
      { name: 'Color', options: ['Carbon Black', 'Space Gray'] }
    ],
    reviews: [
      {
        id: 'r3',
        author: 'Usman Ali',
        rating: 5,
        date: '2025-01-25',
        comment: 'Charges my Dell XPS and iPhone simultaneously. The digital wattage readout is awesome.',
        verified: true
      }
    ]
  },
  {
    id: 'kg-prod-3',
    title: 'Soundcore Space A40 Active Noise Cancelling TWS Earbuds (50H Playtime, Hi-Res Audio)',
    category: 'Audio & Earbuds',
    brand: 'Anker',
    price: 12500,
    originalPrice: 16999,
    stock: 12,
    rating: 4.9,
    reviewCount: 512,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Upgraded adaptive noise canceling reduces ambient noise by up to 98%. Wireless charging case with 50-hour ultra-long battery life and LDAC Hi-Res sound.',
    specs: {
      'Noise Canceling': 'Adaptive Active Noise Cancelling (ANC)',
      'Playtime': '10H single charge / 50H with case',
      'Audio Codec': 'LDAC, AAC, SBC Hi-Res Wireless',
      'Water Resistance': 'IPX4 Water-Resistant',
      'Warranty': '18 Months Official'
    },
    isFlashSale: true,
    isDarazMall: true,
    freeDelivery: true,
    variants: [
      { name: 'Color', options: ['Midnight Black', 'Pearl White', 'Navy Blue'] }
    ],
    reviews: [
      {
        id: 'r4',
        author: 'Zainab Bibi',
        rating: 5,
        date: '2025-02-14',
        comment: 'Best ANC earbuds in this price bracket. Noise cancellation blocks out metro noise easily.',
        verified: true
      }
    ]
  },
  {
    id: 'kg-prod-4',
    title: 'Khan Prime MagSafe Heavy-Duty Armor Magnetic Shockproof Case with Camera Kickstand',
    category: 'Cases & Covers',
    brand: 'Khan Prime',
    price: 1850,
    originalPrice: 2800,
    stock: 55,
    rating: 4.7,
    reviewCount: 142,
    image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80',
    description: 'Premium aerospace zinc-alloy camera ring kicks out for hands-free horizontal and vertical viewing. N52 strong magnets ensure snappy MagSafe lock on chargers & mounts.',
    specs: {
      'Compatibility': 'iPhone 16 Pro Max / 15 Pro Max / 14 / Galaxy S24',
      'Magnet Strength': '38x N52 Neodymium Magnets',
      'Drop Protection': 'Military Grade 12ft Drop Tested',
      'Stand Angle': '0 to 120 Degrees Multi-Angle'
    },
    isFlashSale: false,
    isDarazMall: false,
    freeDelivery: false,
    variants: [
      { name: 'Model', options: ['iPhone 16 Pro Max', 'iPhone 15 Pro Max', 'Galaxy S24 Ultra'] },
      { name: 'Finish', options: ['Frost Translucent Black', 'Titanium Silver', 'Deep Purple'] }
    ],
    reviews: [
      {
        id: 'r5',
        author: 'Bilal Khan',
        rating: 5,
        date: '2025-02-02',
        comment: 'The kickstand is solid metal and the magnetic hold is stronger than Apple original cases.',
        verified: true
      }
    ]
  },
  {
    id: 'kg-prod-5',
    title: 'Ugreen 100W Braided USB-C to USB-C 3.2 Gen 2 Cable (E-Marker Chip, 4K Display, 2M)',
    category: 'Chargers & Cables',
    brand: 'Ugreen',
    price: 1650,
    originalPrice: 2400,
    stock: 40,
    rating: 4.9,
    reviewCount: 680,
    image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80',
    description: 'Heavy duty high-density nylon braided cable rated for 25,000+ bends. Built-in E-Marker chip intelligently handles up to 100W (20V/5A) fast charge and 10Gbps data transfer.',
    specs: {
      'Power': '100W (20V/5A) Power Delivery',
      'Data Speed': '10Gbps SuperSpeed Transfer',
      'Length': '2 Meters (6.6 ft)',
      'Jacket': 'Double-Braided Military Grade Nylon',
      'Certification': 'USB-IF Certified'
    },
    isFlashSale: false,
    isDarazMall: true,
    freeDelivery: false,
    variants: [
      { name: 'Length', options: ['1 Meter', '2 Meters'] },
      { name: 'Color', options: ['Space Gray Braided', 'Silver Armor'] }
    ]
  },
  {
    id: 'kg-prod-6',
    title: 'Khan Shield 9D Full Cover Privacy Tempered Glass Screen Protector (Anti-Spy & Shatterproof)',
    category: 'Screen Protectors',
    brand: 'Khan Prime',
    price: 850,
    originalPrice: 1500,
    stock: 90,
    rating: 4.6,
    reviewCount: 310,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
    description: '28-degree narrow anti-peep viewing angle keeps sensitive banking, messages, and photos safe from side glances. Hydrophobic and oleophobic coating resists fingerprints.',
    specs: {
      'Hardness': '9H Sapphire Hardness',
      'Privacy Angle': '28-Degree True Anti-Spy',
      'Edge': '2.5D Curved Edge Polish',
      'Oleophobic Coating': 'Nano Fingerprint Oil Repellent'
    },
    isFlashSale: true,
    isDarazMall: false,
    freeDelivery: false,
    variants: [
      { name: 'Phone Model', options: ['iPhone 16 / 16 Pro', 'iPhone 15 / 15 Pro', 'Samsung S24 Ultra', 'Redmi Note 13'] }
    ]
  },
  {
    id: 'kg-prod-7',
    title: 'Baseus 15W Qi Fast Wireless Car Mount Charger with Smart Infrared Sensor Auto-Clamping',
    category: 'Holders & Mounts',
    brand: 'Baseus',
    price: 3850,
    originalPrice: 5500,
    stock: 22,
    rating: 4.8,
    reviewCount: 175,
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
    description: 'Touch-sensitive motorized grips automatically lock when your phone approaches. 360-degree swivel ball joint with heavy-duty air vent clip and dashboard suction base.',
    specs: {
      'Charging Output': '15W / 10W / 7.5W Wireless Qi',
      'Sensor': 'Infrared Proximity & Touch Release Button',
      'Mounting': 'Air Vent Clip & Suction Arm Included',
      'Built-in Capacitor': 'Allows opening clamps even after car engine shuts off'
    },
    isFlashSale: false,
    isDarazMall: true,
    freeDelivery: true,
    variants: [
      { name: 'Mount Type', options: ['Air Vent + Suction Combo', 'MagSafe Magnetic Vent Only'] }
    ]
  },
  {
    id: 'kg-prod-8',
    title: 'Flydigi Apex 4 Wireless Mobile & PC Gaming Controller with Force-Feedback Hall Triggers',
    category: 'Gaming Accessories',
    brand: 'Khan Prime',
    price: 14500,
    originalPrice: 19999,
    stock: 8,
    rating: 5.0,
    reviewCount: 94,
    image: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=800&q=80',
    description: 'Flagship competitive mobile gaming controller with adjustable trigger tension, customizable screen, 1000Hz polling rate, and zero-drift Hall effect joysticks for PUBG & COD Mobile.',
    specs: {
      'Connection': 'Bluetooth 5.3, 2.4G Wireless Dongle & Wired Type-C',
      'Sticks': 'Hall Effect Magnetic Anti-Drift Joysticks',
      'Triggers': 'Adjustable Resistance Force Feedback',
      'Compatibility': 'Android, iOS (MFi), PC, Nintendo Switch',
      'Battery': '1500mAh (Up to 30 Hours Continuous)'
    },
    isFlashSale: true,
    isDarazMall: true,
    freeDelivery: true
  },
  {
    id: 'kg-prod-9',
    title: 'Titanium Milanese Magnetic Loop Strap for Apple Watch & Galaxy Watch Ultra',
    category: 'Smartwatches & Wearables',
    brand: 'Khan Prime',
    price: 1950,
    originalPrice: 3200,
    stock: 35,
    rating: 4.7,
    reviewCount: 168,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    description: 'Breathable stainless steel woven mesh with strong neodymium magnetic clasp. Infinitely adjustable for a feather-light, elegant fit on your wrist.',
    specs: {
      'Material': '316L Surgical Stainless Steel Mesh',
      'Clasp': 'Full Magnetic Loop Closure',
      'Sizes': '42/44/45/49mm Ultra & 38/40/41mm',
      'Skin Friendly': 'Hypoallergenic & Sweat-Resistant'
    },
    isFlashSale: false,
    isDarazMall: false,
    freeDelivery: false,
    variants: [
      { name: 'Color', options: ['Raw Titanium Gray', 'Starlight', 'Midnight Black', 'Champagne Gold'] }
    ]
  },
  {
    id: 'kg-prod-10',
    title: 'Remax 30000mAh 22.5W Fast Charging Power Bank with 4 Built-in Cables & Flashlight',
    category: 'Power Banks',
    brand: 'Remax',
    price: 5400,
    originalPrice: 7900,
    stock: 26,
    rating: 4.7,
    reviewCount: 420,
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
    description: 'All-in-one travel battery monster with built-in Type-C, Lightning, Micro-USB, and USB-A charging cables. Dual high-intensity emergency LED torch for load shedding and camping.',
    specs: {
      'Capacity': '30,000mAh High Density Li-Polymer',
      'Fast Charge': '22.5W Huawei SuperCharge / 20W PD Apple',
      'Integrated Cables': 'iPhone Lightning, Type-C, Micro, USB Input',
      'Torch': 'High Lumen Dual Emergency Flashlight'
    },
    isFlashSale: false,
    isDarazMall: true,
    freeDelivery: true,
    variants: [
      { name: 'Color', options: ['Tactical Black', 'Army Green'] }
    ]
  },
  {
    id: 'kg-prod-11',
    title: 'Memo Semiconductor Phone Cooler DL05 for Gaming (Digital Temperature Display RGB)',
    category: 'Gaming Accessories',
    brand: 'Khan Prime',
    price: 2450,
    originalPrice: 3800,
    stock: 45,
    rating: 4.8,
    reviewCount: 289,
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    description: 'Active thermoelectric Peltier cooling chip drops phone temperature by up to 25°C in seconds. Prevents frame drops in competitive games like PUBG, Genshin Impact, and Free Fire.',
    specs: {
      'Cooling Mechanism': 'Semiconductor Peltier Refrigeration',
      'Display': 'Real-time Backplate Temp (°C) Screen',
      'Lighting': 'Dynamic Gaming RGB Ring',
      'Clamp Range': '65mm to 85mm Wide Phones'
    },
    isFlashSale: true,
    isDarazMall: false,
    freeDelivery: false
  },
  {
    id: 'kg-prod-12',
    title: 'Samsung 45W Super Fast Charger 2.0 with 5A Type-C to Type-C Cable in Box',
    category: 'Chargers & Cables',
    brand: 'Samsung',
    price: 3600,
    originalPrice: 5200,
    stock: 30,
    rating: 4.9,
    reviewCount: 512,
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
    description: 'Original Samsung Super Fast Charging 2.0 (PPS 45W). Fully charges Galaxy S24 Ultra, S23 Ultra, and Note 20 series to 70% in only 30 minutes.',
    specs: {
      'Power Output': '45W Max PPS Super Fast Charge 2.0',
      'In The Box': '45W Adapter + 1.8M 5A E-Marker Type-C Cable',
      'Compatibility': 'Samsung Galaxy S-Series, Z-Fold, iPad Pro',
      'Warranty': '6 Months Replacement'
    },
    isFlashSale: false,
    isDarazMall: true,
    freeDelivery: true,
    variants: [
      { name: 'Pin Style', options: ['UK 3-Pin (Pak Standard)', 'EU 2-Pin Round'] }
    ]
  },
  // --- SCREENSHOT 1: Smartwatches ---
  {
    id: 'kg-watch-1',
    title: 'Smart Watch Plus Men Women Plus Full Touch Screen Hi-Fi Voice Calling',
    category: 'Smartwatches & Wearables',
    brand: 'Smart Watch Plus',
    price: 1111,
    originalPrice: 2650,
    stock: 55,
    rating: 4.8,
    reviewCount: 382,
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Smart Watch Plus with full metal casing, high-fidelity Bluetooth calling speaker and microphone. Features bright 1.95-inch full touch curved display, multi-sport workout tracking, heart rate, SpO2 monitor, and classic stainless steel strap.',
    specs: {
      'Display': '1.95" HD Full Touch Curved Screen',
      'Connectivity': 'Bluetooth 5.2 Hi-Fi Calling & Audio',
      'Health Tracking': 'Dynamic Heart Rate, SpO2, Sleep Monitor',
      'Battery Life': 'Up to 5-7 Days Standby (280mAh)',
      'Water Resistance': 'IP67 Splash & Dust Resistant',
      'Strap Material': 'Stainless Steel Metal Link Strap'
    },
    isFlashSale: true,
    isDarazMall: true,
    freeDelivery: false,
    variants: [
      { name: 'Color', options: ['Classic Black Steel', 'Silver Chrome Steel'] }
    ],
    reviews: [
      {
        id: 'w1-r1',
        author: 'Rakibul Islam',
        rating: 5,
        date: '2025-02-15',
        comment: 'Best budget smartwatch in Bangladesh! Calling sound is very loud and clear.',
        verified: true
      }
    ]
  },
  {
    id: 'kg-watch-2',
    title: 'LAXASFIT H9 Smart Watch Men Women Sports Fitness 1.96-inch HD Large Screen',
    category: 'Smartwatches & Wearables',
    brand: 'LAXASFIT',
    price: 1212,
    originalPrice: 2890,
    stock: 40,
    rating: 5.0,
    reviewCount: 190,
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1510017803434-a899398421b3?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'LAXASFIT H9 features an ultra-wide 1.96-inch HD vibrant color screen with rose-gold case and soft pastel silicone band. Equipped with blood oxygen sensor, Bluetooth calling mic, and 100+ sports activity modes.',
    specs: {
      'Display': '1.96-inch HD Borderless Curved Display',
      'Calling': 'Hi-Fi Built-in Speaker & HD Mic',
      'Sensors': 'Real-time SpO2, Heart Rate, Step Counter',
      'Sports Modes': '100+ Professional Workout Modes',
      'Compatibility': 'Android 5.0+ & iOS 9.0+'
    },
    isFlashSale: true,
    isDarazMall: false,
    freeDelivery: false,
    variants: [
      { name: 'Color', options: ['Rose Pink', 'Midnight Black', 'Starlight Gold'] }
    ]
  },
  {
    id: 'kg-watch-3',
    title: 'A1 Smart Watch Bluetooth Camera For Android iOS Phones with SIM & TF Slot',
    category: 'Smartwatches & Wearables',
    brand: 'A1 Tech',
    price: 1150,
    originalPrice: 1790,
    stock: 35,
    rating: 4.8,
    reviewCount: 30,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    description: 'Classic standalone smartwatch featuring Micro-SIM card slot, TF memory card expansion up to 32GB, built-in 0.3MP front camera, on-screen telephone dialer, pedometer, and sleep monitor.',
    specs: {
      'SIM Support': 'Micro-SIM GSM 850/900/1800/1900MHz',
      'Memory Expansion': 'TF Card Slot up to 32GB',
      'Camera': '0.3MP Front Camera & Remote Shutter',
      'Display': '1.54-inch TFT LCD Touch Screen',
      'Battery': '380mAh Removable Polymer Battery'
    },
    isFlashSale: false,
    isDarazMall: false,
    freeDelivery: false,
    variants: [
      { name: 'Color', options: ['Carbon Black', 'Metallic Silver', 'Ocean Blue'] }
    ]
  },
  {
    id: 'kg-watch-4',
    title: 'Y56 Smart Watches Men Women Bluetooth Smartwatch Sport Watch Waterproof Rugged',
    category: 'Smartwatches & Wearables',
    brand: 'Y56 Sport',
    price: 716,
    originalPrice: 1660,
    stock: 60,
    rating: 4.7,
    reviewCount: 280,
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80',
    description: 'Military-grade rugged shockproof smartwatch designed for extreme outdoor adventures. High-contrast negative digital display, 50m water resistance, calorie calculator, remote camera trigger, and ultra-long battery life.',
    specs: {
      'Design': 'Shock-resistant Tactical Bumper Casing',
      'Waterproof': '50M / 5 ATM Deep Waterproof',
      'Battery Life': 'Up to 12 Months (Standard Button Cell)',
      'Functions': 'Step Pedometer, Calorie Counter, Alarm, Stopwatch',
      'Backlight': 'High Visibility EL Backlight'
    },
    isFlashSale: true,
    isDarazMall: false,
    freeDelivery: false,
    variants: [
      { name: 'Color', options: ['Tactical Black', 'Army Green', 'Desert Camo'] }
    ]
  },
  // --- SCREENSHOT 2: Smartwatches ---
  {
    id: 'kg-watch-5',
    title: 'Apple Watch Series 11 Ultra-Slim OLED Bezel-less Display Smartwatch',
    category: 'Smartwatches & Wearables',
    brand: 'Apple Watch Series 11',
    price: 1430,
    originalPrice: 4950,
    stock: 25,
    rating: 4.9,
    reviewCount: 8,
    image: 'https://images.unsplash.com/photo-1510017803434-a899398421b3?auto=format&fit=crop&w=800&q=80',
    description: 'Series 11 high-performance smartwatch featuring premium curved borderless OLED screen, fast wireless magnetic dock charging, functional rotating digital crown knob, Bluetooth voice calling, and Siri AI assistant.',
    specs: {
      'Display': '2.05-inch Curved Borderless HD Retina Display',
      'Charging': 'Wireless Magnetic Fast Charging Dock',
      'Dial Crown': 'Active Rotating Digital Crown Knob',
      'Calling': 'Bluetooth HD Calling with Noise Reduction Mic',
      'Sensors': 'ECG, Heart Rate, SpO2, Sleep Tracker'
    },
    isFlashSale: true,
    isDarazMall: true,
    freeDelivery: false,
    variants: [
      { name: 'Case Color', options: ['Midnight Black', 'Space Grey', 'Starlight Silver'] }
    ]
  },
  {
    id: 'kg-watch-6',
    title: 'K10 Ultra Smartwatch with SIM Support – 4G LTE Smart Watch for Men Calling Feature',
    category: 'Smartwatches & Wearables',
    brand: 'K10 Ultra',
    price: 1360,
    originalPrice: 3020,
    stock: 35,
    rating: 4.7,
    reviewCount: 23,
    image: 'https://images.unsplash.com/photo-1617043786394-f977fa12eddf?auto=format&fit=crop&w=800&q=80',
    description: 'Rugged titanium alloy Ultra edition smartwatch with standalone 4G SIM calling, high-elastic orange wave ocean strap, 2.0-inch sapphire scratch-resistant flat screen, and sports GPS tracking.',
    specs: {
      'Casing': 'Titanium Alloy Industrial Rugged Case',
      'Cellular': '4G LTE SIM Card Calling & SMS',
      'Strap': 'High-Grade Silicone Wave Ocean Strap',
      'Display': '2.0-inch HD Flat Screen with Scratch Shield',
      'Wireless Charging': 'Fast Magnetic Wireless Pad'
    },
    isFlashSale: true,
    isDarazMall: true,
    freeDelivery: false,
    variants: [
      { name: 'Strap Color', options: ['Vibrant Orange Ocean', 'Stealth Black Ocean', 'Marine Yellow Ocean'] }
    ]
  },
  {
    id: 'kg-watch-7',
    title: 'Men Smart Watch Bluetooth Call Fitness Clock Heart Rate with Stainless Steel Strap',
    category: 'Smartwatches & Wearables',
    brand: 'North Tactical',
    price: 1051,
    originalPrice: 2450,
    stock: 44,
    rating: 4.8,
    reviewCount: 110,
    image: 'https://images.unsplash.com/photo-1544117518-30df578096a4?auto=format&fit=crop&w=800&q=80',
    description: 'Executive stainless steel linked wrist watch with high-definition digital watch face, multi-metric athletic health metrics (BPM, Calories, Weather), dual Bluetooth 5.0, and quick reply calls.',
    specs: {
      'Material': 'Brushed Stainless Steel Bezel & Metal Links',
      'Screen': '1.85-inch IPS Full Color HD Panel',
      'Battery': '320mAh High-Capacity Long Standby',
      'Features': 'Real-time Heart Rate, Blood Pressure, Pedometer',
      'Waterproof': 'IP68 Waterproof'
    },
    isFlashSale: true,
    isDarazMall: false,
    freeDelivery: false,
    variants: [
      { name: 'Finish', options: ['Titanium Grey Steel', 'Silver Steel', 'Onyx Black Steel'] }
    ]
  },
  {
    id: 'kg-watch-8',
    title: '2025 Smartwatch Men Flashlight Waterproof Outdoor Rugged Tactical Watch (420mAh)',
    category: 'Smartwatches & Wearables',
    brand: 'Tank Tactical',
    price: 1212,
    originalPrice: 2890,
    stock: 28,
    rating: 4.9,
    reviewCount: 21,
    image: 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?auto=format&fit=crop&w=800&q=80',
    description: 'Special operations outdoor rugged smartwatch equipped with a powerful side-mounted LED spotlight flashlight, huge 420mAh battery for 15+ days standby, reinforced drop bumpers, and Bluetooth voice communication.',
    specs: {
      'Battery': '420mAh Mega Battery (15-20 Days Standby)',
      'Flashlight': 'Built-in High-Lumen Emergency Side LED Torch',
      'Durability': 'Drop-Proof Metal Armor Frame',
      'Display': '1.96-inch High Contrast Sunlight Readable',
      'Calling': 'Noise-Canceling Bluetooth Calling'
    },
    isFlashSale: true,
    isDarazMall: false,
    freeDelivery: false,
    variants: [
      { name: 'Color', options: ['Heavy Black', 'Armor Silver'] }
    ]
  },
  // --- SCREENSHOT 3: Smartwatches & Wearables ---
  {
    id: 'kg-watch-9',
    title: '2026 New Bluetooth Smart Watch with Call Function 1.52-inch Round Dial',
    category: 'Smartwatches & Wearables',
    brand: 'Chrono Tech',
    price: 1867,
    originalPrice: 4340,
    stock: 32,
    rating: 5.0,
    reviewCount: 38,
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
    description: 'Classic round chronometer aesthetic with 1.52-inch circular AMOLED display, stainless steel rotating tachymeter bezel, crystal clear Hi-Fi voice calling, and wireless inductive charging.',
    specs: {
      'Display': '1.52-inch Circular HD AMOLED 360x360 Screen',
      'Dial': 'Precision Stainless Steel Bezel',
      'Calling': 'Hi-Fi Audio Bluetooth Calling',
      'Health': '24/7 Heart Monitor, SpO2, Sleep Tracking',
      'Charging': 'Wireless Magnetic Fast Charger'
    },
    isFlashSale: true,
    isDarazMall: false,
    freeDelivery: false,
    variants: [
      { name: 'Strap Style', options: ['Silver Steel Strap', 'Black Metal Strap', 'Brown Leather Band'] }
    ]
  },
  {
    id: 'kg-watch-10',
    title: '2026 Smart Bracelet Activity Fitness Tracker Sleep Heart Rate (Slim Milanese Band)',
    category: 'Smartwatches & Wearables',
    brand: 'LuxeBand',
    price: 3956,
    originalPrice: 10140,
    stock: 15,
    rating: 4.9,
    reviewCount: 65,
    image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=800&q=80',
    description: 'Ultra-luxurious slim vertical jewelry fitness bracelet with magnetic Milanese mesh band. Precise biometric sleep cycle and heart rate monitor, smart notifications, and IP67 waterproof protection.',
    specs: {
      'Form Factor': 'Ultra-Slim Curved Jewelry Bangle',
      'Strap': 'Premium Stainless Steel Milanese Magnetic Loop',
      'Display': '0.96-inch OLED Curved Vertical Screen',
      'Biometrics': 'Continuous Heart Rate, Blood Pressure, Sleep Stages',
      'Waterproof': 'IP67 Daily Waterproof'
    },
    isFlashSale: true,
    isDarazMall: true,
    freeDelivery: true,
    variants: [
      { name: 'Band Color', options: ['Silver Milanese', 'Rose Gold Milanese', 'Space Black'] }
    ]
  },
  {
    id: 'kg-watch-11',
    title: 'Smart Watch Women Men Music Control Bluetooth Fitness Tracker',
    category: 'Smartwatches & Wearables',
    brand: 'FitPro',
    price: 628,
    originalPrice: 1495,
    stock: 75,
    rating: 4.6,
    reviewCount: 846,
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80',
    description: 'Lightweight and vibrant daily fitness companion. Features vivid color screen, remote music player control, message reminders (WhatsApp, SMS), pedometer, and long-life rechargeable battery.',
    specs: {
      'Display': '1.3-inch Color IPS Display',
      'Controls': 'Music Player Control & Camera Shutter',
      'Sensors': 'Optical Heart Rate & Pedometer',
      'Strap': 'Skin-friendly Soft Silicone',
      'Battery Life': '5-7 Days Active Use'
    },
    isFlashSale: true,
    isDarazMall: false,
    freeDelivery: false,
    variants: [
      { name: 'Color', options: ['Onyx Black', 'Coral Blue', 'Blush Pink'] }
    ]
  },
  {
    id: 'kg-watch-12',
    title: '11.11 Ultra S9 4G Android Smartwatch with Camera 32GB RAM & 256GB ROM Calling Watch',
    category: 'Smartwatches & Wearables',
    brand: 'Ultra S9 Pro',
    price: 4616,
    originalPrice: 7440,
    stock: 12,
    rating: 4.9,
    reviewCount: 14,
    image: 'https://images.unsplash.com/photo-1617043786394-f977fa12eddf?auto=format&fit=crop&w=800&q=80',
    description: 'Full Android smartphone on your wrist. Features 32GB RAM + 256GB internal storage, rotatable HD camera for video calls, Google Play Store app downloads, standalone 4G SIM, Wi-Fi, GPS navigation, and YouTube streaming.',
    specs: {
      'Operating System': 'Full Android OS with Google Play Store',
      'Storage & RAM': '32GB RAM + 256GB Internal Storage',
      'Camera': '180° Telescopic / Rotatable HD Camera',
      'Connectivity': '4G Nano-SIM, Dual-Band Wi-Fi, GPS',
      'Screen': '2.04-inch AMOLED Ultra HD Display'
    },
    isFlashSale: false,
    isDarazMall: true,
    freeDelivery: true,
    variants: [
      { name: 'Strap Color', options: ['Vibrant Orange Ocean', 'Titanium Black Ocean', 'Alpine White'] }
    ]
  },
  // --- SCREENSHOT 4: Power Banks ---
  {
    id: 'kg-power-1',
    title: 'Hoco J154a 22.5W + PD 20W 20000mAh Fast Charging Powerbank with LED Display',
    category: 'Power Banks',
    brand: 'Hoco',
    price: 1435,
    originalPrice: 1670,
    stock: 80,
    rating: 4.8,
    reviewCount: 767,
    image: 'https://images.unsplash.com/photo-1609592424300-3cb8fa4e99e4?auto=format&fit=crop&w=800&q=80',
    description: 'High-capacity 20,000mAh external battery pack supporting 22.5W Huawei SuperCharge and 20W Type-C Power Delivery for iPhone and Android. Features digital LED percentage display and dual output.',
    specs: {
      'Capacity': '20,000mAh High-Density Polymer',
      'Output Power': '22.5W QC 3.0 + 20W Type-C PD',
      'Display': 'Digital LED Battery Percentage Indicator',
      'Ports': '2x USB-A Output, 1x Type-C Bi-directional',
      'Certifications': 'CE, FCC, RoHS Safety Standards'
    },
    isFlashSale: true,
    isDarazMall: true,
    freeDelivery: false,
    variants: [
      { name: 'Color', options: ['Matte Black', 'Glacier White'] }
    ]
  },
  {
    id: 'kg-power-2',
    title: 'Proton 10000mAh Power Bank Power House X10 (751593) | 22.5W Fast Charging Slim Design',
    category: 'Power Banks',
    brand: 'Proton',
    price: 880,
    originalPrice: 1000,
    stock: 65,
    rating: 4.9,
    reviewCount: 28,
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80',
    description: 'Ultra-portable pocket power bank with grooved anti-slip exterior. Delivers 22.5W high-speed charging in an exceptionally slim 10,000mAh body with multi-level surge and heat protection.',
    specs: {
      'Capacity': '10,000mAh Compact Pocket Size',
      'Fast Charging': '22.5W Super Charge Output',
      'Protection': 'Short Circuit, Overheat & Surge Protection',
      'Warranty': '1 Year Official Brand Warranty',
      'Weight': 'Ultra-lightweight ~185g'
    },
    isFlashSale: false,
    isDarazMall: true,
    freeDelivery: false,
    variants: [
      { name: 'Color', options: ['Carbon Black', 'Pure White'] }
    ]
  },
  {
    id: 'kg-power-3',
    title: 'QCY PB20A 20000mAh 45W PD Fast Charging Mini Power bank with Built-in Lanyard',
    category: 'Power Banks',
    brand: 'QCY',
    price: 3290,
    originalPrice: 4630,
    stock: 30,
    rating: 4.9,
    reviewCount: 60,
    image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80',
    description: 'Powerful 45W high-output PD portable battery capable of fast charging laptops (MacBook Air/Pro), iPads, and smartphones. Extremely compact mini form factor with integrated heavy-duty lanyard carry cable.',
    specs: {
      'Output Power': '45W Max USB-C PD (Laptop Compatible)',
      'Capacity': '20,000mAh High-Performance Cells',
      'Form Factor': 'Mini Pocket Block with Carry Lanyard',
      'Warranty': '12 Months Official Brand Warranty',
      'Fast Recharge': '45W Rapid Power Bank Recharging'
    },
    isFlashSale: true,
    isDarazMall: true,
    freeDelivery: true,
    variants: [
      { name: 'Color', options: ['Space Grey', 'Arctic White'] }
    ]
  },
  {
    id: 'kg-power-4',
    title: 'Oraimo Power Nova Q21 20000mAh 22.5W Black Power Bank with Precision Digital Display',
    category: 'Power Banks',
    brand: 'Oraimo',
    price: 2049,
    originalPrice: 3300,
    stock: 45,
    rating: 4.8,
    reviewCount: 68,
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
    description: 'Premium Oraimo Power Nova Q21 with AniFast smart charging technology. Delivers 22.5W output, bright digital percentage battery display, dual fast-charging USB ports, and durable scratch-resistant texture.',
    specs: {
      'Capacity': '20,000mAh Ultra-Reliable Li-Polymer',
      'Technology': 'AniFast Intelligent Chipset 22.5W',
      'Display': 'High-Visibility LED Digital Battery Meter',
      'Safety': 'Multi-Protection Shield Against Overcharging',
      'In Box': 'Power Bank + Fast Type-C Cable'
    },
    isFlashSale: true,
    isDarazMall: true,
    freeDelivery: true,
    variants: [
      { name: 'Color', options: ['Matte Black'] }
    ]
  },
  // ==================== FOOD ITEMS (খাদ্যদ্রব্য ও অর্গানিক পণ্য) ====================
  {
    id: 'kg-food-1',
    title: 'Radhuni Pure Mustard Oil (ঘানি ভাঙা খাঁটি সরিষার তেল - ১ লিটার বোতল)',
    category: 'Food Items',
    brand: 'Radhuni',
    price: 320,
    originalPrice: 360,
    stock: 50,
    rating: 4.9,
    reviewCount: 420,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
    description: '১০০% বিশুদ্ধ ঘানি ভাঙা কাঠের ঘানির সরিষার তেল। ঝাঁজালো সুবাস ও খাঁটি পুষ্টিগুণে ভরপুর। কোনো ক্ষতিকর কেমিক্যাল বা কৃত্রিম রঙ নেই।',
    specs: {
      'পরিমাণ': '১ লিটার বোতল',
      'প্রস্তুত প্রণালী': 'ঘানি ভাঙা কোল্ড প্রেসড',
      'ব্র্যান্ড': 'রাধুনী পিওর',
      'সংরক্ষণ': 'শুকনো ও ঠান্ডা স্থানে রাখুন'
    },
    isFlashSale: true,
    isDarazMall: true,
    freeDelivery: true
  },
  {
    id: 'kg-food-2',
    title: 'Fresh Padma River Hilsa Fish (তাজা পদ্মার রূপালী ইলিশ - ১ পিস ৯০০ গ্রাম-১ কেজি)',
    category: 'Food Items',
    brand: 'Padma Fresh',
    price: 1650,
    originalPrice: 1850,
    stock: 25,
    rating: 5.0,
    reviewCount: 310,
    image: 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=800&q=80',
    description: 'সরাসরি চাঁদপুর ও মাওয়া ঘাট থেকে সংগৃহীত তাজা পদ্মার রূপালী ইলিশ। কোনো বরফের রাসায়নিক নেই, প্রাকৃতিক স্বাদে ভরপুর ও সেরা সাইজ।',
    specs: {
      'ওজন': '৯০০ গ্রাম থেকে ১ কেজি (১ পিস)',
      'উৎস': 'পদ্মা নদী, চাঁদপুর',
      'ডেলিভারি': 'আইস বক্সে বিশেষ হাইজিনিক ডেলিভারি'
    },
    isFlashSale: true,
    isDarazMall: true,
    freeDelivery: true
  },
  {
    id: 'kg-food-3',
    title: 'Deshi Red Onion / Local Peyaj (দেশি লাল পেঁয়াজ - ১ কেজি)',
    category: 'Food Items',
    brand: 'Deshi Agro',
    price: 70,
    originalPrice: 85,
    stock: 120,
    rating: 4.8,
    reviewCount: 180,
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80',
    description: 'তাজা বাছাইকৃত দেশি লাল পেঁয়াজ। রান্নায় চমৎকার ঘ্রাণ এবং সঠিক স্বাদের জন্য আদর্শ। শুকনো ও পরিষ্কার প্যাক।',
    specs: {
      'ওজন': '১ কেজি নেট',
      'ধরন': 'দেশি লাল পেঁয়াজ'
    },
    isFlashSale: true,
    isDarazMall: false,
    freeDelivery: false
  },
  {
    id: 'kg-food-4',
    title: 'Bogura Diamond Fresh Potato (বগুড়ার ডায়মন্ড আলু - ২ কেজি প্যাক)',
    category: 'Food Items',
    brand: 'Bogura Agro',
    price: 65,
    originalPrice: 80,
    stock: 95,
    rating: 4.7,
    reviewCount: 140,
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
    description: 'বগুড়ার বিখ্যাত ডায়মন্ড জাতের তাজা গোল আলু। ভাজি, তরকারি কিংবা ভর্তার জন্য অত্যন্ত সুস্বাদু।',
    specs: {
      'ওজন': '২ কেজি প্যাক',
      'জাত': 'ডায়মন্ড'
    },
    isFlashSale: true,
    isDarazMall: false,
    freeDelivery: false
  },
  {
    id: 'kg-food-5',
    title: 'Premium Miniket Rice (প্রিমিয়াম মিনিকেট চাল - ৫ কেজি ব্যাগ)',
    category: 'Food Items',
    brand: 'Pran Agro',
    price: 385,
    originalPrice: 420,
    stock: 60,
    rating: 4.9,
    reviewCount: 290,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    description: 'উচ্চমানের দীর্ঘ দানার প্রিমিয়াম মিনিকেট চাল। রান্নার পর ভাত হয় ঝরঝরে ও সুগন্ধিযুক্ত।',
    specs: {
      'ওজন': '৫ কেজি পলিব্যাগ',
      'গুণমান': '১০০% পরিষ্কার ও পাথর মুক্ত'
    },
    isFlashSale: false,
    isDarazMall: true,
    freeDelivery: true
  },
  {
    id: 'kg-food-6',
    title: 'Fresh Deshi Beef Bone-in (তাজা দেশি গরুর মাংস - ১ কেজি)',
    category: 'Food Items',
    brand: 'Bengal Halal',
    price: 780,
    originalPrice: 820,
    stock: 30,
    rating: 4.9,
    reviewCount: 220,
    image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=800&q=80',
    description: '১০০% হালাল জবাইকৃত তাজা দেশি গরুর মাংস। সঠিক পরিমাণে হাড় ও মাংসের কম্বিনেশনসহ পরিষ্কারভাবে কাটা।',
    specs: {
      'ওজন': '১ কেজি',
      'সার্টিফিকেশন': '১০০% হালাল জবাই'
    },
    isFlashSale: false,
    isDarazMall: true,
    freeDelivery: true
  },
  {
    id: 'kg-food-7',
    title: 'Pabna Pure Cow Gawa Ghee (পাবনার খাঁটি দানাদার গাওয়া ঘি - ৫০০ গ্রাম)',
    category: 'Food Items',
    brand: 'Pabna Organic',
    price: 690,
    originalPrice: 750,
    stock: 40,
    rating: 5.0,
    reviewCount: 340,
    image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=800&q=80',
    description: 'পাবনার চাটমোহর ও বাঘাবাড়ির খাঁটি গাভীর দুধের মাখন থেকে তৈরি সুগন্ধি দানাদার গাওয়া ঘি।',
    specs: {
      'ওজন': '৫০০ গ্রাম কাঁচের জার',
      'উপাদান': '১০০% খাঁটি দুধের মাখন'
    },
    isFlashSale: true,
    isDarazMall: true,
    freeDelivery: true
  },
  {
    id: 'kg-food-8',
    title: 'Farm Fresh Brown Eggs (ফার্ম ফ্রেশ দেশি লাল ডিম - ১২ পিস)',
    category: 'Food Items',
    brand: 'Kazi Farms',
    price: 142,
    originalPrice: 155,
    stock: 80,
    rating: 4.8,
    reviewCount: 195,
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=800&q=80',
    description: 'ফার্ম ফ্রেশ স্বাস্থ্যসম্মত পুষ্টিকর বাদামি ডিম। প্রোটিনের সমৃদ্ধ উৎস, সুরক্ষিত কার্ডবোর্ড বক্সে প্যাক করা।',
    specs: {
      'পরিমাণ': '১ ডজন (১২ পিস)',
      'প্যাকিং': 'শক-প্রুফ ডিম কেস'
    },
    isFlashSale: true,
    isDarazMall: false,
    freeDelivery: false
  },

  // ==================== ELECTRONIC GADGET (ইলেকট্রনিক গ্যাজেট) ====================
  {
    id: 'kg-gadget-1',
    title: 'Haylou Solar Plus RT3 AMOLED Bluetooth Calling Smartwatch with SpO2',
    category: 'Electronic Gadget',
    brand: 'Haylou',
    price: 3650,
    originalPrice: 4200,
    stock: 35,
    rating: 4.9,
    reviewCount: 312,
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80',
    description: '1.43-inch AMOLED high-definition screen with 466*466 resolution, crystal clear Bluetooth calling, 105 workout sports modes, continuous heart rate and blood oxygen monitoring.',
    specs: {
      'Screen': '1.43" AMOLED HD (466x466)',
      'Calling': 'Bluetooth HD Voice Call Support',
      'Battery': 'Up to 7 Days Normal Use',
      'Waterproof': 'IP68 Professional Water Resistant'
    },
    isFlashSale: true,
    isDarazMall: true,
    freeDelivery: true,
    variants: [
      { name: 'Color', options: ['Obsidian Black', 'Silver Gray'] }
    ]
  },
  {
    id: 'kg-gadget-2',
    title: 'Realme Buds Air 5 Pro ANC Dual Dynamic Driver Wireless Earbuds (50dB ANC)',
    category: 'Electronic Gadget',
    brand: 'Realme',
    price: 5790,
    originalPrice: 6500,
    stock: 22,
    rating: 4.9,
    reviewCount: 410,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
    description: 'Flagship 50dB Active Noise Cancellation with dual coaxial drivers (11mm bass + 6mm planar tweeter), LDAC Hi-Res Audio certification, and 40-hour total playback.',
    specs: {
      'ANC': '50dB Deep Active Noise Reduction',
      'Audio': 'Hi-Res Wireless & LDAC Codec',
      'Playtime': 'Up to 40 Hours with Case',
      'Latency': '40ms Ultra-Low Gaming Latency'
    },
    isFlashSale: true,
    isDarazMall: true,
    freeDelivery: true,
    variants: [
      { name: 'Color', options: ['Astral Black', 'Sunrise Beige'] }
    ]
  },
  {
    id: 'kg-gadget-3',
    title: 'Remax RPP-292 20,000mAh 22.5W Fast Charging Power Bank with LED Display',
    category: 'Electronic Gadget',
    brand: 'Remax',
    price: 1950,
    originalPrice: 2400,
    stock: 45,
    rating: 4.8,
    reviewCount: 260,
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=800&q=80',
    description: 'Heavy duty high-speed power bank with dual USB-A and Type-C PD 20W/22.5W outputs. Compact, safe polymer core, and digital battery meter.',
    specs: {
      'Capacity': '20,000mAh Polymer Battery',
      'Fast Charge': '22.5W SuperCharge / PD 20W',
      'Display': 'LED Numeric Battery Indicator',
      'Warranty': '1 Year Replacement'
    },
    isFlashSale: true,
    isDarazMall: true,
    freeDelivery: true
  },
  {
    id: 'kg-gadget-4',
    title: 'JBL GO 3 Portable Waterproof Bluetooth Speaker with Deep Punchy Bass',
    category: 'Electronic Gadget',
    brand: 'JBL',
    price: 3750,
    originalPrice: 4200,
    stock: 28,
    rating: 4.9,
    reviewCount: 380,
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
    description: 'Bold styling and rich JBL Pro Sound in a pocket-sized package. IP67 waterproof and dustproof design with integrated loop for carrying anywhere.',
    specs: {
      'Sound': 'Original JBL Pro Sound',
      'Playtime': 'Up to 5 Hours on a Single Charge',
      'Protection': 'IP67 Waterproof and Dustproof',
      'Connectivity': 'Bluetooth 5.1'
    },
    isFlashSale: false,
    isDarazMall: true,
    freeDelivery: true,
    variants: [
      { name: 'Color', options: ['Squad Camo', 'Ocean Blue', 'Midnight Black', 'Red'] }
    ]
  },

  // ==================== MEN'S FASHION (পুরুষদের ফ্যাশন) ====================
  {
    id: 'kg-mens-1',
    title: 'Aarong Heritage Embroidered Silk Panjabi (আড়ং হেরিটেজ এমব্রয়ডারি সিল্ক পাঞ্জাবি)',
    category: "Men's Fashion",
    brand: 'Aarong Heritage',
    price: 3200,
    originalPrice: 3650,
    stock: 20,
    rating: 4.9,
    reviewCount: 160,
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
    description: 'উৎসবের সেরা ঐতিহ্যবাহী হ্যান্ডলুম সিল্ক পাঞ্জাবি। কলার ও বুকে চমৎকার জর্ডোস ও সুতোর নিখুঁত হাতের কাজ। প্রিমিয়াম ফিটিংস।',
    specs: {
      'কাপড়': '১০০% পিওর হ্যান্ডলুম সিল্ক ও কটন ব্লেন্ড',
      'ডিজাইন': 'হাতের এমব্রয়ডারি কারুকাজ',
      'ফিট': 'রেগুলার স্লিম কমফোর্ট ফিট'
    },
    isFlashSale: true,
    isDarazMall: true,
    freeDelivery: true,
    variants: [
      { name: 'সাইজ', options: ['40 (M)', '42 (L)', '44 (XL)'] },
      { name: 'রং', options: ['মার্জিত সাদা (Pearl White)', 'রয়্যাল ব্লু (Royal Blue)', 'মেরুন (Maroon)'] }
    ]
  },
  {
    id: 'kg-mens-2',
    title: 'Richman Executive 100% Egyptian Cotton Formal Shirt (রিচম্যান এক্সিকিউটিভ কটন শার্ট)',
    category: "Men's Fashion",
    brand: 'Richman',
    price: 2100,
    originalPrice: 2450,
    stock: 35,
    rating: 4.8,
    reviewCount: 190,
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
    description: 'অফিস ও এক্সিকিউটিভ মিটিংয়ের জন্য পারফেক্ট শতভাগ মিশরীয় কটনের প্রিমিয়াম ফুল হাতা ফরমাল শার্ট। রিঙ্কল-ফ্রি এবং আরামদায়ক।',
    specs: {
      'কাপড়': '১০০% ইজিপশিয়ান প্রিমিয়াম কটন',
      'কলার': 'কাটঅ্যাওয়ে মডার্ন কলার',
      'ফিটিং': 'টেইলর স্লিম ফিট'
    },
    isFlashSale: false,
    isDarazMall: true,
    freeDelivery: true,
    variants: [
      { name: 'সাইজ', options: ['15 (M)', '15.5 (L)', '16 (XL)'] },
      { name: 'রং', options: ['স্কাই ব্লু (Sky Blue)', 'সাদা (Crisp White)', 'লাইট পিঙ্ক'] }
    ]
  },
  {
    id: 'kg-mens-3',
    title: 'Artisan Premium Stretch Indigo Denim Jeans (আর্টিসান প্রিমিয়াম স্ট্রেচ ডেনিম জিন্স)',
    category: "Men's Fashion",
    brand: 'Artisan',
    price: 2190,
    originalPrice: 2600,
    stock: 40,
    rating: 4.8,
    reviewCount: 175,
    image: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80',
    description: '১২ আউন্স হেভিওয়েট প্রিমিয়াম স্ট্রেচেবল ডেনিম প্যান্ট। নিখুঁত ওয়াশ ও আরামদায়ক বসার সুবিধা। দীর্ঘস্থায়ী ও টেকসই ফেব্রিক।',
    specs: {
      'উপাদান': '৯৮% তুলা, ২% স্প্যানডেক্স ইলাস্টেন',
      'ওয়াশ': 'ডিপ ইন্ডিগো বায়ো স্টোন ওয়াশ',
      'কাট': 'স্লিম টেপারড লেগ'
    },
    isFlashSale: false,
    isDarazMall: true,
    freeDelivery: false,
    variants: [
      { name: 'কোমরের মাপ', options: ['30', '32', '34', '36'] }
    ]
  },
  {
    id: 'kg-mens-4',
    title: 'Handcrafted 100% Top-Grain Leather Shoe Loafer (হাতে তৈরি খাঁটি চামড়ার এক্সিকিউটিভ লোফার)',
    category: "Men's Fashion",
    brand: 'Apex Royal',
    price: 1750,
    originalPrice: 2200,
    stock: 25,
    rating: 4.9,
    reviewCount: 140,
    image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80',
    description: 'খাঁটি জেনুইন লেদারের তৈরি প্রিমিয়াম হ্যান্ডমেড লোফার জুতো। কুশনিং ইনসোল দীর্ঘ সময় হাঁটার পরও পায়ের আরাম নিশ্চিত করে।',
    specs: {
      'চামড়া': '১০০% খাঁটি গরুর টপ-গ্রেইন লেদার',
      'সোল': 'অ্যান্টি-স্লিপ রাবার গ্রিপ সোল',
      'ইনসোল': 'মেমোরি ফোম কমফোর্ট প্যাডিং'
    },
    isFlashSale: true,
    isDarazMall: true,
    freeDelivery: true,
    variants: [
      { name: 'সাইজ', options: ['40', '41', '42', '43', '44'] },
      { name: 'রং', options: ['ক্লাসিক ব্ল্যাক', 'চকলেট ব্রাউন'] }
    ]
  },

  // ==================== WOMEN'S FASHION (মহিলাদের ফ্যাশন) ====================
  {
    id: 'kg-womens-1',
    title: 'Authentic Handwoven Dhakai Jamdani Saree (ঐতিহ্যবাহী খাঁটি হাতে বোনা ঢাকাই জামদানি শাড়ি)',
    category: "Women's Fashion",
    brand: 'Dhakai Heritage',
    price: 7200,
    originalPrice: 8500,
    stock: 15,
    rating: 5.0,
    reviewCount: 280,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    description: 'রূপগঞ্জ ও ডেমরার অভিজ্ঞ তাঁতীদের নিখুঁত হাতে বোনা ৮৪ কাউন্ট কটন সিল্ক ঢাকাই জামদানি। রাজকীয় সোনালী জরির জলছাপ ও আচল ডিজাইন।',
    specs: {
      'কাউন্ট': '৮৪ কাউন্ট ফাইন কটন সিল্ক',
      'দৈর্ঘ্য': '১২ হাত ফুল শাড়ি (ব্লাউজ পিস সহ)',
      'ডিজাইন': 'ঐতিহ্যবাহী ময়ূরপঙ্খী ও পানপাতা বুটি'
    },
    isFlashSale: true,
    isDarazMall: true,
    freeDelivery: true,
    variants: [
      { name: 'রং', options: ['টকটকে লাল (Festive Crimson)', 'কালো ও সোনালী জরি (Black Gold)', 'রয়্যাল নীল (Royal Blue)'] }
    ]
  },
  {
    id: 'kg-womens-2',
    title: 'Kay Kraft Embroidered Luxury Cotton Three-Piece (কে ক্র্যাফ্ট লাক্সারি এমব্রয়ডারি থ্রি-পিস)',
    category: "Women's Fashion",
    brand: 'Kay Kraft',
    price: 4150,
    originalPrice: 4800,
    stock: 24,
    rating: 4.8,
    reviewCount: 150,
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    description: 'উচ্চমানের লাক্সারি লন কটন থ্রি-পিস সেট। কামিজের সামনে ও হাতায় চমৎকার সূক্ষ্ম কাজ, সাথে ভারী ম্যাচিং শিফন ওড়না।',
    specs: {
      'কামিজ': 'প্রিমিয়াম লন কটন উইথ এমব্রয়ডারি (৩ গজ)',
      'সেলোয়ার': 'সফট পিওর কটন (২.৫ গজ)',
      'ওড়না': 'প্রিমিয়াম পিওর শিফন প্রিন্ট ওড়না (৫ হাত)'
    },
    isFlashSale: false,
    isDarazMall: true,
    freeDelivery: true
  },
  {
    id: 'kg-womens-3',
    title: 'Premium Dubai Cherry Chiffon Borka & Hijab Set (প্রিমিয়াম দুবাই চেরি জর্জেট বোরকা ও হিজাব সেট)',
    category: "Women's Fashion",
    brand: 'Dubai Modest',
    price: 2650,
    originalPrice: 3200,
    stock: 30,
    rating: 4.9,
    reviewCount: 210,
    image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=800&q=80',
    description: 'আসল দুবাই চেরি জর্জেট কাপড়ে তৈরি রুচিশীল ও মার্জিত ডিজাইনের বোরকা ও ম্যাচিং হিজাব সেট। শরীর ঠান্ডা রাখে এবং সহজে কুঁচকে যায় না।',
    specs: {
      'ফেব্রিক': 'অরিজিনাল দুবাই চেরি জর্জেট',
      'সাইজ': '৫২, ৫৪, ৫৬ (ফ্রি বডি সাইজ)',
      'সেটে যা আছে': 'ফুল বোরকা গাউন + প্রিমিয়াম বড় হিজাব'
    },
    isFlashSale: true,
    isDarazMall: true,
    freeDelivery: true,
    variants: [
      { name: 'বোরকার লম্বা', options: ['52 Inch', '54 Inch', '56 Inch'] },
      { name: 'রং', options: ['জেট ব্ল্যাক', 'সি-গ্রিন', 'কফি চকলেট'] }
    ]
  },
  {
    id: 'kg-womens-4',
    title: "Anjan's Hand Block Printed 100% Cotton Kurti (অঞ্জনস হাতে ব্লক প্রিন্ট ১০০% কটন ডিজাইনার কুর্তি)",
    category: "Women's Fashion",
    brand: "Anjan's",
    price: 1390,
    originalPrice: 1650,
    stock: 35,
    rating: 4.7,
    reviewCount: 120,
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
    description: 'দৈনন্দিন বিশ্ববিদ্যালয়, কলেজ বা অফিসে পরার জন্য আরামদায়ক ১০০% খাঁটি সুতি ব্লক প্রিন্ট কুর্তি। পরিবেশবান্ধব রঙে প্রস্তুত।',
    specs: {
      'কাপড়': '১০০% দেশি তাজা সুতি',
      'প্রিন্ট': 'হাতের কাঠের ব্লকের নান্দনিক প্রিন্ট',
      'ফিট': 'মডার্ন এ-লাইন ফিট'
    },
    isFlashSale: false,
    isDarazMall: false,
    freeDelivery: false,
    variants: [
      { name: 'সাইজ', options: ['38 (M)', '40 (L)', '42 (XL)'] }
    ]
  }
];

export const INITIAL_VOUCHERS: Voucher[] = [
  {
    code: 'KHAN10',
    discountType: 'percentage',
    discountValue: 10,
    minSpend: 1500,
    description: '10% OFF on all orders above ৳ 1,500',
    isActive: true
  },
  {
    code: 'DARAZSUPER',
    discountType: 'fixed',
    discountValue: 500,
    minSpend: 3000,
    description: 'Flat ৳ 500 OFF on orders above ৳ 3,000',
    isActive: true
  },
  {
    code: 'FREESHIP',
    discountType: 'fixed',
    discountValue: 149,
    minSpend: 1000,
    description: 'Free Courier Delivery (৳ 149 OFF)',
    isActive: true
  },
  {
    code: 'GADGET20',
    discountType: 'percentage',
    discountValue: 20,
    minSpend: 8000,
    description: '20% OFF Mega VIP Discount on orders above ৳ 8,000',
    isActive: true
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'KG-849201-BD',
    trackingNumber: 'STD-BD-98241029',
    createdAt: '2025-02-28T14:32:00Z',
    status: 'In Transit' as any,
    items: [
      {
        product: INITIAL_PRODUCTS[0],
        quantity: 1,
        selectedVariants: { 'Color': 'Matte Black' },
        priceAtPurchase: 4999
      },
      {
        product: INITIAL_PRODUCTS[5],
        quantity: 2,
        selectedVariants: { 'Phone Model': 'iPhone 16 / 16 Pro' },
        priceAtPurchase: 850
      }
    ],
    shippingAddress: {
      fullName: 'Muhammad Tanvir Hasan',
      phone: '01854-774406',
      email: 'tanvir.hasan@gmail.com',
      city: 'Dhaka',
      province: 'Dhaka Division',
      address: 'House #42, Road #7, Dhanmondi',
      landmark: 'Near Dhanmondi Lake',
      addressType: 'Home'
    },
    paymentMethod: 'cod',
    paymentStatus: 'Unpaid (COD)',
    subtotal: 6699,
    discount: 669,
    shippingFee: 0,
    total: 6030,
    appliedVoucher: 'KHAN10',
    carrierName: 'Steadfast Courier',
    estimatedDelivery: 'Tomorrow, by 5:00 PM',
    checkpoints: [
      {
        title: 'Order Placed & Verified',
        location: 'Khan Gadget Portal',
        time: '28 Feb, 02:32 PM',
        description: 'Order confirmed with Cash on Delivery (COD).',
        completed: true
      },
      {
        title: 'Packed & Quality Verified',
        location: 'Khan Gadget Central Warehouse, Dhaka',
        time: '28 Feb, 06:15 PM',
        description: 'Quality inspected, barcode verified, bubble wrap packing done.',
        completed: true
      },
      {
        title: 'Handed Over to Courier',
        location: 'Steadfast Courier Logistics Center, Dhaka',
        time: '01 Mar, 09:30 AM',
        description: 'Consignment booked under tracking # STD-BD-98241029.',
        completed: true
      },
      {
        title: 'In Transit to Destination Hub',
        location: 'Dhanmondi Delivery Facility, Dhaka',
        time: '02 Mar, 04:20 AM',
        description: 'Package arrived at regional sorting center. Sorting for route delivery.',
        completed: true,
        current: true
      },
      {
        title: 'Out for Delivery',
        location: 'Dhanmondi Hub, Dhaka',
        time: 'Estimated 03 Mar, 09:00 AM',
        description: 'Rider assigned with dispatch run.',
        completed: false
      },
      {
        title: 'Delivered',
        location: 'Customer Address',
        time: 'Pending',
        description: 'Package delivered & signed by recipient.',
        completed: false
      }
    ]
  },
  {
    id: 'KG-719302-BD',
    trackingNumber: 'REDX-BD-7729104',
    createdAt: '2025-02-25T11:15:00Z',
    status: 'Delivered',
    items: [
      {
        product: INITIAL_PRODUCTS[1],
        quantity: 1,
        selectedVariants: { 'Color': 'Carbon Black' },
        priceAtPurchase: 9800
      }
    ],
    shippingAddress: {
      fullName: 'Shafiqul Islam',
      phone: '01712-334455',
      email: 'shafiq.bd@gmail.com',
      city: 'Chittagong',
      province: 'Chittagong Division',
      address: 'Flat 4B, Agrabad Commercial Area',
      landmark: 'Near GEC Circle',
      addressType: 'Office'
    },
    paymentMethod: 'cod',
    paymentStatus: 'Paid',
    subtotal: 9800,
    discount: 500,
    shippingFee: 0,
    total: 9300,
    appliedVoucher: 'DARAZSUPER',
    carrierName: 'RedX Logistics',
    estimatedDelivery: 'Delivered on 27 Feb',
    checkpoints: [
      {
        title: 'Order Placed',
        location: 'Khan Gadget Portal',
        time: '25 Feb, 11:15 AM',
        description: 'Order placed with Cash on Delivery.',
        completed: true
      },
      {
        title: 'Dispatched from Warehouse',
        location: 'Dhaka Central Hub',
        time: '25 Feb, 03:40 PM',
        description: 'Passed automated weight & seal check.',
        completed: true
      },
      {
        title: 'Out for Delivery',
        location: 'Chittagong Agrabad Delivery Van',
        time: '27 Feb, 10:10 AM',
        description: 'Rider Farhan (01811-987654) out for delivery.',
        completed: true
      },
      {
        title: 'Delivered & Completed',
        location: 'Chittagong Agrabad',
        time: '27 Feb, 02:45 PM',
        description: 'Received & signed by Shafiqul Islam. Cash collected.',
        completed: true,
        current: true
      }
    ]
  }
];
