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
		this._clearEvents();
		this._fetchTemplate('src/html/home.html')
			.then(data => {
				this._scene.innerHTML = '';
		    this._scene.appendChild(this._parseTemplate(data));
		    this._evtsIds.push(this._evts.addEvent('click', document.getElementById('new-game'), this._newGamePage, this));
		    this._evtsIds.push(this._evts.addEvent('click', document.getElementById('scoreboard'), this._scoreBoardPage, this));
		    this._evtsIds.push(this._evts.addEvent('click', document.getElementById('stats'), this._statsPage, this));
		    this._evtsIds.push(this._evts.addEvent('click', document.getElementById('rules'), this._rulesPage, this));
			})
			.catch(err => console.log('Failed to retrieve homepage html content.', err));	
	}


	_newGamePage() {
		this._clearEvents();
	}


	_scoreBoardPage() {
		this._clearEvents();
		this._fetchTemplate('src/html/scoreboard.html')
			.then(data => {
				this._scene.innerHTML = '';
		    this._scene.appendChild(this._parseTemplate(data));
		    this._evtsIds.push(this._evts.addEvent('click', document.getElementById('homepage'), this._homePage, this));		    
			})
			.catch(err => console.log('Failed to retrieve scoreboard html content.', err));	
	}


	_statsPage() {
		this._clearEvents();
		this._fetchTemplate('src/html/stats.html')
			.then(data => {
				this._scene.innerHTML = '';
		    this._scene.appendChild(this._parseTemplate(data));
		    this._evtsIds.push(this._evts.addEvent('click', document.getElementById('homepage'), this._homePage, this));		    
			})
			.catch(err => console.log('Failed to retrieve stats html content.', err));	
	}


	_rulesPage() {
		this._clearEvents();
		this._fetchTemplate('src/html/rules.html')
			.then(data => {
				this._scene.innerHTML = '';
		    this._scene.appendChild(this._parseTemplate(data));
		    this._evtsIds.push(this._evts.addEvent('click', document.getElementById('homepage'), this._homePage, this));		    
			})
			.catch(err => console.log('Failed to retrieve rules html content.', err));		
	}


	/* Utils */


	_clearEvents() {
		for (let i = 0; i < this._evtsIds.length; ++i) {
			this._evts.removeEvent(this._evtsIds[i]);
		}
	}


	_fetchTemplate(url) {
		return new Promise((resolve, reject) => {
			fetch(url)
				.then(data => resolve(data.text()))
				.catch(reject);
		});
	}


	_parseTemplate(htmlString) {
		const parser = new DOMParser();
    const dom = parser.parseFromString(htmlString, 'text/html');
    return dom.body;
	}


}


window.Bocce = new GrandeBocce();
export default GrandeBocce;
