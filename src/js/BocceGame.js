import Utils from './Utils';


class BocceGame {


	constructor(options) {
		this._type = options.type;
		this._menes = [];

		this._teamA = [];
		this._teamB = [];
		// The true game score
		this._scoreA = 0;
		this._scoreB = 0;
		// The temp game score (while players still have bowls)
		this._tmpScoreA = 0;
		this._tmpScoreB = 0;

		this._startingTeam = 0;
		this._bowlsPerPlayer = 0;
		this._remainingBowls = 0;

		this._init(options);
	}


	_init(options) {
		this._startingTeam = (Math.floor(Math.random() * 10) > 4) ? 1 : 2;		
		this._bowlsPerPlayer = (this._type === '3v3') ? 2 : 3;
		this._remainingBowls = ((2 * options.players.a.length) * this._bowlsPerPlayer);

		for (let i = 0; i < options.players.a.length; ++i) {
			this._teamA.push({
				name: options.players.a[i],
				team: 'A',
				stats: {
					score: 0,
					boom: 0,
					kiss: 0,
					miss: 0
				}
			});

			this._teamB.push({
				name: options.players.b[i],
				team: 'B',
				stats: {
					score: 0,
					boom: 0,
					kiss: 0,
					miss: 0
				}
			});
		}

		this._quickRulesView().then(this._newMene.bind(this));
	}


	_quickRulesView() {
		return new Promise(resolve => {
			const oldStyle = window.Bocce.scene.style;

			window.Bocce.scene.style = 'align-items:center;display:flex;font-size:1.1rem;height:100vh;justify-content:center;padding:1rem;text-align:center;';
			window.Bocce.scene.innerHTML = `Que chaque joueur se munisse de ${this._bowlsPerPlayer} boules. C'est à l'équipe ${this._startingTeam} de commencer, plus précisément de lancer le but et sa première boule.`;

			setTimeout(() => {
				window.Bocce.scene.style = oldStyle;
				resolve();
			}, 6000);
		});
	}


	_quickMeneReview() {
		return new Promise(resolve => {
			const oldStyle = window.Bocce.scene.style;
			window.Bocce.scene.innerHTML = '';

			const stats = this._menes[this._menes.length - 1];
			const winning = (stats.meneWinner === 'A') ? 1 : 2;
			const winScore = stats[`meneScore${stats.meneWinner}`];
			const loseScore = stats[`meneScore${(stats.meneWinner === 'A') ? 'B' : 'A'}`];
			const head = document.createElement('P');
			const body = document.createElement('P');

			window.Bocce.scene.style = 'align-items:center;display:flex;flex-direction:column;font-size:1.1rem;height:100vh;justify-content:center;padding:1rem;text-align:center;';
			head.style = 'font-size:1.1rem;margin-bottom:1rem;';
			head.innerHTML = `C'est l'équipe ${winning} qui emporte la mène, sur un score de ${winScore} à ${loseScore} et qui a l'honneur de démarrer la mène suivante. Le score de la partie est actuellement de ${stats.totalScoreA} à ${stats.totalScoreB}.`;

			body.style = 'font-size:1.1rem;';
			if (winScore === 5 || winScore === 6) {
				body.innerHTML = `L'équipe ${winning} à infligé une valise (la bonne valoche des famille) à l'équipe adverse, en marquant ${winScore} points contre elle.`;
			} else if (winScore === 4) {
				body.innerHTML = `L'équipe ${winning} à infligé un sac à main à l'équipe adverse en marquant 4 points contre elle.`;
			} else if (winScore === 3) {
				body.innerHTML = `L'équipe ${winning} à infligé un portefeuille à l'équipe adverse en marquant 3 points contre elle.`;
			} else {
				body.innerHTML = `Rien n'est joué, la partie réserve encore ses surpises. À vos boules, prêt, pastis!`;
			}

			window.Bocce.scene.appendChild(head);
			window.Bocce.scene.appendChild(body);

			setTimeout(() => {
				window.Bocce.scene.style = oldStyle;
				resolve();
			}, 6000);
		});		
	}


