module.exports = {
  apps : [{
    name: 'HPC-Portal',
    script: 'npm',
    args: 'run linuxRun',
    exec_mode: "fork",
    cwd: "/var/www/HPC-Portal",
    instances: 1,
    watch: true,
    restart_delay: 10000,
    ignore_watch: ["frontend/node_modules", 
      "node_modules", "supabase", "package-lock.json", 
      "package.json", "generated/prisma", "dist", "frontend"]
  },
  {
    name: 'HPC-Data',
    script: 'npm',
    args: 'run lclient-build',
    exec_mode: "fork",
    cwd: "/var/www/HPC-Portal",
    instances: 1,
    watch: true,
    watch_delay: 10000,
    ignore_watch: ["frontend/node_modules", 
      "node_modules", "supabase", "package-lock.json", 
      "package.json", "generated/prisma", "dist", "frontend/dist",
    "frontend/package-lock.json", "frontend/package.json"]
  }],

  deploy : {
    production : {
      user : 'SSH_USERNAME',
      host : 'SSH_HOSTMACHINE',
      ref  : 'origin/master',
      repo : 'GIT_REPOSITORY',
      path : 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy' : 'npm run linuxRUn',
      'pre-setup': ''
    }
  }
};
