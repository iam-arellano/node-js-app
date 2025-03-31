pipeline {
    agent any
    
    environment {
        SCANNER_HOME= tool 'sonar-scanner'                      
        
        /// THIS IS FOR DOCKER CRED TO PUSH 
        APP_NAME = "nodejs-app"      
        RELEASE = "1.0.0"
        DOCKER_USER = "raemondarellano"
        DOCKER_PASS = 'jenkins-docker-credentials'              
        IMAGE_NAME = "${DOCKER_USER}" + "/" + "${APP_NAME}"  
        IMAGE_TAG = "${RELEASE}-${BUILD_NUMBER}"
        JENKINS_API_TOKEN = credentials("JENKINS_API_TOKEN")
        
    }

    stages {
        stage("Cleanup Workspace") {
            steps {
                cleanWs()
            }
        }
        stage("Checkout from SCM"){
            steps {
                git branch: 'master', credentialsId: 'github', url: 'https://github.com/iam-arellano/node-js-app.git'
                    echo 'Git Checkout Completed'
            }
        }
           stage ('DEV Approve') {                 //aproval before proceed
             steps {
                echo "Taking approval from DEV Manager for QA Deployment"
                timeout(time: 7, unit: 'DAYS') {
                input message: 'Do you want to deploy?', submitter: 'admin'
              }
            }
        }

    }
}

