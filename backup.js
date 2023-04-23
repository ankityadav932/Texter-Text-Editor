/**
 * @author : Ankit Yadav (ankitrao.a1@gmail.com)
 * @module : Texter
 * @description : The program is a javascript basic text
 * editor plugin. 
 * ========================================================  */

// Configs 
let textEditorConfig = {
	selectionType : {
		emptySelection : 0,
		singleLineSelection : 1,
		multilineSelection : 2
	}
};


// Features
const textEditorFeatures = {
	h1 : {
		type : 'switch',
		content : `
		<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-type-h1" viewBox="0 0 16 16">
		  <path d="M8.637 13V3.669H7.379V7.62H2.758V3.67H1.5V13h1.258V8.728h4.62V13h1.259zm5.329 0V3.669h-1.244L10.5 5.316v1.265l2.16-1.565h.062V13h1.244z"/>
		</svg>
		`,
	},
	h2 : {
		type : 'switch',
		content : `
		<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-type-h2" viewBox="0 0 16 16">
		  <path d="M7.638 13V3.669H6.38V7.62H1.759V3.67H.5V13h1.258V8.728h4.62V13h1.259zm3.022-6.733v-.048c0-.889.63-1.668 1.716-1.668.957 0 1.675.608 1.675 1.572 0 .855-.554 1.504-1.067 2.085l-3.513 3.999V13H15.5v-1.094h-4.245v-.075l2.481-2.844c.875-.998 1.586-1.784 1.586-2.953 0-1.463-1.155-2.556-2.919-2.556-1.941 0-2.966 1.326-2.966 2.74v.049h1.223z"/>
		</svg>
		`,
	},
	h3 : {
		type : 'switch',
		content : `
		<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-type-h3" viewBox="0 0 16 16">
		  <path d="M7.637 13V3.669H6.379V7.62H1.758V3.67H.5V13h1.258V8.728h4.62V13h1.259zm3.625-4.272h1.018c1.142 0 1.935.67 1.949 1.674.013 1.005-.78 1.737-2.01 1.73-1.08-.007-1.853-.588-1.935-1.32H9.108c.069 1.327 1.224 2.386 3.083 2.386 1.935 0 3.343-1.155 3.309-2.789-.027-1.51-1.251-2.16-2.037-2.249v-.068c.704-.123 1.764-.91 1.723-2.229-.035-1.353-1.176-2.4-2.954-2.385-1.873.006-2.857 1.162-2.898 2.358h1.196c.062-.69.711-1.299 1.696-1.299.998 0 1.695.622 1.695 1.525.007.922-.718 1.592-1.695 1.592h-.964v1.074z"/>
		</svg>
		`,
	},
	boldText : {
		type : 'switch',
		content : `
		<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-type-bold" viewBox="0 0 16 16">
			<path d="M8.21 13c2.106 0 3.412-1.087 3.412-2.823 0-1.306-.984-2.283-2.324-2.386v-.055a2.176 2.176 0 0 0 1.852-2.14c0-1.51-1.162-2.46-3.014-2.46H3.843V13H8.21zM5.908 4.674h1.696c.963 0 1.517.451 1.517 1.244 0 .834-.629 1.32-1.73 1.32H5.908V4.673zm0 6.788V8.598h1.73c1.217 0 1.88.492 1.88 1.415 0 .943-.643 1.449-1.832 1.449H5.907z"/>
		</svg>
		`,
	},
	italicText : {
		type : 'switch',
		content : `
		<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-type-italic" viewBox="0 0 16 16">
		  <path d="M7.991 11.674 9.53 4.455c.123-.595.246-.71 1.347-.807l.11-.52H7.211l-.11.52c1.06.096 1.128.212 1.005.807L6.57 11.674c-.123.595-.246.71-1.346.806l-.11.52h3.774l.11-.52c-1.06-.095-1.129-.211-1.006-.806z"/>
		</svg>
		`,
	},
	unorderedlists : {
		type : 'switch',
		content : `
		<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-list-task" viewBox="0 0 16 16">
		  <path fill-rule="evenodd" d="M2 2.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5H2zM3 3H2v1h1V3z"/>
		  <path d="M5 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM5.5 7a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 4a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9z"/>
		  <path fill-rule="evenodd" d="M1.5 7a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H2a.5.5 0 0 1-.5-.5V7zM2 7h1v1H2V7zm0 3.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5H2zm1 .5H2v1h1v-1z"/>
		</svg>
		`,
	},
	orderedlists : {
		type : 'switch',
		content : `
		<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-list-ol" viewBox="0 0 16 16">
		  <path fill-rule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5z"/>
		  <path d="M1.713 11.865v-.474H2c.217 0 .363-.137.363-.317 0-.185-.158-.31-.361-.31-.223 0-.367.152-.373.31h-.59c.016-.467.373-.787.986-.787.588-.002.954.291.957.703a.595.595 0 0 1-.492.594v.033a.615.615 0 0 1 .569.631c.003.533-.502.8-1.051.8-.656 0-1-.37-1.008-.794h.582c.008.178.186.306.422.309.254 0 .424-.145.422-.35-.002-.195-.155-.348-.414-.348h-.3zm-.004-4.699h-.604v-.035c0-.408.295-.844.958-.844.583 0 .96.326.96.756 0 .389-.257.617-.476.848l-.537.572v.03h1.054V9H1.143v-.395l.957-.99c.138-.142.293-.304.293-.508 0-.18-.147-.32-.342-.32a.33.33 0 0 0-.342.338v.041zM2.564 5h-.635V2.924h-.031l-.598.42v-.567l.629-.443h.635V5z"/>
		</svg>
		`,
	},
	tables : {
		type : 'module',
		content : `
		<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-table" viewBox="0 0 16 16">
		  <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm15 2h-4v3h4V4zm0 4h-4v3h4V8zm0 4h-4v3h3a1 1 0 0 0 1-1v-2zm-5 3v-3H6v3h4zm-5 0v-3H1v2a1 1 0 0 0 1 1h3zm-4-4h4V8H1v3zm0-4h4V4H1v3zm5-3v3h4V4H6zm4 4H6v3h4V8z"/>
		</svg>
		`,
	},
	image : {
		type : 'module',
		content : `
		<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-image" viewBox="0 0 16 16">
		  <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
		  <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"/>
		</svg>
		`,
	}
};


