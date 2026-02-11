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
        stage('installing dependencies') {
            steps {
                sh 'npm install --no-audit'
            }
        }
        stage('Dep Scanning'){
            parallel{
        stage('Npm audit'){
            steps {
                sh '''
                    npm audit --audit-level=critical
                    echo $?
                '''
            }
        }

        stage('OWASP dependency checker'){
            steps{
                dependencyCheck additionalArguments:
                '''
                    --scan \'. /\'
                    --out \'./\'
                    --format \'ALL\'
                    --prettyPrint ''' , odcInstallation: 'OWASP-DepCheck-10'
            }
        }
            }
        }
    }
}


