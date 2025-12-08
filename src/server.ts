import app from './app';

async function startServer(): Promise<void> {
  try {
    app.listen();

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();