let elements = {}

setupUI()
setupEvents()

function setupUI(){
	let search = document.querySelector(".search input")
	search.onfocus = function(event){
		event.target.placeholder = ""
	}
	search.onblur = function(event){
		event.target.placeholder = "#SomeEdgyHashTag"
	}
}

function setupEvents(){
	let form = document.querySelector("#search")
	form.onsubmit = function(event){
		event.preventDefault()
		let hashTag = form.children[0].value
		socket.emit("listen", {tag: hashTag})
	}
}

function handleTweet(tweetObj){
	let tweets = document.querySelector(".tweets")
	let avatar = compose(elt("div", "avatar"), [
			elt("img", null, null, {src: tweetObj.img})
		])
	let post = compose(elt("div", "post"), [
			elt("div", "user", tweetObj.user),
			elt("div", "content", tweetObj.content)
		])
	let tweet = compose(elt("div", "tweet"), [avatar, post])
	tweets.prepend(tweet)
}