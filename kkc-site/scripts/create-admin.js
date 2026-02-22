/**
 * One-time script to create the admin user and grant admin role.
 * 
 * Admin credentials:
 *   Email:    shyakayvany@gmail.com
 *   Password: shyaka1234
 * 
 * Prerequisites:
 *   1. Firebase project with Email/Password sign-in enabled (Authentication).
 *   2. Firestore Database created.
 *   3. Service account key: Firebase Console → Project Settings → Service accounts
 *      → "Generate new private key" → save as scripts/firebase-service-account.json
 * 
 * Run (from project root):
 *   Windows (PowerShell):
 *     $env:GOOGLE_APPLICATION_CREDENTIALS="D:\KKC\kkc-site\scripts\firebase-service-account.json"
 *     $env:FIREBASE_PROJECT_ID="your-project-id"
 *     node scripts/create-admin.js
 * 
 *   Or if you use .env.local with FIREBASE_PROJECT_ID, run:
 *     node -r dotenv/config scripts/create-admin.js
 *     (after: npm install dotenv --save-dev)
 */

const admin = require("firebase-admin");
const path = require("path");

const ADMIN_EMAIL = "shyakayvany@gmail.com";
const ADMIN_PASSWORD = "shyaka1234";

const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
if (!projectId) {
  console.error("Missing FIREBASE_PROJECT_ID or NEXT_PUBLIC_FIREBASE_PROJECT_ID. Set it in .env or pass it when running.");
  process.exit(1);
}

// Prefer explicit path, then env, then default next to this script
const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS
  || process.env.FIREBASE_SERVICE_ACCOUNT_PATH
  || path.join(__dirname, "firebase-service-account.json");

let app;
try {
  app = admin.initializeApp({
    projectId,
    credential: admin.credential.cert(require(credPath)),
  });
} catch (e) {
  console.error("Failed to initialize Firebase Admin. Ensure GOOGLE_APPLICATION_CREDENTIALS (or FIREBASE_SERVICE_ACCOUNT_PATH) points to your service account JSON file.");
  console.error(e.message);
  process.exit(1);
}

const auth = admin.auth();
const db = admin.firestore();

async function main() {
  let uid;
  try {
    const user = await auth.getUserByEmail(ADMIN_EMAIL);
    uid = user.uid;
    console.log("User already exists:", ADMIN_EMAIL, "UID:", uid);
  } catch (err) {
    if (err.code === "auth/user-not-found") {
      const newUser = await auth.createUser({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        emailVerified: true,
      });
      uid = newUser.uid;
      console.log("Created user:", ADMIN_EMAIL, "UID:", uid);
    } else {
      throw err;
    }
  }

  await db.collection("roles").doc(uid).set({ role: "admin", admin: true }, { merge: true });
  console.log("Admin role set for UID:", uid);
  console.log("\nYou can now sign in on the website with:");
  console.log("  Email:   ", ADMIN_EMAIL);
  console.log("  Password:", ADMIN_PASSWORD);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
