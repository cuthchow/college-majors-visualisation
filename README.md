# college-majors-visualisation

![preview_image](https://github.com/cuthchow/college-majors-visualisation/blob/master/preview.png)

An interactive, scrollable visualisation of College Majors in the United States, built using D3.js. The Goal
of this project was to learn how to create a narrative visualisation which changed state based on the 
user's scroll position on the page. I utilised several resources to learn the necessary techniques, most 
useful of them being [Jim Vallandingham's article](https://vallandingham.me/scroller.html) on the topic.

A full write-up detailing how this project was created can be found at my [blog here](https://towardsdatascience.com/how-i-created-an-interactive-scrolling-visualisation-with-d3-js-and-how-you-can-too-e116372e2c73)

The most useful techniques I learned in this project include:

* Using .transition() before every attribute change to allow interruptable animations
* Using named transitions for the animations which must be completed
* Using .raise() to reorder elements - Will append current selection to the end of the parent element
* Creating all elements initially, and using the opacity attribute to bring them in and out of view 
* Using d3.dispatch() to generate events, which dispatches events based on the user's scroll position
