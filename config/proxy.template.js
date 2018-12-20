const environment = 'qa1'

const proxy = ['/system']

const config = {
	qa1: {
		baseUrl: '',
		token: '',
		cookie: ''
	},
	qa2: {
		baseUrl: '',
		token: '',
		cookie: ''
	},
	qa3: {
		baseUrl: '',
		token: '',
		cookie: ''
	},
	dev: {
		baseUrl: '',
		token: '',
		cookie: ''
	}
}

const headers = config[environment];

const proxyList = proxy.map((item)=>[item, headers.baseUrl + item]);

function headerMiddleware (req, res, next) {
    headers.cookie && (req.headers.cookie = headers.cookie);
    headers.token && (req.headers.token = headers.token);
    next();
}

module.exports ={
	proxy: proxyList,
	headerMiddleware: headerMiddleware
}