/**
 * @function : createTextEditor
 * @purpose : To create the text editor
 * element and write it to DOM.
 **/

let createTextEditor = (userInput) => 
{
	// Main container
	let container = document.createElement('div'); 

	container.classList.add('texter');
	container.classList.add(userInput.config.customClass);
	container.style.width = userInput.config.width;

	// Option menu
	let optionMenu = document.createElement('div');

	optionMenu.classList.add('texter-option-menu');

	for(firstlevelItem in textEditorFeatures)
	{
		let itemElem = document.createElement('span');

		itemElem.classList.add('first-level-item');
		itemElem.classList.add(firstlevelItem);
		itemElem.setAttribute('type', 'button');
		itemElem.innerHTML = textEditorFeatures[firstlevelItem].content;	

		optionMenu.appendChild(itemElem);	
	}


	// Text editor
	let textEditor = document.createElement('div');

	textEditor.classList.add('texter-text-editor');
	textEditor.setAttribute('contenteditable', 'true');
	textEditor.style.height = userInput.config.height;


	/* TEST CODE { */

	textEditor.innerHTML = testHTML;

	/* TEST CODE } */



	// Nest elements	
	container.appendChild(optionMenu);
	container.appendChild(textEditor);


	// Render to DOM
	userInput.element.insertAdjacentElement('afterend', container);

	addTextEditorListener(textEditor);
}


class Texter 
{
	constructor(userConfig)
	{
		this.userConfig = userConfig;
		this.createTextEditor()
	}

	/**
	 * @function : createTextEditor
	 * @purpose : To create the text editor
	 * element and write it to DOM.
	 **/

	let createTextEditor = () => 
	{
		// Main container
		let container = document.createElement('div'); 

		container.classList.add('texter');
		container.classList.add(this.userInput.config.customClass);
		container.style.width = this.userInput.config.width;

		// Option menu
		let optionMenu = document.createElement('div');

		optionMenu.classList.add('texter-option-menu');

		for(firstlevelItem in textEditorFeatures)
		{
			let itemElem = document.createElement('span');

			itemElem.classList.add('first-level-item');
			itemElem.classList.add(firstlevelItem);
			itemElem.setAttribute('type', 'button');
			itemElem.innerHTML = textEditorFeatures[firstlevelItem].content;	

			optionMenu.appendChild(itemElem);	
		}


		// Text editor
		let textEditor = document.createElement('div');

		textEditor.classList.add('texter-text-editor');
		textEditor.setAttribute('contenteditable', 'true');
		textEditor.style.height = this.userInput.config.height;


		/* TEST CODE { */

		textEditor.innerHTML = testHTML;

		/* TEST CODE } */



		// Nest elements	
		container.appendChild(optionMenu);
		container.appendChild(textEditor);


		// Render to DOM
		this.userInput.element.insertAdjacentElement('afterend', container);

		addTextEditorListener(textEditor);
	}

}




