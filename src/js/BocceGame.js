import Utils from './Utils';


class BocceGame {


	constructor(teams) {
		this._menes = [];
		this._teams = {
			A: { score: 0, players: [] },
			B: { score: 0, players: [] }
		};

		this._startingTeam = 0;
		this._bowlsPerPlayer = 0;
		this._remainingBowls = 0;

		this._meneScoreA = 0;
		this._meneScoreB = 0;
		this._gameStats = {
			menes: null,
			start: null,
			end: null,
			winner: '',
			scoreA: 0,
			scoreB: 0
		};

		this._init(teams);
		this.drawstarterView().then(() => {
			this._gameStats.start = Date.now();
			this.newMene();
		});
	}


	_init(teams) {
		this._startingTeam = (Math.floor(Math.random() * 10) > 4) ? 'A' : 'B';
		this._bowlsPerPlayer = (teams.A.length === 3) ? 2 : 3;

		for (let i = 0; i < teams.A.length; ++i) {
			this._teams.A.players.push({
				name: teams.A[i],
				team: 'A',
				stats: {
					boom: 0, // Bowls that air-striked another on the field
					kiss: 0, // Bowls that kissed the  but on the field
					score: 0, // Point taken to the rival team during the mene 
					miss: 0, // Missed bowls that were wasted
					takenPoints: 0 // Point actually marked at the end of a mene
				}
			});
			this._teams.B.players.push({
				name: teams.B[i],
				team: 'B',				
				stats: {
					boom: 0, // Bowls that air-striked another on the field
					kiss: 0, // Bowls that kissed the  but on the field
					score: 0, // Point taken to the rival team during the mene 
					miss: 0, // Missed bowls that were wasted
					takenPoints: 0 // Point actually marked at the end of a mene
				}
			});			
		}
	}


	endGame() {
		return new Promise(resolve => {
			Utils.fetchTemplate('assets/html/game/endgame.html', 'end-game')
				.then(() => {
					Utils.dgid('text-header').innerHTML = 'Fin de partie';
					Utils.dgid('subtext-header').innerHTML = '';
					Utils.dgid('game-winner').innerHTML = `C'est l'équipe ${this._gameStats.winner} qui remporte cette partie.`;
					Utils.dgid('game-score').innerHTML = `Le score final de cette rencontre est de ${this._gameStats.scoreA} à ${this._gameStats.scoreB}.`;
					Utils.dgid('game-time').innerHTML = `Ce match acharné à pris ${Utils.secondsToTimecode((this._gameStats.end - this._gameStats.start) / 1000)} pour atteindre son terme.`;
					window.Bocce.evts.addEvent('click', Utils.dgid('homepage'), window.Bocce.homepageView, window.Bocce);
					resolve();
				}).catch(window.Bocce.fetchPageError);
		});		
	}


	drawstarterView() {
		return new Promise(resolve => {
			Utils.fetchTemplate('assets/html/game/drawstarter.html', 'draw-starter')
				.then(() => {
					Utils.dgid('text-header').innerHTML = 'Tirage au sort';
					setTimeout(() => Utils.dgid('draw-starter').innerHTML = `L'équipe ${this._startingTeam}`, 1000);
					setTimeout(() => Utils.dgid('late1').style.opacity = 1, 3500);
					setTimeout(() => Utils.dgid('late2').style.opacity = 1, 5000);
					setTimeout(resolve, 6500);
				}).catch(window.Bocce.fetchPageError);
		});
	}


	newMene() {
		return new Promise(resolve => {
			Utils.fetchTemplate('assets/html/game/mene.html', 'mene')
				.then(() => {
					Utils.dgid('text-header').innerHTML = `${this._teams.A.score} — ${this._teams.B.score}`;
					Utils.dgid('subtext-header').innerHTML = `Mène n°${this._menes.length + 1}`;

					this._remainingBowls = ((2 * this._teams.A.players.length) * this._bowlsPerPlayer);
					this._meneScoreB = 0;
					this._meneScoreA = 0;

					for (let i = 0; i < this._teams.A.players.length; ++i) {
						this._addPlayerForMene('A', this._teams.A.players[i]);
						this._addPlayerForMene('B', this._teams.B.players[i]);
					}

					const notStarting = (this._startingTeam === 'A') ? 'B' : 'A';	
					Utils.dgid(notStarting).classList.add('disabled');
					Utils.dgid('bowls-remaining-A').innerHTML = this._remainingBowls / 2;
					Utils.dgid('bowls-remaining-B').innerHTML = this._remainingBowls / 2;

					window.Bocce.evts.addEvent('click', Utils.dgid('cancel-mene'), this.endMene.bind(this, true));

					resolve();
				}).catch(window.Bocce.fetchPageError);
		});
	}


