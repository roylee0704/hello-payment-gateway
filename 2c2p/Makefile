# step 1. run server to listen to webhook.
server:
	PORT=3001 HOST=127.0.0.1 node ./server.js


# step 2. after that, set the ngrok url in 2c2p merchant portal option.
ngrok:
	ngrok http 3001

# step 3. run client to generate web payment url
start:
	node ./client.js