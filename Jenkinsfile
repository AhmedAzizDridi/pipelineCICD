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
          node --version
        '''
      }
    }

    stage('installing dependencies') {
      steps {
        sh 'npm install --no-audit'
      }
    }

    stage('Npm audit') {
      steps {
        script {
          int code = sh(script: 'npm audit --audit-level=critical', returnStatus: true)
          if (code != 0) {
            unstable("npm audit found vulnerabilities (exit code: ${code})")
          }
        }
      }
    }
  }
}
