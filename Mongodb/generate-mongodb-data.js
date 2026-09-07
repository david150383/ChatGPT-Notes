/*
 * MongoDB Interview Practice Dataset Generator
 *
 * Generates:
 *   users.json       -> 10,000
 *   products.json    -> 2,000
 *   orders.json      -> 50,000
 *   reviews.json     -> 20,000
 *   payments.json    -> 50,000
 *
 * Usage:
 *   node generate-mongodb-data.js
 *
 * Then import:
 *
 *   mongoimport --db ecommerce --collection users --file users.json --jsonArray
 *   mongoimport --db ecommerce --collection products --file products.json --jsonArray
 *   mongoimport --db ecommerce --collection orders --file orders.json --jsonArray
 *   mongoimport --db ecommerce --collection reviews --file reviews.json --jsonArray
 *   mongoimport --db ecommerce --collection payments --file payments.json --jsonArray
 */

const fs = require("fs");

// ============================================================
// CONFIGURATION
// ============================================================

const CONFIG = {
  users: 10000,
  products: 2000,
  orders: 50000,
  reviews: 20000,
  payments: 50000,
};

const OUTPUT_DIR = "./mongodb-practice-data";

// ============================================================
// HELPERS
// ============================================================

function pad(num, size = 6) {
  return String(num).padStart(size, "0");
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max, decimals = 2) {
  const value = Math.random() * (max - min) + min;
  return Number(value.toFixed(decimals));
}

function randomItem(array) {
  return array[randomInt(0, array.length - 1)];
}

