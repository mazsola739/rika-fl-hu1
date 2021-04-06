function visitLink(path) {
	let tmpOfRikasHW = localStorage.getItem(path)
	if (tmpOfRikasHW) {
		tmpOfRikasHW = parseInt(tmpOfRikasHW)
		localStorage.setItem(path, tmpOfRikasHW + 1)
	} else {
		localStorage.setItem(path, 1)
	}
}

function viewResults() {
	let removing = document.getElementById('clicks')
	if (removing) {
		removing.remove()
	}
	let ul = document.getElementById('content')
	let ulResult = document.createElement('ul')
	ulResult.id = 'clicks'
	function zero(pageName) {
		let pageClicks = localStorage.getItem(pageName)
		if (pageClicks === null) {
			pageClicks = '0'
		}
		return pageClicks
	}
	let page1Clicks = zero('Page1')
	let page2Clicks = zero('Page2')
	let page3Clicks = zero('Page3')
	ulResult.innerHTML = `<li>You visited Page1: ${page1Clicks} time(s)</li>
	<li>You visited Page2: ${page2Clicks} time(s)</li>
	<li>You visited Page3: ${page3Clicks} time(s)</li>`
	ul.appendChild(ulResult)
	localStorage.clear()
}
