build: css js

watch:
	@make serve & make dev
serve:
	@npx live-server public --wait=1000 --port=8081
dev:
	@npm run dev
	
css: public/styles.css
public/styles.css:
	@npm run css

js: public/main.js
public/main.js:
	@npm run js