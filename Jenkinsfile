pipeline {
    agent any
    parameters {
    choice(
        name: 'BranchName',
        choices: "${BRANCH_NAMES}",
        description: 'to refresh the list, go to configure, disable "this build has parameters", launch build (without parameters)to reload the list and stop it, then launch it again (with parameters)'
    )
}
    stages {
        stage('Git'){
            steps{
                git branch: 'main', credentialsId: 'git_ssh', url: 'git@github.com:nasibsingh/usp-admin-web.git'
                sh 'pwd'
                sh 'ls'
                
            }
        }
        stage ('build') {
            steps{
                sh 'npm i'
                sh 'npm run build'
            }
        }
        stage ('zip stage') {
            steps {
                sh 'zip dist$BUILD_NUMBER.zip dist'
            }
        }
        stage ('Upload') {
            steps {
                sh 'aws s3 cp /var/jenkins_home/workspace/s3/dist$BUILD_NUMBER.zip s3://usp-pipeline-test/'
            }
        }
    }
}