	_newMene() {
		Utils.fetchTemplate('src/html/mene.html')
			.then(() => {
				document.getElementById('mene-number').innerHTML = `<b>Mène n°${this._menes.length + 1}</b>`;
				document.getElementById('starting-team').innerHTML = `C'est à l'équipe ${this._startingTeam} de démarrer la mène.`;
				// Update score at begining of mene
				document.getElementById('scoreA').innerHTML = this._scoreA;
				document.getElementById('scoreB').innerHTML = this._scoreB;

				for (let i = 0; i < this._teamA.length; ++i) {
					this._addPlayer('team-a', this._teamA[i]);
				}

				for (let i = 0; i < this._teamB.length; ++i) {
					this._addPlayer('team-b', this._teamB[i]);
				}

				if (this._startingTeam === 1) {
					document.getElementById('team-b').classList.add('disabled');
				} else {
					document.getElementById('team-a').classList.add('disabled');
				}
				
				document.getElementById('bowls-remaining-a').innerHTML = this._remainingBowls / 2;
				document.getElementById('bowls-remaining-b').innerHTML = this._remainingBowls / 2;
				window.Bocce.evtsIds.push(window.Bocce.evts.addEvent('click', document.getElementById('endx'), this._endMene, this));
			})
			.catch(err => console.log('Failed to retrieve home html content.', err));
	}


	_endMene() {
		window.Bocce.clearEvents();

		const meneStats = {
			totalScoreA: 0,
			totalScoreB: 0,
			meneScoreA: this._tmpScoreA,
			meneScoreB: this._tmpScoreB,
			meneWinner: 0,
			teamA: Object.assign(this._teamA, {}),
			teamB: Object.assign(this._teamB, {})
		};

		this._remainingBowls = ((2 * this._teamA.length) * this._bowlsPerPlayer);		
		this._scoreA += this._tmpScoreA;
		this._scoreB += this._tmpScoreB;

		meneStats.totalScoreA = this._scoreA;
		meneStats.totalScoreB = this._scoreB;
		meneStats.meneWinner = (this._tmpScoreA > this._tmpScoreB) ? 'A' : 'B';

		this._tmpScoreA = 0;
		this._tmpScoreB = 0;

		if (this._scoreA > this._scoreB) {
			this._startingTeam = 1;
		} else {
			this._startingTeam = 2;
		}

		this._menes.push(meneStats);
		if (this._scoreA >= 13 || this._scoreB >= 13) {
			this._endGame();
		}	else {
			this._quickMeneReview().then(this._newMene.bind(this));
		}
	}


	_endGame() {
		Utils.fetchTemplate('src/html/endgame.html')
			.then(() => {
				const head = document.createElement('P');
				const body = document.createElement('P');
				const stats = this._menes[this._menes.length - 1];
				const winnerLetter = (stats.totalScoreA > stats.totalScoreB) ? 'A' : 'B';
				const looserLetter = (winnerLetter === 'A') ? 'B' : 'A';
				const winnerNumber = (winnerLetter === 'A') ? 1 : 2;

				head.innerHTML = `C'est l'équipe ${winnerNumber} qui remporte la partie sur un score de ${stats[`totalScore${winnerLetter}`]} à ${stats[`totalScore${looserLetter}`]}.`;

				if (stats[`totalScore${looserLetter}`] === 0) {
					body.innerHTML = `En pétanque, pour une fessée pareille, on dit que les perdants se sont prix une Fanny. À vous donc de payer votre coup à boire au gagnant, c'est la tradition !`;
				} else {
					body.innerHTML = `Ce fût une partie intense, sachez maintenant que chaque joueur à vu sa fiche de statistiques mise à jour avec les données de cette partie. N'hésitez pas à consulter le tableau des scores, ou refaites une partie!`;					
				}

				document.getElementById('endgame').appendChild(head);
				document.getElementById('endgame').appendChild(body);
				window.Bocce.evtsIds.push(window.Bocce.evts.addEvent('click', document.getElementById('homepage'), window.Bocce.homePage, window.Bocce));				
			});
	}


