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
