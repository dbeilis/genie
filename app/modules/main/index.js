// HTTC Transport Version
var oChatUI = new GenesysChatUI($, $("#chat_panel"),
	Transport_REST_HTTC, {
		id : "515a4376-ac30-4ed2-801f-a876c0d56c93",
		dataURL : "https://genesysvoice.com:8080/gcfd/servlets/chats/api/v2/chats/",
		context : "demo"
	}

	// Transport_WebSocket, {
	// 	id : "",
	// 	dataURL : "wss://genesysvoice.com:8080/gcfd/websockets/messaging",
	// 	context : "demo"
	// }
);

oChatUI.startSession();


