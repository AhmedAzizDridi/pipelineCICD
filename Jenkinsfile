pipeline {
  agent any

  tools {
    nodejs 'nodejs-25.5'
  }
  environment {
    MONGO_URL = 'mongodb://172.24.128.1:27017/SuperData'
  }

  stages {
    
    stage('testing') {
      steps {
        sh '''
          npm --version
          node --version
        '''
        sh 'echo "MONGO_URL=$MONGO_URL"'
        

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
    sh '''
      node -e "require('net').connect(27017,'172.24.128.1').on('connect',()=>{console.log('✅ Mongo reachable from Jenkins');process.exit(0)}).on('error',(e)=>{console.error('❌ Mongo NOT reachable:',e.message);process.exit(1)})"
'''

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
