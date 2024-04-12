export default class URL {
	constructor(url, base = undefined) {
		const name = "URL";
		const version = "2.1.0";
		console.log(`\n🟧 ${name} v${version}\n`);
		url = this.#parse(url, base);
		return this;
	};

	#parse(url, base = undefined) {
		//const URLRegex = /(?:(?<protocol>.+:)\/\/(?<host>[^/]+))?(?<pathname>\/?[^?]+)?(?<search>\?[^?]+)?/;
		const URLRegex = /(?:(?<protocol>\w+:)\/\/(?:(?<username>[^\s:"]+)(?::(?<password>[^\s:"]+))?@)?(?<host>[^\s@/]+))?(?<pathname>\/?[^\s@?]+)?(?<search>\?[^\s?]+)?/
		const PortRegex = /(?<hostname>.+):(?<port>\d+)$/;
		url = url.match(URLRegex)?.groups || {};
		console.log(`🚧 URL.#parse, url: ${JSON.stringify(url)}`, "");
		if (base) {
			base = base?.match(URLRegex)?.groups || {};
			console.log(`🚧 URL.#parse, base: ${JSON.stringify(base)}`, "");
			if (!base.protocol || !base.hostname) throw new Error(`🚨 ${name}, ${base} is not a valid URL`);
		};
		if (url.protocol || base?.protocol) this.protocol = url.protocol || base.protocol;
		if (url.username || base?.username) this.username = url.username || base.username;
		if (url.password || base?.password) this.password = url.password || base.password;
		if (url.host || base?.host) {
			this.host = url.host || base.host;
			Object.freeze(this.host);
			this.hostname = this.host.match(PortRegex)?.groups.hostname ?? this.host;
			this.port = this.host.match(PortRegex)?.groups.port ?? "";
		};
		if (url.pathname || base?.pathname) {
			this.pathname = url.pathname || base?.pathname;
			if (!this.pathname.startsWith("/")) this.pathname = "/" + this.pathname;
			this.paths = this.pathname.split("/").filter(Boolean);
			Object.freeze(this.paths);
			//if (this?.pathname?.at(-1)?.includes(".")) this.format = this.pathname.at(-1).split(".").at(-1);
			if (this.paths) {
				const fileName = this.paths[this.paths.length - 1];
				if (fileName?.includes(".")) {
					const list = fileName.split(".");
					this.format = list[list.length - 1];
					Object.freeze(this.format);
				}
			};
		} else this.pathname = "";
		if (url.search || base?.search) {
			this.search = url.search || base.search;
			Object.freeze(this.search);
			if (this.search) {
				const array = this.search.slice(1).split("&").map((param) => param.split("="));
				console.log(`🚧 URL.#parse, Object.fromEntries(this.search.slice(1).split("&").map((item) => item.split("="))): ${JSON.stringify(Object.fromEntries(array))}`, "");
				this.searchParams = new Map(array);
			};
		};
		this.harf = this.toString();
		Object.freeze(this.harf);
		console.log(`🚧 URL.#parse, this: ${JSON.stringify(this)}`, "");
		return this;
	};

	toString() {
		let string = "";
		if (this.protocol) string += this.protocol + "//";
		//console.log(`🚧 toString, string: ${string}`, "");
		if (this.username) string += this.username + (this.password ? ":" + this.password : "") + "@";
		//console.log(`🚧 toString, string: ${string}`, "");
		if (this.hostname) string += this.hostname;
		//console.log(`🚧 toString, string: ${string}`, "");
		if (this.port) string += ":" + this.port;
		//console.log(`🚧 toString, string: ${string}`, "");
		if (this.pathname) string += this.pathname;
		//console.log(`🚧 toString, string: ${string}`, "");
		if (this.searchParams) string += "?" + Array.from(this.searchParams).map(param => param.join("=")).join("&");
		//console.log(`🚧 toString, string: ${string}`, "");
		return string;
	};

	toJSON() { return JSON.stringify({ ...this }) };
}
