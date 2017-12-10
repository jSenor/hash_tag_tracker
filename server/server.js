const path = require("path")
const express = require("express")
const app = express()
const server = require("http").Server(app)
const io = require("socket.io")(server)

let sockets = {}, registered = {}

app.use(express.static(path.resolve(__dirname, "../client")))

app.get("/", function(req, res){
	res.sendFile(path.resolve(__dirname, "../client", "index.html"))
})

io.on("connection", function(socket){
	sockets[socket.id] = socket

	socket.on("listen", function(data){
		register(this.id, data.tag)
	})

	socket.on("disconnect", function(){
		delete sockets[this.id]
	})
})

server.listen(3000, function(){
	console.log("running")
})

function register(id, tag){
	if(registered[id]) unregister(id)
	twitterMock.track(tag, function(stream){
		registered[id] = stream
		console.log(registered)
		stream.on("tweet", function(tweet){
			sockets[id].emit("tweet", tweet)
		})
	})
}

function unregister(id){
	if(!registered[id]) return
	registered[id].close()
	delete registered[id]
	console.log(registered)
}

let twitterMock = {
	track: function(tag, cb){
		cb(createStreamer(tag))
	}
}

let createStreamer = function(tag){
	return{
		bank: null,
		on: function(name, cb){
			this.bank = setInterval(() => cb("Hello " + tag), 1000)
		},
		close: function(){
			clearInterval(this.bank)
		}
	}
}