/**
 * @module : Prototype extension
 * @description : This is the starting point of this functionality
 * -> It adds a prototype function to the HTML element class
 * -> The function loads the Texter(text-editor)
 * ===============================================================*/

HTMLElement.prototype.texter = function (userConfig) 
{
	// Prepare user input object
	let userInput = {
		element : this,
		config : userConfig
	};


	// Check if input element is an textarea
	if (userInput.element.nodeName !== 'TEXTAREA')
	{
		console.error('Texter : Given element is not an textarea');
		return false;
	}



	// Hide the input's element (textarea)
	userInput.element.style.display = 'none';	


	createTextEditor(userInput); 
}


// Test Code -----------------------------------

let addTextEditorListener = (textEditor) => 
{	
	let editorEvt = ['keyup', 'mouseup', 'focusin'];

	editorEvt.forEach(evtName => {
		textEditor.addEventListener(evtName, evt => {
			
			let currentSelection = window.getSelection();

			if(currentSelection.rangeCount == 0) return;
				
			window.lastSelection = currentSelection.getRangeAt(0);


			window.lastSelection = {
				startContainer : lastSelection.startContainer,
				endContainer : lastSelection.endContainer,
				startOffset : lastSelection.startOffset,
				endOffset : lastSelection.endOffset,
				collapsed : lastSelection.collapsed
			};

		});
	});

	document.querySelector('.boldText').addEventListener('click', evt => {
		insertInlineTag('big');
	});

	document.querySelector('.italicText').addEventListener('click', evt => {
		insertInlineTag('i');
	});
}


let setNewSelection = (randString, selectionType = 0) => 
{
	let range = document.createRange();
	let currentSelection = window.getSelection();
	let newElement = document.querySelector('[new-inserted-elem="'+ randString +'"]');
	newElement.removeAttribute('new-inserted-elem');

	switch (selectionType)
	{
		case 0: 
		{
			range.selectNodeContents(newElement);
		}
		break;

		case 1: 
		{
			range.setStart(newElement.nextSibling, 0);
			range.collapse(true);
		}
		break;

		case 2: 
		{
			console.log('Third selection type');
		}
		break;

		default:
			console.error('Unknown seletion type');
		break;
	}
	
	currentSelection.removeAllRanges();
	currentSelection.addRange(range);
}