	_addPlayer(id, player) {
		const element = document.createElement('DIV');
		const playerName = document.createElement('P');
		const boomWrapper = document.createElement('DIV');
		const kissWrapper = document.createElement('DIV');
		const scoreWrapper = document.createElement('DIV');
		const missWrapper = document.createElement('DIV');
		const boom = document.createElement('IMG');
		const kiss = document.createElement('IMG');
		const score = document.createElement('IMG');
		const miss = document.createElement('IMG');
		element.classList = 'player';
		playerName.innerHTML = player.name;
		boomWrapper.dataset.value = 0;
		kissWrapper.dataset.value = 0;
		scoreWrapper.dataset.value = 0;
		missWrapper.dataset.value = 0;
		boom.src = 'assets/img/boom.svg';
		kiss.src = 'assets/img/kiss.svg';
		score.src = 'assets/img/score.svg';
		miss.src = 'assets/img/miss.svg';

		element.appendChild(playerName);
		boomWrapper.appendChild(boom);
		kissWrapper.appendChild(kiss);
		scoreWrapper.appendChild(score);
		missWrapper.appendChild(miss);
		element.appendChild(boomWrapper);
		element.appendChild(kissWrapper);
		element.appendChild(scoreWrapper);
		element.appendChild(missWrapper);

		const addBoom = () => {
			boomWrapper.dataset.value = parseInt(boomWrapper.dataset.value) + 1;
			player.stats.boom += 1;
		};

		const addKiss = () => {
			kissWrapper.dataset.value = parseInt(kissWrapper.dataset.value) + 1;
			player.stats.kiss += 1;
		};

		const addScore = () => {
			scoreWrapper.dataset.value = parseInt(scoreWrapper.dataset.value) + 1;
			player.stats.score += 1;
			this._updateScore(player.team);

			if (parseInt(scoreWrapper.dataset.value) + parseInt(missWrapper.dataset.value) === this._bowlsPerPlayer) {
				element.classList.add('disabled');
			}
		};

		const addMissed = () => {
			const oppositeMarking = (player.team === 'A') ? 'B' : 'A';			
			const marking = (player.team === 'A') ? 1 : 2;
			const toPlay = (player.team === 'A') ? 2 : 1;
			missWrapper.dataset.value = parseInt(missWrapper.dataset.value) + 1;
			player.stats.miss += 1;

			document.getElementById('starting-team').innerHTML = `L'équipe ${marking} échoue misérablement. Jouez à nouveau.`;			
			const remaining = parseInt(document.getElementById(`bowls-remaining-${player.team.toLowerCase()}`).innerHTML) - 1;
			document.getElementById(`bowls-remaining-${player.team.toLowerCase()}`).innerHTML = remaining;

			if (remaining === 0) {
				document.getElementById('starting-team').innerHTML = `L'équipe ${marking} n'à plus de boules. À l'équipe ${toPlay} de jouer.`;
				document.getElementById(`team-${player.team.toLowerCase()}`).classList.add('disabled');
				document.getElementById(`team-${oppositeMarking.toLowerCase()}`).classList.remove('disabled');			
			}

			if (parseInt(scoreWrapper.dataset.value) + parseInt(missWrapper.dataset.value) === this._bowlsPerPlayer) {
				element.classList.add('disabled');
			}

			--this._remainingBowls;
			if (this._remainingBowls === 0) {
				this._endMene();
			}
		};		

		window.Bocce.evtsIds.push(window.Bocce.evts.addEvent('click', boom, addBoom, boom));
		window.Bocce.evtsIds.push(window.Bocce.evts.addEvent('click', kiss, addKiss, kiss));
		window.Bocce.evtsIds.push(window.Bocce.evts.addEvent('click', score, addScore, score));
		window.Bocce.evtsIds.push(window.Bocce.evts.addEvent('click', miss, addMissed, miss));

		document.getElementById(id).appendChild(element);		
	}