	endMene(tie) {
		return new Promise(resolve => {
			Utils.fetchTemplate('assets/html/game/endmene.html', 'end-mene')
				.then(() => {
					Utils.dgid('subtext-header').innerHTML = '';
					// Reset tmp score and wait for user events to fill 'em
					this._meneScoreB = 0;
					this._meneScoreA = 0;

					for (let i = 0; i < this._teams.A.players.length; ++i) {
						this._addPlayerForEndMene('A', this._teams.A.players[i]);
						this._addPlayerForEndMene('B', this._teams.B.players[i]);
					}

					const meneStats = {
						scoreA: 0,
						scoreB: 0,
						meneWinner: '-',
						teamA: JSON.parse(JSON.stringify(this._teams.A)),
						teamB: JSON.parse(JSON.stringify(this._teams.B))
					};

					if (tie) {
						Utils.dgid('text-header').innerHTML = 'Mène nulle';
						Utils.dgid('A').classList.add('disabled');
						Utils.dgid('B').classList.add('disabled');					
						Utils.dgid('referee-help').innerHTML = 'Cette mène est comptabilisée comme nulle. La mène suivante va démarrer.';
						meneStats.scoreA = this._teams.A.score;
						meneStats.scoreB = this._teams.B.score;						
						this._menes.push(meneStats);
						setTimeout(this.newMene.bind(this), 5000);
					} else {
						Utils.dgid('text-header').innerHTML = 'Comptage de points';
						const next = () => {
							this._teams.A.score += this._meneScoreA;
							this._teams.B.score += this._meneScoreB;
							meneStats.scoreA = this._meneScoreA;
							meneStats.scoreB = this._meneScoreB;
							meneStats.meneWinner = (this._meneScoreA > this._meneScoreB) ? 'A' : 'B';
							this._startingTeam = meneStats.meneWinner;
							this._menes.push(meneStats);

							if (this._teams.A.score >= 13 || this._teams.B.score >= 13) {
								this._gameStats.end = Date.now();
								this._gameStats.menes = this._menes;
								this._gameStats.scoreA = this._teams.A.score;
								this._gameStats.scoreB = this._teams.B.score;
								this._gameStats.winner = (this._teams.A.score > this._teams.B.score) ? 'A' : 'B';
								this.endGame();
							}	else {
								this.newMene();
							}						
						};

						window.Bocce.evts.addEvent('click', Utils.dgid('end-mene'), next, this);
					}

					resolve();
				}).catch(window.Bocce.fetchPageError);
		});
	}


	_addPlayerForMene(team, player) {
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
		score.src = 'assets/img/point.svg';
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

			if (player.team === 'A' && this._meneScoreA < this._meneScoreB) {
				this._meneScoreB = 0;
				this._meneScoreA = 1;
				Utils.dgid('A').classList.add('disabled');
				Utils.dgid('B').classList.remove('disabled');
			} else if (player.team === 'B' && this._meneScoreB < this._meneScoreA) {
				this._meneScoreB = 1;
				this._meneScoreA = 0;
				Utils.dgid('A').classList.remove('disabled');
				Utils.dgid('B').classList.add('disabled');
			} else {
				const oppositeMarking = (player.team === 'A') ? 'B' : 'A';
				const oppositeBowls = parseInt(Utils.dgid(`bowls-remaining-${oppositeMarking}`).innerHTML);			
				this[`_meneScore${player.team}`] += 1;
				if (oppositeBowls > 0) {
					Utils.dgid(player.team).classList.add('disabled');
					Utils.dgid(oppositeMarking).classList.remove('disabled');
				}
			}
			// Update remaining bowls for marking team
			const remaining = parseInt(Utils.dgid(`bowls-remaining-${player.team}`).innerHTML) - 1;
			Utils.dgid(`bowls-remaining-${player.team}`).innerHTML = remaining;

			if (parseInt(scoreWrapper.dataset.value) + parseInt(missWrapper.dataset.value) === this._bowlsPerPlayer) {
				element.classList.add('disabled');
			}

			--this._remainingBowls;
			if (this._remainingBowls === 0) {
				this.endMene();
			}
		};

		const addMissed = () => {
			const oppositeMarking = (player.team === 'A') ? 'B' : 'A';			
			missWrapper.dataset.value = parseInt(missWrapper.dataset.value) + 1;
			player.stats.miss += 1;

			const remaining = parseInt(Utils.dgid(`bowls-remaining-${player.team}`).innerHTML) - 1;
			Utils.dgid(`bowls-remaining-${player.team}`).innerHTML = remaining;

			if (remaining === 0) {
				Utils.dgid(player.team).classList.add('disabled');
				Utils.dgid(oppositeMarking).classList.remove('disabled');			
			}

			if (parseInt(scoreWrapper.dataset.value) + parseInt(missWrapper.dataset.value) === this._bowlsPerPlayer) {
				element.classList.add('disabled');
			}

			--this._remainingBowls;
			if (this._remainingBowls === 0) {
				this.endMene();
			}
		};			

		window.Bocce.evts.addEvent('click', boom, addBoom, boom);
		window.Bocce.evts.addEvent('click', score, addScore, score);
		window.Bocce.evts.addEvent('click', kiss, addKiss, kiss);
		window.Bocce.evts.addEvent('click', miss, addMissed, miss);

		Utils.dgid(team).appendChild(element);
	}


	_addPlayerForEndMene(team, player) {
		const element = document.createElement('DIV');
		const playerName = document.createElement('P');
		const pointWrapper = document.createElement('DIV');
		const point = document.createElement('IMG');

		element.classList = 'player';
		playerName.innerHTML = player.name;
		pointWrapper.dataset.value = 0;
		point.src = 'assets/img/score.svg';

		element.appendChild(playerName);
		pointWrapper.appendChild(point);
		element.appendChild(pointWrapper);

		const addPoint = () => {
			const oppositeMarking = (player.team === 'A') ? 'B' : 'A';
			if (parseInt(pointWrapper.dataset.value) + 1 <= this._bowlsPerPlayer) {
				pointWrapper.dataset.value = parseInt(pointWrapper.dataset.value) + 1;
				player.stats.takenPoints += 1;
				this[`_meneScore${player.team}`] += 1;
				Utils.dgid(oppositeMarking).classList.add('disabled');
				if (player.stats.takenPoints === this._bowlsPerPlayer) {
					element.classList.add('disabled');
				}
			} else {
				element.classList.add('disabled');
			}
		};

		window.Bocce.evts.addEvent('click', point, addPoint, point);

		Utils.dgid(team).appendChild(element);		
	}


}


export default BocceGame;