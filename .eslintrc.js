module.exports = {
	"env": {
		"es6": true,
		"node": true
	},
	"extends": "eslint:recommended",

	"parserOptions": {
		"sourceType": "module",
		"ecmaVersion": 2017
	},
	"rules": {
		"no-console": "off",
		"no-unused-vars": ["warn", { "vars": "all", "args": "after-used", "ignoreRestSiblings": false }],
		"no-console": "off",
		"semi": 2
	}
};
