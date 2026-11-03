// Configuración de PM2 para levantar el backend.
// Uso (desde la raíz del repo, con el backend ya compilado):
//   pm2 start ecosystem.config.cjs --env production
module.exports = {
  apps: [
    {
      name: 'clinica-backend',
      cwd: './backend',
      script: 'dist/main.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      time: true,
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
