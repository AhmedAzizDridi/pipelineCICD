pipeline {
  agent any

  tools {
    nodejs 'nodejs-25.5'
  }
  environment {
    MONGO_URL = 'mongodb://127.0.0.1:27017/SuperData'
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

    stage('Dep Scanning') {
      parallel {
        stage('Npm audit') {
          steps {
            sh '''
              npm audit --audit-level=critical || true
              echo "npm audit exit code: $?"
            '''
          }
        }

        stage('OWASP dependency checker') {
          steps {
            sh 'mkdir -p odc-report'

            dependencyCheck(
              odcInstallation: 'OWASP-DepCheck-10',
              additionalArguments: '--scan . --out odc-report --format ALL --prettyPrint'
            )

            sh 'ls -la odc-report || true'
          }
        }

      }
    }
   stage('Testing') {
  
  steps {
    sh 'npm test'
  }
}
  }

  post {
    always {
      archiveArtifacts artifacts: 'odc-report/**', allowEmptyArchive: true

      dependencyCheckPublisher pattern: 'odc-report/dependency-check-report.xml'

      junit allowEmptyResults: true, keepProperties: true, testResults: 'odc-report/dependency-check-junit.xml'

      publishHTML(target: [
        allowMissing: true,
        alwaysLinkToLastBuild: true,
        keepAll: true,
        reportDir: 'odc-report',
        reportFiles: 'dependency-check-report.html',
        reportName: 'OWASP Dependency-Check HTML Report'
      ])
    }
  }

}
