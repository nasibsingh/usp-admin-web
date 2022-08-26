pipeline {
    agent any
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
