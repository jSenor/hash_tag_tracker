const path = require("path")
const express = require("express")
const app = express()
const server = require("http").Server(app)
const io = require("socket.io")(server)
const twitter = require("twitter")
const config = require("./config")
const twitterAPI = twitter(config)

let sockets = {}, registered = {}

app.use(express.static(path.resolve(__dirname, "../client")))

app.get("/", function(req, res){
	res.sendFile(path.resolve(__dirname, "../client", "index.html"))
})

io.on("connection", function(socket){

	socket.on("listen", function(data){
		sockets[socket.id] = socket
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
	if(!sockets[id]) return
	// twitterMock.track(tag, function(stream){
	// 	registered[id] = stream
	// 	console.log(registered)
	// 	stream.on("tweet", function(tweet){
	// 		sockets[id].volatile.emit("tweet", {
	// 			user: Math.random(),
	// 			img: "img.png",
	// 			content: tweet
	// 		})
	// 	})
	// })
	twitterAPI.stream("statuses/filter", {track: tag}, stream => {
		registered[id] = stream
		stream.on("data", tweet => {
			sockets[id].volatile.emit("tweet", {
				user: tweet.user.screen_name,
				img: tweet.user.profile_image_url,
				content: tweet.text
			})
		})

		stream.on("error", console.log)
	})
}

function unregister(id){
	if(!registered[id]) return
	registered[id].destroy()
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
			this.bank = setInterval(() => cb("Hello " + tag + Math.random()), 5000)
		},
		close: function(){
			clearInterval(this.bank)
		}
	}
}