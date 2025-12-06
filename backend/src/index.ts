import app from './app';
import { config } from './config';
import { connectDatabase } from './config/database';

const startServer = async () => {
  try {
    await connectDatabase();
    
    app.listen(config.port, () => {
      console.log(`🚀 Server running on port ${config.port}`);
      console.log(`📝 Environment: ${config.nodeEnv}`);
      console.log(`🍪 HttpOnly Cookies: ${config.useHttpOnlyCookies ? 'Enabled' : 'Disabled'}`);
      console.log(`☁️  Cloudinary: ${config.useCloudinary ? 'Enabled' : 'Disabled'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();


