pipeline {
    agent any


    stages {
        stage('Build') {
            steps {
                sh 'npm install --unsafe-perm'
            }
        }
        stage('Deploy') {
            steps {
                 sh 'chmod +x ./scripts/stop-app.sh'
                 sh './scripts/stop-app.sh'
                 sh 'chmod +x ./scripts/start-app.sh'
                 sh './scripts/start-app.sh'
             }
        }
    }
}