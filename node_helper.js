const NodeHelper = require("node_helper");

module.exports = NodeHelper.create({
	start () {
		console.log(`Starting node_helper for module: ${this.name}`);
	},

	async getRandomBroadcast (config) {		
		var url = config.apiUrl
		try {
			const response = await fetch(url, {
				headers: { "Authorization":  `${config.apiKey}` }
			});
			const data = await response.json();
			if (data.length == 0){
				console.error(`Module ${this.name}: 0 broadcast messages received.`);
			} 
			else{				
				return data;
			}
		} catch (error) {
			console.error("Error fetching broadcast: ", error);
			return null;
		}
	},

	async socketNotificationReceived (notification, payload) {
		console.error(`Module ${this.name} @ Socket Notification @ NH: ${JSON.stringify(payload)}`);
		if (notification === "GET_RANDOM_BROADCAST") {
			const broadcast = await this.getRandomBroadcast(payload);
			this.sendSocketNotification("GET_RANDOM_BROADCAST_RESPONSE", broadcast);
		}
	}
});
