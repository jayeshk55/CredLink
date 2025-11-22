import * as admin from 'firebase-admin'

// Initialize Firebase Admin SDK once per runtime
function initFirebaseAdmin() {
  if (!admin.apps.length) {
    const projectId = process.env.FIREBASE_PROJECT_ID
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
    let privateKey = process.env.FIREBASE_PRIVATE_KEY
    const storageBucket = process.env.FIREBASE_STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET

    console.log('[Firebase Admin] Init start', {
      hasProjectId: !!projectId,
      hasClientEmail: !!clientEmail,
      hasPrivateKey: !!privateKey,
      storageBucket,
    })

    // Allow escaped newlines in env
    if (privateKey) {
      privateKey = privateKey.replace(/\\n/g, '\n')
    }

    try {
      if (projectId && clientEmail && privateKey) {
        console.log('[Firebase Admin] Using service account credentials')
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId,
            clientEmail,
            privateKey,
          }),
          storageBucket,
        })
      } else {
        console.warn('[Firebase Admin] Missing service account env vars, falling back to applicationDefault credentials')
        // Fallback to applicationDefault if service account not explicitly set
        if (storageBucket) {
          admin.initializeApp({
            credential: admin.credential.applicationDefault(),
            storageBucket,
          })
        } else {
          admin.initializeApp({
            credential: admin.credential.applicationDefault(),
          })
        }
      }
    } catch (error) {
      console.error('[Firebase Admin] Failed to initialize', error)
      throw error
    }
  }
}

// Initialize Firebase Admin SDK once per runtime
function getFirebaseAdmin() {
  if (!admin.apps.length) {
    initFirebaseAdmin()
  }
  return admin
}

export const adminAuth = () => getFirebaseAdmin().auth()
export const adminStorageBucket = () => getFirebaseAdmin().storage().bucket()
