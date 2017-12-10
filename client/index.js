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