module.exports = {
  apps : [{
    name: 'HPC-Portal',
    script: './dist/server.js',
    instances: 1,
    watch: true,
    ignore_watch: ["frontend", "node_modules", "supabase"]
  }],

  deploy : {
    production : {
      user : 'SSH_USERNAME',
      host : 'SSH_HOSTMACHINE',
      ref  : 'origin/master',
      repo : 'GIT_REPOSITORY',
      path : 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
