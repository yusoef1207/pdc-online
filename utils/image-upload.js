import axios from 'axios'

export function imageUpload (img) {
	return axios({
		method: 'post',
		url: 'https://api.imgur.com/3/image',
		data: {
			image : img
		},
		headers : {
			Authorization : 'CLIENT-ID d8728f22a503a6b'
		}
	})
};