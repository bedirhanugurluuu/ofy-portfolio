import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Database connection
    const connection = await mysql.createConnection({
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      port: process.env.DATABASE_PORT || 3306,
    });

    // Test query
    const [rows] = await connection.execute('SELECT 1 as test');
    
    await connection.end();

    res.status(200).json({ 
      message: 'Database connection successful',
      test: rows[0],
      env: {
        host: process.env.DATABASE_HOST ? 'Set' : 'Not set',
        user: process.env.DATABASE_USER ? 'Set' : 'Not set',
        password: process.env.DATABASE_PASSWORD ? 'Set' : 'Not set',
        database: process.env.DATABASE_NAME ? 'Set' : 'Not set',
        port: process.env.DATABASE_PORT ? 'Set' : 'Not set',
      }
    });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ 
      message: 'Database connection failed',
      error: error.message,
      env: {
        host: process.env.DATABASE_HOST ? 'Set' : 'Not set',
        user: process.env.DATABASE_USER ? 'Set' : 'Not set',
        password: process.env.DATABASE_PASSWORD ? 'Set' : 'Not set',
        database: process.env.DATABASE_NAME ? 'Set' : 'Not set',
        port: process.env.DATABASE_PORT ? 'Set' : 'Not set',
      }
    });
  }
}
