



class Block {
	
	constructor ( index, previousHash, timestamp, data, hash){
		this.index = index;
		this.previousHash = previousHash.toString();
		this.timestamp = timestamp;
		this.data = data;
		this.hash = hash.toString();
	}

}



var calculateHash = ( index, previousHash, timestamp, data) => {
	return CryptoJS.SHA256(index, previousHash, timestamp, data)
};



var generateNextBlock = (blockData) => {
	var previousBlock = getLatestBlock();
	var nextIndex = previousBlock.index + 1;
	var nextTimestamp = new Date().getTime() / 1000;
	var nextHash = calculateHash (nextIndex, previousBlock.hash, nextTimestamp,blockData);
	return new Block(nextIndex, previousBlock.hash, nextTimestamp, blockData,nextHash);
}


var getGenesisBlock = () => {
	return new Block(0,"0", 1465154705, "First Block: Genesis", "816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7" );
}

var blockchain = [getGenesisBlock()];