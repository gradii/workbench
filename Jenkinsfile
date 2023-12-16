pipeline {
  agent {
    node {
      label 'nodejs-large'
    }
  }

  parameters {
    booleanParam(
            name: 'FORCE_DEPLOY',
            defaultValue: false,
            description: '强制部署 ?'
        )
  }

  environment {
    DOCKER_CREDENTIAL_ID = 'private-registry-id'
    GITHUB_CREDENTIAL_ID = 'github-id'
    KUBECONFIG_CREDENTIAL_ID = 'kubeconfig-triangle-id'
    NPM_CREDENTIAL_ID = 'npm-registry-id'
    REGISTRY = 'registry.cn-hangzhou.aliyuncs.com'
    DOCKERHUB_NAMESPACE = 'gradii'
    GITHUB_ACCOUNT = 'linpolen'
    APP_NAME = 'workbench-design'
    BRANCH_NAME =  "${BRANCH_NAME.replaceAll(/[^0-9a-zA-Z\-]/, '-').replaceAll(/-{2,}/, '-').toLowerCase()}"
    CYPRESS_INSTALL_BINARY = '0'
  }

  stages {
    stage('prepare tools') {
      steps {
        container('nodejs') {

          sh 'yarn node scripts/cache-node-modules.js $APP_NAME'
          sh 'yarn install'
        }
      }
    }

    stage('install & init kubectl') {
      steps {
        container('nodejs') {
          sh 'curl -LO "https://cdn.ks.reiki-punch.com/kubernetes/kubectl"'
          sh 'install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl'
          sh 'kubectl version --client'
          withCredentials([kubeconfigContent(credentialsId : "$KUBECONFIG_CREDENTIAL_ID" ,variable : 'KUBECONFIG')]) {
            sh '''
              set +x
              mkdir ~/.kube
              echo "$KUBECONFIG" > ~/.kube/config
            '''
          }
          sh 'kubectl cluster-info'
        }
      }
    }


    stage('deploy workbench-design') {
      environment {
        APP_NAME = 'workbench-design'
      }
      when {
        anyOf {
          expression { params.FORCE_DEPLOY ==~ /(?i)(Y|YES|T|TRUE|ON|RUN)/ }
          allOf {
            not {
              branch 'release'
            }
            anyOf {
              changeset 'apps/**'
              changeset 'libs/**'
            }
          }
        }
      }
      steps {
        container('nodejs') {
          sh 'yarn build design --configuration=dev --verbose'
          sh 'yarn build workbench --verbose'
          sh 'docker build -f Dockerfile-design-workbench -t $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:$BRANCH_NAME-$BUILD_NUMBER .'
          withCredentials([usernamePassword(passwordVariable : 'DOCKER_PASSWORD' ,usernameVariable : 'DOCKER_USERNAME' ,credentialsId : "$DOCKER_CREDENTIAL_ID" ,)]) {
            sh 'echo "$DOCKER_PASSWORD" | docker login $REGISTRY -u "$DOCKER_USERNAME" --password-stdin'
            sh 'docker push  $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:$BRANCH_NAME-$BUILD_NUMBER'
          }
        }
        //'push latest'
        container('nodejs') {
          sh 'docker tag  $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:$BRANCH_NAME-$BUILD_NUMBER $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:latest '
          sh 'docker push  $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:latest '
        }
        //'deploy to dev'
        container('nodejs') {
          sh '''
          find deploy/dev-ol -type f |while read FILE; \
          do envsubst < "$FILE" > "$FILE".tmp&&mv "$FILE".tmp "$FILE"; \
          done;
          '''
          sh 'kubectl apply -f deploy/dev-ol'
        }
        // kubernetesDeploy(configs: 'deploy/dev-ol/**', enableConfigSubstitution: true, kubeconfigId: "$KUBECONFIG_CREDENTIAL_ID")
      }
    }

    stage('deploy workbench-design-backend') {
      environment {
        APP_NAME = 'workbench-design-backend'
      }
      when {
        anyOf {
          expression { params.FORCE_DEPLOY ==~ /(?i)(Y|YES|T|TRUE|ON|RUN)/ }
          allOf {
            not {
              branch 'release'
            }
            anyOf {
              changeset 'apps/backend/**'
              changeset 'libs/**'
            }
          }
        }
      }
      steps {
        container('nodejs') {
          sh 'yarn build backend'
          sh 'docker build -f Dockerfile-backend -t $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:$BRANCH_NAME-$BUILD_NUMBER .'
          withCredentials([usernamePassword(passwordVariable : 'DOCKER_PASSWORD' ,usernameVariable : 'DOCKER_USERNAME' ,credentialsId : "$DOCKER_CREDENTIAL_ID" ,)]) {
            sh 'echo "$DOCKER_PASSWORD" | docker login $REGISTRY -u "$DOCKER_USERNAME" --password-stdin'
            sh 'docker push  $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:$BRANCH_NAME-$BUILD_NUMBER'
          }
        }
        //'push latest'
        container('nodejs') {
          sh 'docker tag  $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:$BRANCH_NAME-$BUILD_NUMBER $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:latest '
          sh 'docker push  $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:latest '
        }
        //'deploy to dev'
        container('nodejs') {
          sh '''
          find deploy/dev-api -type f |while read FILE; \
          do envsubst < "$FILE" > "$FILE".tmp&&mv "$FILE".tmp "$FILE"; \
          done;
          '''
          sh 'kubectl apply -f deploy/dev-api'
        }
      }
    }
  }
}
