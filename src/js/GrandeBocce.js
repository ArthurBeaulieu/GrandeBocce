import BocceGame from './BocceGame';
import Utils from './Utils';
import CustomEvents from '../lib/CustomEvents';
import '../scss/GrandeBocce.scss';


class GrandeBocce {



	constructor() {
		this.scene = null;
		this.evts = null;
		this._game = null;
	}


	init() {
		this.scene = document.getElementById('app-container');
		this.evts = new CustomEvents();
		this.homepageView();
	}


	/* Views */


	homepageView() {
		return new Promise(resolve => {
			Utils.fetchTemplate('assets/html/homepageview.html', 'home')
				.then(() => {
					Utils.dgid('text-header').innerHTML = 'GrandeBocce';					
					this.evts.addEvent('click', Utils.dgid('new-game'), this.teamspageView, this);
					this.evts.addEvent('click', Utils.dgid('rules'), this.rulespageView, this);
					resolve();					
				}).catch(this.fetchPageError);
		});
	}


	teamspageView() {
		return new Promise(resolve => {
			Utils.fetchTemplate('assets/html/teamspageview.html', 'teams')
				.then(() => {
					Utils.dgid('text-header').innerHTML = 'Équipes';
					this.evts.addEvent('click', Utils.dgid('1'), this.playerspageView, this);
					this.evts.addEvent('click', Utils.dgid('2'), this.playerspageView, this);
					this.evts.addEvent('click', Utils.dgid('3'), this.playerspageView, this);
					this.evts.addEvent('click', Utils.dgid('homepage'), this.homepageView, this);
					resolve();
				}).catch(this.fetchPageError);
		});
	}


	playerspageView(event) {
		return new Promise(resolve => {
			Utils.fetchTemplate('assets/html/playerspageview.html', 'players')
				.then(() => {
					Utils.dgid('text-header').innerHTML = 'Joueurs';
					this.evts.addEvent('click', Utils.dgid('homepage'), this.homepageView, this);
					// ID is held on button but click can occur on <i> or <b> inside button
					this._fillPlayerspageView(parseInt(event.target.id) || parseInt(event.target.parentNode.id));
					resolve();					
				}).catch(this.fetchPageError);
		});		
	}


	rulespageView() {
		return new Promise(resolve => {
			Utils.fetchTemplate('assets/html/rulespageview.html', 'rules')
				.then(() => {
					Utils.dgid('text-header').innerHTML = 'Règles du jeu';
					this.evts.addEvent('click', Utils.dgid('homepage'), this.homepageView, this);
					resolve();					
				}).catch(this.fetchPageError);
		});
	}


	/* Modals */


	searchplayerModal() {
		// TODO : search players in db and display in radio list
	}


	/* Utils */


	fetchPageError(err) {
		console.error('GrandeBocce : Unable to fetch HTML template.', err);
	}


	clearEvents() {
		this.evts.removeAllEvents();
	}


	/* Auxiliary */


	_fillPlayerspageView(playerPerTeam) {
		const inputs = [];
		const fillTeamPlayers = letter => {
			for (let i = 0; i < playerPerTeam; ++i) {
				const player = document.createElement('DIV');
				const label = document.createElement('P');
				const input = document.createElement('INPUT');
				const search = document.createElement('IMG');
				
				player.classList.add('player');
				label.innerHTML = `n°${i + 1}`;
				input.dataset.team = letter;
				search.src = 'assets/img/search.svg';

				player.appendChild(label);
				player.appendChild(input);
				player.appendChild(search);
				Utils.dgid(letter).appendChild(player);
				inputs.push(input);

				this.evts.addEvent('click', search, this.searchplayerModal, this);		
			}
		};

		const checkInput = () => {
			const teams = {
				A: [],
				B: []
			};
			let error = false;
			for (let i = 0; i < inputs.length; ++i) {
				if (inputs[i].value === '') {
					inputs[i].classList.add('error');
					error = true;
					Utils.dgid('subtext-header').innerHTML = 'Il manque des noms de joueurs';
				} else {
					teams[inputs[i].dataset.team].push(inputs[i].value);
				}
			}

			if (!error) {
				Utils.dgid('subtext-header').innerHTML = '';
				this._game = new BocceGame(teams);
			}
		};

		fillTeamPlayers('A');
		fillTeamPlayers('B');

		this.evts.addEvent('click', Utils.dgid('startx'), checkInput, this);
	}


}


window.Bocce = new GrandeBocce();
window.Bocce.init();
export default GrandeBocce;
