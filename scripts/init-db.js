// scripts/init-db.js
/**
 * Database initialization script
 * 
 * This script can be used to initialize the database with essential
 * schema migrations when deploying to a new environment.
 * 
 * Usage: 
 * - Deploy your app
 * - Run this script once: `node scripts/init-db.js`
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Function to load environment variables from .env files if dotenv isn't configured
function loadEnv() {
  try {
    const envFiles = ['.env', '.env.local', '.env.production.local', '.env.production'];
    let loaded = false;

    for (const file of envFiles) {
      const filePath = path.join(process.cwd(), file);
      if (fs.existsSync(filePath)) {
        console.log(`Loading environment from ${file}`);
        const envContent = fs.readFileSync(filePath, 'utf8');
        const envVars = envContent.split('\n');
        
        for (const line of envVars) {
          // Skip comments and empty lines
          if (line.trim().startsWith('#') || line.trim() === '') continue;
          
          const [key, ...valueParts] = line.split('=');
          const value = valueParts.join('=').trim();
          if (key && value && !process.env[key.trim()]) {
            process.env[key.trim()] = value.replace(/^["'](.*)["']$/, '$1'); // Remove quotes if present
          }
        }
        
        loaded = true;
        break;
      }
    }

    if (!loaded) {
      console.warn('No .env file found. Make sure DATABASE_URL is set in your environment.');
    }
  } catch (error) {
    console.error('Error loading environment variables:', error);
  }
}

// Main function
async function main() {
  try {
    // Load environment variables
    loadEnv();
    
    // Validate database URL
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL is not set! Please set it in your environment or .env file.');
      process.exit(1);
    }

    console.log('Starting database initialization...');

    // Check if Prisma client is generated
    const prismaClientPath = path.join(process.cwd(), 'node_modules', '.prisma', 'client');
    if (!fs.existsSync(prismaClientPath)) {
      console.log('Generating Prisma client...');
      execSync('npx prisma generate', { stdio: 'inherit' });
    }

    // Apply migrations if they exist
    const migrationsDir = path.join(process.cwd(), 'prisma', 'migrations');
    if (fs.existsSync(migrationsDir) && fs.readdirSync(migrationsDir).length > 0) {
      console.log('Applying existing migrations...');
      try {
        execSync('npx prisma migrate deploy', { stdio: 'inherit' });
      } catch (error) {
        console.error('Error applying migrations:', error);
        console.log('Trying database push as fallback...');
        execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
      }
    } else {
      console.log('No migrations found, pushing schema...');
      execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
    }
    
    // Create demo user if in demo mode
    if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
      console.log('Demo mode detected, creating demo user...');
      
      // Use the seed script if available
      if (fs.existsSync(path.join(process.cwd(), 'prisma', 'seed.ts'))) {
        console.log('Running seed script...');
        execSync('npx prisma db seed', { stdio: 'inherit' });
      } else {
        console.log('No seed script found.');
      }
    }

    console.log('✅ Database initialization completed successfully');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

// Run the main function
main();