function randomItems(array, min, max) {
  const count = randomInt(min, Math.min(max, array.length));
  const copy = [...array];

  // Fisher-Yates partial shuffle
  for (let i = copy.length - 1; i > 0; i--) {
    const j = randomInt(0, i);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy.slice(0, count);
}

function randomBoolean(probability = 0.5) {
  return Math.random() < probability;
}

function randomDate(start, end) {
  const startTime = start.getTime();
  const endTime = end.getTime();

  return new Date(startTime + Math.random() * (endTime - startTime));
}

function isoDate(date) {
  return date.toISOString();
}

function oid(prefix, number) {
  return prefix + pad(number, 24 - prefix.length);
}

function money(value) {
  return Number(value.toFixed(2));
}

function weightedChoice(items) {
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * total;

  for (const item of items) {
    random -= item.weight;

    if (random <= 0) {
      return item.value;
    }
  }

  return items[items.length - 1].value;
}

function writeJson(filename, data) {
  const filePath = `${OUTPUT_DIR}/${filename}`;

  console.log(`Writing ${filename} ...`);

  fs.writeFileSync(filePath, JSON.stringify(data));

  const sizeMB = (fs.statSync(filePath).size / 1024 / 1024).toFixed(2);

  console.log(`Created ${filename} (${sizeMB} MB)`);
}

// ============================================================
// DATA
// ============================================================

const firstNames = [
  "Rahul",
  "Amit",
  "Arjun",
  "Vikram",
  "Ravi",
  "Kiran",
  "Suresh",
  "Raj",
  "Aditya",
  "Manoj",
  "Anil",
  "Rohit",
  "Akash",
  "Varun",
  "Nikhil",
  "Sanjay",
  "Deepak",
  "Prakash",
  "Vivek",
  "Abhishek",
  "Priya",
  "Sneha",
  "Anjali",
  "Neha",
  "Pooja",
  "Kavya",
  "Divya",
  "Swati",
  "Meera",
  "Asha",
  "Lakshmi",
  "Shreya",
  "Nandini",
  "Isha",
  "Riya",
  "Simran",
  "Ananya",
  "Pallavi",
  "Shruti",
  "Sonia",
];

const lastNames = [
  "Sharma",
  "Reddy",
  "Patel",
  "Kumar",
  "Singh",
  "Verma",
  "Gupta",
  "Rao",
  "Mehta",
  "Shah",
  "Joshi",
  "Nair",
  "Iyer",
  "Kapoor",
  "Malhotra",
  "Agarwal",
  "Choudhary",
  "Das",
  "Mishra",
  "Bose",
];

const cities = [
  {
    city: "Hyderabad",
    state: "Telangana",
    country: "India",
    pincode: "500001",
  },
  {
    city: "Bengaluru",
    state: "Karnataka",
    country: "India",
    pincode: "560001",
  },
  {
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    pincode: "400001",
  },
  {
    city: "Delhi",
    state: "Delhi",
    country: "India",
    pincode: "110001",
  },
  {
    city: "Chennai",
    state: "Tamil Nadu",
    country: "India",
    pincode: "600001",
  },
  {
    city: "Pune",
    state: "Maharashtra",
    country: "India",
    pincode: "411001",
  },
  {
    city: "Ahmedabad",
    state: "Gujarat",
    country: "India",
    pincode: "380001",
  },
  {
    city: "Kolkata",
    state: "West Bengal",
    country: "India",
    pincode: "700001",
  },
  {
    city: "Jaipur",
    state: "Rajasthan",
    country: "India",
    pincode: "302001",
  },
  {
    city: "Kochi",
    state: "Kerala",
    country: "India",
    pincode: "682001",
  },
  {
    city: "New York",
    state: "New York",
    country: "USA",
    pincode: "10001",
  },
  {
    city: "London",
    state: "England",
    country: "UK",
    pincode: "SW1A",
  },
  {
    city: "Toronto",
    state: "Ontario",
    country: "Canada",
    pincode: "M5V",
  },
];

const categories = [
  "Electronics",
  "Audio",
  "Footwear",
  "Clothing",
  "Home",
  "Kitchen",
  "Sports",
  "Books",
  "Beauty",
  "Accessories",
];

const brands = [
  "Apple",
  "Samsung",
  "Sony",
  "Dell",
  "HP",
  "Lenovo",
  "Nike",
  "Adidas",
  "LG",
  "Philips",
  "Puma",
  "Amazon",
  "Logitech",
  "JBL",
  "Canon",
  "Nikon",
];

const productNames = [
  "MacBook Pro",
  "MacBook Air",
  "iPhone",
  "Galaxy S",
  "Galaxy Note",
  "Pixel",
  "Dell XPS",
  "ThinkPad",
  "HP Pavilion",
  "Sony Headphones",
  "JBL Speaker",
  "AirPods",
  "Gaming Mouse",
  "Mechanical Keyboard",
  "Monitor",
  "Smart TV",
  "Running Shoes",
  "Sports Shoes",
  "Winter Jacket",
  "Cotton Shirt",
  "Coffee Maker",
  "Air Fryer",
  "Mixer Grinder",
  "Smart Watch",
  "Fitness Tracker",
  "Backpack",
  "Office Chair",
  "Desk Lamp",
  "Cookware Set",
  "Programming Book",
];

const tags = [
  "premium",
  "popular",
  "new",
  "sale",
  "wireless",
  "smart",
  "gaming",
  "computer",
  "mobile",
  "smartphone",
  "android",
  "ios",
  "business",
  "office",
  "home",
  "sports",
  "running",
  "fitness",
  "fashion",
  "audio",
];

const orderStatuses = [
  { value: "delivered", weight: 55 },
  { value: "shipped", weight: 15 },
  { value: "processing", weight: 10 },
  { value: "confirmed", weight: 8 },
  { value: "cancelled", weight: 7 },
  { value: "returned", weight: 5 },
];

const paymentMethods = [
  "upi",
  "credit_card",
  "debit_card",
  "net_banking",
  "wallet",
  "cash_on_delivery",
];

const paymentStatuses = [
  { value: "success", weight: 85 },
  { value: "failed", weight: 5 },
  { value: "pending", weight: 5 },
  { value: "refunded", weight: 5 },
];

const reviewTitles = [
  "Excellent product",
  "Very good",
  "Worth the money",
  "Good quality",
  "Average product",
  "Not bad",
  "Amazing",
  "Highly recommended",
  "Could be better",
  "Excellent quality",
];

const reviewComments = [
  "Great product and very good quality.",
  "The product works exactly as expected.",
  "Good value for money.",
  "Delivery was fast and packaging was good.",
  "I am happy with the purchase.",
  "Quality is excellent.",
  "Product is okay but could be improved.",
  "Very useful product for daily use.",
  "Performance is better than expected.",
  "Would definitely recommend this product.",
];

// ============================================================
// CREATE OUTPUT DIRECTORY
// ============================================================

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, {
    recursive: true,
  });
}

