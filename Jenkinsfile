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
		sh 'docker stop frontend-staging'
		sh 'docker run --rm --name frontend-develop -d -p 3002:3002 pdc-online:develop npm run front'
		sh 'docker run --rm --name backend-develop -d -p 4002:4002 pdc-online:develop npm run staging'
	}

	stage('Cleanup Docker Image')
	{
		sh 'clean-docker-images'
	}
}