pipeline {
    agent any

    environment {
        NODE_ENV = "production"
    }

    stages {
    //     stage('Install Dependencies') {
    //         steps {
    //             dir('frontend') {
    //                 sh 'npm ci'
    //             }
    //         }
    //     }

        stage('Build App') {
            steps {
                dir('frontend') {
                    sh 'npm run build'
                }
            }
        }

        stage('Deploy to Nginx') {
            steps {
                // Adjust `dist` to `build` if you're using Create React App
                sh '''
                    sudo cp -R frontend/build/* /var/www/vhosts/frontend/
                    sudo nginx -s reload
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Deployment completed!'
        }
        failure {
            echo '❌ Deployment failed.'
        }
    }
}
