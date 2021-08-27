import CustomEvents from '../lib/CustomEvents';
import '../scss/GrandeBocce.scss';


class GrandeBocce {


	constructor() {
		this._scene = null;
		this._evts = new CustomEvents();
		this._evtsIds = [];

		this._init();
		this._homePage();
	}


	_init() {
		this._scene = document.getElementById('app-scene');
	}


	/* Pages */


	_homePage() {
		this._fetchTemplate('src/html/home.html')
			.then(() => {
				this._evtsIds.push(this._evts.addEvent('click', document.getElementById('new-game'), this._newGamePage, this));
				this._evtsIds.push(this._evts.addEvent('click', document.getElementById('scoreboard'), this._scoreBoardPage, this));
				this._evtsIds.push(this._evts.addEvent('click', document.getElementById('stats'), this._statsPage, this));
				this._evtsIds.push(this._evts.addEvent('click', document.getElementById('rules'), this._rulesPage, this));
			})
			.catch(err => console.log('Failed to retrieve homepage html content.', err));	
	}


	_newGamePage() {
		this._fetchTemplate('src/html/game.html')
			.then(() => {
				this._evtsIds.push(this._evts.addEvent('click', document.getElementById('1v1'), this._startNewGame, this));				
				this._evtsIds.push(this._evts.addEvent('click', document.getElementById('2v2'), this._startNewGame, this));				
				this._evtsIds.push(this._evts.addEvent('click', document.getElementById('3v3'), this._startNewGame, this));				
				this._evtsIds.push(this._evts.addEvent('click', document.getElementById('homepage'), this._homePage, this));				
			})
			.catch(err => console.log('Failed to retrieve game html content.', err));	
	}


	_scoreBoardPage() {
		this._fetchTemplate('src/html/scoreboard.html')
			.then(() => {
				this._evtsIds.push(this._evts.addEvent('click', document.getElementById('homepage'), this._homePage, this));		    
			})
			.catch(err => console.log('Failed to retrieve scoreboard html content.', err));	
	}


	_statsPage() {
		this._fetchTemplate('src/html/stats.html')
			.then(() => {
				this._evtsIds.push(this._evts.addEvent('click', document.getElementById('homepage'), this._homePage, this));		    
			})
			.catch(err => console.log('Failed to retrieve stats html content.', err));	
	}


	_rulesPage() {
		this._fetchTemplate('src/html/rules.html')
			.then(() => {
				this._evtsIds.push(this._evts.addEvent('click', document.getElementById('homepage'), this._homePage, this));		    
			})
			.catch(err => console.log('Failed to retrieve rules html content.', err));		
	}


	/* Game routines */


	_startNewGame(e) {
		this._clearEvents();		
		console.log(e)
	}


	/* Utils */


	_clearEvents() {
		for (let i = 0; i < this._evtsIds.length; ++i) {
			this._evts.removeEvent(this._evtsIds[i]);
		}
	}


	_fetchTemplate(url) {
		return new Promise((resolve, reject) => {
			this._clearEvents();
			fetch(url)
				.then(data => {
					data.text().then(htmlString => {
						this._scene.innerHTML = '';
						this._scene.appendChild(this._parseTemplate(htmlString));					
						resolve();
					})
					.catch(reject);
				})
				.catch(reject);
		});
	}


	_parseTemplate(htmlString) {
		const parser = new DOMParser();
    const dom = parser.parseFromString(htmlString, 'text/html');
    return dom.body.firstChild;
	}


}


window.Bocce = new GrandeBocce();
export default GrandeBocce;
