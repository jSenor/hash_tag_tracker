//Create a new dom element type=>string, className=>string, value=>string attrib=>object
function elt(type, className, value, attrib){
	let element = document.createElement(type)
	if(!element) return null

	if(className) element.className = className
	if(value) element.innerText = value

	if(attrib){
		for(prop in attrib){
			element.setAttribute(prop, attrib[prop])
		}
	}

	return element
}

//Puts all the elements in the children's array as a direct child of element
function compose(element, children){
	if(!element && !children)
		return
	children.forEach(child => {
		element.appendChild(child)
	})
	return element
}