	_updateScore(markingTeam) {
		// Team A take the point
		if (markingTeam === 'A' && this._tmpScoreA < this._tmpScoreB) {
			document.getElementById('starting-team').innerHTML = `L'équipe 1 prends le point. À l'équipe 2 de jouer.`;
			this._tmpScoreB = 0;
			this._tmpScoreA = 1;
			document.getElementById('team-a').classList.add('disabled');
			document.getElementById('team-b').classList.remove('disabled');
		} else if (markingTeam === 'B' && this._tmpScoreB < this._tmpScoreA) {
			document.getElementById('starting-team').innerHTML = `L'équipe 2 prends le point. À l'équipe 1 de jouer.`;
			this._tmpScoreB = 1;
			this._tmpScoreA = 0;
			document.getElementById('team-a').classList.remove('disabled');
			document.getElementById('team-b').classList.add('disabled');
		} else if (this._tmpScoreA === this._tmpScoreB) {
			const oppositeMarking = (markingTeam === 'A') ? 'B' : 'A';
			const oppositeBowls = parseInt(document.getElementById(`bowls-remaining-${oppositeMarking.toLowerCase()}`).innerHTML);			
			const marking = (markingTeam === 'A') ? 1 : 2;
			const toPlay = (markingTeam === 'A') ? 2 : 1;
			document.getElementById('starting-team').innerHTML = `L'équipe ${marking} prends le point. À l'équipe ${toPlay} de jouer.`;
			this[`_tmpScore${markingTeam}`] += 1;
			if (oppositeBowls > 0) {
				document.getElementById(`team-${markingTeam.toLowerCase()}`).classList.add('disabled');
				document.getElementById(`team-${oppositeMarking.toLowerCase()}`).classList.remove('disabled');
			}	else {
				document.getElementById('starting-team').innerHTML = `L'équipe ${marking} enfonce le clou.`;				
			}
		} else {
			const oppositeMarking = (markingTeam === 'A') ? 'B' : 'A';
			const oppositeBowls = parseInt(document.getElementById(`bowls-remaining-${oppositeMarking.toLowerCase()}`).innerHTML);
			const marking = (markingTeam === 'A') ? 1 : 2;
			const toPlay = (markingTeam === 'A') ? 2 : 1;
			document.getElementById('starting-team').innerHTML = `L'équipe ${marking} creuse l'écart. À l'équipe ${toPlay} de jouer.`;			
			this[`_tmpScore${markingTeam}`] += 1;
			if (oppositeBowls > 0) {
				document.getElementById(`team-${markingTeam.toLowerCase()}`).classList.add('disabled');
				document.getElementById(`team-${oppositeMarking.toLowerCase()}`).classList.remove('disabled');
			} else {
				document.getElementById('starting-team').innerHTML = `L'équipe ${marking} enfonce le clou.`;				
			}
		}
		// Update remaining bowls for marking team
		const remaining = parseInt(document.getElementById(`bowls-remaining-${markingTeam.toLowerCase()}`).innerHTML) - 1;
		document.getElementById(`bowls-remaining-${markingTeam.toLowerCase()}`).innerHTML = remaining;
		// Update score at begining of mene
		document.getElementById('scoreA').innerHTML = this._scoreA + this._tmpScoreA;
		document.getElementById('scoreB').innerHTML = this._scoreB + this._tmpScoreB;

		--this._remainingBowls;
		if (this._remainingBowls === 0) {
			this._endMene();
		}
	}


}


export default BocceGame;