pipeline {
  agent {
    node {
      label 'nodejs'
    }
  }

  parameters {
    string(name: 'TAG_NAME', defaultValue: '', description: '')
  }

  environment {
    DOCKER_CREDENTIAL_ID = 'private-registry-id'
    GITHUB_CREDENTIAL_ID = 'github-id'
    KUBECONFIG_CREDENTIAL_ID = 'kubeconfig-triangle-id'
    NPM_CREDENTIAL_ID = 'npm-registry-id'
    REGISTRY = 'registry.cn-hangzhou.aliyuncs.com'
    DOCKERHUB_NAMESPACE = 'gradii'
    GITHUB_ACCOUNT = 'linpolen'
    APP_NAME = 'workbench'
    BRANCH_NAME =  "${BRANCH_NAME.replaceAll(/[^0-9a-zA-Z\-]/, '-').replaceAll(/-{2,}/, '-').toLowerCase()}"
    CYPRESS_INSTALL_BINARY = '0'
  }

  stages {

//     stage('unit test') {
//       steps {
//         container('maven') {
//           sh 'mvn clean -o -gs `pwd`/configuration/settings.xml test'
//         }
//
//       }
//     }

    stage('prepare tools') {
      steps {
        container('nodejs') {
          withCredentials([usernamePassword(passwordVariable : 'NPM_PASSWORD' ,usernameVariable : 'NPM_USERNAME' ,credentialsId : "$NPM_CREDENTIAL_ID" ,)]) {
            sh 'npm config set @gradii:registry https://npm.pkg.github.com/'
            sh 'npm config set //npm.pkg.github.com/:_authToken $NPM_PASSWORD'
          }
          sh 'yarn node scripts/cache-node-modules.js'
          sh 'yarn install'
        }
      }
    }

    stage('build & push npm package') {
      when {
        anyOf {
          branch 'release'
        }
      }
      steps {
        container('nodejs') {
          sh 'yarn run build'
//           sh 'docker build -f Dockerfile-online -t $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:SNAPSHOT-$BRANCH_NAME-$BUILD_NUMBER .'
//           withCredentials([usernamePassword(passwordVariable : 'DOCKER_PASSWORD' ,usernameVariable : 'DOCKER_USERNAME' ,credentialsId : "$DOCKER_CREDENTIAL_ID" ,)]) {
//             sh 'echo "$DOCKER_PASSWORD" | docker login $REGISTRY -u "$DOCKER_USERNAME" --password-stdin'
//             sh 'docker push  $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:SNAPSHOT-$BRANCH_NAME-$BUILD_NUMBER'
//           }
        }
      }
    }

    stage('build devops workbench api & push image') {
//       when {
//         branch 'master'
//       }
      steps {
        container('nodejs') {
          sh 'yarn run nx build devops'
          sh 'yarn run nx build workbench'
          sh 'docker build -f deploy/Dockerfile-fe -t $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME-fe:$BRANCH_NAME-$BUILD_NUMBER .'
          withCredentials([usernamePassword(passwordVariable : 'DOCKER_PASSWORD' ,usernameVariable : 'DOCKER_USERNAME' ,credentialsId : "$DOCKER_CREDENTIAL_ID" ,)]) {
            sh 'echo "$DOCKER_PASSWORD" | docker login $REGISTRY -u "$DOCKER_USERNAME" --password-stdin'
            sh 'docker push  $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:$BRANCH_NAME-$BUILD_NUMBER'
          }
        }
        container('nodejs') {
          sh 'yarn run nx build api'
          sh 'docker build -f deploy/Dockerfile-fe -t $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME-fe:$BRANCH_NAME-$BUILD_NUMBER .'
          withCredentials([usernamePassword(passwordVariable : 'DOCKER_PASSWORD' ,usernameVariable : 'DOCKER_USERNAME' ,credentialsId : "$DOCKER_CREDENTIAL_ID" ,)]) {
            sh 'echo "$DOCKER_PASSWORD" | docker login $REGISTRY -u "$DOCKER_USERNAME" --password-stdin'
            sh 'docker push  $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:$BRANCH_NAME-$BUILD_NUMBER'
          }
        }
      }
    }

    stage('push latest') {
//       when {
//         branch 'master'
//       }
      steps {
        container('nodejs') {
          sh 'docker tag  $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME-fe:$BRANCH_NAME-$BUILD_NUMBER $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:latest '
          sh 'docker push  $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME-fe:latest '
        }
        container('nodejs') {
          sh 'docker tag  $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME-api:$BRANCH_NAME-$BUILD_NUMBER $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:latest '
          sh 'docker push  $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME-api:latest '
        }

      }
    }

    stage('deploy to dev') {
      steps {
//         input(id: 'deploy-to-dev', message: 'deploy to dev?')
        kubernetesDeploy(configs: 'deploy/dev-ol/**', enableConfigSubstitution: true, kubeconfigId: "$KUBECONFIG_CREDENTIAL_ID")
      }
    }
//
//     stage('deploy to production') {
//       steps {
//         input(id: 'deploy-to-production', message: 'deploy to production?')
//         kubernetesDeploy(configs: 'deploy/prod-ol/**', enableConfigSubstitution: true, kubeconfigId: "$KUBECONFIG_CREDENTIAL_ID")
//       }
//     }

  }

}