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
              // sh 'mkdir -p odc-report'
            dependencyCheck(
              odcInstallation: 'OWASP-DepCheck-10',
              additionalArguments: '--scan . --out odc-report --format ALL --prettyPrint'
            )
           // sh 'ls -la odc-report || true'
            }
        }
            }
        }
        stage('report html'){
            steps{
            publishHTML([allowMissing: true, alwaysLinkToLastBuild: true, icon: '', keepAll: true, reportDir: './', reportFiles: 'dependency-check-jenkins.html', reportName: 'HTML Report', reportTitles: '', useWrapperFileDirectly: true])
        }
    }}
/* post {
    always {
      archiveArtifacts artifacts: 'odc-report/**', allowEmptyArchive: true
      dependencyCheckPublisher pattern: 'odc-report/dependency-check-report.xml'
    }
  } */

}