// ============================================================
// DATE RANGE
// ============================================================

const DATA_START = new Date("2018-01-01T00:00:00Z");
const DATA_END = new Date("2026-08-01T00:00:00Z");

// ============================================================
// USERS
// ============================================================

console.log("\nGenerating users...");

const users = [];

for (let i = 1; i <= CONFIG.users; i++) {
  const firstName = randomItem(firstNames);
  const lastName = randomItem(lastNames);
  const location = randomItem(cities);

  const createdAt = randomDate(DATA_START, new Date("2025-12-31T23:59:59Z"));

  const status = weightedChoice([
    { value: "active", weight: 85 },
    { value: "inactive", weight: 10 },
    { value: "blocked", weight: 5 },
  ]);

  const premium = randomBoolean(0.15);

  const user = {
    _id: {
      $oid: oid("64a", i),
    },

    name: `${firstName} ${lastName}`,

    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,

    age: randomInt(18, 70),

    gender: randomItem(["M", "F"]),

    status,

    roles: premium ? ["customer", "premium"] : ["customer"],

    address: {
      city: location.city,
      state: location.state,
      country: location.country,
      pincode: location.pincode,
    },

    preferences: {
      language: randomItem(["en", "hi", "te", "ta", "kn"]),

      notifications: randomBoolean(0.8),

      categories: randomItems(categories, 1, 4),
    },

    createdAt: {
      $date: isoDate(createdAt),
    },
  };

  // Deliberately create missing/null fields
  if (randomBoolean(0.25)) {
    user.phone = `9${randomInt(100000000, 999999999)}`;
  } else if (randomBoolean(0.15)) {
    user.phone = null;
  }

  if (randomBoolean(0.2)) {
    user.dateOfBirth = {
      $date: isoDate(
        new Date(Date.now() - randomInt(18, 70) * 365 * 24 * 60 * 60 * 1000),
      ),
    };
  }

  users.push(user);
}

writeJson("users.json", users);

// ============================================================
// PRODUCTS
// ============================================================

console.log("\nGenerating products...");

const products = [];

for (let i = 1; i <= CONFIG.products; i++) {
  const category = randomItem(categories);
  const brand = randomItem(brands);

  let basePrice;

  switch (category) {
    case "Electronics":
      basePrice = randomInt(20000, 200000);
      break;

    case "Audio":
      basePrice = randomInt(2000, 50000);
      break;

    case "Footwear":
      basePrice = randomInt(1500, 25000);
      break;

    case "Clothing":
      basePrice = randomInt(500, 15000);
      break;

    case "Home":
      basePrice = randomInt(1000, 50000);
      break;

    case "Kitchen":
      basePrice = randomInt(500, 30000);
      break;

    case "Sports":
      basePrice = randomInt(500, 20000);
      break;

    case "Books":
      basePrice = randomInt(200, 5000);
      break;

    case "Beauty":
      basePrice = randomInt(300, 10000);
      break;

    default:
      basePrice = randomInt(500, 30000);
  }

  const product = {
    _id: {
      $oid: oid("65b", i),
    },

    name: `${randomItem(productNames)} ${randomInt(1, 999)}`,

    sku: `SKU-${pad(i, 8)}`,

    category,

    brand,

    price: basePrice,

    discountPercent: randomInt(0, 40),

    stock: randomInt(0, 500),

    tags: randomItems(tags, 1, 5),

    rating: randomFloat(2.5, 5, 1),

    reviewCount: randomInt(0, 1000),

    specifications: {
      ram: randomItem([4, 6, 8, 12, 16, 32, 64]),

      storage: randomItem([64, 128, 256, 512, 1024, 2048]),

      color: randomItem(["Black", "White", "Blue", "Red", "Silver", "Grey"]),
    },

    supplier: {
      name: randomItem([
        "Global Supplies",
        "Tech Distributors",
        "Prime Wholesale",
        "Metro Suppliers",
        "Direct Imports",
      ]),

      country: randomItem(["India", "China", "USA", "Germany", "Japan"]),
    },

    createdAt: {
      $date: isoDate(randomDate(DATA_START, new Date("2025-12-31T23:59:59Z"))),
    },
  };

  // Some products have missing fields
  if (randomBoolean(0.08)) {
    delete product.reviewCount;
  }

  if (randomBoolean(0.05)) {
    product.tags = [];
  }

  products.push(product);
}

