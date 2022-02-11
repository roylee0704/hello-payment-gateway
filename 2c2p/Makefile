# step 1. run server to listen to webhook.
server:
	PORT=3001 HOST=127.0.0.1 node ./server.js


# step 2. after that, set the ngrok url in 2c2p merchant portal option.
ngrok:
	ngrok http 3001

# step 3. run client to generate web payment url
start:
	INVOICE_NO=PSUV-dBPMQWYFFLtoBZU6HBAcy5 \
	node ./client.js

inquiry:
	INVOICE_NO=PSUV-dBPMQWYFFLtoBZU6HBAcy5 PAYMENT_TOKEN=kSAops9Zwhos8hSTSeLTUZMztYY+Hy0KBvtFOSI46iVYawd8M8pO2Mzj2LDJE3sOars7aPOMyqSQ7yGx2Spk8PV6h3tjphbI4LeYkZ9KwIpDVBhGEt0cnerTc9nqiTeI \
	node ./inquiry.js