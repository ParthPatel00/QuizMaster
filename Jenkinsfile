pipeline {
    agent any

    environment {
        NODE_ENV = "production"
    }

    stages {
        stage('Clone Repo') {
            steps {
                 git branch: 'main', credentialsId: 'DP_Jenkins', url: 'https://github.com/ParthPatel00/QuizMaster.git' // or use SSH
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build App') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Deploy to Nginx') {
            steps {
                sh '''
                    sudo rm -rf /var/www/vhosts/frontend/*
                    sudo cp -R dist/* /var/www/vhosts/frontend/
                    sudo nginx -s reload
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Deployment completed successfully!'
        }
        failure {
            echo '❌ Deployment failed.'
        }
    }
}
