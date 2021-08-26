import '../scss/GrandeBocce.scss';


class GrandeBocce {


	constructor() {
		this._scene = null;
		this._init();
	}


	_init() {
		this._scene = document.getElementById('app-scene');

		this._fetchTemplate('src/html/home.html')
			.then(data => {
				this._scene.innerHTML = data;
			})
			.catch(err => console.log('Failed to retrieve homepage html content.', err));
	}


	_fetchTemplate(url) {
		return new Promise((resolve, reject) => {
			fetch(url)
				.then(data => resolve(data.text()))
				.catch(reject);
		});
	}


}


window.Bocce = new GrandeBocce();
export default GrandeBocce;
