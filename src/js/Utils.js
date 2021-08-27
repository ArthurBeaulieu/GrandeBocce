class Utils {


	constructor() {}


	static fetchTemplate(url, scene) {
		return new Promise((resolve, reject) => {
			Bocce.clearEvents();
			fetch(url)
				.then(data => {
					data.text().then(htmlString => {
						Bocce.scene.innerHTML = '';
						Bocce.scene.appendChild(this.parseTemplate(htmlString));					
						resolve();
					})
					.catch(reject);
				})
				.catch(reject);
		});
	}


	static parseTemplate(htmlString) {
		const parser = new DOMParser();
    const dom = parser.parseFromString(htmlString, 'text/html');
    return dom.body.firstChild;
	}	


}


export default Utils;