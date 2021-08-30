import CustomEvents from '../lib/CustomEvents';
import BocceGame from './BocceGame';
//import BocceTournament from './BocceTournament';
import Utils from './Utils';
import '../scss/GrandeBocce.scss';


class GrandeBocce {


	constructor() {
		this.scene = null;
		this.evts = new CustomEvents();
		this.evtsIds = [];
		this._game = null;
		this._tournament = null;
	}


	init() {
		this.scene = document.getElementById('app-scene');
		this.homePage();
	}


	/* Pages */


	homePage() {
		Utils.fetchTemplate('src/html/home.html')
			.then(() => {
				this.evtsIds.push(this.evts.addEvent('click', document.getElementById('new-game'), this._newGamePage, this));
				this.evtsIds.push(this.evts.addEvent('click', document.getElementById('new-tournament'), this._newTournamenPage, this));
				this.evtsIds.push(this.evts.addEvent('click', document.getElementById('scoreboard'), this._scoreBoardPage, this));
				this.evtsIds.push(this.evts.addEvent('click', document.getElementById('stats'), this._statsPage, this));
				this.evtsIds.push(this.evts.addEvent('click', document.getElementById('rules'), this._rulesPage, this));
			})
			.catch(err => console.log('Failed to retrieve home html content.', err));	
	}


	_newGamePage() {
		Utils.fetchTemplate('src/html/newgame.html')
			.then(() => {
				this.evtsIds.push(this.evts.addEvent('click', document.getElementById('1v1'), this._startNewGame, this));
				this.evtsIds.push(this.evts.addEvent('click', document.getElementById('2v2'), this._startNewGame, this));
				this.evtsIds.push(this.evts.addEvent('click', document.getElementById('3v3'), this._startNewGame, this));
				this.evtsIds.push(this.evts.addEvent('click', document.getElementById('homepage'), this.homePage, this));
			})
			.catch(err => console.log('Failed to retrieve newgame html content.', err));	
	}


	_newTournamenPage() {
		Utils.fetchTemplate('src/html/newtournament.html')
			.then(() => {
				this.evtsIds.push(this.evts.addEvent('click', document.getElementById('homepage'), this.homePage, this));
			})
			.catch(err => console.log('Failed to retrieve newtournament html content.', err));	
	}


	_scoreBoardPage() {
		Utils.fetchTemplate('src/html/scoreboard.html')
			.then(() => {
				this.evtsIds.push(this.evts.addEvent('click', document.getElementById('homepage'), this.homePage, this));
			})
			.catch(err => console.log('Failed to retrieve scoreboard html content.', err));	
	}


	_statsPage() {
		Utils.fetchTemplate('src/html/stats.html')
			.then(() => {
				this.evtsIds.push(this.evts.addEvent('click', document.getElementById('homepage'), this.homePage, this));
			})
			.catch(err => console.log('Failed to retrieve stats html content.', err));	
	}


	_rulesPage() {
		Utils.fetchTemplate('src/html/rules.html')
			.then(() => {
				this.evtsIds.push(this.evts.addEvent('click', document.getElementById('homepage'), this.homePage, this));
			})
			.catch(err => console.log('Failed to retrieve rules html content.', err));		
	}


	/* Game routines */


	_startNewGame(e) {
		Utils.fetchTemplate('src/html/players.html')
			.then(() => {
				this.evtsIds.push(this.evts.addEvent('click', document.getElementById('homepage'), this.homePage, this));

				const inputs = [];
				let players = {
					a: [],
					b: []
				};

				const checkInputs = () => {
					let allFilled = true;
					for (let i = 0; i < inputs.length; ++i) {
						if (inputs[i].value === '') {
							allFilled = false;
							document.getElementById('startx').innerHTML = 'Il manque des noms de joueurs!';
							setTimeout(() => {
								document.getElementById('startx').innerHTML = 'Démarrer la partie';
							}, 2000);
							players = {
								a: [],
								b: []
							};					
							break;
						} else {
							players[inputs[i].name[0]].push(inputs[i].value);
						}
					}

					if (allFilled) {
						this._game = new BocceGame({
							type: e.target.id,
							players: players
						});
					}
				};

				// TODO create team section according to team amount (for tournament evolution)
				for (let i = 0; i < e.target.id[0]; ++i) {
					const element = document.createElement('DIV');
					element.classList = 'player';
					const label = document.createElement('P');
					const input = document.createElement('INPUT');
					const search = document.createElement('IMG');
					label.innerHTML = i + 1;
					input.type = 'text';
					input.name = `a-${i + 1}`;
					search.src = 'assets/img/search.svg';
					element.appendChild(label);
					element.appendChild(input);
					element.appendChild(search);
					document.getElementById('team-a').appendChild(element);
					inputs.push(input);
				}

				for (let i = 0; i < e.target.id[0]; ++i) {
					const element = document.createElement('DIV');
					element.classList = 'player';
					const label = document.createElement('P');
					const input = document.createElement('INPUT');
					const search = document.createElement('IMG');
					label.innerHTML = i + 1;
					input.type = 'text';
					input.name = `b-${i + 1}`;
					search.src = 'assets/img/search.svg';
					element.appendChild(label);
					element.appendChild(input);
					element.appendChild(search);
					document.getElementById('team-b').appendChild(element);
					inputs.push(input);
				}

				this.evtsIds.push(this.evts.addEvent('click', document.getElementById('startx'), checkInputs, this));				
			})
			.catch(err => console.log('Failed to retrieve players html content.', err));
	}


	/* Utils */


	clearEvents() {
		for (let i = 0; i < this.evtsIds.length; ++i) {
			this.evts.removeEvent(this.evtsIds[i]);
		}
	}


}


window.Bocce = new GrandeBocce();
window.Bocce.init();
export default GrandeBocce;
