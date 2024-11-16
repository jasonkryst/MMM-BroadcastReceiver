var self;
Module.register("MMM-BroadcastReceiver", {
	// Module config defaults.
	defaults: {
		updateInterval: 60,
		showSymbol: true,
		fadeSpeed: 4000,
		apiUrl: "",
		apiKey: "",
		broadcastSize: "M", 	// S M L - Default M
		authorSize: "S",	// S M L - Default S
		maxBroadcastLength: 180	// Max length of the broadcast message
	},

	getScripts () {
		return ["moment.js"];
	},

	getStyles () {
		return ["MMM-BroadcastReceiver.css", "font-awesome.css"];
	},

	// Override start method.
	start () {
		self = this;
		Log.info(`Starting module: ${this.name}`);

		this.lastBroadcastIndex = -1;
		this.lastIndexUsed = -1;
		this.broadcasts = [];

		this.downloadBroadcastFromService();
		Log.info(`Module ${this.name}: notification send.`);

		setInterval(() => {
			this.updateDom(this.config.fadeSpeed);
		}, this.config.updateInterval * 1000);
	},

	socketNotificationReceived (notification, payload) {
		if (notification === "GET_RANDOM_BROADCAST_RESPONSE") {
			if (payload.length == 0) {
				console.error(`Module ${this.name}: 0 broadcasts received.`);
				return;
			}
			
			var broadcastDetail = { message: payload[0].message.replace("\n", "").replace(payload[0].author, ""), author: payload[0].author };
			if(broadcastDetail.message.length <= this.config.maxBroadcastLength) {
				this.broadcasts.push(broadcastDetail);
				this.updateDom();
			}
			else{
				Log.info(`Module ${this.name}: broadcast message length is ${broadcastDetail.message.length} which exceeds the configured maximum length.`);
				this.downloadBroadcastFromService();
			}
		}
	},

	getRandomBroadcast () {
		this.lastIndexUsed++;
		if (this.lastIndexUsed == this.broadcasts.length) {
			this.downloadBroadcastFromService ();
			this.lastIndexUsed = this.broadcasts.length - 1;
			if (this.broadcasts.length == 9000) this.lastIndexUsed = 0;
		}
		return this.broadcasts[this.lastIndexUsed] || "";
	},

	downloadBroadcastFromService () {
		var data = this.config;
		this.sendSocketNotification("GET_RANDOM_BROADCAST", data);
	},

	getDom () {
		var container = document.createElement("div");
		const wrapper = document.createElement("div");

		var broadcastLineDiv = document.createElement("div");
		var broadcastFontSize = this.getFontSize(this.config.broadcastSize);
		broadcastLineDiv.className = `thin bright pre-line ${broadcastFontSize}`;

		var authorLineDiv = document.createElement("div");
		var authorFontSize = this.getFontSize(this.config.authorSize);
		authorLineDiv.className = `thin bright pre-line ${authorFontSize}`;

		if (this.config.showSymbol) {
			var symbol = document.createElement("span");
			symbol.className = "fa fa-quote-left symbol-quote symbol-quote-left";
			broadcastLineDiv.appendChild(symbol);
		}

		var broadcastText = this.getRandomBroadcast();
		var broadcastLineSpan = document.createElement("span");
		broadcastLineSpan.innerHTML = broadcastText.message;
		broadcastLineDiv.appendChild(broadcastLineSpan);

		if (this.config.showSymbol) {
			symbol = document.createElement("span");
			symbol.className = "fa fa-quote-right symbol-quote symbol-quote-right";
			broadcastLineDiv.appendChild(symbol);
		}
		container.appendChild(broadcastLineDiv);

		if (broadcastText.author !== "" && broadcastText.author !== null && broadcastText.author !== undefined && broadcastText.author !== "null") {
			var authorLineSpan = document.createElement("span");
			authorLineSpan.innerHTML = broadcastText.author;
			authorLineDiv.appendChild(authorLineSpan);
			container.appendChild(authorLineDiv);
		}

		wrapper.innerHTML += container.innerHTML;
		return wrapper;
	},

	getFontSize (size) {
		if (size == "S") return "small";
		if (size == "L") return "large";
		else return "medium";
	}
});