writeJson("products.json", products);

// ============================================================
// ORDERS
// ============================================================

console.log("\nGenerating orders...");

const orders = [];

for (let i = 1; i <= CONFIG.orders; i++) {
  const user = randomItem(users);

  const numberOfItems = randomInt(1, 5);

  const selectedProducts = randomItems(products, numberOfItems, numberOfItems);

  const items = [];

  let subtotal = 0;

  for (const product of selectedProducts) {
    const quantity = randomInt(1, 5);

    const price = product.price;

    const itemTotal = price * quantity;

    subtotal += itemTotal;

    items.push({
      productId: product._id,
      sku: product.sku,
      name: product.name,
      quantity,
      price,
    });
  }

  const discount = money(subtotal * randomFloat(0, 0.25));

  const tax = money((subtotal - discount) * 0.18);

  const shippingFee = subtotal > 50000 ? 0 : randomInt(0, 500);

  const totalAmount = money(subtotal - discount + tax + shippingFee);

  const status = weightedChoice(orderStatuses);

  const orderDate = randomDate(DATA_START, DATA_END);

  const location =
    cities.find((c) => c.city === user.address.city) || randomItem(cities);

  const order = {
    _id: {
      $oid: oid("66c", i),
    },

    orderNumber: `ORD-${new Date().getFullYear()}-${pad(i, 8)}`,

    userId: user._id,

    items,

    pricing: {
      subtotal,
      discount,
      tax,
      shippingFee,
      total: totalAmount,
    },

    totalAmount,

    currency: "INR",

    status,

    paymentStatus:
      status === "cancelled"
        ? "refunded"
        : weightedChoice([
            { value: "paid", weight: 85 },
            { value: "pending", weight: 10 },
            { value: "failed", weight: 5 },
          ]),

    shippingAddress: {
      city: location.city,
      state: location.state,
      country: location.country,
      pincode: location.pincode,
    },

    shipping: {
      method: randomItem(["standard", "express", "same_day"]),

      carrier: randomItem(["FedEx", "DHL", "BlueDart", "Delhivery", "UPS"]),
    },

    orderDate: {
      $date: isoDate(orderDate),
    },

    createdAt: {
      $date: isoDate(orderDate),
    },
  };

  // Some orders contain coupon information
  if (randomBoolean(0.35)) {
    order.coupon = {
      code: randomItem([
        "WELCOME10",
        "SAVE20",
        "FESTIVE25",
        "NEWUSER15",
        "VIP30",
      ]),
      discountPercent: randomInt(5, 30),
    };
  }

  // Some orders have delivery information
  if (status === "delivered" || status === "returned") {
    const deliveryDate = new Date(
      orderDate.getTime() + randomInt(2, 10) * 24 * 60 * 60 * 1000,
    );

    order.delivery = {
      deliveredAt: {
        $date: isoDate(deliveryDate),
      },

      signedBy: randomItem([
        "Customer",
        "Family Member",
        "Security",
        "Reception",
      ]),
    };
  }

  orders.push(order);
}

writeJson("orders.json", orders);

// ============================================================
// REVIEWS
// ============================================================

console.log("\nGenerating reviews...");

const reviews = [];

