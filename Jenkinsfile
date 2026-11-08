
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

        stage('Import Images to K3s') {
            steps {
                sh '''
                    docker save travelbooking-frontend:latest travelbooking-backend:latest | sudo -n k3s ctr images import -
                '''
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                    sudo -n k3s kubectl apply -f k8s/backend-service.yaml
                    sudo -n k3s kubectl apply -f k8s/frontend-service.yaml
                    sudo -n k3s kubectl apply -f k8s/backend-deployment.yaml
                    sudo -n k3s kubectl apply -f k8s/frontend-deployment.yaml

                    sudo -n k3s kubectl rollout restart deployment/travelbooking-backend -n travelbooking
                    sudo -n k3s kubectl rollout restart deployment/travelbooking-frontend -n travelbooking

                    sudo -n k3s kubectl rollout status deployment/travelbooking-backend -n travelbooking --timeout=180s
                    sudo -n k3s kubectl rollout status deployment/travelbooking-frontend -n travelbooking --timeout=180s
                '''
            }
        }
    }

    post {
        success {
            echo 'TravelBooking images built and deployed successfully!'
        }
        failure {
            echo 'TravelBooking pipeline failed. Check console output.'
        }
    }
}

