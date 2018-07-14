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
		sh 'docker run --rm --name frontend-staging -d -p 3002:3000 pdc-online:develop npm run front'
	}

	stage('Cleanup Docker Image')
	{
		sh 'clean-docker-images'
	}
}