
pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Verify Docker') {
            steps {
                sh 'docker --version'
                sh 'docker compose version'
            }
        }

        stage('Build Docker Images') {
            steps {
                sh '''
                    docker build -t travelbooking-frontend:latest ./client
                    docker build -t travelbooking-backend:latest ./server
                '''
            }
        }
    }

    post {
        success {
            echo 'TravelBooking Docker images built successfully!'
        }
        failure {
            echo 'TravelBooking build failed. Check console output.'
        }
    }
}

