


// Block Structure
class Block {
	
	constructor ( index, previousHash, timestamp, data, hash){
		this.index = index;
		this.previousHash = previousHash.toString();
		this.timestamp = timestamp;
		this.data = data;
		this.hash = hash.toString();
	}

}


//Block Hash
var calculateHash = ( index, previousHash, timestamp, data) => {
	return CryptoJS.SHA256(index, previousHash, timestamp, data)
};


// Generating a block
var generateNextBlock = (blockData) => {
	
	var previousBlock = getLatestBlock();
	var nextIndex = previousBlock.index + 1;
	var nextTimestamp = new Date().getTime() / 1000;
	var nextHash = calculateHash (nextIndex, previousBlock.hash, nextTimestamp,blockData);
	return new Block(nextIndex, previousBlock.hash, nextTimestamp, blockData,nextHash);

};

// Storing the block
var getGenesisBlock = () => {
	
	return new Block(0,"0", 1465154705, "First Block: Genesis", "816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7" );

};

var blockchain = [getGenesisBlock()];


// Valiadting the integrity of block
var isValidNewBlock = (newBlock, previousBlock) => {
	
	if (previousBlock.index + 1 !== newBlock.index){
		console.log('invalid index');
		return false;
	}

	else if (previousBlock.hash !== newBlock.previousHash){
		console.log('invalid previous hash');
		return false;
	}

	else if (calculateHashForBlock (newBlock) !== newBlock.hash){
		console.log('invalid hash: ' + calculateHashForBlock (newBlock) + ' ' + newBlock.hash);
		return false;
	}

	return true;

};

//Choosing the longest chain
var replaceChain = (newBlocks) =>{
	
	if (isValidChain (newBlocks) && newBlocks.length > blockchain.length){
		console.log('Received blockchain is vaild. Repalcing current blockchain with received blockchain');
		blockchain = newBlocks;
		broadcast (responseLatestMsg());
	}

	else {
		console.log('Received blockchain invalid');
	}

};

//Controlling the node
var initHttpServer = () => {
	
	var app = express();
	app.use (bodyParser.jason());

	app.get('/blocks', (req,res) => res.send (JASON.stringfy(blockchain)));
	
	app.post ('/mineBlock', (req,res) => {
		var newBlock = generateNextBlock(req.body.data);
		addBlock(newBlock);
		broadcast(responseLatestMsg());
		console.log('block added: ' + JASON.stringify(newBlock));
		res.send();
	});

	app.get('/peers', (res, req) => {
		res.send (sockets.map (s => s._socket.remoteAddress + ':' + s._socket.remotePort));

	});

	app.post('/addPeer', (res, req) => {
		connecctToPeers([req.body.peer]);
		res.send();
	});

	app.listen(http_port, () => console.log('Listening http on port: ' + http_port));
};



