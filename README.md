Swipe-Panel
===========

Description
-----------

The *SwipePanel Javascript class* aims to summarily illustrate what it is possible to achieve by implementing the newly introduced touch events specifications in their W3C and Microsoft flavours in conjunction with unobtrusive Javascript and CSS3 animation capabilities; it basically turns a simple structure made of two nested block elements into a touch-enabled swipe panel.

Further insight: [Blog post](http://www.humanafragilitas.com/archives/508 "Browse to SwipePanel Javascript class blog post")

Demo page: [http://www.humanafragilitas.com/demos/swipe_panel/swipePanel.html](http://www.humanafragilitas.com/demos/swipe_panel/swipePanel.html "Browse to SwipePanel Javascript class demo page")

Usage
-----

### html markup ###
<pre><code>&lt;!-- basic required markup structure --&gt;

&lt;!-- the outer element serves as positioning context --&gt;
&lt;div id=&quot;swipePanelWrapper&quot;&gt;

   &lt;!-- your content here --&gt;

   &lt;!-- the inner element serves as the swipe panel wrapper --&gt;
   &lt;div id=&quot;swipePanel&quot;&gt;

      &lt;!-- your content here --&gt;

   &lt;/div&gt;

&lt;/div&gt;
</code></pre>
### javascript ###
<pre><code>// configuration and constructor invocation 

var configuration,
    swipePanel;

configuration = {

   /* id of swipe panel offset parent: mandatory; e.g.: "#swipePanelWrapper" */
   offsetParent: {String},
   /* id of swipe panel element: mandatory; e.g.: "#swipePanel" */
   panelID: {String},
   /* id string of swipe panel label element: mandatory; e.g.: "mainPanelTag" */
   panelLabelIDString: {String},
   /* swipe panel label: open status; e.g.: "Swipe down to close" */
   panelLabelOpenTag: {String},
   /* swipe panel label: closed status; e.g.: "Swipe up to open" */
   panelLabelClosedTag: {String},
   /* swipe panel background stripes colours; e.g.: ["#454545", "#242424"] */
   swipePanelWrapperColours: {Array},
   /* swipe panel label background stripes colours and text-shadow;
   e.g.: ["#F8B708", "#F9CC52", "#fade92"] */
   swipePanelLabelColours: {Array},
   /* swipe panel z-index css property value; e.g.: 9998 */
   swipePanelZIndex: {Number},
   /* swipe gesture sensivity threshold; e.g.: a value of 7 implies
   a minimum swipe magnitude higher than one seventh of the browser viewport height */
   swipeSensivity: {Number},
   /* note on callback functions: the «this» object is assigned to
   a reference of the object instance identified by «panelID» configuration parameter */
   /* called as soon as the application is ready to be interacted with */
   onReady: {Function},
   /* called as soon as the swipe panel label is released and the closed
   swipe panel starts to open */
   onBeforeOpen: {Function},
   /* called as soon as the swipe panel is completely open */
   onOpen: {Function},
   /* called as soon as the swipe panel label is released and the open
   swipe panel starts to close */
   onBeforeClose: {Function},
   /* called as soon as the swipe panel is completely closed */
   onClose: {Function}

};

swipePanel = new SwipePanel(swipePanelObjConf);
</code></pre>