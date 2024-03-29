/**
 * @author : Ankit Yadav (ankitrao.a1@gmail.com)
 * @module : Texter
 * @description : The program is a javascript basic text
 * editor plugin. 
 * ========================================================  */

class Texter 
{
	// Static properties
	static #emptyText = '\u200b';
	static #emptyHTML = '&#8203;';

	// Debug mode
	#debugMode = true;

	// Texter properties
	#texterContainer = null;
	#texterMenu = null;
	#texterEditor = null;
	#texterActiveFeatures = [];
	#texterActiveNewlineFeature = null;
	#activeCustomFeature = null;
	#activeCustomFeatureNode = null;


	// Last selection param
	#lastSelection = null


	// Configs 
	#textEditorConfig = {
		selectionType : {
			emptySelection : 0,
			singleLineSelection : 1,
			multilineSelection : 2
		},
		featureType : {
			inlineFeature : 1,
			newLineFeature : 2,
			customFeature : 3,
			stylingFeature : 4,
		},
		elementType : {
			inline : 1,
			block : 2
		}
	};

	#texterIcons = {
		p : `
			<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-paragraph" viewBox="0 0 16 16">
			  <path d="M10.5 15a.5.5 0 0 1-.5-.5V2H9v12.5a.5.5 0 0 1-1 0V9H7a4 4 0 1 1 0-8h5.5a.5.5 0 0 1 0 1H11v12.5a.5.5 0 0 1-.5.5z"/>
			</svg>
		`,
		h1 : `
			<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-type-h1" viewBox="0 0 16 16">
			  <path d="M8.637 13V3.669H7.379V7.62H2.758V3.67H1.5V13h1.258V8.728h4.62V13h1.259zm5.329 0V3.669h-1.244L10.5 5.316v1.265l2.16-1.565h.062V13h1.244z"/>
			</svg>
		`,
		h2 : `
			<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-type-h2" viewBox="0 0 16 16">
			  <path d="M7.638 13V3.669H6.38V7.62H1.759V3.67H.5V13h1.258V8.728h4.62V13h1.259zm3.022-6.733v-.048c0-.889.63-1.668 1.716-1.668.957 0 1.675.608 1.675 1.572 0 .855-.554 1.504-1.067 2.085l-3.513 3.999V13H15.5v-1.094h-4.245v-.075l2.481-2.844c.875-.998 1.586-1.784 1.586-2.953 0-1.463-1.155-2.556-2.919-2.556-1.941 0-2.966 1.326-2.966 2.74v.049h1.223z"/>
			</svg>
		`,
		h3 : `
			<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-type-h3" viewBox="0 0 16 16">
			  <path d="M7.637 13V3.669H6.379V7.62H1.758V3.67H.5V13h1.258V8.728h4.62V13h1.259zm3.625-4.272h1.018c1.142 0 1.935.67 1.949 1.674.013 1.005-.78 1.737-2.01 1.73-1.08-.007-1.853-.588-1.935-1.32H9.108c.069 1.327 1.224 2.386 3.083 2.386 1.935 0 3.343-1.155 3.309-2.789-.027-1.51-1.251-2.16-2.037-2.249v-.068c.704-.123 1.764-.91 1.723-2.229-.035-1.353-1.176-2.4-2.954-2.385-1.873.006-2.857 1.162-2.898 2.358h1.196c.062-.69.711-1.299 1.696-1.299.998 0 1.695.622 1.695 1.525.007.922-.718 1.592-1.695 1.592h-.964v1.074z"/>
			</svg>
		`,
		boldText : `
			<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-type-bold" viewBox="0 0 16 16">
				<path d="M8.21 13c2.106 0 3.412-1.087 3.412-2.823 0-1.306-.984-2.283-2.324-2.386v-.055a2.176 2.176 0 0 0 1.852-2.14c0-1.51-1.162-2.46-3.014-2.46H3.843V13H8.21zM5.908 4.674h1.696c.963 0 1.517.451 1.517 1.244 0 .834-.629 1.32-1.73 1.32H5.908V4.673zm0 6.788V8.598h1.73c1.217 0 1.88.492 1.88 1.415 0 .943-.643 1.449-1.832 1.449H5.907z"/>
			</svg>
		`,
		italicText : `
			<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-type-italic" viewBox="0 0 16 16">
			  <path d="M7.991 11.674 9.53 4.455c.123-.595.246-.71 1.347-.807l.11-.52H7.211l-.11.52c1.06.096 1.128.212 1.005.807L6.57 11.674c-.123.595-.246.71-1.346.806l-.11.52h3.774l.11-.52c-1.06-.095-1.129-.211-1.006-.806z"/>
			</svg>
		`,
		underlinedText : `
			<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-type-underline" viewBox="0 0 16 16">
			  <path d="M5.313 3.136h-1.23V9.54c0 2.105 1.47 3.623 3.917 3.623s3.917-1.518 3.917-3.623V3.136h-1.23v6.323c0 1.49-.978 2.57-2.687 2.57-1.709 0-2.687-1.08-2.687-2.57V3.136zM12.5 15h-9v-1h9v1z"/>
			</svg>
		`,
		unorderedlists : `
			<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-list-task" viewBox="0 0 16 16">
			  <path fill-rule="evenodd" d="M2 2.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5H2zM3 3H2v1h1V3z"/>
			  <path d="M5 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM5.5 7a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 4a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9z"/>
			  <path fill-rule="evenodd" d="M1.5 7a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H2a.5.5 0 0 1-.5-.5V7zM2 7h1v1H2V7zm0 3.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5H2zm1 .5H2v1h1v-1z"/>
			</svg>
		`,
		orderedlists : `
			<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-list-ol" viewBox="0 0 16 16">
			  <path fill-rule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5z"/>
			  <path d="M1.713 11.865v-.474H2c.217 0 .363-.137.363-.317 0-.185-.158-.31-.361-.31-.223 0-.367.152-.373.31h-.59c.016-.467.373-.787.986-.787.588-.002.954.291.957.703a.595.595 0 0 1-.492.594v.033a.615.615 0 0 1 .569.631c.003.533-.502.8-1.051.8-.656 0-1-.37-1.008-.794h.582c.008.178.186.306.422.309.254 0 .424-.145.422-.35-.002-.195-.155-.348-.414-.348h-.3zm-.004-4.699h-.604v-.035c0-.408.295-.844.958-.844.583 0 .96.326.96.756 0 .389-.257.617-.476.848l-.537.572v.03h1.054V9H1.143v-.395l.957-.99c.138-.142.293-.304.293-.508 0-.18-.147-.32-.342-.32a.33.33 0 0 0-.342.338v.041zM2.564 5h-.635V2.924h-.031l-.598.42v-.567l.629-.443h.635V5z"/>
			</svg>
		`,
		tables : `
			<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-table" viewBox="0 0 16 16">
			  <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm15 2h-4v3h4V4zm0 4h-4v3h4V8zm0 4h-4v3h3a1 1 0 0 0 1-1v-2zm-5 3v-3H6v3h4zm-5 0v-3H1v2a1 1 0 0 0 1 1h3zm-4-4h4V8H1v3zm0-4h4V4H1v3zm5-3v3h4V4H6zm4 4H6v3h4V8z"/>
			</svg>
		`,
		image : `
			<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-image" viewBox="0 0 16 16">
			  <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
			  <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"/>
			</svg>
		`,	
		alignLeft : `
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-text-left" viewBox="0 0 16 16">
			  <path fill-rule="evenodd" d="M2 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
			</svg>
		`,
		alignRight : `
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-text-right" viewBox="0 0 16 16">
			  <path fill-rule="evenodd" d="M6 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-4-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm4-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-4-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
			</svg>
		`,
		alignCenter : `
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-text-center" viewBox="0 0 16 16">
			  <path fill-rule="evenodd" d="M4 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
			</svg>
		`,
		close : `
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
			  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
			  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
			</svg>
		`,
		add : `
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle-fill" viewBox="0 0 16 16">
			  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"/>
			</svg>
		`
	} 


	// Features
	#textEditorFeatures = {
		p : {
			name : 'P',
			class : 'p-btn',
			type : this.#textEditorConfig.featureType.newLineFeature,
			content : this.#texterIcons.p,
			tooltip : 'Paragraph'
		},
		h1 : {
			name : 'H1',
			class : 'h1-btn',
			type : this.#textEditorConfig.featureType.newLineFeature,
			content : this.#texterIcons.h1,
			tooltip : 'Big heading'
		},
		h2 : {
			name : 'H2',
			class : 'h2-btn',
			type : this.#textEditorConfig.featureType.newLineFeature,
			content : this.#texterIcons.h2,
			tooltip : 'Medium heading',
		},
		h3 : {
			name : 'H3',
			class : 'h3-btn',
			type : this.#textEditorConfig.featureType.newLineFeature,
			content : this.#texterIcons.h3,
			tooltip : 'Small heading'
		},
		D1 : 'divider',
		boldText : {
			name : 'STRONG',
			class : 'boldText-btn',
			type : this.#textEditorConfig.featureType.inlineFeature,
			content : this.#texterIcons.boldText,
			tooltip : 'Bold text'
		},
		italicText : {
			name : 'I',
			class : 'italicText-btn',
			type : this.#textEditorConfig.featureType.inlineFeature,
			content : this.#texterIcons.italicText,
			tooltip : 'Italic text'
		},
		underlinedText : {
			name : 'U',
			class : 'underlinedText-btn',
			type : this.#textEditorConfig.featureType.inlineFeature,
			content : this.#texterIcons.underlinedText,
			tooltip : 'Underlined text'
		},
		D2 : 'divider',
		unorderedlists : {
			name : 'UL',
			class : 'unorderedlists-btn',
			type : this.#textEditorConfig.featureType.newLineFeature,
			content : this.#texterIcons.unorderedlists,
			tooltip : 'Bullet list'
		},
		orderedlists : {
			name : 'OL',
			class : 'orderedlists-btn',
			type : this.#textEditorConfig.featureType.newLineFeature,
			content : this.#texterIcons.orderedlists,
			tooltip : 'Numbered list'
		},
		D3 : 'divider',
		alignLeft : {
			name : 'ALIGN-LEFT',
			styleCategory : 'ALIGNMENT',
			class : 'align-left-btn',
			type : this.#textEditorConfig.featureType.stylingFeature,
			styleClass : 'align-left',
			content : this.#texterIcons.alignLeft,
			tooltip : 'Align Left', 
			level : this.#textEditorConfig.elementType.block
		}
