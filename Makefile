build: css js

css: dist/css/output.css
dist/css/output.css:
	@npm run css

js: dist/main.js
dist/main.js:
	@npm run js