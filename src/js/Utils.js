class Utils {


  /** @summary <h1>Static class to hold useful method across the app</h1>
   * @author Arthur Beaulieu
   * @since September 2021
   * @description <blockquote>The Utils class is not meant to be instanciated, but to be used straight by
   * calling its static methods. It holds the main utils methods for GrandeBocce. Refer to each static, 
   * public method for detailed features. For source code, please go to 
   * <a href="https://github.com/ArthurBeaulieu/GrandeBocce" alt="grande-bocce">
   * https://github.com/ArthurBeaulieu/GrandeBocce</a></blockquote> */
	constructor() {}


  /** @method
   * @name fetchTemplate
   * @public
   * @static
   * @memberof Utils
   * @description <blockquote>Fetch a html from a url and append its content to the GrandeBocce scene.</blockquote> 
   * @param {string} url - The url to retrieve the HTML content from */
	static fetchTemplate(url, className) {
		return new Promise((resolve, reject) => {
			window.Bocce.clearEvents();
      window.Bocce.scene.style.opacity = 0;
      Utils.dgid('text-header').style.animation = 'none';
      setTimeout(() => {
        fetch(url)
          .then(data => {
            data.text().then(htmlString => {
              window.Bocce.scene.className = className;
              window.Bocce.scene.innerHTML = '';
              window.Bocce.scene.appendChild(this.parseTemplate(htmlString));
              window.Bocce.scene.style.opacity = 1;
              Utils.dgid('text-header').style.animation = '';
              setTimeout(resolve, 200);
            })
            .catch(reject);
          })
          .catch(reject);
      }, 200);
		});
	}


  /** @method
   * @name parseTemplate
   * @public
   * @static
   * @memberof Utils
   * @description <blockquote>Convert an HTML string into a DOM object.</blockquote> 
   * @param {string} htmlString - The raw HTML text string */
	static parseTemplate(htmlString) {
    return document.createRange().createContextualFragment(htmlString);
	}


  static secondsToTimecode(time, float) {
    const output = { h: 0, m: 0, s: 0, ms: 0 };
    // Cutting total seconds
    output.h = Math.floor(time / 3600);
    output.m = Math.floor((time - (output.h * 3600)) / 60);
    output.s = Math.floor(time - (output.h * 3600) - (output.m * 60));
    output.ms = Math.floor((time - (output.m * 60) - output.s) * 100); // If  hour value exists, we will not display ms
    // Adding an extra 0 for values inferior to 10
    if (output.h < 10) { output.h = `0${output.h}`; }
    if (output.m < 10) { output.m = `0${output.m}`; }
    if (output.s < 10) { output.s = `0${output.s}`; }
    if (output.ms < 10) { output.ms = `0${output.ms}`; }
    // Formatting output
    if (output.h > 0) {
      return `${output.h}h ${output.m}m ${output.s}s`;
    } else {
      if (float === true) {
        return `${output.m}m ${output.s}s ${output.ms}ms`;
      } else {
        return `${output.m}h ${output.s}s`;
      }
    }
  }


  static dgid(id) {
    return document.getElementById(id);
  }


}


export default Utils;
