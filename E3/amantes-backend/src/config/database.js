import mongoose from 'mongoose';

/**
 * @param {string} uri
 */
export async function connectMongo(uri) {
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
}

export async function disconnectMongo() {
  await mongoose.disconnect();
}
