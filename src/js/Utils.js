class Utils {


	constructor() {}


	static fetchTemplate(url) {
		return new Promise((resolve, reject) => {
			window.Bocce.clearEvents();
			fetch(url)
				.then(data => {
					data.text().then(htmlString => {
						window.Bocce.scene.innerHTML = '';
						window.Bocce.scene.appendChild(this.parseTemplate(htmlString));					
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