for (let i = 1; i <= CONFIG.reviews; i++) {
  const user = randomItem(users);
  const product = randomItem(products);

  const rating = weightedChoice([
    { value: 5, weight: 45 },
    { value: 4, weight: 30 },
    { value: 3, weight: 15 },
    { value: 2, weight: 7 },
    { value: 1, weight: 3 },
  ]);

  const reviewDate = randomDate(new Date("2018-01-01T00:00:00Z"), DATA_END);

  const review = {
    _id: {
      $oid: oid("67d", i),
    },

    userId: user._id,

    productId: product._id,

    rating,

    title: randomItem(reviewTitles),

    comment: randomItem(reviewComments),

    verifiedPurchase: randomBoolean(0.75),

    helpfulVotes: randomInt(0, 500),

    createdAt: {
      $date: isoDate(reviewDate),
    },
  };

  if (randomBoolean(0.15)) {
    review.images = [`review_${i}_1.jpg`, `review_${i}_2.jpg`];
  }

  if (randomBoolean(0.1)) {
    review.sellerResponse = {
      message: "Thank you for your feedback.",
      respondedAt: {
        $date: isoDate(
          new Date(
            reviewDate.getTime() + randomInt(1, 30) * 24 * 60 * 60 * 1000,
          ),
        ),
      },
    };
  }

  reviews.push(review);
}

writeJson("reviews.json", reviews);

// ============================================================
// PAYMENTS
// ============================================================

console.log("\nGenerating payments...");

const payments = [];

for (let i = 1; i <= CONFIG.payments; i++) {
  const order = orders[i - 1];

  const paymentStatus = weightedChoice(paymentStatuses);

  const paymentDate = order.orderDate.$date;

  const amount = order.totalAmount;

  const payment = {
    _id: {
      $oid: oid("68e", i),
    },

    paymentId: `PAY-${pad(i, 10)}`,

    orderId: order._id,

    userId: order.userId,

    amount,

    currency: "INR",

    method: randomItem(paymentMethods),

    status: paymentStatus,

    transactionId: `TXN-${randomInt(10000000, 99999999)}`,

    gateway: randomItem(["Razorpay", "Stripe", "PayPal", "PayU"]),

    paymentDate: {
      $date: paymentDate,
    },
  };

  if (paymentStatus === "failed") {
    payment.failureReason = randomItem([
      "Insufficient funds",
      "Bank declined",
      "Timeout",
      "Invalid card",
      "Gateway error",
    ]);
  }

  if (paymentStatus === "refunded") {
    payment.refund = {
      amount,
      reason: randomItem([
        "Customer requested",
        "Order cancelled",
        "Product unavailable",
        "Product returned",
      ]),
      refundedAt: {
        $date: isoDate(
          new Date(
            new Date(paymentDate).getTime() +
              randomInt(1, 15) * 24 * 60 * 60 * 1000,
          ),
        ),
      },
    };
  }

  payments.push(payment);
}

writeJson("payments.json", payments);

// ============================================================
// SUMMARY
// ============================================================

console.log("\n========================================");
console.log("MongoDB dataset generation completed!");
console.log("========================================");

console.log(`
Output directory:
${OUTPUT_DIR}

Files:

users.json       ${users.length.toLocaleString()} documents
products.json    ${products.length.toLocaleString()} documents
orders.json      ${orders.length.toLocaleString()} documents
reviews.json     ${reviews.length.toLocaleString()} documents
payments.json    ${payments.length.toLocaleString()} documents
`);

console.log("Import commands:");

console.log(`
mongoimport --db ecommerce --collection users --file ${OUTPUT_DIR}/users.json --jsonArray

mongoimport --db ecommerce --collection products --file ${OUTPUT_DIR}/products.json --jsonArray

mongoimport --db ecommerce --collection orders --file ${OUTPUT_DIR}/orders.json --jsonArray

mongoimport --db ecommerce --collection reviews --file ${OUTPUT_DIR}/reviews.json --jsonArray

mongoimport --db ecommerce --collection payments --file ${OUTPUT_DIR}/payments.json --jsonArray
`);

console.log("Done!");
