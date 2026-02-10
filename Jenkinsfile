pipeline {
    agent any

    tools {
        nodejs 'nodejs-25.5'
    }
    stages {
        stage('testing') {
            steps {
                sh '''
                    npm --version
                    node --version '''
        }
    }
    }
}