let insertInlineTag = (elementTag) => 
{
	let lastSelectionRange = getLastRange();
	
	if(lastSelectionRange.collapsed)
	{
		let randString = generateString();
		let newElement = document.createElement(elementTag);
		let currNode = lastSelectionRange.startContainer;
		let currParent = currNode.parentElement;
		let beforeSelection = document.createTextNode(currNode.nodeValue.slice(0, lastSelectionRange.startOffset));
		let afterSelection = document.createTextNode(currNode.nodeValue.slice(lastSelectionRange.startOffset));
		
		newElement.setAttribute('new-inserted-elem', randString);
		newElement.innerHTML = '&#8203;';	

		currParent.insertBefore(beforeSelection, currNode);

		if (currNode.nextSibling) 
			currParent.insertBefore(afterSelection, currNode.nextSibling);
		else
			currParent.appendChild(afterSelection);

		currParent.replaceChild(newElement ,currNode);

		setNewSelection(randString, 0);
	}
	else
	{	
		let commonParent = lastSelectionRange.commonAncestorContainer;
		
		let newElement = document.createElement(elementTag);
		let beginNode = lastSelectionRange.startContainer;
		let beginNodeParent = beginNode.parentElement;
		let beforeSelection = document.createTextNode(beginNode.nodeValue.slice(0, lastSelectionRange.startOffset));
		let afterSelection = document.createTextNode(beginNode.nodeValue.slice(lastSelectionRange.startOffset));

		newElement.appendChild(afterSelection);

		beginNodeParent.insertBefore(beforeSelection, beginNode);
		beginNodeParent.replaceChild(newElement, beginNode);

		let currNode = beginNodeParent;

		while(currNode.parentElement)
		{
			if (currNode.parentElement == commonParent) break;

			let tempNode = currNode;
			
			while(currNode = currNode.nextSibling) nodeTreeTagInserter(currNode, elementTag);

			currNode = tempNode.parentElement;
		}

		let beginParentNode = currNode;


		let endNode = lastSelectionRange.endContainer;
		let endNodeParent = endNode.parentElement;
		newElement = document.createElement(elementTag);
		beforeSelection = document.createTextNode(endNode.nodeValue.slice(0, lastSelectionRange.endOffset));
		afterSelection = document.createTextNode(endNode.nodeValue.slice(lastSelectionRange.endOffset));

		newElement.appendChild(beforeSelection);

		endNodeParent.insertBefore(newElement, endNode);
		endNodeParent.replaceChild(afterSelection, endNode);

		
		currNode = endNodeParent;

		while(currNode.parentElement)
		{
			if (currNode.parentElement == commonParent) break;

			let tempNode = currNode;
			
			while(currNode = currNode.previousSibling) nodeTreeTagInserter(currNode, elementTag);

			currNode = tempNode.parentElement;
		}

		let endParentNode = currNode;


		currNode = beginParentNode.nextSibling;

		while (currNode != endParentNode)
		{
			if (currNode.nodeType == 3 && (!currNode.nodeValue.trim() || currNode.nodeValue.trim() == '\n\t')) 
			{
				currNode = currNode.nextSibling;
				continue;
			}

			nodeTreeTagInserter(currNode, elementTag);
			currNode = currNode.nextSibling;
		}

	}
}


let nodeTreeTagInserter = (element, tagName) => 
{
	if (element.childNodes.length)
	{
		console.log(`if`);
		console.log(element);
		for (child of element.childNodes)
		{
			if (child.nodeType == 3 && child.nodeValue.trim()) 
			{
				let newNode = document.createElement(tagName);
				let childClone = child;
				child.parentElement.replaceChild(newNode, child);
				newNode.appendChild(childClone);
			}
			else if (child.nodeType == 1) nodeTreeTagInserter(child, tagName);
		}
	}
}


let generateString = () => 
{
    let result = '';
	const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    
    for (let i = 0; i < 10; i++) result += characters.charAt(Math.floor(Math.random() * charactersLength));

    return result;
}


let getLastRange = () => 
{
	let lastSelectionRange = document.createRange();

	lastSelectionRange.setStart(window.lastSelection.startContainer, window.lastSelection.startOffset);
	lastSelectionRange.setEnd(window.lastSelection.endContainer, window.lastSelection.endOffset);

	if (window.lastSelection.collapsed) lastSelectionRange.collapse(true);

	return lastSelectionRange;
}



// ------------------------------------------------------------
let testHTML = `
	<div>asldaldjalk<strong>asdkjasljdad<i>asldaldhasldja</i>aslkjdsadasda</strong>kjhakjsdhkjash</div>
	<div>lkjdasldjalksd<strong>asldjalskdjalsdjlkasdakdsad</strong></div>
	<div>aslk<strong>asldajlsd<i>laskjdlaksjdlkasjdl</i>jaslkdj</strong>jasldjalksjdalksdas</div>
`;

/*let testHTML = `
	<ul>
		<li>sldjalkjdakd</li>
	</ul>
`;*/

// let testHTML = `
// 	<table>
// 		<thead>
// 			<tr>
// 				<th>dasddad</th>
// 				<th>dasddad</th>
// 				<th>dasddad</th>
// 			</tr>
// 		</thead>
// 		<tbody>
// 			<tr>
// 				<td>dasddad</td>
// 				<td>dasddad</td>
// 				<td>sadljjasldj</td>
// 			</tr>
// 			<tr>
// 				<td>dasddad</td>
// 				<td>dasddad</td>
// 				<td>sadljjasldj</td>
// 			</tr>
// 			<tr>
// 				<td>dasddad</td>
// 				<td>dasddad</td>
// 				<td>sadljjasldj</td>
// 			</tr>
// 			<tr>
// 				<td>dasddad</td>
// 				<td>dasddad</td>
// 				<td>sadljjasldj</td>
// 			</tr>
// 		</tbody>
// 	</table>
// `;