,		alignCenter : {
			name : 'ALIGN-CENTER',
			styleCategory : 'ALIGNMENT',
			class : 'align-center-btn',
			type : this.#textEditorConfig.featureType.stylingFeature,
			styleClass : 'align-center',
			content : this.#texterIcons.alignCenter,
			tooltip : 'Align Center', 
			level : this.#textEditorConfig.elementType.block
		},
		alignright : {
			name : 'ALIGN-RIGHT',
			styleCategory : 'ALIGNMENT',
			class : 'align-right-btn',
			type : this.#textEditorConfig.featureType.stylingFeature,
			styleClass : 'align-right',
			content : this.#texterIcons.alignRight,
			tooltip : 'Align Right', 
			level : this.#textEditorConfig.elementType.block
		},
		D4: 'divider',
		tables : {
			name : 'TABLE',
			class : 'tables-btn',
			type : this.#textEditorConfig.featureType.customFeature,
			content : this.#texterIcons.tables,
			tooltip : 'Table'
		},
		image : {
			name : 'IMG',
			class : 'image-btn',
			type : this.#textEditorConfig.featureType.customFeature,
			content : this.#texterIcons.image,
			tooltip : 'Image'
		}
	};

	

	/**
	 * @function : constructor 
	 * @purpose : To initialise the text edtior
	 * ===========================================*/

	constructor(userConfig)
	{
		this.userConfig = userConfig;
		this.createTextEditor()
	}


	/**
	 * @function : getLastRange
	 * @purpose : To get the last selection range 
	 * in the text editor
	 * =============================================*/

	getLastRange = () => 
	{
		/*
		- Create new range based on last selection params
		- Return newly created range
		*/ 

		if(!this.#lastSelection) return null;

		let lastSelectionRange = document.createRange();

		lastSelectionRange.setStart(this.#lastSelection.startContainer, this.#lastSelection.startOffset);
		lastSelectionRange.setEnd(this.#lastSelection.endContainer, this.#lastSelection.endOffset);

		if (this.#lastSelection.collapsed) lastSelectionRange.collapse(true);

		return lastSelectionRange;
	}



	/**
	 * @function : clearLastSelection
	 * @purpose : To clear the lastSelection property
	 * ===============================================*/

	clearLastSelection = () => 
	{
		window.getSelection().removeAllRanges();
	 	this.#lastSelection = null; 
	}



	/**
	 * @function : createTextEditor
	 * @purpose : To create the text editor
	 * element and write it to DOM.
	 * ===========================================*/

	createTextEditor = () => 
	{
		// Create main container
		this.#texterContainer = document.createElement('div'); 

		this.#texterContainer.classList.add('texter');
		this.#texterContainer.classList.add(this.userConfig.config.customClass);
		this.#texterContainer.style.width = this.userConfig.config.width;


		// Create option menu
		this.#texterMenu = document.createElement('div');
		this.#texterMenu.classList.add('texter-option-menu');

		let overflowScrollDiv = document.createElement('div');
		overflowScrollDiv.classList.add('overflow-scroll');

		let menuPanel = document.createElement('div');
		menuPanel.classList.add('menu-panel');

		// Set menu items
		for(let firstlevelItem in this.#textEditorFeatures)
		{
			if (this.#textEditorFeatures[firstlevelItem] == 'divider') 
			{
				let divider = document.createElement('span');
				divider.classList.add('menu-divider');
				menuPanel.appendChild(divider);
				continue;
			}


			let itemElem = document.createElement('span');
			itemElem.classList.add('first-level-item');
			itemElem.classList.add(this.#textEditorFeatures[firstlevelItem].class);
			itemElem.setAttribute('type', 'button');
			itemElem.setAttribute('feature-key', firstlevelItem)
			itemElem.setAttribute('title', this.#textEditorFeatures[firstlevelItem].tooltip)
			itemElem.innerHTML = this.#textEditorFeatures[firstlevelItem].content;	

			menuPanel.appendChild(itemElem);
		}

		overflowScrollDiv.appendChild(menuPanel);
		this.#texterMenu.appendChild(overflowScrollDiv);


		// Create text editor
		this.#texterEditor = document.createElement('div');

		this.#texterEditor.classList.add('texter-text-editor');
		this.#texterEditor.setAttribute('contenteditable', 'true');
		this.#texterEditor.setAttribute('placeholder', 'Type something here ...');
		// this.#texterEditor.setAttribute('autofocus', 'true');
		this.#texterEditor.style.height = this.userConfig.config.height;


		/* TEST CODE { */

		// this.#texterEditor.innerHTML = 	testHTML;

		/* TEST CODE } */


		// Nest elements	
		this.#texterContainer.appendChild(this.#texterMenu);
		this.#texterContainer.appendChild(this.#texterEditor);


		// Render to DOM
		this.userConfig.element.insertAdjacentElement('afterend', this.#texterContainer);


		// Add event listeners
		this.addTexterListeners();
	}



	/**
	 * @function : addTexterListenerss
	 * @purpose : To add event listeners to the newly 
	 * created text editor instance
	 * ===================================================*/

	addTexterListeners = () => 
	{	
		// Set menu item - Icon size
		document.querySelectorAll('.first-level-item svg').forEach(svg => {
			svg.setAttribute('width','25');
			svg.setAttribute('height','25');
		});


		// Set p as default
		document.execCommand('defaultParagraphSeparator', false, 'p');


		this.#texterContainer.addEventListener('mouseup', evt => {
			
			this.manageCustomFeatureOptions(evt.target);	
			this.manageMenuOptions(evt.target)

			
			if (this.#texterEditor.contains(evt.target)) 
			{
				// Set <p> as default new line tag
				this.setParagraphAsDefault(evt);	
				
				// Get current selection and range 
				let currentSelection = window.getSelection();

				if(currentSelection.rangeCount == 0) return;
				
				let currentRange = currentSelection.getRangeAt(0);

				if (this.#texterEditor == currentRange.commonAncestorContainer || this.#texterEditor.contains(currentRange.commonAncestorContainer)) 
				{
					// Set Last range params
					this.#lastSelection = {
						startContainer : currentRange.startContainer,
						endContainer : currentRange.endContainer,
						startOffset : currentRange.startOffset,
						endOffset : currentRange.endOffset,
						collapsed : currentRange.collapsed
					};


					// Set Active features
					this.setActiveFeatures();
				}
			}


			// Add event listeners to menu feature buttons
			if (this.#texterMenu.contains(evt.target)) 
			{
				let featureBtn = this.#texterMenu.querySelectorAll('span.first-level-item');

				featureBtn.forEach(elem => {
					if (elem == evt.target || elem.contains(evt.target))
						this.changeFeatureState(elem.getAttribute('feature-key'));
				});
			}
		});


		// Event array to be added to texterEditor
		let editorEvt = ['keyup', 'focusin'];

		// Add listeners to texterEditor
		editorEvt.forEach(evtName => {

			this.#texterEditor.addEventListener(evtName, evt => {

				// Set <p> as default new line tag
				this.setParagraphAsDefault(evt);	
				
				// Get current selection and range 
				let currentSelection = window.getSelection();

				if(currentSelection.rangeCount == 0) return;
	
				let currentRange = currentSelection.getRangeAt(0);

				if (this.#texterEditor == currentRange.commonAncestorContainer || this.#texterEditor.contains(currentRange.commonAncestorContainer)) 
				{
					// Set Last range params
					this.#lastSelection = {
						startContainer : currentRange.startContainer,
						endContainer : currentRange.endContainer,
						startOffset : currentRange.startOffset,
						endOffset : currentRange.endOffset,
						collapsed : currentRange.collapsed
					};


					// Set Active features
					this.setActiveFeatures();
				}
			});
		});


		this.#texterEditor.addEventListener('focusout', evt => {
			console.log('OK');

			// Remove all empty Nodes 
			// Remove all duplicate Nodes
		});
	}



	/**
	 * @function : createImageOptions
	 * @purpose : To create the floating option menu 
	 * for image feature
	 * =====================================================*/

	createImageOptions = (imgNode) =>
	{
		if (imgNode.parentElement.querySelector('span.image-options')) return;

		let imgOptions = document.createElement('SPAN');
		imgOptions.contentEditable = false;
		imgOptions.classList.add('image-options');

		let divider = document.createElement('SPAN')
		divider.classList.add('custom-feature-divider');


		let alignLeftBtn = document.createElement('BUTTON');
		alignLeftBtn.innerHTML = this.#texterIcons.alignLeft;
		alignLeftBtn.setAttribute('feature', 'img-left');
		alignLeftBtn.setAttribute('title', 'Algin left');
		imgOptions.appendChild(alignLeftBtn);
		
		let alignCenterBtn = document.createElement('BUTTON');
		alignCenterBtn.innerHTML = this.#texterIcons.alignCenter;
		alignCenterBtn.setAttribute('feature', 'img-center');
		alignCenterBtn.setAttribute('title', 'Align center');
		imgOptions.appendChild(alignCenterBtn);

		let alignRightBtn = document.createElement('BUTTON');
		alignRightBtn.innerHTML = this.#texterIcons.alignRight;
		alignRightBtn.setAttribute('feature', 'img-right');
		alignRightBtn.setAttribute('title', 'Align right');
		imgOptions.appendChild(alignRightBtn);

		imgOptions.appendChild(divider.cloneNode(true));


		let fullSizeBtn = document.createElement('BUTTON');
		fullSizeBtn.innerText = '100%';
		fullSizeBtn.setAttribute('feature', 'img-full');
		fullSizeBtn.setAttribute('title', 'Full size image');
		imgOptions.appendChild(fullSizeBtn);

		let halfSizeBtn = document.createElement('BUTTON');
		halfSizeBtn.innerText = '50%';
		halfSizeBtn.setAttribute('feature', 'img-half');
		halfSizeBtn.setAttribute('title', 'Half size image');
		imgOptions.appendChild(halfSizeBtn);

		let quaterSizeBtn = document.createElement('BUTTON');
		quaterSizeBtn.innerText = '25%';
		quaterSizeBtn.setAttribute('feature', 'img-quarter');
		quaterSizeBtn.setAttribute('title', 'Qauter size image');
		imgOptions.appendChild(quaterSizeBtn);

		imgOptions.appendChild(divider.cloneNode(true));

		let closeBtn = document.createElement('BUTTON');
		closeBtn.innerHTML = this.#texterIcons.close;
		closeBtn.setAttribute('feature', 'img-close');
		closeBtn.setAttribute('title', 'Remove image');
		imgOptions.appendChild(closeBtn);

		imgNode.insertAdjacentElement('afterend', imgOptions);

		this.addImageOptionListener(imgNode, imgOptions);
	}



	/**
	 * @function : addImageOptionListeners
	 * @purpose : To add event Listeners for 
	 * all image options
	 * ===========================================*/

	addImageOptionListener = (imgNode, imgOptions) =>
	{
		let mainBlockNode = this.mainElement(imgNode, this.#textEditorConfig.elementType.block);
		let mainInlineNode = imgNode.parentElement;
		let imgOptionList = imgOptions.querySelectorAll('button');
		console.log(imgOptionList);

		let addAlignment = (alignClass) => 
		{
			['align-left', 'align-center', 'align-right'].forEach(alignClassItr => {
				if (mainBlockNode.classList.contains(alignClassItr)) 
					mainBlockNode.classList.remove(alignClassItr);
			});

			mainBlockNode.classList.add(alignClass);

			mainBlockNode.click()
		}

		let addSize = (sizeClass) => 
		{
			['full', 'half', 'quarter'].forEach(sizeClassItr => {
				if (mainInlineNode.classList.contains(sizeClassItr)) 
					mainInlineNode.classList.remove(sizeClassItr);
			});

			mainInlineNode.classList.add(sizeClass);

			imgNode.click();
		}		


		imgOptionList.forEach(imgFeatureBtn => {
			let featureAttr = imgFeatureBtn.getAttribute('feature');

			if (featureAttr) 
			{
				switch(featureAttr)
				{
					case 'img-left':
						imgFeatureBtn.addEventListener('mouseup', evt => addAlignment('align-left'));
					break;

					case 'img-center':
						imgFeatureBtn.addEventListener('mouseup', evt => addAlignment('align-center'));
					break;

					case 'img-right':
						imgFeatureBtn.addEventListener('mouseup', evt => addAlignment('align-right'));
					break;

					case 'img-full':
						imgFeatureBtn.addEventListener('mouseup', evt => addSize('full'));
					break;

					case 'img-half':
						imgFeatureBtn.addEventListener('mouseup', evt => addSize('half'));
					break;

					case 'img-quarter':
						imgFeatureBtn.addEventListener('mouseup', evt => addSize('quarter'));
					break;

					case 'img-close':
						imgFeatureBtn.addEventListener('mouseup', evt => {
							mainInlineNode.parentElement.removeChild(mainInlineNode);
							mainBlockNode.removeAttribute('class');

							if (!mainBlockNode.properText().length) 
								mainBlockNode.parentElement.removeChild(mainBlockNode);
						});
					break;

					default:
						console.error('Unknown Image option passed for adding event listener');
					break;
				}
			}
		});
	}



	/**
	 * @function : manageCustomFeatureOptions
	 * @purpose : To check if a custom feature options needs 
	 * to be activated 
	 * ======================================================*/

	manageCustomFeatureOptions = (targetNode) =>
	{
		if(this.#activeCustomFeatureNode && this.#activeCustomFeatureNode != targetNode && !this.#activeCustomFeatureNode.contains(targetNode))
		{
			switch(this.#activeCustomFeature)
			{
				case 'IMG':
					while(this.#activeCustomFeatureNode.nextSibling)
						this.#activeCustomFeatureNode.parentElement.removeChild(this.#activeCustomFeatureNode.nextSibling);

					while(this.#activeCustomFeatureNode.previousSibling)
						this.#activeCustomFeatureNode.parentElement.removeChild(this.#activeCustomFeatureNode.previousSibling);
				break;

				case 'TABLE':
					if (this.#activeCustomFeatureNode.lastChild.nodeName == 'SPAN')
						this.#activeCustomFeatureNode.removeChild(this.#activeCustomFeatureNode.lastChild);
				break;

				default:
					console.error('Unknown custom feature passed for deactivation');
				break; 

			}

			this.#activeCustomFeatureNode = null;
			this.#activeCustomFeature = null;
		}
	}	



	/** 
	 * @function : manageMenuOptions
	 * @todo : To manage the options for the features
	 * mentioned in the menu
	 * ================================================*/

	manageMenuOptions = (targetNode) => 
	{
		let itemSubMenu = document.querySelector('#item-sub-menu');

		if (!itemSubMenu) return;

		if (!(targetNode == itemSubMenu || itemSubMenu.contains(targetNode)))
			itemSubMenu.parentElement.removeChild(itemSubMenu);
	}



	/**
	 * @function : getElementType 
	 * @purpose : To get if the element in 
	 * block or inline level
	 * ================================================*/

	getElementType = (element) =>
	{
		if (!element) return;

		if (element.nodeType != 1) return console.error('Only HTML node will be accepted as parameter');

		let elemStyle = element.currentStyle || window.getComputedStyle(element, ""); 
		return elemStyle.display;
	}



	/**
	 * @function : getElementPosition
	 * @purpose : To get the computed position 
	 * of an element
	 * ================================================*/

	getElementPosition = (element) => 
	{
		const elementViewPosition = element.getBoundingClientRect();
		const elementOffsetParent = element.offsetParent;
		const elementOffsetParentPosition = elementOffsetParent.getBoundingClientRect();

		let offsetTop = Math.abs(elementViewPosition.top - elementOffsetParentPosition.top);
		let offsetLeft = Math.abs(elementViewPosition.left - elementOffsetParentPosition.left);

		return {
		    left: offsetLeft + window.scrollX,
		    top: offsetTop + window.scrollY
		};
	}	



	/**
	 * @function : setParagraphAsDefault
	 * @todo : To set paragraph <p> as default new line tag
	 * ==================================================*/

	setParagraphAsDefault = (evt) =>
	{
		let currentSelection = window.getSelection();

		if(currentSelection.rangeCount == 0) return;
		
		let currentRange = currentSelection.getRangeAt(0);

		if (this.#texterEditor.properText().length == 0 && this.#texterEditor.childNodes.length == 0) 
		{
			let p = document.createElement('p');
			p.appendChild(document.createElement('br'));
			this.#texterEditor.appendChild(p);

			let newRange = document.createRange();
			newRange.setStart(p.firstChild, 0);
			newRange.collapse(true);
			currentSelection.removeAllRanges();
			currentSelection.addRange(newRange);			
		}
	}



	/**
	 * @function : unNestElements
	 * @purpose : To un-nest the nested elements as
	 * seperate independent nodes divided from the 
	 * position of collapsed selection range(Caret position)
	 * =======================================================*/

	unNestElements = (node, offset, tagName, targetElement) => 
	{
		// Validate for allowed node types
		if (![1,3].includes(node.nodeType)) 
			return console.error('Node of unknown type has been passed for un-nesting');

		// Check if empty Html element is passed
		if (node.nodeType == 1)
		{
			if (!(node.properText() && node.properText().length)) 
			{
				let emptyTextNode = document.createTextNode(Texter.#emptyText);
				node.appendChild(emptyTextNode);

				node = emptyTextNode;
				offset = 0;
			}
			else
				return console.error('Non empty HTML node has been passed for un-nesting')
		} 

		
		// Get current node child after and before selection range
		let beforeSelection = document.createTextNode(node.nodeValue.slice(0, offset));
		let afterSelection = document.createTextNode(node.nodeValue.slice(offset));
		let remainingNodeArray = [];
		let beforeSelectionElem = [];
		let afterSelectionElem = [];
		
		let itrNode = node;

		while (itrNode = itrNode.previousSibling) 
			beforeSelectionElem.unshift(itrNode)

		itrNode = node;

		while(itrNode = itrNode.nextSibling) 
			afterSelectionElem.push(itrNode);

		node.parentElement.setAttribute('target-node', 'true');


		// Get first tag node
		let tagNode = node.parentElement;
		remainingNodeArray.push(tagNode.nodeName.toUpperCase());

		if (tagName) 
		{
			while(tagNode.nodeName != tagName)
			{
				tagNode = tagNode.parentElement;
				remainingNodeArray.push(tagNode.nodeName.toUpperCase());
			} 
		}
		else if (targetElement)
		{
			while(tagNode != targetElement)
			{
				tagNode = tagNode.parentElement;
				remainingNodeArray.push(tagNode.nodeName.toUpperCase());
			} 		
		}
		else return console.error('Either tagName or targetElement is required for un-nesting HTML elements');


		// Clone first tag node 
		let beforeClone = tagNode.cloneNode(true);
		let afterClone = tagNode.cloneNode(true);


		// Prepare before division node
		let currNode = (beforeClone.hasAttribute('target-node')) ? beforeClone : beforeClone.querySelector('[target-node]');

		while(currNode.firstChild) 
			currNode.removeChild(currNode.firstChild);

		for(itrNode of beforeSelectionElem) 
			currNode.appendChild(itrNode);

		currNode.appendChild(beforeSelection);		
		currNode.removeAttribute('target-node');

		while(currNode != beforeClone)
		{
			while(currNode.nextSibling) 
				currNode.parentElement.removeChild(currNode.nextSibling);
			
			currNode = currNode.parentElement;
		}


		// Prepare after division node		
		currNode = (afterClone.hasAttribute('target-node')) ? afterClone : afterClone.querySelector('[target-node]');

		while(currNode.firstChild) 
			currNode.removeChild(currNode.firstChild);

		currNode.appendChild(afterSelection);

		for(itrNode of afterSelectionElem) 
			currNode.appendChild(itrNode);

		currNode.removeAttribute('target-node');

		while(currNode != afterClone)
		{
			while(currNode.previousSibling) 
				currNode.parentElement.removeChild(currNode.previousSibling);

			currNode = currNode.parentElement;
		}	


		// Replace clones with original element
		let emptyTextNode = document.createTextNode(Texter.#emptyText); 
		let tagNodeParent = tagNode.parentElement;

		if (afterClone.properText() && afterClone.properText().length) 
		{
			tagNodeParent.replaceChild(afterClone, tagNode);
			tagNodeParent.insertBefore(emptyTextNode, afterClone);
		}
		else
			tagNodeParent.replaceChild(emptyTextNode, tagNode);
		
		if (beforeClone.properText() && beforeClone.properText().length) tagNodeParent.insertBefore(beforeClone ,emptyTextNode);


		return {
			focusNode : emptyTextNode,
			nodeArray : remainingNodeArray                                                                
		}

	}


	/**
	 * @function : removeDuplicateTags
	 * @todo : To remove all duplicates HTML element in 
	 * a given HTML element
	 * ================================================*/

	removeDuplicateTags = (element, tagObj = {}) =>
	{
		if (element.nodeType == 1) 
		{
				let nodeName = element.nodeName;

			if (nodeName in tagObj) 
				tagObj[nodeName]++;
			else
				tagObj[nodeName] = 1;


			if (element.childNodes.length)
				for (let child of element.childNodes) 
					this.removeDuplicateTags(child, tagObj);


			if (nodeName in tagObj && tagObj[nodeName] > 1) 
			{
				let parent = element.parentElement;

				while(element.firstChild)
					parent.insertBefore(element.firstChild, element);

				parent.removeChild(element);
			}
			 
			tagObj[nodeName]--;	
		}
	}


	/**
	 * @function : insertInlineTag
	 * @purpose : To insert an HTML element according
	 * to the selection range
	 * ================================================*/

	insertInlineTag = (elementTag) => 
	{
		// Get last range
		let lastSelectionRange = this.getLastRange();

		if(!lastSelectionRange) return false;
		

		// Check is selection is empty or not
		if(lastSelectionRange.collapsed) // Empty selection
		{
			// Get data 
			let newElement = document.createElement(elementTag);
			let currNode = lastSelectionRange.startContainer;
			let currParent = (currNode.nodeType == 1) ? currNode : currNode.parentElement;
			let mainBlockNode = this.mainElement(currParent, this.#textEditorConfig.elementType.block);

			
			// Prepare tag to be inserted
			newElement.appendChild(document.createTextNode(Texter.#emptyText));


			// Handle non-empty element
			if (currNode.nodeType == 3)  
			{
				if (currNode.properText().length) 
				{
					let beforeSelection = document.createTextNode(currNode.nodeValue.slice(0, lastSelectionRange.startOffset));
					let afterSelection = document.createTextNode(currNode.nodeValue.slice(lastSelectionRange.startOffset));

					currParent.insertBefore(beforeSelection, currNode);

					if (currNode.nextSibling) 
						currParent.insertBefore(afterSelection, currNode.nextSibling);
					else
						currParent.appendChild(afterSelection);
				
				}

				currParent.replaceChild(newElement, currNode);
			}
			else if(currNode.nodeType == 1)
			{
				if (currNode.nodeName == 'BR') 
				{
					let tempNode = currNode;
					currNode = currNode.parentElement;

					currNode.removeChild(tempNode);
				}

				if (currNode.childNodes.length) 
					currNode.insertBefore(newElement, currNode.firstChild);
				else
					currNode.appendChild(newElement);
			}
			else console.error('Unknown element in range');


			// Set the selection back to last range
			this.setCaretPosition(newElement.firstChild, 1);
			this.setActiveFeatures();
		}
		else // Non-empty selection
		{
			if (lastSelectionRange.startContainer == lastSelectionRange.endContainer) 
			{
				let newElement = document.createElement(elementTag);
				let currNode = lastSelectionRange.startContainer;
				let currNodeParent = currNode.parentElement;
				let beforeSelection = document.createTextNode(currNode.nodeValue.slice(0, lastSelectionRange.startOffset));
				let inSelection = document.createTextNode(currNode.nodeValue.slice(lastSelectionRange.startOffset, lastSelectionRange.endOffset))
				let afterSelection = document.createTextNode(currNode.nodeValue.slice(lastSelectionRange.endOffset));

				newElement.appendChild(inSelection);
				currNodeParent.insertBefore(beforeSelection, currNode);

				if (currNode.nextSibling) 
					currNodeParent.insertBefore(afterSelection, currNode.nextSibling);
				else
					currNodeParent.appendChild(afterSelection);

				currNodeParent.replaceChild(newElement, currNode);
			}			
			else
			{
				let commonParent = lastSelectionRange.commonAncestorContainer;


				// Insert tag at the begin of selection range
				let currNode = lastSelectionRange.startContainer;
				let currOffset = lastSelectionRange.startOffset;
				let currElement = currNode.parentElement;

				let beforeSelection = document.createTextNode(currNode.nodeValue.slice(0, currOffset));
				let afterSelection = document.createTextNode(currNode.nodeValue.slice(currOffset));

				let newElement = document.createElement(elementTag);
				let focusElement = newElement;
				newElement.appendChild(afterSelection);

				currElement.replaceChild(newElement, currNode);
				currElement.insertBefore(beforeSelection, newElement);

				currElement = newElement;

				if (currElement != commonParent) 
				{
					while(currElement.parentElement != commonParent)
					{
						let currElemParent = currElement.parentElement;
						currElement = currElement.nextSibling;

						while(currElement)
						{
							let tempNode = currElement;
							currElement = currElement.nextSibling;

							this.setInlineTagInNode(tempNode, elementTag);
						}

						currElement = currElemParent;
					}
				}

				let	beginParentNode	= currElement;


				// Insert Tag at the end of selection range
				currNode = lastSelectionRange.endContainer;
				currOffset = lastSelectionRange.endOffset;
				currElement = currNode.parentElement;

				beforeSelection = document.createTextNode(currNode.nodeValue.slice(0, currOffset));
				afterSelection = document.createTextNode(currNode.nodeValue.slice(currOffset));

				newElement = document.createElement(elementTag);
				newElement.appendChild(beforeSelection);

				currElement.replaceChild(afterSelection, currNode);
				currElement.insertBefore(newElement, afterSelection);

				currElement = newElement;
				
				if (currElement != commonParent) 
				{
					while(currElement.parentElement != commonParent)
					{
						let currElemParent = currElement.parentElement;
						currElement = currElement.previousSibling;

						while(currElement)
						{
							let tempNode = currElement;
							currElement = currElement.previousSibling;

							this.setInlineTagInNode(tempNode, elementTag);
						}

						currElement = currElemParent;
					}
				}

				let endParentNode = currElement;


				// Insert tag between starting and endpoints
				if (beginParentNode != commonParent && endParentNode != commonParent) 
				{
					currElement = beginParentNode.nextSibling; 
					while(currElement && currElement != endParentNode)
					{	
						let tempNode = currElement;
						currElement = currElement.nextSibling;

						this.setInlineTagInNode(tempNode, elementTag);
					}
				}	

				this.setCaretPosition(focusElement.firstChild, 0);		
			}
		}
	}


	/**
	 * @function : setInlineTagInNode
	 * @purpose : insert the requested tag into given element
	 * ======================================================*/

	setInlineTagInNode = (node, tag) =>
	{
		if (!(node.properText() && node.properText().length))
			return node.parentElement.removeChild(node);

		if (node.nodeType == 1) 
		{
			let currElemType = this.getElementType(node);
			let newElement = document.createElement(tag);

			if (currElemType != 'inline') 
			{
				while(node.firstChild)
					newElement.appendChild(node.firstChild);

				node.appendChild(newElement);		
			}
			else if (currElemType == 'inline')
			{	
				let tempParentElement = node.parentElement;

				newElement.appendChild(node.cloneNode(true));
				tempParentElement.replaceChild(newElement, node);
			}
			else console.error('DOM element display type is out of config - ' + currElemType);
		}
		else if (node.nodeType == 3)
		{
			if (node && node.properText().length) 
			{
				let nodeParent = node.parentElement;
				let newElement = document.createElement(tag);
				
				newElement.appendChild(node.cloneNode(true));
				nodeParent.replaceChild(newElement, node);
			}
		}
		else console.error('DOM node type is out of config - ' + node.nodeType);		
	}



	/**
	 * @function : mainElement 
	 * @purpose : Returns the main block or inline level 
	 * ancestor element for its child element
	 * =====================================================*/
 
	mainElement = (node, type) =>
	{	
		let mainParent = this.#texterEditor;
		let currNode = (node.nodeType == 3) ? node.parentElement : node;

		if (type == this.#textEditorConfig.elementType.block) 
		{
			while(currNode)
			{
				let currNodeElementType = this.getElementType(currNode);

				if (currNode == mainParent) 
				{
					console.error('No block ancestor element found. Please report this issue');
					return null;
				}

				/* Old Condition*/
				// if (currNodeElementType == 'block' && currNode.parentElement == mainParent)
				
				if (currNodeElementType != 'inline' && currNode.parentElement == mainParent)
						return currNode; 

				currNode = currNode.parentElement;
			}
		}
		else if (type == this.#textEditorConfig.elementType.inline)
		{
			while(currNode)
			{
				let currNodeElementType = this.getElementType(currNode);
				let currParentElementType = this.getElementType(currNode.parentElement);

				if (currNode == mainParent) 
				{
					console.error('No block ancestor element found. Please report this issue');
					return null;
				}

				if (currNodeElementType == 'inline' && currParentElementType != 'inline')
						return currNode; 

				currNode = currNode.parentElement;
			}
		}
		else
		{
			console.error('Exceptional value sent in type argument');
			return false;
		} 
	}



	/**
	 * @function : setCaretPosition
	 * @purpose : To set caret position in text editor 
	 * in the given element and offset
	 * =====================================================*/

	setCaretPosition = (element, offset) =>
	{
		let range = document.createRange();
		let currentSelection = window.getSelection();

		range.setStart(element, offset);
		range.collapse(true);

		this.#lastSelection = {
			startContainer : range.startContainer,
			endContainer : range.endContainer,
			startOffset : range.startOffset,
				endOffset : range.endOffset,
			collapsed : range.collapsed
		};

		currentSelection.removeAllRanges();
		currentSelection.addRange(range);
	}	



	/**
	 * @function : generateString
	 * @purpose : Generates and returns a random string
	 * =====================================================*/

	generateString = () => 
	{
	    let result = 'ID';
		const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	    const charactersLength = characters.length;
	    
	    for (let i = 0; i < 10; i++) result += characters.charAt(Math.floor(Math.random() * charactersLength));

	    return result;
	}



	/**
	 * @function : nodeTreeTagRemover
	 * @purpose : Remove an HTML element around every non-empty
	 * text node in the given element
	 * =========================================================*/

	nodeTreeTagRemover = (element, tagName) => 
	{	
		if (element.nodeType == 1) 
		{
			if (element.childNodes.length)
			{
				let elemChild = element.firstChild;
				while (elemChild)
				{
					let tempNode = elemChild;
					elemChild = elemChild.nextSibling;
					this.nodeTreeTagRemover(tempNode, tagName);
				} 
			}			


			let nodeName = element.nodeName;

			if (!(element.properText() && element.properText().length))
			{
				element.parentElement.removeChild(element);
				return;
			}

			if (tagName == element.nodeName) 
			{
				let parent = element.parentElement;

				while(element.firstChild)
					parent.insertBefore(element.firstChild, element);

				parent.removeChild(element);
			}
		}
	}



	/** 
	 * @function : removeInlineTag
	 * @purpose : To remove a certain tag from selection range
	 * =========================================================*/

	removeInlineTag = (elementTag) => 
	{
		let lastSelectionRange = this.getLastRange();		

		if (lastSelectionRange.collapsed) 
		{	
			let currNode = lastSelectionRange.startContainer;
			let currOffset = lastSelectionRange.startOffset;

			let unNestObj = this.unNestElements(currNode, currOffset, elementTag, null);
			let focusNode = unNestObj.focusNode;
			let focusNodeParent = focusNode.parentElement;
			let focusNodeNextSibling = focusNode.nextSibling;


			let itrChildNode = focusNode
			for(let feature of this.#texterActiveFeatures)
			{
				if (feature.featureType == this.#textEditorConfig.featureType.inlineFeature) 
				{
					if (feature.nodeName != elementTag && unNestObj.nodeArray.includes(feature.nodeName.toUpperCase())) 
					{
						let tempNode = document.createElement(feature.nodeName);
						tempNode.appendChild(itrChildNode);
						itrChildNode = tempNode;
					}
				}
			}

			if (focusNodeNextSibling) 
				focusNodeParent.insertBefore(itrChildNode, focusNodeNextSibling);
			else
				focusNodeParent.appendChild(itrChildNode);

			this.setCaretPosition(focusNode, 1);
			this.setActiveFeatures();
		}
		else
		{
			if (lastSelectionRange.startContainer == lastSelectionRange.endContainer) 
			{
				console.log('Same element tag removal - To be developed');
			}
			else
			{	
				// Get required data
				let commonParent = lastSelectionRange.commonAncestorContainer;
				let commonParentType = this.getElementType(commonParent);


				// Mark begin and end Nodes
				let beginNode = lastSelectionRange.startContainer;
				let beginNodeSpan = document.createElement('SPAN');
				let beginOffset = lastSelectionRange.startOffset;

				let endNode = lastSelectionRange.endContainer;
				let endNodeSpan = document.createElement('SPAN');	
				let endOffset = lastSelectionRange.endOffset;

				beginNodeSpan.setAttribute('id', 'begin-node');
				endNodeSpan.setAttribute('id', 'end-node');

				beginNodeSpan.appendChild(beginNode.cloneNode(true));
				endNodeSpan.appendChild(endNode.cloneNode(true));	

				beginNode.parentElement.replaceChild(beginNodeSpan,beginNode);
				endNode.parentElement.replaceChild(endNodeSpan,endNode);
				

				// Un-nest and remove tags from begining node 
				beginNodeSpan = this.#texterEditor.querySelector('#begin-node');
				beginNode = beginNodeSpan.firstChild;
				beginNodeSpan.parentElement.replaceChild(beginNode, beginNodeSpan);

				let beginParentNode = null;
				if (this.getElementType(beginNode.parentElement) == 'inline') 
				{	
					let mainInlineNode = this.mainElement(beginNode, this.#textEditorConfig.elementType.inline);
					let unNestObj = this.unNestElements(beginNode, beginOffset, null, mainInlineNode);	
					beginParentNode = unNestObj.focusNode;
				}
				else 
					beginParentNode = beginNode; 


				// Remove tag from begin commonSubParent
				if (commonParentType != 'inline') 
				{
					while(beginParentNode && beginParentNode.parentElement != commonParent)
					{
						let tempNode = beginParentNode;
						beginParentNode = beginParentNode.parentElement;
						tempNode = tempNode.nextSibling;

						while(tempNode)
						{
							let tempNode1 = tempNode;
							tempNode = tempNode.nextSibling;

							if (tempNode1.nodeType == 1) 
								this.nodeTreeTagRemover(tempNode1, elementTag);
						}
					}					
				}
				

				// Un-nest and remove tags from end node 
				endNodeSpan = this.#texterEditor.querySelector('#end-node');
				endNode = endNodeSpan.firstChild;
				endNodeSpan.parentElement.replaceChild(endNode, endNodeSpan);

				let endParentNode = null;
				if (this.getElementType(endNode.parentElement) == 'inline')
				{
					let commonSubParent = this.mainElement(endNode, this.#textEditorConfig.elementType.inline);
					let unNestObj = this.unNestElements(endNode, endOffset, null, commonSubParent);
					endParentNode = unNestObj.focusNode;
				}
				else 
					endParentNode = endNode;


				// Remove tag from end commonSubParent
				if (commonParentType != 'inline') 
				{
					while(endParentNode.parentElement != commonParent)
					{
						let tempNode = endParentNode;
						endParentNode = endParentNode.parentElement;
						tempNode = tempNode.previousSibling;

						while(tempNode)
						{
							let tempNode1 = tempNode;
							tempNode = tempNode.previousSibling;

							if (tempNode1.nodeType == 1) 
								this.nodeTreeTagRemover(tempNode1, elementTag);
						}
					}
				}					


				console.dir(beginParentNode);
				console.dir(endParentNode);


				// Remove tags from the elements between startingParentNode and endParentNode
				let currNode = beginParentNode.nextSibling;

				if (currNode && currNode != endParentNode) 
				{
					while(currNode && currNode != endParentNode)
					{
						let tempNode = currNode;
						currNode = currNode.nextSibling;

						if (tempNode.nodeType == 1)
							this.nodeTreeTagRemover(tempNode, elementTag);
					}
				}
			}
		}
	}	


	/**
	 * @function : activateNewLineFeature
	 * @purpose : To activate a new line feature
	 * ============================================*/

	activateNewLineFeature = (feature) => 
	{
		let lastSelectionRange = this.getLastRange();
		let featureTag = feature.name;
		let listTags = ['UL', 'OL'];
		let generalTags = ['H1', 'H2', 'H3', 'P'];

		if (lastSelectionRange.collapsed) 
		{
			let mainBlockNode = this.mainElement(lastSelectionRange.startContainer, this.#textEditorConfig.elementType.block);

			if (listTags.includes(featureTag)) 
			{
				let newList = document.createElement(featureTag);
				
				if (listTags.includes(mainBlockNode.nodeName)) 
				{
					while(mainBlockNode.firstChild)
						newList.appendChild(mainBlockNode.firstChild);

					mainBlockNode.parentElement.replaceChild(newList, mainBlockNode);

					this.setCaretPosition(newList.lastChild, 0);
				}
				else if (generalTags.includes(mainBlockNode.nodeName))
				{
					let newListItem = document.createElement('LI');

					while(mainBlockNode.firstChild)
						newListItem.appendChild(mainBlockNode.firstChild);

					newList.appendChild(newListItem);
					
					mainBlockNode.parentElement.replaceChild(newList, mainBlockNode);
					
					this.setCaretPosition(newListItem, 0);
				}
				else console.log('New feature cant be implemented on custom feature');
			}
			else if (generalTags.includes(featureTag))
			{
				if (listTags.includes(mainBlockNode.nodeName)) 
				{
					let listTag = mainBlockNode.nodeName;
					
					let liElement = lastSelectionRange.startContainer;
					while(liElement.nodeName.toUpperCase() != 'LI')
						liElement = liElement.parentElement;

					let newElement = document.createElement(featureTag);
					while(liElement.firstChild)
						newElement.appendChild(liElement.firstChild);

					let beforeLi = document.createElement(listTag);
					while(liElement.previousSibling)
					{
						if (beforeLi.childNodes.length) 
							beforeLi.insertBefore(liElement.previousSibling, beforeLi.firstChild);
						else
							beforeLi.appendChild(liElement.previousSibling);
					}	

					let afterLi = document.createElement(listTag);
					while(liElement.nextSibling)
						afterLi.appendChild(liElement.nextSibling);

					if (afterLi.childNodes.length) 
					{
						mainBlockNode.parentElement.replaceChild(afterLi, mainBlockNode);
						afterLi.parentElement.insertBefore(newElement, afterLi);
					}
					else
						mainBlockNode.parentElement.replaceChild(newElement, mainBlockNode);

					if (beforeLi.childNodes.length) 
						newElement.parentElement.insertBefore(beforeLi, newElement);

					this.setCaretPosition(newElement, 0);
				}
				else if (generalTags.includes(mainBlockNode.nodeName))
				{
					let newElement = document.createElement(featureTag);

					while(mainBlockNode.firstChild)
						newElement.appendChild(mainBlockNode.firstChild);

					mainBlockNode.parentElement.replaceChild(newElement, mainBlockNode);

					this.setCaretPosition(newElement, 0);
				}
				else console.log('New feature cant be implemented on custom feature');
			}
			else console.log('New feature cant be implemented on custom feature');
		}
		else
		{
			let beginNode = lastSelectionRange.startContainer;
			let endNode = lastSelectionRange.endContainer;
			let beginBlockNode = this.mainElement(beginNode, this.#textEditorConfig.elementType.block);
			let endBlockNode = this.mainElement(endNode, this.#textEditorConfig.elementType.block);


			if (!(listTags.includes(beginBlockNode.nodeName) || generalTags.includes(beginBlockNode.nodeName)))
			{
				while(!(listTags.includes(beginBlockNode.nodeName) || generalTags.includes(beginBlockNode.nodeName) || beginBlockNode == endBlockNode))
					beginBlockNode = beginBlockNode.nextSibling;
			}

			if (!(listTags.includes(endBlockNode.nodeName) || generalTags.includes(endBlockNode.nodeName)))
			{
				while(!(listTags.includes(endBlockNode.nodeName) || generalTags.includes(endBlockNode.nodeName) || endBlockNode == beginBlockNode))
					endBlockNode = endBlockNode.previousSibling;
			}


			if (beginBlockNode == endBlockNode) 
			{
				let newElement = document.createElement(featureTag);

				while(beginBlockNode.firstChild)
					newElement.appendChild(beginBlockNode.firstChild);

				beginBlockNode.parentElement.replaceChild(newElement, beginBlockNode);

				return;
			}



			// Un-nest begin block element if LI
			if (listTags.includes(beginBlockNode.nodeName))
			{
				let mainLi = beginNode;
				while(mainLi.nodeName.toUpperCase() != 'LI')
					mainLi = mainLi.parentElement;

				let beforeList = document.createElement(beginBlockNode.nodeName);
				while(mainLi.previousSibling)
				{
					if (beforeList.childNodes.length) 
						beforeList.appendChild(mainLi.previousSibling);
					else
						beforeList.insertBefore(mainLi.previousSibling, beforeList.firstChild);
				}

				beginBlockNode.parentElement.insertBefore(beforeList, beginBlockNode);
			}


			// Un-nest end block element if LI
			if (listTags.includes(endBlockNode.nodeName))
			{
				let mainLi = endNode;
				while(mainLi.nodeName.toUpperCase() != 'LI')
					mainLi = mainLi.parentElement;

				let afterList = document.createElement(beginBlockNode.nodeName);
				while(mainLi.nextSibling)
					afterList.appendChild(mainLi.nextSibling);

				if (endBlockNode.nextSibling) 
					endBlockNode.parentElement.insertBefore(afterList, endBlockNode.nextSibling);
				else
					endBlockNode.appendChild(afterList);
			}


			// Activate feature for middle element between beginBlockNode and endBlockNode
			if (listTags.includes(featureTag)) 
			{
				let currNode = beginBlockNode;
				let newElement = document.createElement(featureTag);

				while(true)
				{
					let tempNode = currNode;
					currNode = (currNode.nextSibling) ? currNode.nextSibling : currNode;

					if (listTags.includes(tempNode.nodeName)) 
					{
						while(tempNode.firstChild)
							newElement.appendChild(tempNode.firstChild);

						if (tempNode != endBlockNode) 
							tempNode.parentElement.removeChild(tempNode);
					}
					else if (generalTags.includes(tempNode.nodeName))
					{
						let newLi = document.createElement('LI');

						while(tempNode.firstChild)
							newLi.appendChild(tempNode.firstChild);

						newElement.appendChild(newLi);

						if (tempNode != endBlockNode) 
							tempNode.parentElement.removeChild(tempNode);
					}
					else 
					{
						if (newElement.childNodes.length) 
							tempNode.parentElement.insertBefore(newElement, tempNode);

						newElement = document.createElement(featureTag);
						continue;	
					}

					if (tempNode == endBlockNode) 
					{
						tempNode.parentElement.insertBefore(newElement, tempNode);
						tempNode.parentElement.removeChild(tempNode);
						break;
					}
				}
			}
			else if (generalTags.includes(featureTag))
			{
				let currNode = beginBlockNode;
				
				while(true)
				{
					let tempNode = currNode;			
					currNode = (currNode.nextSibling) ? currNode.nextSibling : currNode;

					if (listTags.includes(tempNode.nodeName)) 
					{
						while(tempNode.firstChild)
						{
							let templi = tempNode.firstChild
							let newElement = document.createElement(featureTag);				

							while(templi.firstChild)
								newElement.appendChild(templi.firstChild);

							tempNode.parentElement.insertBefore(newElement, tempNode);
							tempNode.removeChild(templi);
						}

						tempNode.parentElement.removeChild(tempNode);
					}
					else if (generalTags.includes(tempNode.nodeName))
					{
						let newElement = document.createElement(featureTag);				

						while(tempNode.firstChild)
							newElement.appendChild(tempNode.firstChild);
 
						tempNode.parentElement.replaceChild(newElement, tempNode);
					}
					else 
						continue;	

					if (tempNode == endBlockNode) 
						break;
				}
			}
			else console.log('New feature cant be implemented on custom feature');
		}
	}



	/**
	 * @function : insertImage 
	 * @purpose : To insert an image in texter text editor
	 * =====================================================*/

	insertImage = () =>
	{
		// Open select image prompt
		let fileInput = document.createElement('INPUT');
		fileInput.type = 'file';
		fileInput.click();


		// Add event listeners
		fileInput.addEventListener('change', evt => {
			if (!(evt.target.files && evt.target.files.length == 1)) return console.log('No file selected');

			let uploadedFile = evt.target.files[0];
			if (uploadedFile) 	
			{
				let fileReader = new FileReader();

				fileReader.addEventListener('load', evt => {
					let fileContent = evt.target.result;
					let lastSelectionRange = this.getLastRange();

					let newImage = document.createElement('IMG');
					newImage.src = fileContent;

					let newSpan = document.createElement('SPAN');
					newSpan.contentEditable = false;
					newSpan.classList.add('image-container');
					newSpan.appendChild(newImage);

					let newDiv = document.createElement('div');
					newDiv.contentEditable = false;
					newDiv.appendChild(newSpan);

					if (lastSelectionRange) 
					{
						let mainBlockNode = this.mainElement(lastSelectionRange.endContainer, this.#textEditorConfig.elementType.block);
						mainBlockNode.insertAdjacentElement('afterend', newDiv);
					}
					else
						this.#texterEditor.appendChild(newDiv);

					let afterP = document.createElement('p');
					afterP.appendChild(document.createElement('br'));
					newDiv.insertAdjacentElement('afterend', afterP);

					newImage.addEventListener('click', evt => {
						this.createImageOptions(evt.target);
						this.clearLastSelection();
						this.setActiveFeatures();
						this.#activeCustomFeatureNode = evt.target;
						this.#activeCustomFeature = evt.target.nodeName;	
					})
				});

				fileReader.readAsDataURL(uploadedFile);
			}
		});
	}



	/**
	 * @function : openMenuOptions
	 * @purpose : To open the option UI for a menu item
	 * ===================================================*/

	openMenuOptions = (element, extraTop = 0, extraLeft = 0) =>
	{
		if (element.classList.contains('first-level-item')) 
		{
			let elementPos = this.getElementPosition(element);

			let tableSubMenu = document.createElement('span');
			tableSubMenu.classList.add('hide');
			tableSubMenu.id = 'item-sub-menu';
			tableSubMenu.style.left = elementPos.left + extraLeft + 'px';
			tableSubMenu.style.top = elementPos.top + extraTop + 'px';
			this.#texterMenu.appendChild(tableSubMenu);

			return tableSubMenu;
		}
		else return null;
	}



	/**
	 * @function : addTableOptionHandlers
	 * @purpose : To add event Listeners to all 
	 * the options(features) of the newly 
	 * created table
	 * ==============================================*/

	addTableOptionHandlers = (table, tableOptions) =>
	{
		let tableFeaturesBtn = tableOptions.querySelectorAll('button');

		let setTableAlignment = (alignmentClass) =>
		{
			let lastSelectionRange = this.getLastRange();
			let sameFeatureClasses = ['align-left','align-center','align-right'];
			
			sameFeatureClasses.forEach(className => {
				if (table.classList.contains(className))
					table.classList.remove(className);
			});

			table.classList.add(alignmentClass);

			this.setCaretPosition(lastSelectionRange.startContainer, lastSelectionRange.startOffset);
		}

		let manageTableHeaders = (headerClass = false) =>
		{
			let lastSelectionRange = this.getLastRange();

			if (headerClass) 
			{
				switch(headerClass)
				{
					case 'row':
						if (!table.classList.contains('header-row')) 
							table.classList.add('header-row');
					break;

					case 'col':
						if (!table.classList.contains('header-col')) 
							table.classList.add('header-col');
					break;

					default:
					break;
				}
			}
			else
			{
				table.classList.remove('header-col');
				table.classList.remove('header-row');
			}

			this.setCaretPosition(lastSelectionRange.startContainer, lastSelectionRange.startOffset);
		}

		let addCol = () => 
		{
			let lastSelectionRange = this.getLastRange();
			let trList = table.querySelectorAll('tr');
			let newTd = document.createElement('td');

			trList.forEach(tr => {
				tr.appendChild(newTd.cloneNode(true));
			});			

			this.setCaretPosition(lastSelectionRange.startContainer, lastSelectionRange.startOffset);
		}

		let addRow = () =>
		{
			let lastSelectionRange = this.getLastRange();
			let tr = table.querySelector('tr');
			let tdCount = tr.childNodes.length;

			let td = document.createElement('td');
			tr = document.createElement('tr');

			for (var i = 0; i < tdCount; i++) 
				tr.appendChild(td.cloneNode());

			if (table.lastChild.nodeName == 'SPAN') 
				table.insertBefore(tr, table.lastChild);
			else
				table.appendChild(tr);

			this.setCaretPosition(lastSelectionRange.startContainer, lastSelectionRange.startOffset);
		}


		tableFeaturesBtn.forEach(featureBtn => {
			switch(featureBtn.getAttribute('feature'))
			{
				case 'table-left':
					featureBtn.addEventListener('click', evt => setTableAlignment('align-left'));
				break;

				case 'table-center':
					featureBtn.addEventListener('click', evt => setTableAlignment('align-center'));
				break;

				case 'table-right':
					featureBtn.addEventListener('click', evt => setTableAlignment('align-right'));
				break;

				case 'table-add-col':
					featureBtn.addEventListener('click', evt => addCol());
				break;

				case 'table-add-row':
					featureBtn.addEventListener('click', evt => addRow());
				break;

				case 'table-header-row':
					featureBtn.addEventListener('click', evt => manageTableHeaders('row'));
				break;

				case 'table-header-col':
					featureBtn.addEventListener('click', evt => manageTableHeaders('col'));
				break;

				case 'table-header-remove':
					featureBtn.addEventListener('click', evt => manageTableHeaders());
				break;

				case 'table-close':
					featureBtn.addEventListener('click', evt => {
						let previousElement = table.previousElementSibling;
						table.parentElement.removeChild(table);

						this.setCaretPosition(previousElement, 0);
					});
				break;

				default:
					console.log('Unknow table feature passed');
				break;
			}
		});
	}


	/**
	 * @function : createTableOptions
	 * @purpose : To open custom options for the 
	 * newly created table
	 * ==============================================*/

	createTableOptions = (tableCell) =>
	{
		let table = tableCell;
		while(table.nodeName != 'TABLE')
			table = table.parentElement;	

		if (table.querySelector('span.table-options')) return;

		let tableOffset = this.getElementPosition(table);

		let tableOptions = document.createElement('span');
		tableOptions.contentEditable = false;
		tableOptions.classList.add('table-options');
		table.appendChild(tableOptions);

		let divider = document.createElement('SPAN')
		divider.classList.add('custom-feature-divider');

		let alignLeftBtn = document.createElement('BUTTON');
		alignLeftBtn.innerHTML = this.#texterIcons.alignLeft;
		alignLeftBtn.setAttribute('feature', 'table-left');
		alignLeftBtn.setAttribute('title', 'Algin left');
		tableOptions.appendChild(alignLeftBtn);
		
		let alignCenterBtn = document.createElement('BUTTON');
		alignCenterBtn.innerHTML = this.#texterIcons.alignCenter;
		alignCenterBtn.setAttribute('feature', 'table-center');
		alignCenterBtn.setAttribute('title', 'Align center');
		tableOptions.appendChild(alignCenterBtn);

		let alignRightBtn = document.createElement('BUTTON');
		alignRightBtn.innerHTML = this.#texterIcons.alignRight;
		alignRightBtn.setAttribute('feature', 'table-right');
		alignRightBtn.setAttribute('title', 'Align right');
		tableOptions.appendChild(alignRightBtn);

		tableOptions.appendChild(divider.cloneNode(true));


		let addColBtn = document.createElement('BUTTON');
		addColBtn.innerHTML = this.#texterIcons.add + ' Column';
		addColBtn.setAttribute('feature', 'table-add-col');
		addColBtn.setAttribute('title', 'Add column to table');
		tableOptions.appendChild(addColBtn);

		let addRowBtn = document.createElement('BUTTON');
		addRowBtn.innerHTML = this.#texterIcons.add + ' Row';
		addRowBtn.setAttribute('feature', 'table-add-row');
		addRowBtn.setAttribute('title', 'Add row to table');
		tableOptions.appendChild(addRowBtn);

		tableOptions.appendChild(divider.cloneNode(true));

		let headerRowBtn = document.createElement('BUTTON');
		headerRowBtn.innerHTML = 'Header Row';
		headerRowBtn.setAttribute('feature', 'table-header-row');
		headerRowBtn.setAttribute('title', 'Add header row to table');
		tableOptions.appendChild(headerRowBtn);

		let headerColBtn = document.createElement('BUTTON');
		headerColBtn.innerHTML = 'Header Column';
		headerColBtn.setAttribute('feature', 'table-header-col');
		headerColBtn.setAttribute('title', 'Add header column to table');
		tableOptions.appendChild(headerColBtn);	

		let removeheaderBtn = document.createElement('BUTTON');
		removeheaderBtn.innerHTML = 'Remove Header';
		removeheaderBtn.setAttribute('feature', 'table-header-remove');
		removeheaderBtn.setAttribute('title', 'Remove table headers');
		tableOptions.appendChild(removeheaderBtn);	

		tableOptions.appendChild(divider.cloneNode(true));

		let closeBtn = document.createElement('BUTTON');
		closeBtn.innerHTML = this.#texterIcons.close;
		closeBtn.setAttribute('feature', 'table-close');
		closeBtn.setAttribute('title', 'Remove table');
		tableOptions.appendChild(closeBtn);

		this.addTableOptionHandlers(table, tableOptions);
	}



	/**
	 * @function : openNewTableOptions
	 * @purpose : To open options UI for 
	 * creating a new table
	 * =============================================*/

	openNewTableOptions = () =>
	{
		let tableBtn = this.#texterMenu.querySelector('.first-level-item.tables-btn');			
		let subMenu = this.openMenuOptions(tableBtn, 40);

		let demoTabledimension = 8;
		let demoTable = document.createElement('table');
		demoTable.classList.add('demo-table');

		for (let i = 0; i < demoTabledimension; i++) 
		{	
			let tr = document.createElement('tr');

			for (let j = 0; j < demoTabledimension; j++) 
				tr.appendChild(document.createElement('td'));

			demoTable.appendChild(tr);
		}

		subMenu.appendChild(demoTable);
		subMenu.classList.remove('hide');


		let tableCols = demoTable.querySelectorAll('td');

		tableCols.forEach(col => {

			col.addEventListener('mouseover', evt => {	
				let tr = col.parentElement
				let tdIndex = tr.childNodes.indexOf(col);
				let trIndex = tr.parentElement.childNodes.indexOf(tr);

				for (let i = 0; i < demoTabledimension; i++) 
				{
					for (let j = 0; j < demoTabledimension; j++) 
					{
						let itrNode = demoTable.childNodes[i].childNodes[j];

						if (i <= trIndex && j <= tdIndex) 
							itrNode.classList.add('selected');
						else
							if (itrNode.classList.contains('selected')) 
								itrNode.classList.remove('selected');
					}
				}
			});

			col.addEventListener('click', evt => {	
				let tr = col.parentElement
				let tdIndex = tr.childNodes.indexOf(col);
				let trIndex = tr.parentElement.childNodes.indexOf(tr);
				let lastSelectionRange = this.getLastRange();
				
				trIndex++;
				tdIndex++;		

				let newTable = document.createElement('table');
				newTable.classList.add('bordered')

				for (let i = 0; i < trIndex; i++) 
				{
					let newTr = document.createElement('tr');

					for (let j = 0; j < tdIndex; j++) 
					{
						let newTd = document.createElement('td');
						newTr.appendChild(newTd);
					}

					newTable.appendChild(newTr);
				}

				let currNode = lastSelectionRange.endContainer;
				let mainBlockNode = this.mainElement(currNode, this.#textEditorConfig.elementType.block);

				let newP = document.createElement('p');
				newP.appendChild(document.createElement('br'));

				mainBlockNode.insertAdjacentElement('afterend', newTable);
				newTable.insertAdjacentElement('afterend', newP);

				newTable.querySelectorAll('td, th').forEach(cell => {
					cell.addEventListener('click', evt => {
						this.createTableOptions(evt.target);
						this.#activeCustomFeatureNode = newTable;
						this.#activeCustomFeature = 'TABLE';
					});
				});

				subMenu.parentElement.removeChild(subMenu);
			});			
		});
	}



	/**
	 * @function : applyStyleToElement
	 * @todo : To apply style class 
	 * to a specific element
	 * =========================================*/

	applyStyleToElement = (feature, element) => 
	{
		if (feature.type == this.#textEditorConfig.featureType.stylingFeature) 
		{
			let sameFeatureClasses = [];

			for(let itrfeature in this.#textEditorFeatures)
				if (this.#textEditorFeatures[itrfeature].styleCategory == feature.styleCategory	)
					sameFeatureClasses.push(this.#textEditorFeatures[itrfeature].styleClass); 

			switch(feature.styleCategory)
			{
				case 'ALIGNMENT':

					sameFeatureClasses.forEach(className => {
						if (element.classList.contains(className)) 
							element.classList.remove(className);
					});

					element.classList.add(feature.styleClass);

				break;
			}		
		}
	}


	/**
	 * @function : applyStyles
	 * @purpose : To apply styles classes
	 * to elements
	 * =========================================*/

	applyStyles = (feature) =>
	{
		const lastSelectionRange = this.getLastRange();

		if (lastSelectionRange.collapsed) 
		{
			if (feature.level == this.#textEditorConfig.elementType.block) 
			{
				let currNode = lastSelectionRange.startContainer;
				let currOffset = lastSelectionRange.startOffset;	
				let mainBlockNode = this.mainElement(currNode, this.#textEditorConfig.elementType.block);

				if (mainBlockNode)
				{	
					this.applyStyleToElement(feature, mainBlockNode)
					this.setCaretPosition(currNode, currOffset);
				}
			} 
			// else for inline feature styling
		}
		else
		{
			if (feature.level == this.#textEditorConfig.elementType.block) 
			{
				let beginNode = lastSelectionRange.startContainer;
				let beginOffset = lastSelectionRange.startOffset;
				beginNode = this.mainElement(beginNode, this.#textEditorConfig.elementType.block);

				this.applyStyleToElement(feature, beginNode);

				
				let endNode = lastSelectionRange.endContainer;
				let endOffset = lastSelectionRange.endOffset;
				endNode = this.mainElement(endNode, this.#textEditorConfig.elementType.block);

				this.applyStyleToElement(feature, endNode);

				if (beginNode != endNode) 
				{		
					let currNode = beginNode.nextSibling;
					while(currNode != endNode)
					{
						currNode = this.mainElement(currNode, this.#textEditorConfig.elementType.block);
						this.applyStyleToElement(feature, currNode)
						currNode = currNode.nextSibling;
					}
				}

				this.setCaretPosition(beginNode, 0);
			}			
			// else for inline feature styling
		}
	}



	/**
	 * @function : changeFeatureState
	 * @purpose : To toggle a feature working status
	 * if active then deactivate it
	 * if deactive then activate it
	 * ==========================================================*/

	changeFeatureState = (feature) => 
	{
		let targetFeature = null;

		if (!this.#lastSelection) return console.error('Editor was not in focus. No selection found');


		for(let itrFeature of this.#texterActiveFeatures)
		{
			if (itrFeature.featureName == feature)
			{
				targetFeature = itrFeature;
				break;
			} 
		}


		if (targetFeature) 
			this.deActivateFeature(this.#textEditorFeatures[feature]);	
		else
			this.activateFeature(this.#textEditorFeatures[feature]);
	}



	/**
	 * @function : activateFeature
	 * @purpose : To activate a feature means
	 * to apply it in the last selection range
	 * ===========================================================*/

	activateFeature = (feature) => 
	{
		console.log('Feature activated');

		switch (feature.type)
		{
			case this.#textEditorConfig.featureType.inlineFeature:
				this.insertInlineTag(feature.name);
			break;

			case this.#textEditorConfig.featureType.newLineFeature: 
				this.activateNewLineFeature(feature);
			break;	

			case this.#textEditorConfig.featureType.customFeature:

				switch(feature.name)
				{
					case 'IMG':
						this.insertImage();	
					break;

					case 'TABLE':
						this.openNewTableOptions();
					break;
					
					default:
						console.error('Unknown custom feature is requested for activation');
					break;	
				}

			break;				

			case this.#textEditorConfig.featureType.stylingFeature:
				if (feature.level == this.#textEditorConfig.elementType.block) 
					this.applyStyles(feature);
				else
					console.log('Only block level styles are developed till now');
			break;	

			default:
				console.error('Unknown feature type');
			break;
		}
	}



	/**
	 * @function : deActivateFeature
	 * @purpose : To deactivate a feature means
	 * to unapply it in the last selection range
	 * ===========================================================*/

	deActivateFeature = (feature) => 
	{
		console.log('Feature deactivated');

		switch (feature.type)
		{
			case this.#textEditorConfig.featureType.inlineFeature:
				this.removeInlineTag(feature.name);
			break;

			case this.#textEditorConfig.featureType.newLineFeature:
				console.log('New Line feature cannot be disabled. It can be toggled with another new line feature');
			break;		

			case this.#textEditorConfig.featureType.customFeature:
				console.log('Custom Feature cannot be deactivated by menu. It has deactivation option within itself');
			break;		

			case this.#textEditorConfig.featureType.stylingFeature:
				console.log('Custom Feature cannot be deactivated by menu. It has deactivation option within itself');
			break;			

			default:
				console.error('Unknown feature type');
			break;
		}			
	}



	/**
	 * @function : setActiveFeatures
	 * @purpose : To set active features for element
	 * in selection range
	 * =====================================================*/

	setActiveFeatures = () => 
	{
		let lastSelectionRange = this.getLastRange();

		this.#texterActiveFeatures = [];
		this.#texterMenu.querySelectorAll('.first-level-item').forEach(elem => elem.classList.remove('active'));

		if (!lastSelectionRange) return console.log('Editor not in focus');

		if (lastSelectionRange.collapsed) 
		{
			let currNode = lastSelectionRange.startContainer;
			let classSelectorStr = ``;
			
			if (currNode instanceof Node == false) return;

			while(currNode != this.#texterEditor)
			{
				if (currNode.nodeType == 1) 
					this.setActiceFeatureByElement(currNode);

				currNode = currNode.parentElement;
			}
		}	
		else
		{
			let rangeElements = lastSelectionRange.cloneContents();
			this.#texterActiveFeatures = [];


			// Get start container parents till main block element
			let currNode = lastSelectionRange.startContainer.parentElement;			
			let mainBlockNode = this.mainElement(currNode, this.#textEditorConfig.elementType.block);

			if (currNode instanceof Node == false) return;

			while(currNode != mainBlockNode)
			{
				if (currNode.nodeType == 1) 
					this.setActiceFeatureByElement(currNode);

				currNode = currNode.parentElement;
			}


			// Get end container parents till main block element
			currNode = lastSelectionRange.endContainer.parentElement;			
			mainBlockNode = this.mainElement(currNode, this.#textEditorConfig.elementType.block);

			if (currNode instanceof Node == false) return;

			while(currNode != mainBlockNode)
			{	
				if (currNode.nodeType == 1) 
					this.setActiceFeatureByElement(currNode);

				currNode = currNode.parentElement;
			}


			// Iterate all element in the range and set active elements
			currNode = null;
			if (rangeElements.childNodes && rangeElements.childNodes.length) 
				for(currNode of rangeElements.childNodes)
					this.nodeTreeTagChecker(currNode);
				
		}
	}



	/**
	 * @function : setActiceFeatureByElement
	 * @purpose : To set active feature for the element 
	 * passed as parameter
	 * ====================================================*/

	setActiceFeatureByElement = (element) =>
	{
		if (element.nodeType != 1) return console.error('Only HTML node will be accepted as paramter');

		let lastSelectionRange = this.getLastRange();

		for(let feature in this.#textEditorFeatures)
		{
			let featureObj = this.#textEditorFeatures[feature];

			if (typeof featureObj == 'object' && featureObj.type) 
			{
				let currfeatureType = featureObj.type;

				switch(currfeatureType)
				{
					case this.#textEditorConfig.featureType.inlineFeature:
					case this.#textEditorConfig.featureType.newLineFeature:

						if (featureObj && featureObj.name == element.nodeName && !this.#texterActiveFeatures.find(activeFeature => activeFeature.nodeName == element.nodeName)) 
						{
							this.#texterActiveFeatures.push({
								featureName : feature,
								nodeName : element.nodeName,
								featureType : featureObj.type
							});

							let featureBtn = this.#texterMenu.querySelector(`.${featureObj.class}`);

							if (!featureBtn.classList.contains('active')) featureBtn.classList.add('active');
						}

					break;

					case this.#textEditorConfig.featureType.stylingFeature:

						let elementType = this.getElementType(element);

						if (featureObj.level == this.#textEditorConfig.elementType.block && 
							elementType != 'inline' &&
							element.classList.contains(featureObj.styleClass) &&
							!this.#texterActiveFeatures.find(activeFeature => activeFeature.nodeName == featureObj.name)) 
						{
							this.#texterActiveFeatures.push({
								featureName : feature,
								nodeName : featureObj.name,
								featureType : featureObj.type
							});		

							let featureBtn = this.#texterMenu.querySelector(`.${featureObj.class}`);

							if (!featureBtn.classList.contains('active')) featureBtn.classList.add('active');										
						}

					break;
				}
			}
		}		
	}



	/**
	 * @function : nodeTreeTagChecker 
	 * @purpose : Check if any feature tag is present
	 * in the given node
	 * ===================================================*/

	nodeTreeTagChecker = (element) => 
	{
		if (element.nodeType == 1) 
		{
			for(let feature in this.#textEditorFeatures)
			{
				let featureObj = this.#textEditorFeatures[feature];

				if (featureObj && featureObj.name == element.nodeName && 
					!this.#texterActiveFeatures.find(activeFeature => activeFeature.nodeName == element.nodeName)) 
				{
					this.#texterActiveFeatures.push({
						featureName : feature,
						nodeName : element.nodeName,
						featureType : featureObj.type
					});

					this.#texterMenu.querySelector(`.${feature}-btn`).classList.add('active');
				}
			}

			if (element.childNodes.length) 
				for(let child of element.childNodes)
					if (child.nodeType == 1) 
						this.nodeTreeTagChecker(child);
		}
	}

	// Class Ends 
}



/**
 * @function : texter
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
		return console.error('Texter : Given element is not an textarea');
	

	// Hide the input's element (textarea)
	userInput.element.style.display = 'none';	


	// Initialise text editor
	if (window.texter = new Texter(userInput)) 
		return true;
	else
		return false;
}



/**
 * @function : properText
 * @module : Prototype Extension
 * @description : This function returns the proper text content of
 * a node object by removing empty spaces and some specific 
 * characters or unicodes
 * ================================================================*/

Node.prototype.properText = function () 
{
	let orgText = this.textContent.trim();

	if (orgText.length)
	{
		orgText = orgText.replace(/\n/g, '');
		orgText = orgText.replace(/\t/g, '');
		orgText = orgText.replace(/\u200b/g, '');
	} 

	return orgText;
}


NodeList.prototype.indexOf = Array.prototype.indexOf;


// Test Code -----------------------------------


let testHTML = `
<p>alsdkjasljdlajdlasjdljasldjaslj</p>
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