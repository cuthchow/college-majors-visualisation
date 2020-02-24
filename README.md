# college-majors-visualisation

An interactive, scrollable visualisation of College Majors in the United States, built using D3.js. The Goal
of this project was to learn how to create a narrative visualisation which changed state based on the 
user's scroll position on the page. I utilised several resources to learn the necessary techniques, most 
useful of them being [Jim Vallandingham's article](https://vallandingham.me/scroller.html) on the topic. 

The most useful techniques I have learned in this project include:

* Using .transition() before every attribute change to allow interruptable animations
* Using named transitions for animations which must be completed
* Using .raise() to reorder elements - Will append current selection to the end of the parent element
* Creating all elements initially, and using the opacity attribute to bring them in and out of view 
* Using d3.dispatch to generate events, which dispatches events based on the user's scroll positino