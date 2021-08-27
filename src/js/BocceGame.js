import Utils from './Utils';


class BocceGame {


	constructor(options) {
		this._type = options.type;
		this._menes = 0;
		this._teamA = options.players.a;
		this._teamB = options.players.b;
		this._scoreA = 0;
		this._scoreB = 0;
		this._init();
	}


	_init() {
		this._quickRulesView().then(this._newMene.bind(this));
	}


	_quickRulesView() {
		return new Promise(resolve => {
			const bowlsAmount = (this._type === '3v3') ? 2 : 3;
			const startingTeam = (Math.floor(Math.random() * 10) > 4) ? 1 : 2;
			const oldStyle = Bocce.scene.style;

			Bocce.scene.style = 'align-items:center;display:flex;font-size:1.1rem;height:100vh;justify-content:center;padding:1rem;text-align:center;';
			Bocce.scene.innerHTML = `Que chaque joueur se munisse de ${bowlsAmount} boules. C'est à l'équipe ${startingTeam} de commencer, plus précisément de lancer le but et sa première boule.`;

			setTimeout(() => {
				Bocce.scene.style = oldStyle;
				resolve();
			}, 6000);
		});
	}


	_newMene() {
		Utils.fetchTemplate('src/html/mene.html')
			.then(() => {
				console.log(this)
			})
			.catch(err => console.log('Failed to retrieve home html content.', err));
	}


}


export default BocceGame;