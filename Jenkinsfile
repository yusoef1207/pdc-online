node('pdc-server')
{
	stage('Checkout')
	{
		checkout([$class: 'GitSCM', 
		branches: [[name: '*/develop']], 
		doGenerateSubmoduleConfigurations: false, 
		extensions: [], 
		submoduleCfg: [], 
		userRemoteConfigs: [[credentialsId: 'pdc', 
		url: 'https://github.com/yusoef1207/pdc-online.git']]])
	}

	stage('Build Docker Image')
	{
		sh 'docker build -t pdc-online:develop .'
	}

	stage('Run Docker Staging')
	{
		sh 'docker stop frontend-develop'
		sh 'docker run --rm --name frontend-develop -d -p 3002:3000 pdc-online:develop npm run frontend'
		sh 'docker stop backend-develop'
		sh 'docker run --rm --name backend-develop -d -p 4000:4000 pdc-online:develop npm run backend'
	}

	stage('Run Docker Prod')
	{
		sh 'docker stop frontend'
		sh 'docker run --rm --name frontend -d -p 80:3000 pdc-online:master npm run frontend'
	}

	stage('Cleanup Docker Image')
	{
		sh 'clean-docker-images'
	}
}
