ipfs.files.cat("QmS1xZmXxyA2WRCKPG24bx4Lve9ZMvjwJkNzp6qa3LQyDt", (err, stream) => {
	stream.on('data', file => {
		let fileContent = new TextDecoder('utf-8').decode(file)
		console.log(fileContent)
    })
})

// For folders
ipfs.files.add({path: '.', content: new ipfs.types.Buffer('what up people')}).then(result => {console.log(result)})

// For non folders
ipfs.files.add(new ipfs.types.Buffer('what up people')).then(result => {console.log(result)})
