/**
 * Swipe Panel Class (beta)
 *
 * © 2012-2013 Andrea Blasio
 *
 * Released under MIT License & GNU Free Documentation License
 *
 * Demo page: http://www.humanafragilitas.com/demos/swipe_panel/swipePanel.html
 *
 * Further insight: http://www.humanafragilitas.com/archives/508
 *
 * @author andrea(at)humanafragilitas(dot)com
 * @module HF
 */

if (typeof HF === "undefined") {

    var HF = {};

}

/**
 * @namespace HF
 * @class SwipePanel
 * @constructor SwipePanel
 */

HF.SwipePanel = function SwipePanel(confObject){
        
    "use strict"
        
        // main elements
    var w = window,
        d = w.document,
        b = d.body,
        s = b.style,
        
        // iterators
        i,
        
        // events
        isW3CTouchEnabled, 
        isMSTouchEnabled,
        touchStartEvent,
        touchMoveEvent,
        touchEndEvent,
        orientationEvent,
        resizeEvent,
        transitionEndEvent,
        
        // css selectors
        cssProps,
    
        // private classes
        ManageData,
        ManageInterface,
        ManageEvents,
        
        // helper functions
        _translate,
        
        // configuration defaults
        configuration = {
            
            // main elements identifiers
            offsetParent: "",
            panelID: "",
            panelLabelIDString: "",
            // label text nodes
            panelLabelOpenTag: "",
            panelLabelClosedTag: "",
            // appearance
            swipePanelWrapperColours: ["#454545", "#242424"],
            swipePanelLabelColours: ["#F8B708", "#F9CC52", "#fade92"],
            swipePanelZIndex: 9998,
            // swipe gesture threshold
            swipeSensivity: 7,
            // callback functions
            onReady: null,
            onBeforeOpen: null,
            onOpen: null,
            onBeforeClose: null,
            onClose: null
            
        };
    
    /* BEGIN: Constructors **************************************/
    
    /**
     * Swipe panel wrapper label:
     * when swiped allows to either open
     * or close the swipe panel
     * @class SwipePanelWrapperLabel
     * @constructor
     * @return {Object} HTMLElement: label object instance
     * @private
     */
     
    function SwipePanelWrapperLabel(){
            
            // html elements
        var wrapperLabel,
        
            // styles
            wrapperLabelCSS = [],
            wrapperLabelCSSOpen = [],
            wrapperLabelCSSClosed = [],
            
            // private methods
            _setStatus;
        
        // swipe panel label css
        wrapperLabelCSS.push("display: inline-block;");
        wrapperLabelCSS.push("padding: 0 18px 0 18px;");
        wrapperLabelCSS.push("background-image: " + cssProps.repeatingLinearGradient);
        wrapperLabelCSS.push("(90deg, ");
        wrapperLabelCSS.push(configuration.swipePanelLabelColours[0] + ", ");
        wrapperLabelCSS.push(configuration.swipePanelLabelColours[0] + " 1px, ");
        wrapperLabelCSS.push(configuration.swipePanelLabelColours[1] + " 1px, ");
        wrapperLabelCSS.push(configuration.swipePanelLabelColours[1] + " 2px);");       
        wrapperLabelCSS.push(cssProps.transition + ":" + cssProps.transform + " 0.15s ease-out;");
        wrapperLabelCSS.push("height: 48px;");
        wrapperLabelCSS.push("line-height: 48px;");
        wrapperLabelCSS.push("cursor: move;");
        wrapperLabelCSS.push(cssProps.userSelect + ": none;");
        wrapperLabelCSS.push("z-index: " + (configuration.swipePanelZIndex + 1) + ";");
        
        // swipe panel label css (status: open)
        wrapperLabelCSSOpen.push("border-top-left-radius: 0;");
        wrapperLabelCSSOpen.push("border-top-right-radius: 0;");
        wrapperLabelCSSOpen.push("border-bottom-left-radius: 4px;");
        wrapperLabelCSSOpen.push("border-bottom-right-radius: 4px;");
        wrapperLabelCSSOpen.push("text-shadow: 0 -1px ");
	wrapperLabelCSSOpen.push(configuration.swipePanelLabelColours[2] + ";");
        wrapperLabelCSSOpen.push("box-shadow: 0 2px 4px rgba(0,0,0,.5),");
        wrapperLabelCSSOpen.push("0 1px 1px rgba(0,0,0,.2),");
        wrapperLabelCSSOpen.push("0 1px 1px #333333 inset;");
        
        // swipe panel label css (status: closed)
        wrapperLabelCSSClosed.push("border-top-left-radius: 4px;");
        wrapperLabelCSSClosed.push("border-top-right-radius: 4px;");
        wrapperLabelCSSClosed.push("border-bottom-left-radius: 0;");
        wrapperLabelCSSClosed.push("border-bottom-right-radius: 0;");
        wrapperLabelCSSClosed.push("text-shadow: 0 1px ");
        wrapperLabelCSSClosed.push(configuration.swipePanelLabelColours[2] + ";");
        wrapperLabelCSSClosed.push("box-shadow: 0 -2px 5px rgba(0,0,0,.7),");
        wrapperLabelCSSClosed.push("0 -1px 1px rgba(0,0,0,.4),");
        wrapperLabelCSSClosed.push("0 -1px 1px #333333 inset;");
        
        // swipe panel label element
        wrapperLabel = d.createElement("span");
        wrapperLabel.setAttribute("id", configuration.panelLabelIDString);
        wrapperLabel.style.cssText = wrapperLabelCSS.join("");
       
        /**
         * Sets swipe panel label status and
         * manages its animation
         * @method _setStatus
         * @param {String} status Status type (closed|open)
         * @private
         */
         
        _setStatus = function(status){
        
            switch (status) {
            
                case "closed":
                wrapperLabel.style.cssText = wrapperLabelCSS.join("") + wrapperLabelCSSClosed.join("");
                wrapperLabel.innerHTML = configuration.panelLabelClosedTag;
                wrapperLabel.style[cssProps.domTransform] = _translate(0, (wrapperLabel.offsetHeight * -1), 0);
                break;
                
                case "open":
                wrapperLabel.style.cssText = wrapperLabelCSS.join("") + wrapperLabelCSSOpen.join("");
                wrapperLabel.innerHTML = configuration.panelLabelOpenTag;
                wrapperLabel.style[cssProps.domTransform] = _translate(0, 0, 0);
                break;
            
            }
        
        }; // _setStatus()
        
        // SwipePanelWrapperLabel class public methods
        wrapperLabel.setStatus = _setStatus;
        
        return wrapperLabel;
    
    } // SwipePanelWrapperLabel class
    
    /**
     * Manages the swipe panel main element
     * specified by panelID configuration parameter
     * @class SwipePanelWrapper
     * @constructor
     * @return {Object} HTMLElement: swipe panel wrapper instance
     * @private
     */
     
    function SwipePanelWrapper(swipePanelElement){
            
            // elements
        var wrapper,
            wrapperChildren,
            wrapperLabel,
            wrapperLabelContainer,
            
            // styles
            wrapperCss = [],
            wrapperLabelContainerCss = [],
            
            // private methods
            _updateSize,
            _updatePanelLabel,
            _move,
            _getLabelInstance,
            _getLabelHeight;
        
        // swipe panel main styles
        wrapperCss.push("position: absolute;");
        wrapperCss.push("top: 0;");
        wrapperCss.push("background:");
        wrapperCss.push(cssProps.radialGradient + "(50% 50%, ellipse cover, rgba(0,0,0,.3) 0%, rgba(0,0,0,1) 130%),");
        wrapperCss.push(cssProps.repeatingLinearGradient);
        wrapperCss.push("(0deg, " + configuration.swipePanelWrapperColours[0] + " 0px,");
        wrapperCss.push(configuration.swipePanelWrapperColours[1] + " 2px,");
        wrapperCss.push(configuration.swipePanelWrapperColours[1] + " 4px);");
        wrapperCss.push("text-align: center;");
        wrapperCss.push("box-shadow: 0 0 8px rgba(0,0,0,.7) inset,");
        wrapperCss.push("0 0 3px rgba(0,0,0,.7) inset,");
        wrapperCss.push("0 -1px 1px rgba(255,255,255,.3);");
        wrapperCss.push("cursor: move;");
        
        // swipe panel label wrapper styles
        wrapperLabelContainerCss.push("position: relative;");
        wrapperLabelContainerCss.push("width: 100%;");
        wrapperLabelContainerCss.push("height: 1px;");
        wrapperLabelContainerCss.push("z-index: " + configuration.swipePanelZIndex + ";");
        
        // set swipe panel element styles
        wrapper = swipePanelElement;
        wrapper.style.cssText = wrapperCss.join("");
        
        // swipe panel object public properties: defaults
        wrapper.isOpen = false;
        wrapper.hasChangedStatus = false;
        wrapper.isDragged = false;
        
        // create swipe panel label wrapper element
        wrapperLabelContainer = d.createElement("div");
        wrapperLabelContainer.style.cssText = wrapperLabelContainerCss.join("");
        
        // create swipe panel label element
        wrapperLabel = new SwipePanelWrapperLabel();
        wrapperLabel.setStatus("closed");
        
        // append the newly created swipe panel label to its container
        wrapperLabelContainer.appendChild(wrapperLabel);
        
        // either append the swipe panel label wrapper to
        // swipe panel wrapper or prepend it to any swipe panel wrapper children
        if ((wrapperChildren = wrapper.childNodes).length > 0) {
        
            wrapper.insertBefore(wrapperLabelContainer, wrapperChildren[0]);
        
        } else {
            
             wrapper.appendChild(wrapperLabelContainer);
        
        }
        
       /**
        * Performs swipe panel animation
        * @method _move
        * @param {String} action Type of animation
        * @param {Boolean} isAnimated Indicates wheter the animation should feature a css3 transition
        * @param {String} [yCoord] Vertical coordinate (required by "drag" and "close" animation types only)
        * @private
        */
        
        _move = function(action, isAnimated, yCoord){
        
            if (isAnimated) {
            
                wrapper.style[cssProps.domTransition] = cssProps.transform + " 0.3s ease-in-out";
                
            } else {
            
                wrapper.style[cssProps.domTransition] = "none";
                
            }
            
            switch (action) {
            
                case "close":
                    (wrapper.isOpen) ? wrapper.hasChangedStatus = true : wrapper.hasChangedStatus = false;
                    wrapper.isOpen = false;
                    wrapper.isDragged = false;
                    wrapper.style[cssProps.domTransform] = _translate(0, yCoord, 0);
                    break;
                    
                case "open":
                    (!wrapper.isOpen) ? wrapper.hasChangedStatus = true : wrapper.hasChangedStatus = false;
                    wrapper.isOpen = true;
                    wrapper.isDragged = false;
                    wrapper.style[cssProps.domTransform] = _translate(0, 0, 0);
                    break;
                    
                case "drag":
                    wrapper.style[cssProps.domTransform] = _translate(0, yCoord, 0);
                    wrapper.isDragged = true;
                    break;
            
            }
        
        }; // _move()
        
       /**
        * Updates swipe panel size
        * @method _updateSize
        * @param {Object} sizeObject Object describing panel size (width, height)
        * @private
        */
        
        _updateSize = function(sizeObject){
            
            // set new size
            wrapper.style.width = sizeObject.width + "px";
            wrapper.style.height = sizeObject.height + "px";
            
            // reposition panel
            if(wrapper.isOpen === false) {
                
                wrapper.move("close", false, sizeObject.height);
                    
            }
            
        }; // _updateSize()
        
       /**
        * Updates swipe panel label status
        * @method _updatePanelLabel
        * @private
        */
        
        _updatePanelLabel = function _updatePanelLabel(){
            
            if (wrapper.isOpen) {
            
                wrapperLabel.setStatus("open");
            
            } else {
                
                wrapperLabel.setStatus("closed");
            
            }
            
        }; // _updatePanelLabel()
        
       /**
        * Returns swipe panel label height
        * @method _getLabelHeight
        * @return {Number} Label height
        * @private
        */
        
        _getLabelHeight = function(){
        
            return wrapperLabel.offsetHeight;
        
        }; // _getLabelHeight()
        
        /**
         * Returns a reference to swipe panel label object
         * @method _getLabelInstance
         * @return {Object} HTMLElement: label object instance
         * @private
         */
        
        _getLabelInstance = function(){
        
            return wrapperLabel;
        
        }; // _getLabelInstance()
        
        // SwipePanelWrapper class public methods
        wrapper.getLabelInstance = _getLabelInstance;
        wrapper.getLabelHeight = _getLabelHeight;
        wrapper.updateSize = _updateSize;
        wrapper.updatePanelLabel = _updatePanelLabel;
        wrapper.move = _move;
        
        return wrapper;
        
    } // SwipePanelWrapper class
    
    /* END: Constructors ****************************************/
    
    /**
     * Manages html markup templates,
     * css3 animations
     * @class ManageInterface
     * @private
     * @static
     */
    
    ManageInterface = (function(){
    
        var swipePanelElement,
            swipePanel,
            swipePanelOffsetParent;
        
        // public methods
        return {
            
            /**
             * Builds the application interface
             * @method buildInterface
             * @static
             */
            
            buildInterface: function(){
                
                // gather elements
                try {
                    
                    swipePanelElement = d.querySelector(configuration.panelID);
                    swipePanelOffsetParent = swipePanelElement.offsetParent;
                        
                } catch (e) {
                    
                    throw new Error("Swipe Panel: illegal panelID and/or offset element.");
                    
                }
                    
                if (!swipePanelElement || !swipePanelOffsetParent) {
                        
                    throw new Error("Swipe Panel: panelID and/or offset element do not exist.");
                        
                }
                
                // create swipe panel object
                swipePanel = new SwipePanelWrapper(swipePanelElement);
                
                // set swipe panel object label default status
                swipePanel.updatePanelLabel();
                
                // set swipe panel offset parent element default style
                swipePanelOffsetParent.style.overflow = "hidden";
                
                // invoke onReady callback function
                if (typeof configuration.onReady === "function") {
                
                    configuration.onReady.call(swipePanel);
                            
                }
                
            }, // buildInterface()
            
            /**
             * Retrieves swipe panel offset parent element size
             * @method getOffsetParentSize
             * @return {Object} Object describing element size (width, height, landscape mode)
             * @static
             */
             
            getOffsetParentSize: function(){
            
                var offsetParentElemWidth,
                    offsetParentElemHeight,
                    isLandscape;
                
                offsetParentElemWidth = swipePanelOffsetParent.offsetWidth;
                offsetParentElemHeight = swipePanelOffsetParent.offsetHeight;
                isLandscape = (offsetParentElemHeight < offsetParentElemWidth);
            
                return {
                    
                    width: offsetParentElemWidth,
                    height: offsetParentElemHeight,
                    isLandscape: isLandscape
                
                };
                
            }, // getOffsetParentSize()
            
            /**
             * Retrieves a reference to the swipe panel offset parent instance
             * @method getOffsetParentInstance
             * @return {Object} HTMLElement: swipe panel offset parent instance
             * @static
             */
             
            getOffsetParentInstance: function(){
            
                return swipePanelOffsetParent;
            
            }, // getOffsetParentInstance()
            
            /**
             * Retrieves a reference to the swipe panel wrapper instance
             * @method getWrapperInstance
             * @return {Object} HTMLElement: swipe panel wrapper instance
             * @static
             */
            
            getWrapperInstance: function(){
            
                return swipePanel;
            
            }, // getWrapperInstance();
            
            /**
             * Retrieves a reference to the swipe panel label instance
             * @method getLabelInstance
             * @return {Object} HTMLElement: swipe panel label instance
             * @static
             */
            
            getLabelInstance: function(){
            
                return swipePanel.getLabelInstance();
            
            } // getLabelInstance()
        
        };
    
    }()); // ManageInterface class
    
    /**
     * Manages UI events
     * @class ManageEvents
     * @private
     * @static
     */
     
    ManageEvents = (function(){
    
        var offsetParentInstance,
            swipePanelInstance,
            swipePanelLabelInstance,
            swipePanelCoords = {x1: 0, y1: 0, x2: 0, y2: 0, d: 0};
        
        return {
            
            /**
             * Attaches event listeners to UI elements
             * @method attachEventListeners
             * @static
             */
            
            attachEventListeners: function(){
                
                swipePanelInstance = ManageInterface.getWrapperInstance();
                swipePanelLabelInstance = ManageInterface.getLabelInstance();
                offsetParentInstance = ManageInterface.getOffsetParentInstance();
                
                // event listeners
                swipePanelLabelInstance.addEventListener(touchStartEvent, ManageEvents.touchStartHandler, false);
                swipePanelLabelInstance.addEventListener(touchEndEvent, ManageEvents.touchEndHandler, false);
                w.addEventListener(resizeEvent, ManageEvents.resizeHandler, false);
                w.addEventListener(orientationEvent, ManageEvents.resizeHandler, false);
                
                // force resize handler method
                ManageEvents.resizeHandler(null);
            
            }, // attachEventListeners()
            
            /**
             * Handles transitionend event
             * @method transitionEndHandler
             * @param {Object} evt Event object
             * @static
             */
             
            transitionEndHandler: function(evt){
                
                swipePanelInstance.removeEventListener(transitionEndEvent, ManageEvents.transitionEndHandler);
                
                swipePanelInstance.updatePanelLabel();
                
                if (!swipePanelInstance.isOpen && swipePanelInstance.hasChangedStatus &&
                        (typeof configuration.onOpen === "function")) {
                    
                    // invoke onClose callback function
                    configuration.onClose.call(swipePanelInstance);
                
                }
                
                if (swipePanelInstance.isOpen && swipePanelInstance.hasChangedStatus &&
                        (typeof configuration.onClose === "function")) {
                    
                    // invoke onOpen callback function
                    configuration.onOpen.call(swipePanelInstance);
                
                }
                
                // restore gesture coordinates delta to its default
                swipePanelCoords.d = 0;
            
            }, // transitionEndHandler()
            
            /**
             * Handles touchstart event
             * @method touchStartHandler
             * @param {Object} evt Event object
             * @static
             */
            
            touchStartHandler: function(evt){
                
                var evtTarget;
                
                evt.preventDefault();
        
                evtTarget = evt.target;
                
                if (!swipePanelInstance.isDragged) {
                    
                    evt.preventDefault();
                    swipePanelCoords.y1 = isW3CTouchEnabled ? evt.touches[0].screenY :
							isMSTouchEnabled ? evt.clientY : evt.clientY;
                    offsetParentInstance.addEventListener(touchMoveEvent, ManageEvents.touchMoveHandler, false);
                
                }
            
            }, // touchStartHandler()
            
            /**
             * Handles touchmove event
             * @method touchMoveHandler
             * @param {Object} evt Event object
             * @static
             */
            
            touchMoveHandler: function(evt){
                 
                var tempCoord,
                    offsetParentSize;
                
                evt.preventDefault();
                
                offsetParentSize = ManageInterface.getOffsetParentSize();
                
                swipePanelCoords.y2 = isW3CTouchEnabled ? evt.touches[0].screenY :
						isMSTouchEnabled ? evt.clientY : evt.clientY;;
                swipePanelCoords.d = Math.abs((swipePanelCoords.y1 - swipePanelCoords.y2));
                
                if (!swipePanelInstance.isOpen) {
                
                    tempCoord = offsetParentSize.height - swipePanelCoords.d;

                } else {
                
                    tempCoord = swipePanelCoords.d;
                    
                }
                
                swipePanelInstance.move("drag", false, tempCoord);
            
            }, // touchMoveHandler()
            
            /**
             * Handles touchend event
             * @method touchEndHandler
             * @param {Object} evt Event object
             * @static
             */
            
            touchEndHandler: function(evt){
                
                var evtTarget,
                    offsetParentSize;
                
                evt.preventDefault();
                
                evtTarget = evt.target;
                
                offsetParentSize = ManageInterface.getOffsetParentSize();
                
                offsetParentInstance.removeEventListener(touchMoveEvent, ManageEvents.touchMoveHandler);
                swipePanelInstance.addEventListener(transitionEndEvent, ManageEvents.transitionEndHandler, false);
                
                // check swipe gesture magnitude
                if (swipePanelCoords.d > (offsetParentSize.height / configuration.swipeSensivity)) {
                    
                    if (swipePanelInstance.isOpen) {
                    
                        swipePanelInstance.move("close", true, offsetParentSize.height);
                        
                        // invoke onBeforeClose callback function
                        configuration.onBeforeClose.call(swipePanel);
                    
                    } else {
                        
                        swipePanelInstance.move("open", true, 0);
                        
                        // invoke onBeforeOpen callback function
                        configuration.onBeforeOpen.call(swipePanel);
                    
                    }
                    
                } else {
                
                    (swipePanelInstance.isOpen) ? swipePanelInstance.move("open", true, 0) :
                            swipePanelInstance.move("close", true, offsetParentSize.height);
                    
                }
            
            }, // touchEndHandler()
            
            /**
             * Handles resize event
             * @method resizeHandler
             * @param {Object} evt Event object
             * @static
             */
            
            resizeHandler: function(evt){
                
                var offsetParentSize;
                
                offsetParentSize = ManageInterface.getOffsetParentSize();
                
                // refresh main panel size
                swipePanelInstance.updateSize(offsetParentSize);
                
                if (swipePanelInstance.isOpen === false) {
                
                    swipePanelInstance.move("close", false, offsetParentSize.height);
                    
                }
            
            }, // resizeHandler()
            
            /**
             * Dispatches custom html events
             * and optionally generates a dummy swipe gesture coordinates delta
             * @method dispatchCustomEvent
             * @param {String} eventType Type of event to be broadcasted
             * @param {Object} eventTarget HTMLElement: target of custom html event
             * @param {Boolean} triggerSwipe Indicates wheter to generate a dummy swipe coordinates delta
             * @static
             */
            
            dispatchCustomEvent: function(eventType, eventTarget, triggerSwipe){
            
                var customTouchEndEvent,
                    offsetParentSize;
                
                if (triggerSwipe === true) {
                
                    offsetParentSize = ManageInterface.getOffsetParentSize();
                    swipePanelCoords.d = (offsetParentSize.height / configuration.swipeSensivity) + 1;
                
                }
                
                customTouchEndEvent = document.createEvent("HTMLEvents");
                customTouchEndEvent.initEvent(eventType, true, true);
                customTouchEndEvent.eventName = eventType;

                eventTarget.dispatchEvent(customTouchEndEvent);
            
            } // dispatchCustomEvent()
        
        };
    
    }()); // ManageEvents class
    
    /* BEGIN: Helper functions **********************************/
    
    _translate = function(x, y, z){
    
        if (cssProps.translate3d) {
        
            _translate = function(x, y, z){
            
                return "translate3d(" + x + "px, " + y + "px, " + z + ")";
            
            };
        
        } else {
        
            _translate = function(x, y, z){
            
                return "translate(" + x + "px, " + y + "px)";
            
            };
        
        }
        
        _translate();
    
    }; // _translate()
    
    /* END: Helper functions ************************************/
    
    /* BEGIN: constructor default actions ***********************/
    
    // touch events
    isW3CTouchEnabled = ("ontouchstart" in w) &&
                        ("ontouchmove" in w) &&
                        ("ontouchend" in w) &&
                        ("ontouchcancel" in w);
                     
    isMSTouchEnabled = ("onmspointerdown" in w) &&
                       ("onmspointermove" in w) &&
                       ("onmspointerup" in w) &&
                       ("onmspointerover" in w) &&
                       ("onmspointerout" in w);
                     
    touchStartEvent = isW3CTouchEnabled ? "touchstart" : isMSTouchEnabled ? "MSPointerDown" : "mousedown";
    touchMoveEvent = isW3CTouchEnabled ? "touchmove" : isMSTouchEnabled ? "MSPointerMove" : "mousemove";
    touchEndEvent = isW3CTouchEnabled ? "touchend" : isMSTouchEnabled ? "MSPointerUp" : "mouseup";
    orientationEvent = "orientationchange";
    resizeEvent = "resize";
    transitionEndEvent = ("onwebkittransitionend" in w) ? "webkitTransitionEnd" : "transitionend";
    
    // detect css features
    cssProps = ("MozTransition" in s &&
                "MozTransform" in s) ? {domTransition: "MozTransition",
                                        transition: "-moz-transition",
                                        transform: "-moz-transform",
                                        domTransform: "MozTransform",
                                        radialGradient: "-moz-radial-gradient",
                                        repeatingLinearGradient: "-moz-repeating-linear-gradient",
                                        translate3d: "translate3d",
                                        userSelect: "-moz-user-select"} :
               ("WebkitTransition" in s &&
                "WebkitTransform" in s) ? {domTransition: "WebkitTransition",
                                           transition: "-webkit-transition",
                                           transform: "-webkit-transform",
                                           domTransform: "WebkitTransform",
                                           radialGradient: "-webkit-radial-gradient",
                                           repeatingLinearGradient: "-webkit-repeating-linear-gradient",
                                           translate3d: "translate3d",
                                           userSelect: "-webkit-user-select"} :
               ("msTransition" in s &&
                "msTransform" in s) ? {domTransition: "msTransition",
                                       transition: "-ms-transition",
                                       transform: "-ms-transform",
                                       domTransform: "msTransform",
                                       radialGradient: "-ms-radial-gradient",
                                       repeatingLinearGradient: "-ms-repeating-linear-gradient",
                                       translate: "translate",
                                       userSelect: "-ms-user-select"} :
               {domTransition: "transition",
                transition: "transition",
                transform: "transform",
                domTransform: "transform",
                radialGradient: "radial-gradient",
                repeatingLinearGradient: "repeating-linear-gradient",
		translate: "translate",
                userSelect: "user-select"};
    
    // check configuration object consistency
    if (typeof confObject !== "object") {
    
        throw new Error("SwipePanel: initialize method argument is not an object.");
    
    }
    
    // extend configuration object with user defined params
    for (i in configuration) {
    
        if (confObject.hasOwnProperty(i) && confObject[i]) {
        
            configuration[i] = confObject[i];
        
        }
    
    }
    
    // default actions
    ManageInterface.buildInterface();
    ManageEvents.attachEventListeners();
    
    /**
     * Toggles the swipe panel
     * @method toggle
     */
     
    HF.SwipePanel.prototype.toggle = function(){
    
        ManageEvents.dispatchCustomEvent(touchEndEvent, ManageInterface.getLabelInstance(), true);
    
    }; // toggle()
    
    /**
     * Opens the swipe panel
     * @method open
     */
    
    HF.SwipePanel.prototype.open = function(){
    
        if (ManageInterface.getWrapperInstance().isOpen === false) {
        
            this.toggle();
        
        }
    
    }; // open();
    
    /**
     * Closes the swipe panel
     * @method close
     */
    
    HF.SwipePanel.prototype.close = function(){
    
        if (ManageInterface.getWrapperInstance().isOpen === true) {
        
            this.toggle();
        
        }
    
    }; // close()
    
    /**
     * Indicates wheter the swipe panel is open or closed
     * @property isOpen 
     * @type Boolean
     */
    
    this.isOpen = ManageInterface.getWrapperInstance().isOpen;
    
    /* END: constructor default actions *************************/

}; // HF.SwipePanel class 