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
    category: 'Smartwatch Accessories',
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
