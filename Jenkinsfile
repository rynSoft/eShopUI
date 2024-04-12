node {
    def app
    parameters {
            choice(name: "NODE_ENV", choices: ["test", "production",], description: "Choose Environment")
        }
    stage ('Clean Workspace') {
        cleanWs()
    }
    
    stage ('Git Checkout') {
      git branch: 'main', credentialsId: '74ef8903-9236-47e4-b8ad-79f7e24157ed', url: 'https://github.com/rynSoft/productionUI.git'
    }
    
    stage('Remove Existing Image') {
        sh('docker image rmi techiz-${NODE_ENV}-fe || (echo "Image techiz-${NODE_ENV}-fe didn\'t exist so not removed."; exit 0)')
    }
      
    stage('Build Image') {
        sh('docker build -t techiz-${NODE_ENV}-fe .  --build-arg NODE_ENV=${NODE_ENV} --no-cache')
    }
      
    stage('Save Tar File') {
        if (params.NODE_ENV == 'production')
        {
            sh('docker save techiz-${NODE_ENV}-fe > techiz-${NODE_ENV}-fe.tar')
        }
    }  
    
    stage('Remove Existing Container') {
        if (params.NODE_ENV == 'test')
        {
            sh('docker rm -f techiz-${NODE_ENV}-fe')
        }
    }
    
    stage('Deploy to Test') {
        if (params.NODE_ENV == 'test')
        {
            sh('docker run -d --restart unless-stopped -p 8020:80 --name techiz-${NODE_ENV}-fe techiz-${NODE_ENV}-fe')
        }
    }
   
}
