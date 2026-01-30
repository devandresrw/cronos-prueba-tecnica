import { initializeApp, getApps, cert, App, ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let adminApp: App | undefined;

// Inicializar Firebase Admin solo en el servidor
if (typeof window === 'undefined') {
  if (!getApps().length) {
    let serviceAccount: ServiceAccount | undefined;

    // 1. Intentar cargar desde archivo local (ideal para desarrollo)
    try {
      // Usamos require dinámico o fs para leer el archivo si existe
      // Nota: En Next.js edge runtime esto podría fallar, pero firebase-admin es solo Node.js
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(process.cwd(), 'service-account.json');
      
      if (fs.existsSync(filePath)) {
        serviceAccount = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      }
    } catch (e) {
      // Ignorar errores de lectura de archivo (puede que no estemos en entorno local o sin permisos)
    }

    // 2. Si no hay archivo, intentar variable de entorno JSON (FIREBASE_SERVICE_ACCOUNT)
    if (!serviceAccount && process.env.FIREBASE_SERVICE_ACCOUNT) {
      try {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      } catch (error) {
        console.error('Error parsing FIREBASE_SERVICE_ACCOUNT JSON:', error);
      }
    }

    // 3. Si no hay JSON, intentar variables individuales
    if (!serviceAccount) {
      const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
      // Manejar saltos de línea tanto literales (\n) como reales
      const privateKey = process.env.FIREBASE_PRIVATE_KEY
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
        : undefined;

      if (projectId && clientEmail && privateKey) {
        serviceAccount = {
          projectId,
          clientEmail,
          privateKey,
        };
      }
    }

    if (serviceAccount) {
      try {
        adminApp = initializeApp({
          credential: cert(serviceAccount),
        });
      } catch (error) {
        console.error('Failed to initialize Firebase Admin:', error);
      }
    } else {
      console.warn('Firebase Admin credentials not found. Create a "service-account.json" file in root or set env vars.');
    }
  } else {
    adminApp = getApps()[0];
  }
}

// Exportar Firestore Admin
export const adminDb = adminApp ? getFirestore(adminApp) : null;
