pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                // Pull code from GitHub repository
                checkout scm
            }
        }
        
        stage('Build') {
            steps {
                // Navigate to frontend directory and build
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }
        
        stage('Deploy') {
            steps {
                // Copy build artifacts to the server location
                sh 'sudo cp -R frontend/dist/ /var/www/vhosts/frontend/'
                
                // Reload Nginx
                sh 'sudo systemctl reload nginx'
            }
        }
    }
    
    post {
        success {
            echo 'Deployment completed successfully!'
        }
        failure {
            echo 'Deployment failed!'
        }
    }
}
